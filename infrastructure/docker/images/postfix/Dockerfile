# Liberation Platform - Postfix SMTP Service
# Hardened mail server for transactional emails (magic links, notifications)
#
# Security features:
# - TLS 1.2+ required for all connections
# - DKIM signing for all outbound mail
# - SASL authentication required
# - No open relay - internal network only
# - Rate limiting to prevent abuse
# - Minimal attack surface

FROM alpine:3.19

LABEL org.opencontainers.image.title="Liberation Postfix"
LABEL org.opencontainers.image.description="Hardened SMTP for transactional emails"
LABEL org.opencontainers.image.vendor="Liberation Platform"

# Install Postfix and security components
# Using Dovecot for SASL auth - more reliable than cyrus-sasl on Alpine
RUN apk add --no-cache \
    postfix \
    postfix-pcre \
    opendkim \
    opendkim-utils \
    dovecot \
    ca-certificates \
    tzdata \
    supervisor \
    openssl \
    python3 \
    && rm -rf /var/cache/apk/*

# Create required directories
RUN mkdir -p \
    /etc/opendkim/keys \
    /var/spool/postfix/opendkim \
    /run/opendkim \
    /var/log/mail \
    && chown opendkim:opendkim /var/spool/postfix/opendkim /run/opendkim \
    && chmod 750 /var/spool/postfix/opendkim

# Copy configuration files
COPY config/main.cf /etc/postfix/main.cf
COPY config/master.cf /etc/postfix/master.cf
COPY config/opendkim.conf /etc/opendkim/opendkim.conf
COPY config/sasl_passwd.template /etc/postfix/sasl_passwd.template
COPY config/header_checks /etc/postfix/header_checks
COPY config/sender_access /etc/postfix/sender_access
COPY config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY scripts/entrypoint.sh /entrypoint.sh
COPY scripts/metrics-exporter.py /usr/local/bin/metrics-exporter

RUN chmod +x /entrypoint.sh /usr/local/bin/metrics-exporter

# Postfix submission port (authenticated)
EXPOSE 587
# SMTPS port (implicit TLS)
EXPOSE 465
# Prometheus metrics
EXPOSE 9154

# Health check - verify Postfix is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD postfix status || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
