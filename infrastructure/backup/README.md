# Backups

`backup.sh` here is the source of truth. It is installed to
`/usr/local/sbin/liberation-backup` on the server and run nightly by cron.

## What happened before this

The crontab called `/opt/liberation-platform/backup.sh`. That file has never
existed. Between 2025-10-24 and 2026-08-21 it failed **597 times**, writing
`not found` into `/var/log/liberation-platform/backup.log`. The entry was also
duplicated, so it failed twice every night.

`enhanced-monitoring.sh`, in the same directory and equally absent, ran every
two minutes for the same ten months. The thing that would have reported the
backup failing was failing in exactly the same way.

Nothing on the box had ever been backed up.

## What is backed up

| Item | Why |
|---|---|
| `pg_dumpall --globals-only` | Roles and passwords live outside any database. A dump without them restores tables nothing can log in to read. |
| Every non-template database | `liberation_analytics`, `listmonk`. Subscribers, campaigns, templates and settings are all here — not in the listmonk container. |
| `postfix-dkim` volume | Unrecoverable. Regenerating means every domain fails DKIM until new TXT records propagate. |
| listmonk uploads | Bind-mounted to the root disk. |
| `/etc/caddy/Caddyfile`, `/etc/liberation/postfix.env`, `jail.local` | Server-side config that is not in git. |

Each database dump is verified with `pg_restore --list` before the run is
called a success. A truncated dump has a plausible file size and fails only on
the day you need it.

## Where it writes, and why that matters

`/mnt/HC_Volume_103803900` — a genuine attached 30GB Hetzner volume.

This matters more than it looks. `/mnt/analytics-volume` and
`/mnt/postgres-volume` are **ordinary directories on the root disk** despite
their names. A backup written to either would sit on the same block device as
the data it protects and die with it. The script refuses to run if its
destination resolves to the same device as `/`.

There is also a 40GB volume, `/mnt/HC_Volume_103803901`, holding an abandoned
postgres data directory last written 2025-11-21. Live postgres was moved to
the root disk at some point and the durable volume was left behind. Moving it
back is a separate decision; this script does not depend on it.

## Retention

Fourteen daily sets, pruned **only after a verified success**, so a run of
failures cannot age out the last good backup.

## Alerting

Two independent mechanisms, because the previous setup had one and it was the
same file that went missing.

1. **The script emails on any failure**, through the local postfix container.
2. **A freshness check emails if no success is recorded in 36 hours.** This
   cron line is written inline, with no script file of its own — deliberately.
   A checker that lives in a file can go missing the same way `backup.sh` did,
   and then nothing reports anything.

## Install

```bash
sudo install -m 0755 backup.sh /usr/local/sbin/liberation-backup
sudo mkdir -p /var/lib/liberation-backup
```

Crontab (replaces both duplicated `/opt/liberation-platform/backup.sh` lines):

```cron
0 2 * * * /usr/local/sbin/liberation-backup >> /var/log/liberation-backup.log 2>&1
0 9 * * * [ -f /var/lib/liberation-backup/last-success ] && [ $(( $(date +\%s) - $(cat /var/lib/liberation-backup/last-success) )) -lt 129600 ] || { printf 'From: Liberation Backup <noreply@greenfieldoverride.com>\nTo: alyssapowell03@gmail.com\nSubject: [BACKUP STALE] no successful backup in 36h\n\nNo success recorded. Check /var/log/liberation-backup.log\n' | docker exec -i liberation-postfix sendmail -f noreply@greenfieldoverride.com alyssapowell03@gmail.com; }
```

## Restoring

```bash
# Roles first, or the restore lands tables nobody can read
gunzip -c globals.sql.gz | docker exec -i liberation-postgres psql -U liberation -d postgres

# Then a database
docker exec -i liberation-postgres pg_restore -U liberation -d listmonk --clean --if-exists < listmonk.dump

# DKIM keys
docker run --rm -v postfix-dkim:/keys -i alpine:3.20 tar -C /keys -xz < postfix-dkim.tar.gz
docker restart liberation-postfix
```

Verify a backup without restoring it:

```bash
sha256sum -c SHA256SUMS
docker exec -i liberation-postgres pg_restore --list < listmonk.dump | head
```

## Test it

A backup you have never restored is a hypothesis. Restore `listmonk.dump` into
a scratch database and count the subscribers:

```bash
docker exec liberation-postgres createdb -U liberation --maintenance-db=postgres restore_test
docker exec -i liberation-postgres pg_restore -U liberation -d restore_test < listmonk.dump
docker exec liberation-postgres psql -U liberation -d restore_test -c 'SELECT count(*) FROM subscribers'
docker exec liberation-postgres dropdb -U liberation --maintenance-db=postgres restore_test
```
