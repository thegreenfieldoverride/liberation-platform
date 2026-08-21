/**
 * Analytics for the Small Bets PWA.
 *
 * Shared implementation in @greenfieldoverride/analytics-client. This file
 * injects the endpoint and defines the events specific to this tool.
 */

import {
  configureAnalytics,
  trackEvent,
  trackPageView as trackPageViewShared,
} from '@greenfieldoverride/analytics-client';

configureAnalytics({
  endpoint:
    import.meta.env.VITE_ANALYTICS_URL || 'https://analytics.greenfieldoverride.com',
});

export function trackPageView(): void {
  trackPageViewShared('/small-bets');
}

/**
 * Which friction profile people pick.
 *
 * The single most useful number this tool can produce: how many people
 * experience starting as an executive-function problem rather than an
 * information problem. Only the profile name is sent, unlinked to anything
 * else, and suppressed entirely under DNT/GPC.
 */
export function trackProfileSelected(profile: string): void {
  void trackEvent('small-bets', 'profile_selected', { profile });
}

/** Which channels people actually open. No ordering, no sequence, no identity. */
export function trackLadderOpened(entryId: string): void {
  void trackEvent('small-bets', 'ladder_opened', { entry: entryId });
}
