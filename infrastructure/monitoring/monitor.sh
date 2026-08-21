#!/usr/bin/env bash
#
# Health checks for the Liberation platform.
#
# Replaces a cron entry calling /opt/liberation-platform/enhanced-monitoring.sh,
# a file which never existed. It ran every two minutes for ten months, writing
# "not found" to a log nobody read. Its absence is why a backup cron failing
# 597 times went unnoticed — the thing meant to notice was broken in the same
# way, in the same directory, and neither reported anything.
#
# Design consequences:
#
#   Alerts are stateful. Something checked every five minutes that emails on
#   every failure produces 288 identical mails a day, which trains you to
#   filter them — the same outcome as no alerting, reached more annoyingly.
#   This alerts on transition into failure, repeats at most every ALERT_COOLDOWN
#   seconds while it persists, and sends one recovery notice.
#
#   Every check is a real observation, not a proxy. "Container is running" does
#   not mean postgres accepts connections, and a valid Caddy config does not
#   mean a site answers.
#
set -uo pipefail

STATE_DIR="${STATE_DIR:-/var/lib/liberation-monitor}"
ALERT_TO="${ALERT_TO:-alyssapowell03@gmail.com}"
ALERT_FROM="${ALERT_FROM:-noreply@greenfieldoverride.com}"
POSTFIX_CONTAINER="${POSTFIX_CONTAINER:-liberation-postfix}"
ALERT_COOLDOWN="${ALERT_COOLDOWN:-21600}"   # 6h between repeats
DISK_WARN_PCT="${DISK_WARN_PCT:-85}"
WAL_RATIO_WARN="${WAL_RATIO_WARN:-50}"   # WAL as a % of the db file
QUEUE_WARN="${QUEUE_WARN:-25}"

mkdir -p "$STATE_DIR"
FAILURES=()

fail() { FAILURES+=("$1"); }

# --- containers ------------------------------------------------------------
for c in liberation-postgres liberation-postfix liberation-listmonk liberation-analytics; do
    if ! docker ps --filter "name=^${c}$" --filter status=running -q | grep -q .; then
        fail "container ${c} is not running"
    fi
done

# --- postgres actually answers --------------------------------------------
if docker ps --filter "name=^liberation-postgres$" -q | grep -q .; then
    docker exec liberation-postgres pg_isready -U liberation -q 2>/dev/null \
        || fail "postgres is running but not accepting connections"
fi

# --- caddy -----------------------------------------------------------------
state=$(systemctl is-active caddy 2>/dev/null || echo unknown)
[ "$state" = "active" ] || fail "caddy service is '${state}' (expected active)"

# --- the sites actually serve ---------------------------------------------
for url in https://greenfieldoverride.com https://lists.greenfieldoverride.com; do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$url" 2>/dev/null || echo 000)
    case "$code" in
        2*|3*) ;;
        *) fail "${url} returned HTTP ${code}" ;;
    esac
done

# --- certificate expiry ----------------------------------------------------
for host in greenfieldoverride.com lists.greenfieldoverride.com; do
    end=$(echo | timeout 10 openssl s_client -connect "${host}:443" -servername "$host" 2>/dev/null \
          | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ -n "$end" ]; then
        days=$(( ( $(date -d "$end" +%s) - $(date +%s) ) / 86400 ))
        [ "$days" -lt 14 ] && fail "TLS cert for ${host} expires in ${days} days"
    fi
done

# --- disk ------------------------------------------------------------------
used=$(df --output=pcent / | tail -1 | tr -dc '0-9')
[ "$used" -ge "$DISK_WARN_PCT" ] && fail "root filesystem ${used}% full"

# --- backups ---------------------------------------------------------------
if [ -f /var/lib/liberation-backup/last-success ]; then
    age=$(( $(date +%s) - $(cat /var/lib/liberation-backup/last-success) ))
    [ "$age" -gt 129600 ] && fail "last successful backup was $(( age / 3600 ))h ago"
else
    fail "no successful backup has ever been recorded"
fi

# --- mail queue ------------------------------------------------------------
if docker ps --filter "name=^liberation-postfix$" -q | grep -q .; then
    q=$(docker exec liberation-postfix sh -c \
        'find /var/spool/postfix/deferred -type f 2>/dev/null | wc -l' 2>/dev/null || echo 0)
    [ "$q" -gt "$QUEUE_WARN" ] && fail "postfix deferred queue has ${q} messages"
fi

# --- DKIM keys -------------------------------------------------------------
# Losing these breaks signing for every domain until new TXT records
# propagate, and nothing else would notice until mail started landing in spam.
if docker ps --filter "name=^liberation-postfix$" -q | grep -q .; then
    keys=$(docker exec liberation-postfix sh -c \
        'ls /etc/opendkim/keys/*/liberation.private 2>/dev/null | wc -l' 2>/dev/null || echo 0)
    [ "$keys" -lt 3 ] && fail "only ${keys} DKIM private keys present (expected 3)"
    docker exec liberation-postfix sh -c 'pgrep opendkim >/dev/null' 2>/dev/null \
        || fail "opendkim is not running — outbound mail is unsigned"
fi

# --- DuckDB write-ahead log ------------------------------------------------
# An un-checkpointed WAL means the data is not in the database file.
#
# The first version of this check warned above a fixed 100MB. That was the
# right idea calibrated wrong: the WAL sat at 14MB holding *every* row while
# the database file was 12KB, and the check stayed silent. Size alone says
# nothing — what matters is how much of the data is only in the log.
WAL=/mnt/analytics-volume/data/analytics.db.wal
DB=/mnt/analytics-volume/data/analytics.db
if [ -f "$WAL" ] && [ -f "$DB" ]; then
    wal_sz=$(stat -c %s "$WAL")
    db_sz=$(stat -c %s "$DB")
    if [ "$db_sz" -gt 0 ] && [ "$wal_sz" -gt 1048576 ]; then
        ratio=$(( wal_sz * 100 / db_sz ))
        [ "$ratio" -gt "$WAL_RATIO_WARN" ] && \
            fail "analytics WAL is ${ratio}% the size of the database file ($(( wal_sz / 1048576 ))MB vs $(( db_sz / 1048576 ))MB) — un-checkpointed"
    fi
fi

# --- report ----------------------------------------------------------------
STATE_FILE="${STATE_DIR}/failing"
LAST_ALERT="${STATE_DIR}/last-alert"
now=$(date +%s)

if [ ${#FAILURES[@]} -eq 0 ]; then
    if [ -f "$STATE_FILE" ]; then
        {
            printf 'From: Liberation Monitor <%s>\nTo: %s\nSubject: [RECOVERED] %s\n\n' \
                "$ALERT_FROM" "$ALERT_TO" "$(hostname)"
            printf 'All checks passing again as of %s UTC.\n\nPreviously failing:\n' "$(date -u)"
            cat "$STATE_FILE"
        } | docker exec -i "$POSTFIX_CONTAINER" sendmail -f "$ALERT_FROM" "$ALERT_TO" 2>/dev/null || true
        rm -f "$STATE_FILE" "$LAST_ALERT"
    fi
    echo "$now" > "${STATE_DIR}/last-ok"
    exit 0
fi

printf '%s\n' "${FAILURES[@]}" > "$STATE_FILE"

send=false
if [ ! -f "$LAST_ALERT" ]; then
    send=true
elif [ $(( now - $(cat "$LAST_ALERT") )) -ge "$ALERT_COOLDOWN" ]; then
    send=true
fi

if [ "$send" = true ]; then
    {
        printf 'From: Liberation Monitor <%s>\nTo: %s\nSubject: [ALERT] %s: %d check(s) failing\n\n' \
            "$ALERT_FROM" "$ALERT_TO" "$(hostname)" "${#FAILURES[@]}"
        printf 'At %s UTC:\n\n' "$(date -u)"
        printf '  - %s\n' "${FAILURES[@]}"
        printf '\nRepeats at most every %dh while this persists.\n' "$(( ALERT_COOLDOWN / 3600 ))"
    } | docker exec -i "$POSTFIX_CONTAINER" sendmail -f "$ALERT_FROM" "$ALERT_TO" 2>/dev/null || true
    echo "$now" > "$LAST_ALERT"
fi

printf '%s FAILING: %s\n' "$(date -u +%H:%M:%S)" "$(IFS=';'; echo "${FAILURES[*]}")"
exit 1
