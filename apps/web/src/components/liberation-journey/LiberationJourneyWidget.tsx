'use client';

import React, { useState, useEffect } from 'react';
import { 
  LiberationJourneyState, 
  LiberationPhaseDefinition,
  LiberationMilestone 
} from '../../../../../packages/shared-types/src/liberation-journey';
import { 
  LIBERATION_PHASES, 
  LIBERATION_MILESTONES, 
  calculatePhaseCompletion 
} from '../../../../../packages/shared-types/src/liberation-milestones';
import { useLiberationJourney } from '@/hooks/useLiberationJourney';
import { LiberationIcons } from '@/components/icons/LiberationIcons';

interface LiberationJourneyWidgetProps {
  className?: string;
  variant?: 'sidebar' | 'mobile-drawer' | 'inline';
}

export function LiberationJourneyWidget({ 
  className = '', 
  variant = 'sidebar' 
}: LiberationJourneyWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { journeyState, updateMilestone, recordEvent } = useLiberationJourney();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentPhase = LIBERATION_PHASES[journeyState.currentPhase];
  const phaseCompletion = calculatePhaseCompletion(journeyState.currentPhase, journeyState.milestones);
  
  const getPhaseIcon = (phaseId: LiberationPhaseDefinition['id']) => {
    switch(phaseId) {
      case 'discovery': return '🔍';
      case 'planning': return '📋';
      case 'building': return '🔨';
      case 'transitioning': return '🚀';
      case 'liberated': return '🌟';
      default: return '🎯';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-violet-500';
    if (progress >= 75) return 'bg-amber-500';
    if (progress >= 50) return 'bg-emerald-500';
    if (progress >= 25) return 'bg-sky-500';
    return 'bg-indigo-500';
  };

  const CompactView = () => (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{getPhaseIcon(journeyState.currentPhase)}</div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentPhase.title}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getProgressColor(journeyState.overallScore)}`}
                style={{ width: `${journeyState.overallScore}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {Math.round(journeyState.overallScore)}%
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={isExpanded ? 'Collapse journey widget' : 'Expand journey widget'}
      >
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );

  const ExpandedView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Liberation Journey
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Collapse journey widget"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Current Phase Overview */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-3">
          <div className="text-3xl">{getPhaseIcon(journeyState.currentPhase)}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {currentPhase.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {currentPhase.description}
            </p>
            
            {/* Overall Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                <span>Overall Progress</span>
                <span>{Math.round(journeyState.overallScore)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getProgressColor(journeyState.overallScore)}`}
                  style={{ width: `${journeyState.overallScore}%` }}
                />
              </div>
            </div>

            {/* Phase Progress */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                <span>Phase Progress</span>
                <span>{phaseCompletion.completed} / {phaseCompletion.total} milestones</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-current transition-all duration-500"
                  style={{ 
                    width: `${phaseCompletion.percentage}%`,
                    color: currentPhase.color 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Phase Timeline</h4>
        <div className="space-y-2">
          {Object.values(LIBERATION_PHASES).map((phase, index) => {
            const isCurrentPhase = phase.id === journeyState.currentPhase;
            const phaseProgress = journeyState.phaseProgress[phase.id];
            const isCompleted = phaseProgress?.completedAt;
            const isAccessible = index === 0 || Object.values(LIBERATION_PHASES)[index - 1].id in journeyState.phaseProgress;

            return (
              <div 
                key={phase.id}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                  isCurrentPhase 
                    ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800' 
                    : ''
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrentPhase
                      ? `text-white`
                      : isAccessible
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}
                  style={isCurrentPhase && !isCompleted ? { backgroundColor: phase.color } : {}}
                >
                  {isCompleted ? '✓' : getPhaseIcon(phase.id)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      isCurrentPhase 
                        ? 'text-gray-900 dark:text-white'
                        : isAccessible
                        ? 'text-gray-700 dark:text-gray-200'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {phase.title}
                    </span>
                    {phaseProgress && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {phaseProgress.completedMilestones}/{phaseProgress.totalMilestones}
                      </span>
                    )}
                  </div>
                  {isCurrentPhase && (
                    <div className="mt-1 w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${phaseCompletion.percentage}%`,
                          backgroundColor: phase.color 
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Recent Activity</h4>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
          {journeyState.achievements.slice(-3).map((achievement, index) => (
            <div key={achievement.id} className="flex items-center space-x-2">
              <span className="text-yellow-500">🏆</span>
              <span>{achievement.title}</span>
            </div>
          ))}
          {journeyState.achievements.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No achievements yet. Start using the tools!</p>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile drawer implementation
  if (variant === 'mobile-drawer' || (variant === 'sidebar' && isMobile)) {
    return (
      <>
        {/* Mobile trigger button */}
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-4 right-4 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors md:hidden"
          aria-label="Open liberation journey"
        >
          🎯
        </button>

        {/* Mobile drawer overlay */}
        {isExpanded && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsExpanded(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto">
              <ExpandedView />
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar implementation
  if (variant === 'sidebar') {
    return (
      <div className={`fixed top-20 right-4 w-80 z-40 hidden md:block ${className}`}>
        {isExpanded ? <ExpandedView /> : <CompactView />}
      </div>
    );
  }

  // Inline implementation
  return (
    <div className={`w-full max-w-md ${className}`}>
      {isExpanded ? <ExpandedView /> : <CompactView />}
    </div>
  );
}