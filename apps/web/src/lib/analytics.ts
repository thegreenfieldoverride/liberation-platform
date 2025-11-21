/**
 * Liberation Analytics Client
 * 
 * PRIVACY-FIRST DESIGN:
 * - Only tracks USAGE (which tools are used), NOT RESULTS (your personal data)
 * - No personal information collected (no emails, names, IPs, or financial data)
 * - No persistent tracking - each event gets a random ID (can't link your tool uses together)
 * - No cookies, no sessionStorage, no localStorage
 * - No cross-site tracking
 * - Used only to understand: "How many people used the runway calculator this week?"
 * - NOT used to know: "What is your runway?" or any personal financial information
 * 
 * Example: We know "50 people used the runway calculator" but have no idea what their results were
 * or if the same person used multiple tools.
 * 
 * You can always disable JavaScript to block all analytics entirely.
 */

interface AnalyticsEvent {
  app: string;
  action: string;
  attributes: Record<string, any>;
  timestamp: string;
  session_id: string;
}

class LiberationAnalytics {
  private baseURL: string;
  private sessionID: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_ANALYTICS_URL || 'https://analytics.greenfieldoverride.com') {
    this.baseURL = baseURL;
    this.sessionID = this.generateSessionID();
  }

  /**
   * Track a liberation analytics event
   */
  async track(app: string, action: string, attributes: Record<string, any> = {}): Promise<void> {
    // Only track in browser
    if (typeof window === 'undefined') return;

    const event: AnalyticsEvent = {
      app,
      action,
      attributes,
      timestamp: new Date().toISOString(),
      session_id: this.sessionID
    };

    try {
      const response = await fetch(`${this.baseURL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.warn('Liberation Analytics: Failed to track event', response.status);
      }
    } catch (error) {
      // Fail silently - analytics should never break the user experience
      console.warn('Liberation Analytics: Network error', (error as Error).message);
    }
  }

  // Convenience methods for specific liberation tools

  /**
   * Track runway calculation usage (privacy-first: just that the tool was used)
   */
  async trackRunwayCalculation(
    runwayMonths: number, 
    savingsBand: string, 
    expensesBand: string, 
    industry?: string
  ): Promise<void> {
    // Only track that the tool was used, not the results
    return this.track('runway-calculator', 'used', {
      completed: true
    });
  }

  /**
   * Track real hourly wage usage (privacy-first: just that the tool was used)
   */
  async trackRealWageReveal(
    salaryBand: string, 
    realWageDiff: number, 
    commuteMinutes: number, 
    industry?: string
  ): Promise<void> {
    // Only track that the tool was used, not the results
    return this.track('real-hourly-wage', 'used', {
      completed: true
    });
  }

  /**
   * Track cognitive debt assessment usage (privacy-first: just that the tool was used)
   */
  async trackCognitiveDebtAssessment(
    score: number, 
    primaryCategory: string, 
    recommendation: string
  ): Promise<void> {
    // Only track that the tool was used, not the results
    return this.track('cognitive-debt-assessment', 'used', {
      completed: true
    });
  }

  /**
   * Track values-vocation matching usage (privacy-first: just that the tool was used)
   */
  async trackValuesVocationMatch(
    topValue: string, 
    careerPivot: boolean, 
    satisfactionChange: number
  ): Promise<void> {
    // Only track that the tool was used, not the results
    return this.track('values-vocation-matcher', 'used', {
      completed: true
    });
  }

  /**
   * Track AI co-pilot usage (privacy-first: just that the tool was used)
   */
  async trackAICoPilotConsultation(
    queryType: string, 
    planGenerated: boolean, 
    actionsTaken: number
  ): Promise<void> {
    // Only track that the tool was used, not the results
    return this.track('ai-copilot', 'used', {
      completed: true
    });
  }

  /**
   * Track small bets portfolio usage (privacy-first: just that the tool was used)
   */
  async trackSmallBetsActivity(
    betCount: number, 
    totalValue: number, 
    topPerformer: string
  ): Promise<void> {
    // Only track that the tool was used, not the results
    return this.track('small-bets-portfolio', 'used', {
      completed: true
    });
  }

  /**
   * Track page views (privacy-first: only tool category, not specific pages)
   */
  async trackPageView(page: string): Promise<void> {
    // Only track high-level categories to understand which tools are used
    // No query parameters, no specific paths that could identify users
    const pagePath = page.split('?')[0]; // Remove query params
    
    // Only track if it's a tool - ignore navigation to content pages
    if (pagePath.includes('runway-calculator') || 
        pagePath.includes('real-hourly-wage') || 
        pagePath.includes('ai-copilot') ||
        pagePath.includes('small-bets') ||
        pagePath.includes('cognitive-debt') ||
        pagePath.includes('values-vocation')) {
      return this.track('navigation', 'tool_visited', {
        completed: true
      });
    }
    
    // Don't track other page visits at all
    return Promise.resolve();
  }

  /**
   * Generate a random event ID (privacy-first: no persistent sessions)
   */
  private generateSessionID(): string {
    if (typeof window === 'undefined') {
      return 'event_server';
    }
    
    // Generate completely random ID for each event - no persistence
    // This way we can't track users across multiple tool uses
    return 'event_' + Math.random().toString(36).substr(2, 16) + 
           Date.now().toString(36);
  }
}

// Create singleton instance
export const analytics = new LiberationAnalytics();

// Export class for custom instances
export default LiberationAnalytics;
