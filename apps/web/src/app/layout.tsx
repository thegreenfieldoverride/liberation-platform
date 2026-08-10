import type { Metadata } from 'next';

// Self-hosted, no runtime request to Google. Both faces are SIL Open Font
// License, so redistribution is explicitly permitted. The variable build of
// Inter covers 300-700 in a single file rather than five static weights.
import '@fontsource-variable/inter';
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/400-italic.css';
import '@fontsource/source-serif-4/600.css';

import '../styles/globals.css';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AnalyticsPageView } from '../components/AnalyticsPageView';

import { LiberationJourneyWidget } from '../components/liberation-journey/LiberationJourneyWidget';

export const metadata: Metadata = {
  title: 'The Greenfield Override - Tools for Liberation',
  description: 'Escape the corporate hamster wheel. Privacy-first tools to transform financial anxiety into clarity and build your path to freedom.',
  keywords: [
    'financial freedom', 
    'burnout recovery', 
    'runway calculator', 
    'real hourly wage',
    'liberation tools', 
    'privacy first',
    'corporate escape',
    'financial independence'
  ],
  authors: [{ name: 'The Greenfield Override' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'The Greenfield Override - Tools for Liberation',
    description: 'Escape the corporate hamster wheel. Transform financial anxiety into clarity.',
    type: 'website',
    siteName: 'The Greenfield Override',
  },
  robots: {
    index: true,
    follow: true,
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ErrorBoundary>
          <AnalyticsPageView />
          <Navigation />
          <main className="flex-1 relative">
            {children}
          </main>
          <Footer />
          {/* <LiberationJourneyWidget /> */}
        </ErrorBoundary>
      </body>
    </html>
  );
}