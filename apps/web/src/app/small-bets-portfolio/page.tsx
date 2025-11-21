/**
 * Small Bets Portfolio Builder - Web App Page
 * Liberation-focused income stream management
 */

'use client';

import React, { useEffect } from 'react';
import { SmallBetsPortfolio } from '@greenfieldoverride/small-bets-portfolio';
import { useLiberationJourney } from '../../hooks/useLiberationJourney';
import { useAnalytics } from '../../hooks/useAnalytics';
import Link from 'next/link';

export default function SmallBetsPortfolioPage() {
  const { updateMilestone, recordEvent, updateToolInsights } = useLiberationJourney();
  const { trackSmallBets, trackToolUsage } = useAnalytics();

  useEffect(() => {
    // Track page view
    trackToolUsage('Small Bets Portfolio', { action: 'page_view' });
    
    // Inject liberation journey hook for package component to use
    if (typeof window !== 'undefined') {
      window.liberationJourney = {
        updateMilestone,
        recordEvent,
        updateToolInsights
      };
      
      // Also inject analytics tracking
      (window as any).liberationAnalytics = {
        trackSmallBets
      };
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        delete window.liberationJourney;
        delete (window as any).liberationAnalytics;
      }
    };
  }, [updateMilestone, recordEvent, updateToolInsights, trackSmallBets, trackToolUsage]);
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/tools" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
            ← Back to Tools
          </Link>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Small Bets Portfolio Builder
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Track and optimize your liberation-focused income streams. Build a portfolio of 
              small bets to diversify your income and reduce dependence on traditional employment.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">📊</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Track Performance</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Monitor ROI, hourly returns, and satisfaction across all your income streams
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">🎯</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Smart Insights</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Get AI-powered recommendations to optimize your portfolio allocation
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">⚖️</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Values Alignment</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Ensure your income streams align with your personal values and goals
                </p>
              </div>
            </div>
            
            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="w-5 h-5 text-blue-600 mr-3 mt-0.5">🔒</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Privacy-First Design</h4>
                  <p className="text-blue-700 text-sm">
                    Your portfolio data is stored locally in your browser using IndexedDB. 
                    No data is sent to external servers. You can export your data at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Component */}
        <SmallBetsPortfolio 
          className="mb-8"
          onBetAdded={(bet) => {
            console.log('Bet added:', bet.name);
          }}
          onBetUpdated={(bet) => {
            console.log('Bet updated:', bet.name);
          }}
          onBetDeleted={(betId) => {
            console.log('Bet deleted:', betId);
          }}
        />

        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started with Small Bets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What is a Small Bet?</h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  A small bet is a low-risk experiment to generate income outside traditional employment. 
                  The key principles:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Low initial investment (typically under $1,000)</li>
                  <li>Quick to test and validate (weeks, not months)</li>
                  <li>Aligned with your values and skills</li>
                  <li>Can be scaled or abandoned easily</li>
                  <li>Diversifies your income sources</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Small Bet Categories</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-start">
                  <span className="w-20 text-sm font-medium text-gray-500">Service:</span>
                  <span className="text-sm">Consulting, freelancing, coaching</span>
                </div>
                <div className="flex items-start">
                  <span className="w-20 text-sm font-medium text-gray-500">Product:</span>
                  <span className="text-sm">Apps, tools, physical products</span>
                </div>
                <div className="flex items-start">
                  <span className="w-20 text-sm font-medium text-gray-500">Content:</span>
                  <span className="text-sm">Courses, newsletters, YouTube</span>
                </div>
                <div className="flex items-start">
                  <span className="w-20 text-sm font-medium text-gray-500">Investment:</span>
                  <span className="text-sm">Stocks, crypto, real estate</span>
                </div>
                <div className="flex items-start">
                  <span className="w-20 text-sm font-medium text-gray-500">Skill:</span>
                  <span className="text-sm">Learning high-value skills</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Pro Tip</h4>
            <p className="text-gray-600 text-sm">
              Start with 2-3 small bets in different categories. This gives you diversity while 
              keeping your efforts focused. As you learn what works, you can scale the winners 
              and stop the losers.
            </p>
          </div>
        </div>

        {/* Cross-Tool Integration */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connected Liberation Tools</h2>
          <p className="text-gray-600 mb-6">
            Your Small Bets Portfolio integrates with other liberation tools to provide a complete picture:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">💰 Financial Data</h4>
              <p className="text-sm text-gray-600">
                Runway and real wage calculations inform your risk tolerance and income targets
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">🎯 Values Alignment</h4>
              <p className="text-sm text-gray-600">
                Your values assessment helps prioritize bets that align with what matters to you
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">🧠 Cognitive Health</h4>
              <p className="text-sm text-gray-600">
                Monitor burnout risk as you balance multiple income streams
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">🤖 AI Guidance</h4>
              <p className="text-sm text-gray-600">
                Get personalized recommendations based on your complete liberation context
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}