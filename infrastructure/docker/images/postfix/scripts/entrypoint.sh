#!/bin/sh
# Liberation Platform - Postfix Entrypoint Script
# Initializes configuration and generates DKIM keys if needed

set -e

# =============================================================================
# ENVIRONMENT VARIABLES
# =============================================================================
MAIL_DOMAIN="${MAIL_DOMAIN:-daon.network}"
MAIL_HOSTNAME="${MAIL_HOSTNAME:-mail.daon.network}"
DKIM_SELECTOR="${DKIM_SELECTOR:-liberation}"
DKIM_ENABLED="${DKIM_ENABLED:-true}"
SMTP_AUTH_USER="${SMTP_AUTH_USER:-liberation}"
SMTP_AUTH_PASSWORD="${SMTP_AUTH_PASSWORD:?Error: SMTP_AUTH_PASSWORD must be set}"

echo "=== Liberation Postfix Initialization ==="
echo "Domain: ${MAIL_DOMAIN}"
echo "Hostname: ${MAIL_HOSTNAME}"
echo "DKIM Selector: ${DKIM_SELECTOR}"
echo "DKIM Enabled: ${DKIM_ENABLED}"
echo "SMTP Auth User: ${SMTP_AUTH_USER}"

# =============================================================================
# POSTFIX CONFIGURATION
# =============================================================================
echo "Configuring Postfix..."

# Update main.cf with environment values
sed -i "s/^myhostname = .*/myhostname = ${MAIL_HOSTNAME}/" /etc/postfix/main.cf
sed -i "s/^mydomain = .*/mydomain = ${MAIL_DOMAIN}/" /etc/postfix/main.cf

# =============================================================================
# TLS CERTIFICATES
# =============================================================================
CERT_DIR="/etc/postfix/certs"
mkdir -p "${CERT_DIR}"

if [ ! -f "${CERT_DIR}/server.crt" ]; then
    echo "Generating self-signed TLS certificate..."
    openssl req -new -x509 -days 365 -nodes \
        -out "${CERT_DIR}/server.crt" \
        -keyout "${CERT_DIR}/server.key" \
        -subj "/CN=${MAIL_HOSTNAME}/O=Liberation Platform/C=US" \
        2>/dev/null
    chmod 600 "${CERT_DIR}/server.key"
    echo "WARNING: Using self-signed certificate. Replace with real cert for production."
fi

# =============================================================================
# DOVECOT SASL AUTHENTICATION
# =============================================================================
echo "Configuring Dovecot SASL authentication..."

# Create Dovecot directories
mkdir -p /etc/dovecot /var/run/dovecot /var/spool/postfix/private 2>/dev/null || true

# Create passwd file for Dovecot (Alpine has /etc/dovecot/users as a file by default)
echo "${SMTP_AUTH_USER}:{PLAIN}${SMTP_AUTH_PASSWORD}" > /etc/dovecot/users
chmod 600 /etc/dovecot/users
chown dovecot:mail /etc/dovecot/users

# Dovecot configuration for SASL only (no IMAP/POP3)
cat > /etc/dovecot/dovecot.conf << EOF
# Dovecot config - SASL auth only for Postfix

# Protocols - none, we only do auth
protocols = 

# Auth configuration
auth_mechanisms = plain login

# Password database - simple passwd file
passdb {
    driver = passwd-file
    args = /etc/dovecot/users
}

# User database - static, not actually used for mail
userdb {
    driver = static
    args = uid=postfix gid=postfix home=/var/spool/postfix
}

# Auth socket for Postfix
service auth {
    unix_listener /var/spool/postfix/private/auth {
        mode = 0660
        user = postfix
        group = postfix
    }
}

# Logging
log_path = /dev/stderr
auth_verbose = yes
auth_debug = no
EOF

# =============================================================================
# DKIM SETUP
# =============================================================================
if [ "${DKIM_ENABLED}" = "true" ]; then
    echo "Configuring DKIM signing..."
    
    DKIM_KEY_DIR="/etc/opendkim/keys/${MAIL_DOMAIN}"
    mkdir -p "${DKIM_KEY_DIR}"
    
    # Generate DKIM key if it doesn't exist
    if [ ! -f "${DKIM_KEY_DIR}/${DKIM_SELECTOR}.private" ]; then
        echo "Generating DKIM key pair..."
        opendkim-genkey -D "${DKIM_KEY_DIR}" -d "${MAIL_DOMAIN}" -s "${DKIM_SELECTOR}" -b 2048
        chown -R opendkim:opendkim "${DKIM_KEY_DIR}"
        chmod 600 "${DKIM_KEY_DIR}/${DKIM_SELECTOR}.private"
        
        echo ""
        echo "========================================"
        echo "IMPORTANT: Add this DNS TXT record to ${MAIL_DOMAIN}:"
        echo "========================================"
        echo ""
        echo "Record Name: ${DKIM_SELECTOR}._domainkey.${MAIL_DOMAIN}"
        echo ""
        echo "Record Value:"
        cat "${DKIM_KEY_DIR}/${DKIM_SELECTOR}.txt" | grep -o '".*"' | tr -d '"' | tr -d '\n'
        echo ""
        echo ""
        echo "========================================"
        echo ""
    else
        echo "DKIM key already exists"
    fi
    
    # Update OpenDKIM configuration
    sed -i "s/^Domain.*/Domain ${MAIL_DOMAIN}/" /etc/opendkim/opendkim.conf
    sed -i "s/^Selector.*/Selector ${DKIM_SELECTOR}/" /etc/opendkim/opendkim.conf
    sed -i "s|^KeyFile.*|KeyFile ${DKIM_KEY_DIR}/${DKIM_SELECTOR}.private|" /etc/opendkim/opendkim.conf
    
    # Create signing table
    cat > /etc/opendkim/SigningTable << EOF
*@${MAIL_DOMAIN} ${DKIM_SELECTOR}._domainkey.${MAIL_DOMAIN}
*@greenfieldoverride.com ${DKIM_SELECTOR}._domainkey.${MAIL_DOMAIN}
*@geekish.us ${DKIM_SELECTOR}._domainkey.${MAIL_DOMAIN}
EOF
    
    # Create key table
    cat > /etc/opendkim/KeyTable << EOF
${DKIM_SELECTOR}._domainkey.${MAIL_DOMAIN} ${MAIL_DOMAIN}:${DKIM_SELECTOR}:${DKIM_KEY_DIR}/${DKIM_SELECTOR}.private
EOF
    
    chown -R opendkim:opendkim /etc/opendkim
    
else
    echo "DKIM disabled, removing milter configuration..."
    sed -i '/^smtpd_milters/d' /etc/postfix/main.cf
    sed -i '/^non_smtpd_milters/d' /etc/postfix/main.cf
fi

# =============================================================================
# POSTFIX MAP FILES
# =============================================================================
echo "Building Postfix lookup tables..."

postmap /etc/postfix/sender_access 2>/dev/null || true

# =============================================================================
# PERMISSIONS
# =============================================================================
echo "Setting permissions..."

# Fix OpenDKIM socket directory permissions
chown opendkim:postfix /var/spool/postfix/opendkim
chmod 770 /var/spool/postfix/opendkim

# Ensure postfix can read necessary files
chown root:postfix /etc/postfix/main.cf /etc/postfix/master.cf
chmod 644 /etc/postfix/main.cf /etc/postfix/master.cf

# Fix Dovecot socket directory
chown postfix:postfix /var/spool/postfix/private

# Add postfix user to opendkim group so it can access the socket
addgroup postfix opendkim 2>/dev/null || true

# =============================================================================
# OUTPUT DNS RECORDS SUMMARY
# =============================================================================
SERVER_IP="${SERVER_IP:-YOUR_SERVER_IP}"

echo ""
echo "========================================"
echo "DNS RECORDS NEEDED FOR ${MAIL_DOMAIN}"
echo "========================================"
echo ""
echo "1. SPF Record (TXT):"
echo "   Name: ${MAIL_DOMAIN}"
echo "   Value: v=spf1 ip4:${SERVER_IP} -all"
echo ""
if [ "${DKIM_ENABLED}" = "true" ] && [ -f "${DKIM_KEY_DIR}/${DKIM_SELECTOR}.txt" ]; then
    echo "2. DKIM Record (TXT):"
    echo "   Name: ${DKIM_SELECTOR}._domainkey.${MAIL_DOMAIN}"
    echo "   Value: $(cat "${DKIM_KEY_DIR}/${DKIM_SELECTOR}.txt" | grep -o '".*"' | tr -d '"' | tr -d '\n')"
    echo ""
fi
echo "3. DMARC Record (TXT):"
echo "   Name: _dmarc.${MAIL_DOMAIN}"
echo "   Value: v=DMARC1; p=reject; rua=mailto:dmarc@${MAIL_DOMAIN}"
echo ""
echo "4. MX Record (optional but recommended):"
echo "   Name: ${MAIL_DOMAIN}"
echo "   Value: 10 ${MAIL_HOSTNAME}"
echo ""
echo "5. A Record for mail hostname:"
echo "   Name: ${MAIL_HOSTNAME}"
echo "   Value: ${SERVER_IP}"
echo ""
echo "========================================"
echo ""
echo "SMTP Connection Info:"
echo "  Host: ${MAIL_HOSTNAME}"
echo "  Port: 587 (STARTTLS) or 465 (SSL/TLS)"
echo "  Username: ${SMTP_AUTH_USER}"
echo "  Password: (as configured)"
echo "  Encryption: Required"
echo "========================================"

# =============================================================================
# START SERVICES
# =============================================================================
echo "Starting services..."
echo "=== Liberation Postfix Ready ==="

exec "$@"
