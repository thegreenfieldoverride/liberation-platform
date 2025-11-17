/**
 * Unit Tests for useLiberationJourney Hook
 * Tests milestone tracking, event recording, and journey state management
 */

import { renderHook, act } from '@testing-library/react';
import { useLiberationJourney } from '@/hooks/useLiberationJourney';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useLiberationJourney Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initialization', () => {
    it('should initialize with default journey state', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      expect(result.current.journeyState.currentPhase).toBe('discovery');
      expect(result.current.journeyState.overallScore).toBe(0);
      expect(result.current.journeyState.milestones).toHaveLength(15);
      expect(result.current.journeyState.achievements).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('should load existing journey state from localStorage', () => {
      const existingState = {
        currentPhase: 'planning',
        overallScore: 25,
        milestones: [],
        achievements: [],
        phaseProgress: {},
        toolInsights: {},
        streaks: { dailyProgress: 0, weeklyGoals: 0, monthlyMomentum: 0 },
        lastUpdated: new Date().toISOString()
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingState));

      const { result } = renderHook(() => useLiberationJourney());
      
      expect(result.current.journeyState.currentPhase).toBe('planning');
      expect(result.current.journeyState.overallScore).toBe(25);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      console.warn = vi.fn();

      const { result } = renderHook(() => useLiberationJourney());
      
      expect(result.current.journeyState.currentPhase).toBe('discovery');
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load journey state from localStorage:'),
        expect.any(Error)
      );
    });
  });

  describe('Milestone Management', () => {
    it('should update milestone progress', () => {
      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.updateMilestone('first-tool-use', 100, { tool: 'runway-calculator' });
      });

      const milestone = result.current.journeyState.milestones.find(m => m.id === 'first-tool-use');
      expect(milestone?.progress).toBe(100);
      expect(milestone?.completedAt).toBeDefined();
    });

    it('should create achievement when milestone is completed', () => {
      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.updateMilestone('first-tool-use', 100, { tool: 'runway-calculator' });
      });

      expect(result.current.journeyState.achievements).toHaveLength(1);
      expect(result.current.journeyState.achievements[0].title).toContain('First Step Taken Completed');
    });

    it('should update overall score when milestones progress', () => {
      const { result } = renderHook(() => useLiberationJourney());
      const initialScore = result.current.journeyState.overallScore;

      act(() => {
        result.current.updateMilestone('first-tool-use', 100, { tool: 'runway-calculator' });
      });

      expect(result.current.journeyState.overallScore).toBeGreaterThan(initialScore);
    });

    it('should advance phase when score threshold is reached', () => {
      const { result } = renderHook(() => useLiberationJourney());

      // Complete multiple milestones to advance phase
      act(() => {
        result.current.updateMilestone('first-tool-use', 100); // 3 points
        result.current.updateMilestone('basic-data-entry', 100); // 4 points  
        result.current.updateMilestone('real-wage-calculated', 100); // 5 points
        result.current.updateMilestone('cognitive-debt-assessed', 100); // 6 points
        result.current.updateMilestone('values-identified', 100); // 8 points
        result.current.updateMilestone('financial-clarity', 100); // 7 points
        // Total: 33 points out of 106 total = 31.1% > 25% threshold
      });

      // Should advance from discovery (0-25) to planning (25-50)
      expect(result.current.journeyState.currentPhase).toBe('planning');
    });

    it('should create phase advancement achievement', () => {
      const { result } = renderHook(() => useLiberationJourney());

      // Force phase change by updating score significantly
      act(() => {
        // Complete high-weight milestones to go above 25% threshold
        result.current.updateMilestone('first-tool-use', 100); // 3 points
        result.current.updateMilestone('basic-data-entry', 100); // 4 points
        result.current.updateMilestone('real-wage-calculated', 100); // 5 points
        result.current.updateMilestone('cognitive-debt-assessed', 100); // 6 points  
        result.current.updateMilestone('values-identified', 100); // 8 points
        result.current.updateMilestone('financial-clarity', 100); // 7 points
        // Total: 33 points out of 106 total = 31.1% > 25% threshold
      });

      const phaseAchievements = result.current.journeyState.achievements.filter(
        a => a.title.includes('Entered')
      );
      expect(phaseAchievements.length).toBeGreaterThan(0);
    });
  });

  describe('Event Recording', () => {
    it('should record tool usage events', () => {
      const { result } = renderHook(() => useLiberationJourney());
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

      act(() => {
        result.current.recordEvent({
          type: 'tool_used',
          toolId: 'runway-calculator',
          metadata: { action: 'data_entered' }
        });
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Liberation Journey Event:',
        expect.objectContaining({
          type: 'tool_used',
          toolId: 'runway-calculator',
          metadata: { action: 'data_entered' },
          timestamp: expect.any(Date)
        })
      );

      consoleSpy.mockRestore();
    });

    it('should update tool insights for decision events', () => {
      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.recordEvent({
          type: 'decision_made',
          toolId: 'insight-engine',
          metadata: { choice: 'A', confidence: 8 }
        });
      });

      expect(result.current.journeyState.toolInsights['insight-engine'].decisionsCount).toBe(1);
      expect(result.current.journeyState.toolInsights['insight-engine'].recentDecision).toEqual({
        choice: 'A',
        confidence: 8,
        date: expect.any(Date)
      });
    });
  });

  describe('Tool Insights Management', () => {
    it('should update tool insights', () => {
      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.updateToolInsights('runway-calculator', {
          runwayMonths: 6,
          trend: 'improving'
        });
      });

      expect(result.current.journeyState.toolInsights['runway-calculator'].runwayMonths).toBe(6);
      expect(result.current.journeyState.toolInsights['runway-calculator'].trend).toBe('improving');
      expect(result.current.journeyState.toolInsights['runway-calculator'].lastUpdated).toBeDefined();
    });

    it('should merge insights with existing data', () => {
      const { result } = renderHook(() => useLiberationJourney());

      // First update
      act(() => {
        result.current.updateToolInsights('runway-calculator', {
          runwayMonths: 6
        });
      });

      // Second update should merge
      act(() => {
        result.current.updateToolInsights('runway-calculator', {
          trend: 'improving'
        });
      });

      const insights = result.current.journeyState.toolInsights['runway-calculator'];
      expect(insights.runwayMonths).toBe(6);
      expect(insights.trend).toBe('improving');
    });
  });

  describe('Journey Reset', () => {
    it('should reset journey to default state', () => {
      const { result } = renderHook(() => useLiberationJourney());

      // Make some progress first
      act(() => {
        result.current.updateMilestone('first-tool-use', 100);
      });

      expect(result.current.journeyState.overallScore).toBeGreaterThan(0);

      // Reset
      act(() => {
        result.current.resetJourney();
      });

      expect(result.current.journeyState.currentPhase).toBe('discovery');
      expect(result.current.journeyState.overallScore).toBe(0);
      expect(result.current.journeyState.achievements).toHaveLength(0);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('liberation-journey-state');
    });
  });

  describe('Persistence', () => {
    it('should save journey state to localStorage on changes', () => {
      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.updateMilestone('first-tool-use', 50);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'liberation-journey-state',
        expect.any(String)
      );
    });

    it('should handle localStorage save errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      console.warn = vi.fn();

      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.updateMilestone('first-tool-use', 50);
      });

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to save journey state to localStorage:'),
        expect.any(Error)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should clamp milestone progress between 0 and 100', () => {
      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.updateMilestone('first-tool-use', 150);
      });

      let milestone = result.current.journeyState.milestones.find(m => m.id === 'first-tool-use');
      expect(milestone?.progress).toBe(100);

      act(() => {
        result.current.updateMilestone('first-tool-use', -10);
      });

      milestone = result.current.journeyState.milestones.find(m => m.id === 'first-tool-use');
      expect(milestone?.progress).toBe(0);
    });

    it('should not duplicate achievements for the same milestone', () => {
      const { result } = renderHook(() => useLiberationJourney());

      act(() => {
        result.current.updateMilestone('first-tool-use', 100);
        result.current.updateMilestone('first-tool-use', 100); // Second completion
      });

      const milestoneAchievements = result.current.journeyState.achievements.filter(
        a => a.id === 'milestone-first-tool-use'
      );
      expect(milestoneAchievements).toHaveLength(1);
    });
  });
});