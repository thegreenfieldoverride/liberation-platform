'use client';

import { AICoPilot } from '@greenfield/ai-copilot/react';
import type { LiberationPlan } from '@greenfield/types';
import { useState } from 'react';

export default function AICoPilotPage() {
  const [generatedPlan, setGeneratedPlan] = useState<LiberationPlan | null>(null);

  const handlePlanGenerated = (plan: LiberationPlan) => {
    setGeneratedPlan(plan);
    console.log('Liberation plan generated:', plan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Liberation AI Co-Pilot
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Your privacy-first AI assistant for planning your corporate escape. 
            All AI processing happens in your browser - nothing is sent to any servers.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
          <AICoPilot 
            onPlanGenerated={handlePlanGenerated}
            className="text-white"
          />
        </div>

        {generatedPlan && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                📋 Plan Summary
              </h2>
              <div className="text-white/80 space-y-2">
                <p><strong>Timeline:</strong> {generatedPlan.timeline}</p>
                <p><strong>Phases:</strong> {generatedPlan.phases.length}</p>
                <p><strong>Contingencies:</strong> {generatedPlan.contingencies.length}</p>
                <p><strong>Resources:</strong> {generatedPlan.resources.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}