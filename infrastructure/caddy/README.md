# Caddy configuration

`Caddyfile` here is the **source of truth**, deployed by the manual
`🔀 Deploy Caddy Config` workflow. Do not hand-edit `/etc/caddy/Caddyfile` on
the server — change it here and dispatch the workflow, or the two drift and
the next deploy silently reverts whatever was done by hand.

It is committed because it was the least-protected thing in the stack: a
single unversioned file, last modified 2025-11-12, routing every public domain
(`greenfieldoverride.com`, `staging`, `analytics`, `strategist`), with no
backup except two stale copies sitting on the same disk beside it. Losing it
takes every site down with nothing to restore from.

Committing it does not make it deployed. It makes it *recoverable*.

## Changing it

1. Edit `infrastructure/caddy/Caddyfile` here.
2. Open a PR. CI validates the syntax with the real Caddy binary.
3. Merge, then dispatch **🔀 Deploy Caddy Config** and type `DEPLOY` to confirm.

The workflow validates locally, backs up the live file with a timestamp,
validates again on the server, reloads, then smoke-tests
`https://greenfieldoverride.com`. **Any failure at any of those steps restores
the previous config and reloads it.** Five dated backups are kept on the
server.

Deployment is deliberately manual, like every other infrastructure gate here.
Nothing about this file should change because someone merged a frontend PR.

## Removed: strategist

`strategist.greenfieldoverride.com` and its `www` redirect have been dropped.
The Collective Strategist backend was deliberately taken down, but the routes
outlived it, so the subdomain served 502 to anyone who visited. A public
hostname that only ever errors is worse than one that does not resolve.

Its DNS A record still exists and should be removed too, otherwise the name
resolves to a server with no route for it.

## listmonk

`lists.greenfieldoverride.com` proxies to listmonk on `127.0.0.1:9001`. The
container still binds only to loopback; Caddy is the sole public path in.

**Three things must be true before this works, in this order:**

1. A DNS record for `lists.greenfieldoverride.com` → `5.161.47.48`. Caddy
   cannot obtain a certificate for a name that does not resolve, and will
   retry ACME on a backoff until it does.
2. This config deployed via `🔀 Deploy Caddy Config`.
3. listmonk's `app.root_url` set to `https://lists.greenfieldoverride.com`
   in **Settings → General**. It ships as `http://localhost:9000`, and every
   unsubscribe, archive and click-tracking link in every campaign is built
   from it. Sending before changing it mails out `localhost` links.

One hostname serves both the admin UI and the subscriber-facing pages. They
cannot be split across two hostnames — listmonk generates all of its links
from the single `root_url`, so a second vhost would produce links pointing
back at the first.

### The admin UI is protected only by the listmonk login

There is no IP restriction and no rate limiting on that form. This box sees
constant credential-guessing traffic, so treat the listmonk password the way
you would an SSH key.

Two hardening options, neither applied here:

- **Skip the public path entirely for admin work.** The container is on
  loopback, so `ssh -L 9001:127.0.0.1:9001 <host>` reaches
  `http://localhost:9001/admin` without going through Caddy at all. This
  works today and requires no configuration.
- **Basic auth in front of `/admin`.** Do *not* put the hash in this file —
  this repository is public and a bcrypt hash in git is offline-crackable.
  Use `basic_auth { admin {env.LISTMONK_BASIC_HASH} }` and set the variable
  in Caddy's systemd unit on the server.

A fail2ban jail against `listmonk.log` would fit the pattern already used for
SSH and SMTP, and is the better long-term answer than a second password
prompt. The dedicated log above exists so that jail has something to read.

## Why the rollback is not optional

Every public domain on the box lives in this one file. A syntax error, or a
route pointed at a dead port, takes all of them down together — which is
exactly what happened to `strategist` and went unnoticed for months.

The workflow therefore treats "reloaded without error" as insufficient and
requires the site to actually answer 200 before declaring success. Caddy will
happily reload a valid config that serves nothing.
