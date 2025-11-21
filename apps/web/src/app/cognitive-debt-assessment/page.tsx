'use client';

import React from 'react';
import Link from 'next/link';
import { CognitiveDebtAssessmentDark } from '../../components/CognitiveDebtAssessmentDark';
import type { CognitiveDebtResult } from '@greenfieldoverride/types';
import { KofiButton } from '@greenfieldoverride/liberation-ui';
import { useLiberationJourney } from '../../hooks/useLiberationJourney';
import { trackToolUsed } from '../../lib/analytics';

export default function CognitiveDebtAssessmentPage() {
  const { updateMilestone, recordEvent, updateToolInsights } = useLiberationJourney();

  const handleResult = (result: CognitiveDebtResult) => {
    // Store result locally for user's reference
    try {
      localStorage.setItem('cognitiveDebtResult', JSON.stringify({
        ...result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Could not save result to localStorage:', error);
    }

    // Track liberation journey milestone
    updateMilestone('cognitive-debt-assessed', 100, {
      debtPercentage: result.percentageScore,
      riskLevel: result.riskLevel,
      primaryConcerns: result.primaryConcerns,
      score: result.totalScore
    });
    
    // Track tool usage
    trackToolUsed('cognitive-debt-assessment');

    // Record assessment completion event
    recordEvent({
      type: 'tool_used',
      toolId: 'cognitive-debt-assessment',
      metadata: {
        action: 'assessment_completed',
        debtPercentage: result.percentageScore,
        riskLevel: result.riskLevel,
        score: result.totalScore
      }
    });

    // Update tool insights
    updateToolInsights('cognitive-debt-assessment', {
      debtPercentage: result.percentageScore,
      riskLevel: result.riskLevel
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-12 pt-32 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="text-sm font-display uppercase tracking-widest text-white/60 mb-4">
                The Greenfield Override • Module 1: The Mirror
              </div>
              <div className="w-16 h-1 bg-white/20 mx-auto mb-8"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Cognitive Debt Assessment
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-serif">
              Measure the hidden mental costs of your work environment. 
              This assessment reveals how deeply corporate burnout has affected your cognitive function, 
              emotional well-being, and sense of self.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-white/90 font-serif leading-relaxed">
                <strong className="text-white">Your Privacy Sanctuary:</strong> This assessment runs entirely in your browser. 
                No data is collected, stored, or shared. Your responses and results remain completely private.
              </p>
            </div>
          </div>
        </header>

        {/* Assessment */}
        <main className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
              <CognitiveDebtAssessmentDark 
                onResult={handleResult}
              />
            </div>
          </div>
        </main>

        {/* Footer Context */}
        <footer className="px-6 py-12 text-center border-t border-white/10">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-white/60 font-serif leading-relaxed">
              Understanding your cognitive debt is the first step toward reclaiming your mental freedom. 
              The path to liberation begins with honest self-assessment.
            </p>
          </div>

          {/* Support */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-lg font-medium text-white mb-3">
              Find These Tools Helpful?
            </h3>
            <p className="text-white/80 mb-6">
              Liberation tools are built in the open and funded by the community. Your support keeps them free, privacy-first, and ad-free for everyone.
            </p>
            <KofiButton variant="button" size="medium" />
            <p className="text-sm text-white/60 mt-4">
              <Link href="/funding" className="text-blue-300 hover:text-blue-200 underline">See how funds are used</Link>
            </p>
          </div>
        </footer>
      </div>


    </div>
  );
}