/**
 * Liberation Analytics client
 *
 * Measure the movement, not the individual.
 *
 * Every event carries a freshly generated id, so two events from the same
 * person cannot be linked to each other — there is no session, no profile,
 * no way to reconstruct one visitor's path. Nothing the user types is ever
 * sent: not a number they entered, not a bet they added, not a result.
 *
 * Ported from apps/web/src/lib/analytics.ts. Second copy — if a third app
 * needs this, extract it to a package instead of copying again.
 */

const ENDPOINT =
  import.meta.env.VITE_ANALYTICS_URL || 'https://analytics.greenfieldoverride.com';

/**
 * Honour Do Not Track and Global Privacy Control.
 *
 * Not required of us by anything, and most analytics ignore both. On a
 * platform whose first principle is "Privacy is a Human Right", ignoring a
 * user's explicit signal because it is legal to do so is not a defensible
 * position.
 */
function optedOut(): boolean {
  if (typeof navigator === 'undefined') return true;
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    doNotTrack?: string;
    msDoNotTrack?: string;
  };
  const dnt =
    nav.doNotTrack ??
    nav.msDoNotTrack ??
    (typeof window !== 'undefined'
      ? (window as unknown as { doNotTrack?: string }).doNotTrack
      : undefined);
  return nav.globalPrivacyControl === true || dnt === '1' || dnt === 'yes';
}

/** Random per event. Deliberately not a session id, despite the field name. */
function eventId(): string {
  return `evt_${Math.random().toString(36).slice(2, 18)}${Date.now().toString(36)}`;
}

async function send(
  app: string,
  action: string,
  attributes: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === 'undefined' || optedOut()) return;

  try {
    await fetch(`${ENDPOINT}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app,
        action,
        attributes,
        timestamp: new Date().toISOString(),
        session_id: eventId(),
      }),
      keepalive: true,
    });
  } catch {
    // Never break the page for a metric.
  }
}

export function trackPageView(): void {
  void send('navigation', 'page_view', { path: '/small-bets' });
}

/**
 * Which friction profile people pick.
 *
 * This is the single most useful number the tool can produce: it says how
 * many people experience starting as an executive-function problem rather
 * than an information problem. Only the profile name is sent, unlinked to
 * anything else, and it is suppressed entirely under DNT/GPC.
 */
export function trackProfileSelected(profile: string): void {
  void send('small-bets', 'profile_selected', { profile });
}

/** Which channels people actually open. No ordering, no sequence, no identity. */
export function trackLadderOpened(entryId: string): void {
  void send('small-bets', 'ladder_opened', { entry: entryId });
}
