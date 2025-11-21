'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// import { analytics } from '../lib/analytics';

/**
 * Client component to track page views
 * Automatically tracks navigation changes
 * TEMPORARILY DISABLED - causing performance issues
 */
export function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    // Temporarily disabled
    // if (pathname) {
    //   analytics.trackPageView(pathname);
    // }
  }, [pathname]);

  return null; // This component doesn't render anything
}
