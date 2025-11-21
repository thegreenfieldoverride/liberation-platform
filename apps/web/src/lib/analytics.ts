/**
 * Simple Analytics Client
 * 
 * Tracks:
 * 1. Page views (where people go)
 * 2. Tool usage (when someone completes a calculation)
 * 
 * Privacy: No personal data, no results, no persistent tracking
 */

interface AnalyticsEvent {
  app: string;
  action: string;
  attributes: Record<string, any>;
  timestamp: string;
  session_id: string;
}

/**
 * Track a page view
 */
export async function trackPageView(path: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  await sendEvent('navigation', 'page_view', { 
    path: path.split('?')[0] // Remove query params
  });
}

/**
 * Track when a tool is used
 */
export async function trackToolUsed(toolName: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  await sendEvent(toolName, 'completed', { 
    completed: true 
  });
}

/**
 * Send event to analytics service
 */
async function sendEvent(
  app: string, 
  action: string, 
  attributes: Record<string, any> = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  const baseURL = process.env.NEXT_PUBLIC_ANALYTICS_URL || 'https://analytics.greenfieldoverride.com';
  
  const event: AnalyticsEvent = {
    app,
    action,
    attributes,
    timestamp: new Date().toISOString(),
    session_id: generateEventID()
  };

  try {
    await fetch(`${baseURL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    // Silently succeed or fail - never break UX
  } catch (error) {
    // Fail silently
  }
}

/**
 * Generate random event ID (no persistent tracking)
 */
function generateEventID(): string {
  return 'evt_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
}
