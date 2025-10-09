'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Application Error - The Greenfield Override</title>
      </head>
      <body className="font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-md w-full mx-auto p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-500 rounded" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Critical Error
              </h1>
              <p className="text-gray-600 mb-8">
                A critical error occurred that prevented the application from loading properly.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={reset}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Restart Application
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                    Error details (development only)
                  </summary>
                  <pre className="text-xs text-red-600 bg-red-50 p-4 rounded overflow-auto">
                    {error.message}
                    {error.stack && (
                      <>
                        {'\n\n'}
                        {error.stack}
                      </>
                    )}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}