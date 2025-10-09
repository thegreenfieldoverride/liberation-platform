import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <div className="text-8xl mb-8">🧭</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Path Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. 
          Let's help you find your way back to liberation.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Return Home
          </Link>
          
          <Link
            href="/tools"
            className="block w-full text-blue-600 hover:text-blue-700 transition-colors"
          >
            Explore Liberation Tools
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Looking for something specific?</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/tools/runway-calculator" className="hover:text-gray-700">
              Runway Calculator
            </Link>
            <Link href="/real-hourly-wage" className="hover:text-gray-700">
              Real Wage
            </Link>
            <Link href="/ai-copilot" className="hover:text-gray-700">
              AI Co-Pilot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}