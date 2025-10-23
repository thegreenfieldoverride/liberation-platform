'use client';

import { useState } from 'react';
import type { VocationMatchingResult } from '@greenfieldoverride/types';
import { ValuesVocationMatcher } from '@greenfieldoverride/values-vocation-matcher/react';

export default function ValuesVocationMatcherPage() {
  const [result, setResult] = useState<VocationMatchingResult | null>(null);

  const handleComplete = (matchingResult: VocationMatchingResult) => {
    setResult(matchingResult);
    console.log('Values-to-Vocation Assessment Complete:', matchingResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Values-to-Vocation Matcher
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover meaningful work that aligns with your authentic values. 
            Move beyond skills and personality to find career paths that honor what truly matters to you.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Values-First Assessment</h3>
              <p className="text-sm text-blue-100">
                60+ thoughtful questions that reveal your authentic priorities and what drives sustainable motivation.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Liberation-Focused Careers</h3>
              <p className="text-sm text-blue-100">
                Career paths optimized for autonomy, flexibility, and meaningful impact rather than corporate conformity.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Transition Roadmaps</h3>
              <p className="text-sm text-blue-100">
                Concrete steps, timelines, and reality checks for moving toward work that truly fits you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {!result ? (
          <>
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Values Matter More Than Skills
                </h2>
                <div className="text-gray-700 space-y-4 text-left">
                  <p>
                    Traditional career assessments focus on what you can do (skills) or how you behave (personality). 
                    But research shows that lasting career satisfaction comes from alignment with your core values - 
                    what matters most deeply to you.
                  </p>
                  <p>
                    When your work aligns with your values, you experience natural motivation, authentic energy, 
                    and resilience during challenges. When it doesn't, even high pay and prestige can't prevent 
                    burnout and dissatisfaction.
                  </p>
                  <p>
                    This assessment starts with your authentic values and matches them to real career opportunities 
                    that honor what matters most to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Assessment Component */}
            <ValuesVocationMatcher 
              onComplete={handleComplete}
              showDetailedResults={true}
              className="mb-8"
            />
          </>
        ) : (
          <>
            {/* Results Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8 border border-green-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎯 Assessment Complete!
                </h2>
                <p className="text-gray-700">
                  You've discovered {result.topMatches.length} career paths that align with your values.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {result.userProfile.dominantValues.length}
                  </div>
                  <div className="text-sm text-gray-600">Top Values Identified</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {result.topMatches.filter(m => m.alignmentScore >= 70).length}
                  </div>
                  <div className="text-sm text-gray-600">High-Alignment Matches</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {result.explorationSuggestions.length}
                  </div>
                  <div className="text-sm text-gray-600">Action Steps Provided</div>
                </div>
              </div>
            </div>

            {/* Integration with Other Tools */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Next Steps: Build Your Liberation Plan
              </h3>
              <p className="text-gray-700 text-center mb-6">
                Now that you know your values and potential career matches, use our other tools to create a complete escape plan.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <a 
                  href="/runway-calculator" 
                  className="block p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Runway Calculator</h4>
                  <p className="text-sm text-gray-600">
                    Calculate how long your savings will last and plan your transition timeline.
                  </p>
                </a>

                <a 
                  href="/real-hourly-wage" 
                  className="block p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real Hourly Wage</h4>
                  <p className="text-sm text-gray-600">
                    Discover your true compensation after factoring in all hidden costs.
                  </p>
                </a>

                <a 
                  href="/ai-copilot" 
                  className="block p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Co-Pilot</h4>
                  <p className="text-sm text-gray-600">
                    Get personalized liberation strategies powered by AI analysis.
                  </p>
                </a>
              </div>
            </div>

            {/* Restart Option */}
            <div className="text-center">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Take Assessment Again
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      {!result && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Work That Honors Your Values?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Take the assessment above to discover career paths that align with what truly matters to you.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span>✓ Comprehensive values assessment</span>
              <span>✓ Liberation-focused career database</span>
              <span>✓ Concrete transition planning</span>
              <span>✓ Privacy-first approach</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}