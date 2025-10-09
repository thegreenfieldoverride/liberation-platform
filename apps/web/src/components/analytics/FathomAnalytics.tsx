'use client';

import { useEffect } from 'react';

interface FathomAnalyticsProps {
  siteId?: string;
  src?: string;
}

/**
 * Fathom Analytics Integration
 * Privacy-first analytics - no cookies, no personal data collection
 * GDPR compliant by design
 */
export function FathomAnalytics({ 
  siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
  src = 'https://cdn.usefathom.com/script.js'
}: FathomAnalyticsProps) {
  useEffect(() => {
    // Only load if we have a site ID and we're in the browser
    if (!siteId || typeof window === 'undefined') {
      return;
    }

    // Check if Fathom is already loaded
    if (window.fathom) {
      return;
    }

    // Load Fathom script
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute('data-site', siteId);
    script.setAttribute('defer', 'true');
    script.async = true;

    // Set up the global fathom function before script loads
    window.fathom = window.fathom || function(...args: any[]) {
      (window.fathom.q = window.fathom.q || []).push(args);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup when component unmounts
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [siteId, src]);

  return null;
}

/**
 * Track custom events with Fathom
 * Usage: trackEvent('Newsletter Signup')
 */
export function trackEvent(eventName: string, value?: number) {
  if (typeof window !== 'undefined' && window.fathom) {
    window.fathom('trackGoal', eventName, value || 0);
  }
}

/**
 * Track page views manually (for SPA navigation)
 * Usually not needed with Next.js as Fathom auto-tracks
 */
export function trackPageView(url?: string) {
  if (typeof window !== 'undefined' && window.fathom) {
    window.fathom('trackPageview', {
      url: url || window.location.pathname + window.location.search
    });
  }
}

// Type declarations for Fathom
declare global {
  interface Window {
    fathom: {
      (...args: any[]): void;
      q?: any[];
    };
  }
}