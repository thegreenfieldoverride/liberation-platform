#!/usr/bin/env bash
#
# Nightly backup for the Liberation platform.
#
# This replaces a cron entry that pointed at /opt/liberation-platform/backup.sh,
# a file which never existed. It failed 597 times between 2025-10-24 and
# 2026-08-21, writing "not found" to a log nobody read, while
# enhanced-monitoring.sh — the thing whose job was to notice — was missing from
# the same directory and failing every two minutes for the same ten months.
#
# Two consequences shaped this script:
#
#   1. It writes to /mnt/HC_Volume_103803900, a real attached Hetzner volume.
#      The paths named "analytics-volume" and "postgres-volume" are ordinary
#      directories on the root disk despite their names, so a backup written
#      beside the data it protects would die with it.
#
#   2. It is loud. A backup that fails quietly is worse than no backup,
#      because it also removes the worry that would have led someone to check.
#      Every failure emails; a missing success file is itself an alert.
#
set -euo pipefail

DEST_ROOT="${DEST_ROOT:-/mnt/HC_Volume_103803900/backups}"
STATE_DIR="${STATE_DIR:-/var/lib/liberation-backup}"
RETAIN_DAYS="${RETAIN_DAYS:-14}"
ALERT_TO="${ALERT_TO:-alyssapowell03@gmail.com}"
ALERT_FROM="${ALERT_FROM:-noreply@greenfieldoverride.com}"
PG_CONTAINER="${PG_CONTAINER:-liberation-postgres}"
PG_USER="${PG_USER:-liberation}"
POSTFIX_CONTAINER="${POSTFIX_CONTAINER:-liberation-postfix}"

STAMP="$(date -u +%Y%m%d-%H%M%S)"
DEST="${DEST_ROOT}/${STAMP}"
LOG="$(mktemp)"

log() { printf '%s  %s\n' "$(date -u +%H:%M:%S)" "$*" | tee -a "$LOG"; }

# Mail through the local postfix. Uses the container directly rather than a
# host MTA, because the host has no sendmail and postfix is the thing that
# actually relays. If this cannot send, it still exits non-zero so cron's
# MAILTO or the log retains the failure.
alert() {
    local subject="$1"
    {
        printf 'From: Liberation Backup <%s>\n' "$ALERT_FROM"
        printf 'To: %s\n' "$ALERT_TO"
        printf 'Subject: %s\n\n' "$subject"
        printf 'Host: %s\nWhen: %s UTC\n\n' "$(hostname)" "$(date -u)"
        cat "$LOG"
    } | docker exec -i "$POSTFIX_CONTAINER" sendmail -f "$ALERT_FROM" "$ALERT_TO" 2>/dev/null || true
}

on_error() {
    local line="$1"
    log "FAILED at line ${line}"
    alert "[BACKUP FAILED] $(hostname) ${STAMP}"
    rm -f "$LOG"
    exit 1
}
trap 'on_error $LINENO' ERR

mkdir -p "$DEST" "$STATE_DIR"

log "backup ${STAMP} starting"

# --- preflight -------------------------------------------------------------
# Refuse to write to the root disk. If the volume is not mounted, backing up
# onto / silently produces a copy that dies with the original.
DEST_SRC="$(findmnt -T "$DEST_ROOT" -no SOURCE)"
ROOT_SRC="$(findmnt -T / -no SOURCE)"
if [ "$DEST_SRC" = "$ROOT_SRC" ]; then
    log "destination ${DEST_ROOT} is on the root device (${DEST_SRC}); the attached volume is not mounted"
    false
fi
log "destination on ${DEST_SRC}, $(df -h "$DEST_ROOT" | tail -1 | awk '{print $4}') free"

docker inspect "$PG_CONTAINER" >/dev/null 2>&1 || { log "container ${PG_CONTAINER} not running"; false; }

# --- postgres --------------------------------------------------------------
# Globals first: roles and their passwords live outside any single database,
# and a dump without them restores tables that nothing can log in to read.
log "dumping globals (roles, grants)"
docker exec "$PG_CONTAINER" pg_dumpall -U "$PG_USER" --globals-only \
    | gzip > "${DEST}/globals.sql.gz"

DBS="$(docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres -tAc \
    "SELECT datname FROM pg_database WHERE datistemplate = false AND datname <> 'postgres'")"

for db in $DBS; do
    log "dumping ${db}"
    # Custom format: compressed, and pg_restore can list or extract selectively.
    docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -Fc "$db" > "${DEST}/${db}.dump"

    # Verify it is readable rather than merely present. A truncated dump has a
    # plausible size and fails only on the day it is needed.
    if ! docker exec -i "$PG_CONTAINER" pg_restore --list < "${DEST}/${db}.dump" > /dev/null 2>&1; then
        log "${db}.dump is not a readable archive"
        false
    fi
    log "  ${db}: $(du -h "${DEST}/${db}.dump" | cut -f1), archive readable"
done

# --- DKIM private keys -----------------------------------------------------
# These are unrecoverable. Regenerating means every domain fails DKIM until
# new TXT records are published and propagate.
log "archiving DKIM keys"
docker run --rm -v postfix-dkim:/keys:ro alpine:3.20 tar -C /keys -cz . \
    > "${DEST}/postfix-dkim.tar.gz"
tar -tzf "${DEST}/postfix-dkim.tar.gz" >/dev/null || { log "DKIM archive unreadable"; false; }
log "  $(tar -tzf "${DEST}/postfix-dkim.tar.gz" | grep -c '\.private$') private keys"

# --- analytics DuckDB ------------------------------------------------------
# Omitted from the first version of this script, which backed up postgres and
# skipped the database the whole exercise was about. Nine months of traffic
# data had no copy at all.
#
# Both files are captured in one tar, deliberately. DuckDB allows a single
# writer and the analytics service holds the file open, so it cannot be
# quiesced or opened read-only from here. Copying the database without its
# write-ahead log restores whatever was last checkpointed and silently drops
# everything since; the pair together lets DuckDB replay on open.
if [ -f /mnt/analytics-volume/data/analytics.db ]; then
    log "archiving analytics DuckDB"
    tar -C /mnt/analytics-volume/data -czf "${DEST}/analytics-duckdb.tar.gz" \
        analytics.db analytics.db.wal 2>/dev/null || \
        tar -C /mnt/analytics-volume/data -czf "${DEST}/analytics-duckdb.tar.gz" analytics.db
    tar -tzf "${DEST}/analytics-duckdb.tar.gz" >/dev/null || { log "DuckDB archive unreadable"; false; }
    log "  $(du -h "${DEST}/analytics-duckdb.tar.gz" | cut -f1), $(tar -tzf "${DEST}/analytics-duckdb.tar.gz" | wc -l) files"
fi

# --- listmonk uploads ------------------------------------------------------
if [ -d /mnt/analytics-volume/listmonk/uploads ]; then
    log "archiving listmonk uploads"
    tar -C /mnt/analytics-volume/listmonk -czf "${DEST}/listmonk-uploads.tar.gz" uploads
fi

# --- server-side config not in git ----------------------------------------
log "archiving server config"
tar -czf "${DEST}/config.tar.gz" \
    --ignore-failed-read \
    /etc/caddy/Caddyfile \
    /etc/liberation/postfix.env \
    /etc/fail2ban/jail.local \
    2>/dev/null || true

# --- manifest --------------------------------------------------------------
( cd "$DEST" && sha256sum ./* > SHA256SUMS )
log "wrote $(find "$DEST" -type f | wc -l) files, $(du -sh "$DEST" | cut -f1) total"

# --- retention -------------------------------------------------------------
# Only prune after a verified success, so a run of failures cannot age out the
# last good backup.
find "$DEST_ROOT" -maxdepth 1 -type d -name '20*' -mtime "+${RETAIN_DAYS}" \
    -exec rm -rf {} + 2>/dev/null || true
log "retained $(find "$DEST_ROOT" -maxdepth 1 -type d -name '20*' | wc -l) backup sets"

date -u +%s > "${STATE_DIR}/last-success"
echo "$STAMP" > "${STATE_DIR}/last-success-stamp"

log "backup ${STAMP} complete"
rm -f "$LOG"
