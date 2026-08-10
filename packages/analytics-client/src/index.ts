/**
 * Liberation Analytics client
 *
 * Measure the movement, not the individual.
 *
 * Every event carries a freshly generated id, so two events from the same
 * person cannot be linked to each other — there is no session, no profile,
 * no way to reconstruct one visitor's path. Nothing a user types is ever
 * sent: not a number they entered, not a result, not a name.
 *
 * Framework-agnostic on purpose. The endpoint is injected rather than read
 * from an environment variable, because Next reads `process.env` and Vite
 * reads `import.meta.env`, and baking either one in is what forced this to
 * be copied per app in the first place.
 *
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

export interface AnalyticsEvent {
  app: string;
  action: string;
  attributes: Record<string, unknown>;
  timestamp: string;
  /** Random per event. Deliberately not a session id, despite the name. */
  session_id: string;
}

export interface AnalyticsConfig {
  endpoint: string;
  /** Set false to disable entirely, e.g. in tests or local development. */
  enabled?: boolean;
}

let config: AnalyticsConfig = {
  endpoint: 'https://analytics.greenfieldoverride.com',
  enabled: true,
};

export function configureAnalytics(next: Partial<AnalyticsConfig>): void {
  config = { ...config, ...next };
}

/**
 * Honour Do Not Track and Global Privacy Control.
 *
 * Nothing requires this of us and most analytics ignore both. On a platform
 * whose first principle is "Privacy is a Human Right", ignoring a user's
 * explicit signal because it is legal to do so is not a defensible position.
 */
export function isOptedOut(): boolean {
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

function eventId(): string {
  return `evt_${Math.random().toString(36).slice(2, 18)}${Date.now().toString(36)}`;
}

/** Fire and forget. Never throws, never blocks, never breaks a page. */
export async function trackEvent(
  app: string,
  action: string,
  attributes: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === 'undefined' || config.enabled === false || isOptedOut()) return;

  const event: AnalyticsEvent = {
    app,
    action,
    attributes,
    timestamp: new Date().toISOString(),
    session_id: eventId(),
  };

  try {
    await fetch(`${config.endpoint}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // Silently succeed or fail — never break UX for a metric.
  }
}

/** Query strings are stripped; they can carry identifiers we do not want. */
export function trackPageView(path: string): void {
  void trackEvent('navigation', 'page_view', { path: path.split('?')[0] });
}

export function trackToolUsed(toolName: string): void {
  void trackEvent(toolName, 'completed', { completed: true });
}
