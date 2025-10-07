import type { Metadata } from 'next';
import '../styles/globals.css';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

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
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Charter:ital,wght@0,400;0,700;1,400&family=Lyon+Display:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&display=swap');
          `
        }} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}