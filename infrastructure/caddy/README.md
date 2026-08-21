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

## Adding listmonk

The deploy workflow binds listmonk to `127.0.0.1:9001`, deliberately not
public. To expose it:

```caddy
lists.greenfieldoverride.com {
    reverse_proxy localhost:9001

    log {
        output file /mnt/analytics-volume/logs/caddy/listmonk.log {
            roll_size 50MB
            roll_keep 10
        }
        format json
    }
}
```

The admin UI has no IP restriction of its own, so anything reachable here is
protected only by the listmonk login. Consider a `@internal` matcher or basic
auth in front of `/admin` if it is ever exposed beyond you.

## Why the rollback is not optional

Every public domain on the box lives in this one file. A syntax error, or a
route pointed at a dead port, takes all of them down together — which is
exactly what happened to `strategist` and went unnoticed for months.

The workflow therefore treats "reloaded without error" as insufficient and
requires the site to actually answer 200 before declaring success. Caddy will
happily reload a valid config that serves nothing.
