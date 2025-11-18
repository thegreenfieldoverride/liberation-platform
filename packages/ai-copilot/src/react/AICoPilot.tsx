'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { LiberationContext, LiberationPlan, LiberationPhase, AIStatus } from '@greenfieldoverride/types';
import { sovereignAI } from '../sovereign-ai';

// Simple function to strip markdown formatting
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
    .replace(/\*(.*?)\*/g, '$1')     // *italic*
    .replace(/__(.*?)__/g, '$1')     // __bold__
    .replace(/_(.*?)_/g, '$1')       // _italic_
    .replace(/`(.*?)`/g, '$1')       // `code`
    .replace(/###\s+(.*?)$/gm, '$1') // ### heading
    .replace(/##\s+(.*?)$/gm, '$1')  // ## heading
    .replace(/#\s+(.*?)$/gm, '$1');  // # heading
}

export interface AICoPilotProps {
  onPlanGenerated?: (plan: LiberationPlan) => void;
  liberationContext?: Partial<LiberationContext>;
  className?: string;
}

export function AICoPilot({ onPlanGenerated, liberationContext, className = '' }: AICoPilotProps) {
  const [status, setStatus] = useState<AIStatus>({ initialized: false, modelsLoaded: [] });
  const [context, setContext] = useState<Partial<LiberationContext>>({
    riskTolerance: 'medium',
    skills: [],
    goals: [],
    ...liberationContext
  });
  const [plan, setPlan] = useState<LiberationPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'input' | 'generating' | 'plan'>('input');
  const [skillsInput, setSkillsInput] = useState<string>('');

  // Update context when liberationContext prop changes
  useEffect(() => {
    if (liberationContext) {
      setContext(prev => ({ ...prev, ...liberationContext }));
      setSkillsInput(liberationContext.skills?.join(', ') || '');
    }
  }, [liberationContext]);

  // Initialize AI on component mount
  useEffect(() => {
    const initializeAI = async () => {
      try {
        setStatus({ initialized: false, modelsLoaded: [], loading: true });
        await sovereignAI.initialize();
        const aiStatus = sovereignAI.getStatus();
        setStatus({ ...aiStatus, loading: false });
      } catch (error) {
        setStatus({ 
          initialized: false, 
          modelsLoaded: [], 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to initialize AI'
        });
      }
    };

    initializeAI();
  }, []);

  const handleGeneratePlan = useCallback(async () => {
    if (!status.initialized || !isValidContext(context)) return;

    setIsGenerating(true);
    setStep('generating');

    try {
      const liberationPlan = await sovereignAI.generateLiberationPlan(context as LiberationContext);
      setPlan(liberationPlan);
      setStep('plan');
      onPlanGenerated?.(liberationPlan);
    } catch (error) {
      console.error('Failed to generate liberation plan:', error);
      setStep('input');
    } finally {
      setIsGenerating(false);
    }
  }, [context, status.initialized, onPlanGenerated]);

  const isValidContext = (ctx: Partial<LiberationContext>): ctx is LiberationContext => {
    return !!(
      typeof ctx.runwayMonths === 'number' &&
      typeof ctx.realHourlyWage === 'number' &&
      typeof ctx.cognitiveDebtPercentage === 'number' &&
      ctx.skills?.length &&
      ctx.industry &&
      ctx.riskTolerance
    );
  };

  const handleSkillChange = (skillInput: string) => {
    setSkillsInput(skillInput);
    const skills = skillInput.split(',').map(s => s.trim()).filter(Boolean);
    setContext((prev: Partial<LiberationContext>) => ({ ...prev, skills }));
  };

  if (status.loading) {
    return (
      <div className={`ai-copilot-loading ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-6">🤖</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Sovereign AI Initializing...
          </h2>
          <p className="text-white/70 mb-6">
            Loading liberation models in your browser. This may take a moment on first use.
          </p>
          <div className="animate-pulse bg-white/20 h-2 rounded-full w-64 mx-auto">
            <div className="bg-blue-400 h-2 rounded-full w-1/3 animate-pulse"></div>
          </div>
          <p className="text-sm text-white/50 mt-4">
            Privacy-first AI • Everything stays in your browser
          </p>
        </div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className={`ai-copilot-error ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            AI Initialization Failed
          </h2>
          <p className="text-white/70 mb-6">
            {status.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className={`ai-copilot-generating ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-6 animate-bounce">🧠</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Generating Your Liberation Plan...
          </h2>
          <p className="text-white/70 mb-6">
            The AI is analyzing your situation and creating a personalized escape strategy.
          </p>
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'plan' && plan) {
    return (
      <div className={`ai-copilot-plan ${className}`}>
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Your Liberation Plan
            </h2>
            <p className="text-white/70">
              Generated by Sovereign AI • Privacy-first planning
            </p>
          </div>

          {/* Assessment */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>📊</span> Situation Assessment
            </h3>
            <p className="text-white/80 leading-relaxed whitespace-pre-line">
              {stripMarkdown(plan.assessment || '')}
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>⏰</span> Timeline: {plan.timeline}
            </h3>
          </div>

          {/* Phases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span>🛤️</span> Liberation Phases
            </h3>
            {plan.phases.map((phase: LiberationPhase, index: number) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-white">
                    Phase {index + 1}: {phase.name}
                  </h4>
                  <span className="text-sm text-white/60 bg-white/20 px-3 py-1 rounded-full">
                    {phase.duration}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-white/80 mb-2">Actions:</h5>
                    <ul className="text-sm text-white/70 space-y-1">
                      {phase.actions.map((action: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-white/80 mb-2">Milestones:</h5>
                    <ul className="text-sm text-white/70 space-y-1">
                      {phase.milestones.map((milestone: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">✓</span>
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contingencies */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>🛡️</span> Contingency Plans
            </h3>
            <ul className="text-white/80 space-y-2">
              {plan.contingencies.map((contingency: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">⚠️</span>
                  {contingency}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>📚</span> Recommended Resources
            </h3>
            <ul className="text-white/80 space-y-2">
              {plan.resources.map((resource: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">📖</span>
                  {resource}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={() => {
                setStep('input');
                setSkillsInput(context.skills?.join(', ') || '');
              }}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              Generate New Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Input form
  return (
    <div className={`ai-copilot-input ${className}`}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Liberation AI Co-Pilot
          </h2>
          <p className="text-white/70 mb-6">
            Your personal Chief of Staff for freedom planning
          </p>
          <div className="text-sm text-white/50 bg-white/10 rounded-lg p-3 border border-white/20">
            ✅ Models loaded: {status.modelsLoaded.join(', ')} • Privacy-first AI • Everything stays in your browser
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Financial Runway (months)
            </label>
            <input
              type="number"
              value={context.runwayMonths || ''}
              onChange={(e) => setContext((prev: Partial<LiberationContext>) => ({ ...prev, runwayMonths: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
              placeholder="Enter runway months"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Real Hourly Wage ($)
            </label>
            <input
              type="number"
              value={context.realHourlyWage || ''}
              onChange={(e) => setContext((prev: Partial<LiberationContext>) => ({ ...prev, realHourlyWage: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
              placeholder="Enter real hourly wage"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Cognitive Debt Percentage (%)
            </label>
            <input
              type="number"
              value={context.cognitiveDebtPercentage || ''}
              onChange={(e) => setContext((prev: Partial<LiberationContext>) => ({ ...prev, cognitiveDebtPercentage: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
              placeholder="Enter cognitive debt %"
              max="100"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => handleSkillChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
              placeholder="Enter your skills, comma-separated"
              spellCheck="false"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Industry
            </label>
            <input
              type="text"
              value={context.industry || ''}
              onChange={(e) => setContext((prev: Partial<LiberationContext>) => ({ ...prev, industry: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
              placeholder="Enter your industry"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Risk Tolerance
            </label>
            <select
              value={context.riskTolerance || 'medium'}
              onChange={(e) => setContext((prev: Partial<LiberationContext>) => ({ ...prev, riskTolerance: e.target.value as 'low' | 'medium' | 'high' }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="low" className="bg-gray-800">Low - Conservative approach</option>
              <option value="medium" className="bg-gray-800">Medium - Balanced strategy</option>
              <option value="high" className="bg-gray-800">High - Aggressive transition</option>
            </select>
          </div>
        </div>

        <div className="text-center pt-6">
          <button
            onClick={handleGeneratePlan}
            disabled={!isValidContext(context) || isGenerating}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Liberation Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}