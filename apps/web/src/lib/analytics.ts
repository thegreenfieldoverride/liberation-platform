/**
 * Analytics for the web app.
 *
 * The implementation lives in @greenfieldoverride/analytics-client so it is
 * not maintained twice. This file exists only to inject the endpoint, since
 * Next reads process.env and Vite reads import.meta.env — that difference is
 * what forced the client to be copied per app previously.
 *
 * Call sites are unchanged: trackPageView(path) and trackToolUsed(name).
 */

import {
  configureAnalytics,
  trackPageView,
  trackToolUsed,
} from '@greenfieldoverride/analytics-client';

configureAnalytics({
  endpoint:
    process.env.NEXT_PUBLIC_ANALYTICS_URL || 'https://analytics.greenfieldoverride.com',
});

export { trackPageView, trackToolUsed };
export type { AnalyticsEvent } from '@greenfieldoverride/analytics-client';
