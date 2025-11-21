'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  LiberationJourneyState, 
  LiberationJourneyEvent, 
  LiberationMilestone 
} from '../../../../packages/shared-types/src/liberation-journey';
import { 
  LIBERATION_PHASES, 
  LIBERATION_MILESTONES, 
  calculatePhaseCompletion 
} from '../../../../packages/shared-types/src/liberation-milestones';

const JOURNEY_STORAGE_KEY = 'liberation-journey-state';

function createDefaultJourneyState(): LiberationJourneyState {
  return {
    currentPhase: 'discovery',
    overallScore: 0,
    milestones: [...LIBERATION_MILESTONES], // Create copy with default progress
    phaseProgress: {
      discovery: { score: 0, completedMilestones: 0, totalMilestones: 6 },
      planning: { score: 0, completedMilestones: 0, totalMilestones: 2 },
      building: { score: 0, completedMilestones: 0, totalMilestones: 3 },
      transitioning: { score: 0, completedMilestones: 0, totalMilestones: 2 },
      liberated: { score: 0, completedMilestones: 0, totalMilestones: 2 }
    },
    toolInsights: {
      'runway-calculator': { trend: 'unknown' },
      'real-hourly-wage': { efficiency: 'unknown' },
      'cognitive-debt-assessment': { riskLevel: 'unknown' },
      'values-vocation-matcher': { topMatchesCount: 0, clarity: 'unknown' },
      'insight-engine': { decisionsCount: 0 },
      'ai-copilot': { sessionCount: 0 },
      'small-bets-portfolio': { activeBetsCount: 0, momentum: 'unknown' }
    },
    achievements: [],
    streaks: {
      dailyProgress: 0,
      weeklyGoals: 0,
      monthlyMomentum: 0
    },
    lastUpdated: new Date()
  };
}

export function useLiberationJourney() {
  const [journeyState, setJourneyState] = useState<LiberationJourneyState>(createDefaultJourneyState);
  const [isLoading, setIsLoading] = useState(true);

  // Load journey state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.achievements = parsed.achievements.map((a: any) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt)
        }));
        parsed.milestones = parsed.milestones.map((m: any) => ({
          ...m,
          completedAt: m.completedAt ? new Date(m.completedAt) : undefined
        }));
        
        // Recalculate phase progress to fix any stale data from milestone rebalancing
        const recalculatedPhaseProgress: any = {};
        Object.keys(LIBERATION_PHASES).forEach((phaseId) => {
          const completion = calculatePhaseCompletion(phaseId as any, parsed.milestones);
          recalculatedPhaseProgress[phaseId] = {
            score: completion.percentage,
            completedMilestones: completion.completed,
            totalMilestones: completion.total
          };
        });
        parsed.phaseProgress = recalculatedPhaseProgress;
        
        setJourneyState(parsed);
      }
    } catch (error) {
      console.warn('Failed to load journey state from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save journey state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(journeyState));
        // Dispatch custom event so other hook instances can update
        window.dispatchEvent(new Event('liberation-journey-updated'));
      } catch (error) {
        console.warn('Failed to save journey state to localStorage:', error);
      }
    }
  }, [journeyState, isLoading]);

  // Listen for updates from other hook instances
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.lastUpdated = new Date(parsed.lastUpdated);
          parsed.achievements = parsed.achievements?.map((a: any) => ({
            ...a,
            unlockedAt: new Date(a.unlockedAt)
          })) || [];
          parsed.milestones = parsed.milestones?.map((m: any) => ({
            ...m,
            completedAt: m.completedAt ? new Date(m.completedAt) : undefined
          })) || [];
          setJourneyState(parsed);
        }
      } catch (error) {
        console.warn('Failed to sync journey state:', error);
      }
    };

    window.addEventListener('liberation-journey-updated', handleStorageUpdate);
    return () => window.removeEventListener('liberation-journey-updated', handleStorageUpdate);
  }, []);

  // Calculate overall score based on milestone weights and progress
  const calculateOverallScore = useCallback((milestones: LiberationMilestone[]): number => {
    const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
    const weightedProgress = milestones.reduce((sum, m) => sum + (m.progress * m.weight / 100), 0);
    return totalWeight > 0 ? (weightedProgress / totalWeight) * 100 : 0;
  }, []);

  // Update a milestone's progress
  const updateMilestone = useCallback((milestoneId: string, progress: number, metadata?: any) => {
    setJourneyState(prev => {
      const updatedMilestones = prev.milestones.map(m => 
        m.id === milestoneId 
          ? { 
              ...m, 
              progress: Math.min(100, Math.max(0, progress)),
              completedAt: progress >= 100 && !m.completedAt ? new Date() : m.completedAt
            }
          : m
      );

      const newOverallScore = calculateOverallScore(updatedMilestones);
      
      // Determine current phase based on score
      let newCurrentPhase = prev.currentPhase;
      for (const [phaseId, phase] of Object.entries(LIBERATION_PHASES)) {
        if (newOverallScore >= phase.scoreRange[0] && newOverallScore < phase.scoreRange[1]) {
          newCurrentPhase = phaseId as any;
          break;
        }
      }

      // Update phase progress
      const updatedPhaseProgress = { ...prev.phaseProgress };
      for (const phaseId of Object.keys(LIBERATION_PHASES)) {
        const phaseCompletion = calculatePhaseCompletion(phaseId as any, updatedMilestones);
        updatedPhaseProgress[phaseId as keyof typeof updatedPhaseProgress] = {
          ...updatedPhaseProgress[phaseId as keyof typeof updatedPhaseProgress],
          completedMilestones: phaseCompletion.completed,
          score: phaseCompletion.percentage
        };
      }

      // Check for new achievements
      const newAchievements = [];
      const completedMilestone = updatedMilestones.find(m => m.id === milestoneId);
      if (completedMilestone && progress >= 100 && !prev.milestones.find(m => m.id === milestoneId)?.completedAt) {
        newAchievements.push({
          id: `milestone-${milestoneId}`,
          title: `${completedMilestone.title} Completed`,
          description: completedMilestone.description,
          unlockedAt: new Date(),
          category: completedMilestone.category
        });
        
        // Milestone completed (analytics removed for simplicity)
      }

       // Check for phase advancement
       if (newCurrentPhase !== prev.currentPhase) {
         newAchievements.push({
           id: `phase-${newCurrentPhase}`,
           title: `Entered ${LIBERATION_PHASES[newCurrentPhase].title}`,
           description: `Advanced to the ${LIBERATION_PHASES[newCurrentPhase].title}`,
           unlockedAt: new Date(),
           category: 'insight' as const
         });
         
         // Phase advanced (analytics removed for simplicity)
       }

       // Update tool insights if metadata provided
       let updatedToolInsights = prev.toolInsights;
       if (metadata && completedMilestone) {
         const toolId = completedMilestone.tool;
         if (toolId) {
           updatedToolInsights = {
             ...prev.toolInsights,
             [toolId]: {
               ...prev.toolInsights[toolId],
               ...metadata,
               lastUpdated: new Date()
             }
           };
         }
       }

       return {
         ...prev,
         currentPhase: newCurrentPhase,
         overallScore: newOverallScore,
         milestones: updatedMilestones,
         phaseProgress: updatedPhaseProgress,
         toolInsights: updatedToolInsights,
         achievements: [...prev.achievements, ...newAchievements],
         lastUpdated: new Date()
       };
    });
  }, [calculateOverallScore]);

  // Record an event (for analytics and tracking)
  const recordEvent = useCallback((event: Omit<LiberationJourneyEvent, 'timestamp'>) => {
    const fullEvent: LiberationJourneyEvent = {
      ...event,
      timestamp: new Date()
    };

    // Log event for debugging
    console.log('Liberation Journey Event:', fullEvent);

    // Event recorded (analytics removed for simplicity)

    // Update tool insights based on event
    setJourneyState(prev => {
      const updatedToolInsights = { ...prev.toolInsights };
      
      switch (event.type) {
        case 'tool_used':
          // Type-safe update for specific tool insights
          if (event.toolId === 'runway-calculator') {
            updatedToolInsights['runway-calculator'] = {
              ...updatedToolInsights['runway-calculator'],
              lastUpdated: new Date()
            };
          } else if (event.toolId === 'real-hourly-wage') {
            updatedToolInsights['real-hourly-wage'] = {
              ...updatedToolInsights['real-hourly-wage'],
              lastUpdated: new Date()
            };
          } else if (event.toolId === 'cognitive-debt-assessment') {
            updatedToolInsights['cognitive-debt-assessment'] = {
              ...updatedToolInsights['cognitive-debt-assessment'],
              lastUpdated: new Date()
            };
          } else if (event.toolId === 'values-vocation-matcher') {
            updatedToolInsights['values-vocation-matcher'] = {
              ...updatedToolInsights['values-vocation-matcher'],
              lastUpdated: new Date()
            };
          } else if (event.toolId === 'insight-engine') {
            updatedToolInsights['insight-engine'] = {
              ...updatedToolInsights['insight-engine']
            };
          } else if (event.toolId === 'ai-copilot') {
            updatedToolInsights['ai-copilot'] = {
              ...updatedToolInsights['ai-copilot'],
              lastUsed: new Date()
            };
          } else if (event.toolId === 'small-bets-portfolio') {
            updatedToolInsights['small-bets-portfolio'] = {
              ...updatedToolInsights['small-bets-portfolio']
            };
          }
          break;
        case 'decision_made':
          if (event.toolId === 'insight-engine') {
            updatedToolInsights['insight-engine'] = {
              ...updatedToolInsights['insight-engine'],
              decisionsCount: updatedToolInsights['insight-engine'].decisionsCount + 1,
              recentDecision: {
                choice: event.metadata?.choice || 'A',
                confidence: event.metadata?.confidence || 5,
                date: new Date()
              }
            };
          }
          break;
      }

      return {
        ...prev,
        toolInsights: updatedToolInsights,
        lastUpdated: new Date()
      };
    });
  }, []);

  // Convenience function to update tool insights
  const updateToolInsights = useCallback((toolId: LiberationMilestone['tool'], insights: any) => {
    setJourneyState(prev => ({
      ...prev,
      toolInsights: {
        ...prev.toolInsights,
        [toolId]: {
          ...prev.toolInsights[toolId],
          ...insights,
          lastUpdated: new Date()
        }
      },
      lastUpdated: new Date()
    }));
  }, []);

  // Reset journey (for testing/debugging)
  const resetJourney = useCallback(() => {
    const defaultState = createDefaultJourneyState();
    setJourneyState(defaultState);
    localStorage.removeItem(JOURNEY_STORAGE_KEY);
  }, []);

  return {
    journeyState,
    isLoading,
    updateMilestone,
    recordEvent,
    updateToolInsights,
    resetJourney
  };
}