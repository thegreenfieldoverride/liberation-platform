// Liberation Form Relay
//
// Accepts contact form submissions over HTTP and hands them to postfix.
//
// The point of this service is that the recipient address never appears in a
// public page. The browser posts to an opaque form id; the id -> recipient
// mapping lives only in FORM_RELAY_FORMS, which is read from a root-owned env
// file on the box and never enters git. That is the whole reason this exists:
// the previous setup put the destination address in the form action attribute,
// where scrapers found it, and 8 of 9 submissions in two months were bots.
//
// Submissions are written to the spool BEFORE the mail is attempted. A mail
// failure must never be a lost message — that is exactly how the one real
// submission on 2026-08-17 disappeared.
package main

import (
	"crypto/rand"
	"crypto/subtle"
	"crypto/tls"
	"crypto/x509"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

// maxBody caps a submission. Postfix advertises SIZE 10485760, but a contact
// form has no business being anywhere near that.
const maxBody = 64 << 10

// Form is one configured endpoint: an opaque id maps to where the mail goes.
type Form struct {
	Origin  string `json:"origin"`  // allowed browser Origin, for the CORS path
	To      string `json:"to"`      // real recipient — never leaves this process
	Subject string `json:"subject"` // subject line prefix
}

type Config struct {
	Listen     string
	Forms      map[string]Form
	MailFrom   string
	SMTPAddr   string
	RelayToken string
	SpoolDir   string
	MinFill    time.Duration
	RatePerHr  int
}

func loadConfig() (*Config, error) {
	c := &Config{
		Listen:     envOr("LISTEN_ADDR", ":8090"),
		MailFrom:   os.Getenv("MAIL_FROM"),
		SMTPAddr:   envOr("SMTP_ADDR", "liberation-postfix:25"),
		RelayToken: os.Getenv("RELAY_TOKEN"),
		SpoolDir:   envOr("SPOOL_DIR", "/var/spool/formrelay"),
		MinFill:    time.Duration(envInt("MIN_FILL_SECONDS", 3)) * time.Second,
		RatePerHr:  envInt("RATE_PER_HOUR", 5),
	}

	if c.MailFrom == "" {
		return nil, fmt.Errorf("MAIL_FROM is required")
	}
	// The envelope sender has to be a domain postfix will accept. Submissions
	// from the docker network match permit_mynetworks and bypass
	// check_sender_access, but keep this aligned with the DKIM SigningTable
	// or the mail goes out unsigned and lands in spam.
	if _, err := mail.ParseAddress(c.MailFrom); err != nil {
		return nil, fmt.Errorf("MAIL_FROM is not a valid address: %w", err)
	}

	raw := os.Getenv("FORM_RELAY_FORMS")
	if raw == "" {
		return nil, fmt.Errorf("FORM_RELAY_FORMS is required")
	}
	if err := json.Unmarshal([]byte(raw), &c.Forms); err != nil {
		return nil, fmt.Errorf("FORM_RELAY_FORMS is not valid JSON: %w", err)
	}
	if len(c.Forms) == 0 {
		return nil, fmt.Errorf("FORM_RELAY_FORMS defines no forms")
	}
	for id, f := range c.Forms {
		if _, err := mail.ParseAddress(f.To); err != nil {
			return nil, fmt.Errorf("form %q has an invalid recipient: %w", id, err)
		}
	}
	return c, nil
}

type Server struct {
	cfg *Config
	lim *limiter
}

func main() {
	log.SetFlags(log.LstdFlags | log.LUTC)

	cfg, err := loadConfig()
	if err != nil {
		log.Fatalf("config: %v", err)
	}
	if err := os.MkdirAll(cfg.SpoolDir, 0o750); err != nil {
		log.Fatalf("spool dir %s: %v", cfg.SpoolDir, err)
	}
	// Fail at startup rather than on the first submission, when the person
	// typing has already spent two minutes on it.
	if err := checkSpoolWritable(cfg.SpoolDir); err != nil {
		log.Fatalf("spool dir %s is not writable: %v", cfg.SpoolDir, err)
	}

	s := &Server{cfg: cfg, lim: newLimiter(cfg.RatePerHr, time.Hour)}

	mux := http.NewServeMux()
	mux.HandleFunc("/f/", s.handleSubmit)
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","forms":%d}`, len(cfg.Forms))
	})

	srv := &http.Server{
		Addr:              cfg.Listen,
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      30 * time.Second,
	}

	log.Printf("form relay listening on %s — %d form(s), spool %s, smtp %s",
		cfg.Listen, len(cfg.Forms), cfg.SpoolDir, cfg.SMTPAddr)
	if cfg.RelayToken == "" {
		log.Printf("WARNING: RELAY_TOKEN unset — this endpoint accepts direct posts")
	}
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("server: %v", err)
	}
}

func (s *Server) handleSubmit(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/f/")
	form, known := s.cfg.Forms[id]

	// An unknown id gets the same 404 as a bad method. Nothing here confirms
	// whether an id exists, so the ids stay guess-resistant.
	if !known || id == "" {
		http.NotFound(w, r)
		return
	}

	if r.Method == http.MethodOptions {
		s.writeCORS(w, r, form)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	s.writeCORS(w, r, form)

	// When box 2 proxies with X-Relay-Token, a request without it came
	// straight to this host, bypassing the origin the form actually lives on.
	if s.cfg.RelayToken != "" {
		got := r.Header.Get("X-Relay-Token")
		if subtle.ConstantTimeCompare([]byte(got), []byte(s.cfg.RelayToken)) != 1 {
			log.Printf("form=%s rejected: bad or missing relay token from %s", id, clientIP(r))
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxBody)
	if err := r.ParseMultipartForm(maxBody); err != nil {
		if err := r.ParseForm(); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
	}

	ip := clientIP(r)

	// Honeypot and timing checks return 200. A bot that learns it was caught
	// is a bot that adapts; one that thinks it succeeded moves on.
	if strings.TrimSpace(r.FormValue("_honey")) != "" {
		log.Printf("form=%s dropped: honeypot filled, ip=%s", id, ip)
		writeOK(w)
		return
	}
	if ms, err := strconv.Atoi(r.FormValue("_elapsed")); err == nil {
		if elapsed := time.Duration(ms) * time.Millisecond; elapsed < s.cfg.MinFill {
			log.Printf("form=%s dropped: filled in %s, ip=%s", id, elapsed, ip)
			writeOK(w)
			return
		}
	}

	if !s.lim.allow(ip) {
		log.Printf("form=%s rejected: rate limit, ip=%s", id, ip)
		http.Error(w, "too many requests", http.StatusTooManyRequests)
		return
	}

	body := strings.TrimSpace(r.FormValue("message"))
	if body == "" {
		http.Error(w, "message is required", http.StatusBadRequest)
		return
	}

	sub := Submission{
		FormID:    id,
		Name:      strings.TrimSpace(r.FormValue("name")),
		Email:     strings.TrimSpace(r.FormValue("email")),
		Message:   body,
		IP:        ip,
		UserAgent: r.Header.Get("User-Agent"),
		Received:  time.Now().UTC(),
	}

	// Spool first. Everything after this point can fail without losing the
	// message.
	path, err := s.spool(sub)
	if err != nil {
		log.Printf("form=%s SPOOL FAILED: %v", id, err)
		http.Error(w, "could not accept submission", http.StatusInternalServerError)
		return
	}

	if err := s.send(form, sub); err != nil {
		// The submission is on disk. Report success to the visitor, who did
		// nothing wrong and cannot fix this, and shout in the log.
		log.Printf("form=%s MAIL FAILED (spooled at %s): %v", id, path, err)
		writeOK(w)
		return
	}

	log.Printf("form=%s delivered to postfix, spooled at %s, ip=%s", id, path, ip)
	writeOK(w)
}

type Submission struct {
	FormID    string    `json:"form_id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	IP        string    `json:"ip"`
	UserAgent string    `json:"user_agent"`
	Received  time.Time `json:"received"`
}

func (s *Server) spool(sub Submission) (string, error) {
	b := make([]byte, 6)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	name := fmt.Sprintf("%s-%s-%s.json",
		sub.Received.Format("20060102T150405Z"), sub.FormID, hex.EncodeToString(b))
	path := filepath.Join(s.cfg.SpoolDir, name)

	data, err := json.MarshalIndent(sub, "", "  ")
	if err != nil {
		return "", err
	}
	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o640)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := f.Write(data); err != nil {
		return "", err
	}
	// The spool is the durability guarantee. An unsynced write that is still
	// in page cache when the box reboots is not one.
	if err := f.Sync(); err != nil {
		return "", err
	}
	return path, nil
}

func (s *Server) send(form Form, sub Submission) error {
	msg, err := buildMessage(s.cfg.MailFrom, form, sub)
	if err != nil {
		return err
	}

	c, err := smtp.Dial(s.cfg.SMTPAddr)
	if err != nil {
		return err
	}
	defer c.Close()

	if err := c.Hello("formrelay"); err != nil {
		return err
	}

	// This hop is deliberately plaintext, and STARTTLS is deliberately not
	// attempted. Three facts drive that:
	//
	//   1. smtp.SendMail would StartTLS with ServerName from SMTP_ADDR
	//      ("liberation-postfix"), which cannot match any certificate.
	//   2. Postfix presents a self-signed cert with CN=mail.daon.network and
	//      no subjectAltName, regenerated on every deploy. Go has rejected
	//      CN-only certs since 1.15, and a CA that changes each deploy cannot
	//      be pinned. There is no configuration of this that verifies.
	//   3. The connection crosses a host-local docker bridge to a port
	//      published on no interface. Anyone positioned to read it already has
	//      root on the box, and can read SPOOL_DIR and the env file directly.
	//
	// Encrypting without verifying would buy nothing here and would put an
	// InsecureSkipVerify in the tree for someone to copy somewhere it matters.
	// Set SMTP_TLS_CA to turn on real, verified STARTTLS if postfix is ever
	// given a properly issued certificate.
	if tc := s.tlsConfig(); tc != nil {
		if ok, _ := c.Extension("STARTTLS"); !ok {
			return fmt.Errorf("SMTP_TLS_CA is set but the server does not offer STARTTLS")
		}
		if err := c.StartTLS(tc); err != nil {
			return fmt.Errorf("starttls: %w", err)
		}
	}

	if err := c.Mail(s.cfg.MailFrom); err != nil {
		return fmt.Errorf("MAIL FROM: %w", err)
	}
	if err := c.Rcpt(form.To); err != nil {
		return fmt.Errorf("RCPT TO: %w", err)
	}
	wc, err := c.Data()
	if err != nil {
		return err
	}
	if _, err := wc.Write(msg); err != nil {
		wc.Close()
		return err
	}
	if err := wc.Close(); err != nil {
		return err
	}
	return c.Quit()
}

// tlsConfig returns a fully verifying config when SMTP_TLS_CA names a PEM
// bundle, or nil to leave the internal hop in plaintext. There is no third
// mode: this never returns a config with verification switched off.
func (s *Server) tlsConfig() *tls.Config {
	ca := os.Getenv("SMTP_TLS_CA")
	if ca == "" {
		return nil
	}
	pem, err := os.ReadFile(ca)
	if err != nil {
		log.Fatalf("SMTP_TLS_CA %s: %v", ca, err)
	}
	pool := x509.NewCertPool()
	if !pool.AppendCertsFromPEM(pem) {
		log.Fatalf("SMTP_TLS_CA %s: no certificates found", ca)
	}
	host, _, err := net.SplitHostPort(s.cfg.SMTPAddr)
	if err != nil {
		host = s.cfg.SMTPAddr
	}
	return &tls.Config{
		RootCAs:    pool,
		ServerName: envOr("SMTP_TLS_SERVERNAME", host),
		MinVersion: tls.VersionTLS12,
	}
}

func buildMessage(from string, form Form, sub Submission) ([]byte, error) {
	subject := header(form.Subject)
	if subject == "" {
		subject = "Form submission"
	}

	var b strings.Builder
	fmt.Fprintf(&b, "From: %s\r\n", from)
	fmt.Fprintf(&b, "To: %s\r\n", form.To)
	fmt.Fprintf(&b, "Subject: %s\r\n", subject)
	fmt.Fprintf(&b, "Date: %s\r\n", sub.Received.Format(time.RFC1123Z))

	// Reply-To carries the submitter so you can just hit reply. It must not
	// be the From: — sending as a domain we do not sign breaks DKIM alignment
	// and lands the mail in spam, which is the failure this replaces.
	if sub.Email != "" {
		if addr, err := mail.ParseAddress(sub.Email); err == nil {
			fmt.Fprintf(&b, "Reply-To: %s\r\n", header(addr.Address))
		}
	}

	b.WriteString("MIME-Version: 1.0\r\n")
	b.WriteString("Content-Type: text/plain; charset=utf-8\r\n")
	b.WriteString("\r\n")

	fmt.Fprintf(&b, "Name:    %s\r\n", header(sub.Name))
	fmt.Fprintf(&b, "Email:   %s\r\n", header(sub.Email))
	fmt.Fprintf(&b, "Form:    %s\r\n", sub.FormID)
	fmt.Fprintf(&b, "IP:      %s\r\n", sub.IP)
	fmt.Fprintf(&b, "Agent:   %s\r\n", header(sub.UserAgent))
	b.WriteString("\r\n")
	// Dot-stuff the body. net/smtp's DataWriter handles this, but building the
	// message correctly does not depend on that being true.
	b.WriteString(strings.ReplaceAll(sub.Message, "\r\n", "\n"))
	b.WriteString("\r\n")

	return []byte(b.String()), nil
}

// header strips CR and LF. Anything reaching a header comes from a form field,
// and a bare newline there is header injection — an extra Bcc: of the
// submitter's choosing.
func header(v string) string {
	v = strings.ReplaceAll(v, "\r", " ")
	v = strings.ReplaceAll(v, "\n", " ")
	if len(v) > 500 {
		v = v[:500]
	}
	return strings.TrimSpace(v)
}

func (s *Server) writeCORS(w http.ResponseWriter, r *http.Request, form Form) {
	origin := r.Header.Get("Origin")
	if origin == "" || form.Origin == "" || origin != form.Origin {
		return
	}
	// One source of truth for these headers, set here and nowhere in Caddy.
	// Two Access-Control-Allow-Origin headers fail the CORS check outright.
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Vary", "Origin")
}

func writeOK(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, `{"status":"received"}`)
}

// clientIP takes the first entry of X-Forwarded-For.
//
// Two proxies sit in front of this (box 2's caddy, then box 1's), so the
// header arrives as "visitor, 204.168.191.68" and net.ParseIP on the whole
// string returns nil — the bug currently sitting in liberation-analytics'
// extractIP. The first entry is only trustworthy because both hops are ours.
func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		first := strings.TrimSpace(strings.Split(xff, ",")[0])
		if ip := net.ParseIP(first); ip != nil {
			return ip.String()
		}
	}
	if xr := strings.TrimSpace(r.Header.Get("X-Real-IP")); xr != "" {
		if ip := net.ParseIP(xr); ip != nil {
			return ip.String()
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

// limiter is a per-IP sliding window. In-memory is right for this: a few
// submissions a day, and a restart forgiving the counters is not a problem.
type limiter struct {
	mu     sync.Mutex
	hits   map[string][]time.Time
	max    int
	window time.Duration
}

func newLimiter(max int, window time.Duration) *limiter {
	return &limiter{hits: make(map[string][]time.Time), max: max, window: window}
}

func (l *limiter) allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-l.window)

	// Prune every caller, not just this one, so a rotating set of bot IPs
	// cannot grow this map without bound.
	for k, times := range l.hits {
		kept := times[:0]
		for _, t := range times {
			if t.After(cutoff) {
				kept = append(kept, t)
			}
		}
		if len(kept) == 0 {
			delete(l.hits, k)
		} else {
			l.hits[k] = kept
		}
	}

	if len(l.hits[key]) >= l.max {
		return false
	}
	l.hits[key] = append(l.hits[key], now)
	return true
}

func checkSpoolWritable(dir string) error {
	probe := filepath.Join(dir, ".writable")
	f, err := os.OpenFile(probe, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0o640)
	if err != nil {
		return err
	}
	f.Close()
	return os.Remove(probe)
}

func envOr(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func envInt(k string, def int) int {
	if v := os.Getenv(k); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return def
}
