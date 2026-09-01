package main

import (
	"bufio"
	"fmt"
	"net"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

// fakeSMTP speaks just enough of the protocol for net/smtp to complete a
// transaction, and hands back whatever arrived in DATA.
func fakeSMTP(t *testing.T) (addr string, received chan string) {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	received = make(chan string, 4)

	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				return
			}
			go func(c net.Conn) {
				defer c.Close()
				r := bufio.NewReader(c)
				fmt.Fprintf(c, "220 fake ESMTP\r\n")
				var body strings.Builder
				inData := false
				for {
					line, err := r.ReadString('\n')
					if err != nil {
						return
					}
					if inData {
						if strings.TrimRight(line, "\r\n") == "." {
							inData = false
							received <- body.String()
							fmt.Fprintf(c, "250 2.0.0 Ok\r\n")
							continue
						}
						body.WriteString(line)
						continue
					}
					cmd := strings.ToUpper(strings.TrimRight(line, "\r\n"))
					switch {
					case strings.HasPrefix(cmd, "EHLO"), strings.HasPrefix(cmd, "HELO"):
						// No STARTTLS advertised: matches the real internal hop.
						fmt.Fprintf(c, "250-fake\r\n250 SIZE 10485760\r\n")
					case strings.HasPrefix(cmd, "MAIL"), strings.HasPrefix(cmd, "RCPT"):
						fmt.Fprintf(c, "250 2.1.0 Ok\r\n")
					case strings.HasPrefix(cmd, "DATA"):
						inData = true
						fmt.Fprintf(c, "354 End data with <CR><LF>.<CR><LF>\r\n")
					case strings.HasPrefix(cmd, "QUIT"):
						fmt.Fprintf(c, "221 2.0.0 Bye\r\n")
						return
					default:
						fmt.Fprintf(c, "250 2.0.0 Ok\r\n")
					}
				}
			}(conn)
		}
	}()
	t.Cleanup(func() { ln.Close() })
	return ln.Addr().String(), received
}

func newTestServer(t *testing.T, smtpAddr string, mutate func(*Config)) *Server {
	t.Helper()
	cfg := &Config{
		Listen:    ":0",
		MailFrom:  "noreply@greenfieldoverride.com",
		SMTPAddr:  smtpAddr,
		SpoolDir:  t.TempDir(),
		MinFill:   3 * time.Second,
		RatePerHr: 5,
		Forms: map[string]Form{
			"abc123": {Origin: "https://example.com", To: "dest@example.com", Subject: "example contact"},
		},
	}
	if mutate != nil {
		mutate(cfg)
	}
	return &Server{cfg: cfg, lim: newLimiter(cfg.RatePerHr, time.Hour)}
}

func post(s *Server, path string, fields map[string]string, headers map[string]string) *httptest.ResponseRecorder {
	form := url.Values{}
	for k, v := range fields {
		form.Set(k, v)
	}
	req := httptest.NewRequest(http.MethodPost, path, strings.NewReader(form.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	w := httptest.NewRecorder()
	s.handleSubmit(w, req)
	return w
}

func spoolCount(t *testing.T, dir string) int {
	t.Helper()
	entries, err := filepath.Glob(filepath.Join(dir, "*.json"))
	if err != nil {
		t.Fatalf("glob: %v", err)
	}
	return len(entries)
}

func validFields() map[string]string {
	return map[string]string{
		"name":     "A Person",
		"email":    "person@example.net",
		"message":  "hello there",
		"_elapsed": "45000",
	}
}

func TestDeliversAndSpools(t *testing.T) {
	addr, received := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	w := post(s, "/f/abc123", validFields(), nil)
	if w.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", w.Code)
	}
	if n := spoolCount(t, s.cfg.SpoolDir); n != 1 {
		t.Fatalf("want 1 spooled submission, got %d", n)
	}

	select {
	case msg := <-received:
		for _, want := range []string{
			"From: noreply@greenfieldoverride.com",
			"To: dest@example.com",
			"Subject: example contact",
			"Reply-To: person@example.net",
			"hello there",
		} {
			if !strings.Contains(msg, want) {
				t.Errorf("message missing %q:\n%s", want, msg)
			}
		}
	case <-time.After(5 * time.Second):
		t.Fatal("no message reached the smtp server")
	}
}

// Postfix has always_add_missing_headers = no, so if we do not write a
// Message-ID the mail goes out without one — a spam signal to Gmail and
// unthreadable everywhere. Verified against the live server: the first
// delivered message logged "message-id=<>".
func TestMessageIDPresentAndUnique(t *testing.T) {
	addr, received := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	seen := map[string]bool{}
	for i := 0; i < 2; i++ {
		post(s, "/f/abc123", validFields(), nil)
		msg := <-received

		var id string
		for _, line := range strings.Split(msg, "\r\n") {
			if strings.HasPrefix(line, "Message-ID: ") {
				id = strings.TrimPrefix(line, "Message-ID: ")
			}
			if line == "" {
				break // headers end
			}
		}
		if id == "" {
			t.Fatalf("no Message-ID header:\n%s", msg)
		}
		if !strings.HasPrefix(id, "<") || !strings.HasSuffix(id, ">") {
			t.Errorf("Message-ID is not angle-addr: %q", id)
		}
		// The domain must be ours, not the submitter's.
		if !strings.HasSuffix(id, "@greenfieldoverride.com>") {
			t.Errorf("Message-ID domain should come from MAIL_FROM, got %q", id)
		}
		if seen[id] {
			t.Errorf("Message-ID reused across submissions: %q", id)
		}
		seen[id] = true
	}
}

// The submitter must never become the From:. Sending as a domain we do not
// sign breaks DKIM alignment, which is the spam-filing failure this replaces.
func TestSubmitterIsReplyToNotFrom(t *testing.T) {
	addr, received := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	post(s, "/f/abc123", validFields(), nil)

	msg := <-received
	if strings.Contains(msg, "From: person@example.net") {
		t.Errorf("submitter leaked into From:\n%s", msg)
	}
	if !strings.Contains(msg, "From: noreply@greenfieldoverride.com") {
		t.Errorf("From: is not the configured sender:\n%s", msg)
	}
}

// A newline in a form field must not be able to add a header.
func TestHeaderInjectionStripped(t *testing.T) {
	addr, received := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	f := validFields()
	f["name"] = "Evil\r\nBcc: attacker@example.org"
	f["email"] = "ok@example.net"
	post(s, "/f/abc123", f, nil)

	msg := <-received
	headers, _, _ := strings.Cut(msg, "\r\n\r\n")
	if strings.Contains(headers, "Bcc:") {
		t.Errorf("injected Bcc survived into the headers:\n%s", headers)
	}
	if strings.Contains(msg, "\nBcc:") {
		t.Errorf("injected Bcc appears on its own line:\n%s", msg)
	}
}

func TestHoneypotDroppedSilently(t *testing.T) {
	addr, received := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	f := validFields()
	f["_honey"] = "gotcha"
	w := post(s, "/f/abc123", f, nil)

	// 200 so the bot does not learn anything, but nothing sent or stored.
	if w.Code != http.StatusOK {
		t.Fatalf("want 200 for a caught bot, got %d", w.Code)
	}
	if n := spoolCount(t, s.cfg.SpoolDir); n != 0 {
		t.Fatalf("honeypot submission was spooled (%d files)", n)
	}
	select {
	case msg := <-received:
		t.Fatalf("honeypot submission was mailed:\n%s", msg)
	case <-time.After(300 * time.Millisecond):
	}
}

// The scraper that found the old form submitted 45ms after page load.
func TestTooFastDropped(t *testing.T) {
	addr, _ := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	f := validFields()
	f["_elapsed"] = "45"
	w := post(s, "/f/abc123", f, nil)

	if w.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", w.Code)
	}
	if n := spoolCount(t, s.cfg.SpoolDir); n != 0 {
		t.Fatalf("45ms submission was accepted (%d files)", n)
	}
}

func TestUnknownFormIs404(t *testing.T) {
	addr, _ := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	if w := post(s, "/f/nope", validFields(), nil); w.Code != http.StatusNotFound {
		t.Fatalf("want 404 for unknown id, got %d", w.Code)
	}
	if w := post(s, "/f/", validFields(), nil); w.Code != http.StatusNotFound {
		t.Fatalf("want 404 for empty id, got %d", w.Code)
	}
}

func TestRelayTokenEnforced(t *testing.T) {
	addr, _ := fakeSMTP(t)
	s := newTestServer(t, addr, func(c *Config) { c.RelayToken = "s3cret" })

	if w := post(s, "/f/abc123", validFields(), nil); w.Code != http.StatusForbidden {
		t.Fatalf("want 403 without token, got %d", w.Code)
	}
	if w := post(s, "/f/abc123", validFields(), map[string]string{"X-Relay-Token": "wrong"}); w.Code != http.StatusForbidden {
		t.Fatalf("want 403 with wrong token, got %d", w.Code)
	}
	if w := post(s, "/f/abc123", validFields(), map[string]string{"X-Relay-Token": "s3cret"}); w.Code != http.StatusOK {
		t.Fatalf("want 200 with correct token, got %d", w.Code)
	}
}

func TestRateLimitPerIP(t *testing.T) {
	addr, _ := fakeSMTP(t)
	s := newTestServer(t, addr, func(c *Config) { c.RatePerHr = 2 })

	h := map[string]string{"X-Forwarded-For": "203.0.113.9, 204.168.191.68"}
	for i := 0; i < 2; i++ {
		if w := post(s, "/f/abc123", validFields(), h); w.Code != http.StatusOK {
			t.Fatalf("submission %d: want 200, got %d", i+1, w.Code)
		}
	}
	if w := post(s, "/f/abc123", validFields(), h); w.Code != http.StatusTooManyRequests {
		t.Fatalf("want 429 on the third, got %d", w.Code)
	}
	// A different visitor behind the same proxy must not be blocked.
	other := map[string]string{"X-Forwarded-For": "198.51.100.4, 204.168.191.68"}
	if w := post(s, "/f/abc123", validFields(), other); w.Code != http.StatusOK {
		t.Fatalf("second visitor was rate limited, got %d", w.Code)
	}
}

// Two proxies means XFF arrives as a list; net.ParseIP on the whole string
// returns nil, which is the bug in liberation-analytics' extractIP.
func TestClientIPTakesFirstOfList(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/f/abc123", nil)
	req.Header.Set("X-Forwarded-For", "203.0.113.9, 204.168.191.68")
	if got := clientIP(req); got != "203.0.113.9" {
		t.Fatalf("want 203.0.113.9, got %q", got)
	}
}

// A postfix outage must not lose the message.
func TestMailFailureStillSpools(t *testing.T) {
	// Nothing is listening on this port.
	s := newTestServer(t, "127.0.0.1:1", nil)

	w := post(s, "/f/abc123", validFields(), nil)
	if w.Code != http.StatusOK {
		t.Fatalf("want 200 so the visitor is not told to retry, got %d", w.Code)
	}
	if n := spoolCount(t, s.cfg.SpoolDir); n != 1 {
		t.Fatalf("message was lost: %d spooled", n)
	}
}

func TestMissingMessageRejected(t *testing.T) {
	addr, _ := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	f := validFields()
	f["message"] = "   "
	if w := post(s, "/f/abc123", f, nil); w.Code != http.StatusBadRequest {
		t.Fatalf("want 400 for an empty message, got %d", w.Code)
	}
}

func TestCORSOnlyForConfiguredOrigin(t *testing.T) {
	addr, _ := fakeSMTP(t)
	s := newTestServer(t, addr, nil)

	w := post(s, "/f/abc123", validFields(), map[string]string{"Origin": "https://evil.example"})
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Fatalf("echoed a foreign origin: %q", got)
	}

	w = post(s, "/f/abc123", validFields(), map[string]string{"Origin": "https://example.com"})
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "https://example.com" {
		t.Fatalf("want the configured origin echoed, got %q", got)
	}
}

func TestConfigRejectsBadInput(t *testing.T) {
	for name, env := range map[string]map[string]string{
		"no MAIL_FROM":   {"FORM_RELAY_FORMS": `{"a":{"to":"x@y.z"}}`},
		"bad MAIL_FROM":  {"MAIL_FROM": "not-an-address", "FORM_RELAY_FORMS": `{"a":{"to":"x@y.z"}}`},
		"no forms":       {"MAIL_FROM": "n@example.com"},
		"forms not json": {"MAIL_FROM": "n@example.com", "FORM_RELAY_FORMS": `{oops`},
		"forms empty":    {"MAIL_FROM": "n@example.com", "FORM_RELAY_FORMS": `{}`},
		"bad recipient":  {"MAIL_FROM": "n@example.com", "FORM_RELAY_FORMS": `{"a":{"to":"nope"}}`},
	} {
		t.Run(name, func(t *testing.T) {
			for _, k := range []string{"MAIL_FROM", "FORM_RELAY_FORMS"} {
				os.Unsetenv(k)
			}
			for k, v := range env {
				t.Setenv(k, v)
			}
			if _, err := loadConfig(); err == nil {
				t.Fatalf("%s: expected an error at startup", name)
			}
		})
	}
}
