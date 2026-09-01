# Liberation Form Relay
#
# Accepts contact form posts and hands them to postfix over the internal
# docker network. No dependencies beyond the Go standard library, so there is
# no module download at build time and nothing to audit but this repo.

FROM golang:1.24-alpine AS build

WORKDIR /src
COPY go.mod ./
COPY main.go ./

# CGO off gives a static binary that runs on scratch. Trimpath and -s -w keep
# the local filesystem layout and symbol table out of the image.
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/formrelay .

FROM alpine:3.20

LABEL org.opencontainers.image.title="Liberation Form Relay"
LABEL org.opencontainers.image.description="Contact form endpoint that relays to postfix"
LABEL org.opencontainers.image.vendor="Liberation Platform"

# Unprivileged. The spool is the only thing it writes, and it owns that.
RUN addgroup -g 10001 -S formrelay \
 && adduser  -u 10001 -S -G formrelay formrelay \
 && mkdir -p /var/spool/formrelay \
 && chown formrelay:formrelay /var/spool/formrelay \
 && chmod 0750 /var/spool/formrelay

COPY --from=build /out/formrelay /usr/local/bin/formrelay

USER formrelay
EXPOSE 8090
VOLUME ["/var/spool/formrelay"]

# No shell in the entrypoint: signals reach the process directly, so docker
# stop is a clean exit rather than a 10 second timeout and a SIGKILL.
ENTRYPOINT ["/usr/local/bin/formrelay"]
