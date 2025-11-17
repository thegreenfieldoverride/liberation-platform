import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLiberationJourney } from '../../src/hooks/useLiberationJourney';
import { 
  LIBERATION_MILESTONES, 
  LIBERATION_PHASES,
  calculatePhaseCompletion 
} from '../../../../packages/shared-types/src/liberation-milestones';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Liberation Journey Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('should initialize with default journey state', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      expect(result.current.journeyState.currentPhase).toBe('discovery');
      expect(result.current.journeyState.overallScore).toBe(0);
      expect(result.current.journeyState.milestones).toHaveLength(LIBERATION_MILESTONES.length);
      expect(result.current.journeyState.phaseProgress.discovery.totalMilestones).toBe(5);
      expect(result.current.journeyState.phaseProgress.planning.totalMilestones).toBe(2);
    });

    it('should load existing state from localStorage', () => {
      const existingState = {
        currentPhase: 'planning',
        overallScore: 35,
        milestones: LIBERATION_MILESTONES.map(m => ({ ...m, progress: m.id === 'first-tool-use' ? 100 : 0 })),
        phaseProgress: {
          discovery: { score: 60, completedMilestones: 3, totalMilestones: 5 },
          planning: { score: 10, completedMilestones: 0, totalMilestones: 2 },
          building: { score: 0, completedMilestones: 0, totalMilestones: 3 },
          transitioning: { score: 0, completedMilestones: 0, totalMilestones: 3 },
          liberated: { score: 0, completedMilestones: 0, totalMilestones: 2 }
        },
        toolInsights: {},
        achievements: [],
        streaks: { dailyProgress: 0, weeklyGoals: 0, monthlyMomentum: 0 },
        lastUpdated: new Date().toISOString()
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingState));
      
      const { result } = renderHook(() => useLiberationJourney());
      
      expect(result.current.journeyState.currentPhase).toBe('planning');
      expect(result.current.journeyState.overallScore).toBe(35);
    });
  });

  describe('Milestone Updates', () => {
    it('should update milestone progress correctly', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        result.current.updateMilestone('first-tool-use', 100, { tool: 'runway-calculator' });
      });
      
      const updatedMilestone = result.current.journeyState.milestones.find(m => m.id === 'first-tool-use');
      expect(updatedMilestone?.progress).toBe(100);
      expect(updatedMilestone?.completedAt).toBeTruthy();
    });

    it('should calculate overall score based on milestone weights', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        // Complete a high-weight milestone
        result.current.updateMilestone('values-identified', 100, { topMatches: 5 });
      });
      
      expect(result.current.journeyState.overallScore).toBeGreaterThan(0);
    });

    it('should advance phase when score threshold is reached', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      // Complete enough milestones to advance phase  
      act(() => {
        result.current.updateMilestone('first-tool-use', 100); // 3 points
        result.current.updateMilestone('basic-data-entry', 100); // 4 points  
        result.current.updateMilestone('real-wage-calculated', 100); // 5 points
        result.current.updateMilestone('cognitive-debt-assessed', 100); // 6 points
        result.current.updateMilestone('values-identified', 100); // 8 points
        result.current.updateMilestone('financial-clarity', 100); // 7 points
        // Total: 33 points out of 106 total = 31.1% > 25% threshold
      });
      
      // Should advance from discovery to planning
      expect(result.current.journeyState.currentPhase).toBe('planning');
    });

    it('should create achievements for completed milestones', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        result.current.updateMilestone('first-tool-use', 100, { tool: 'runway-calculator' });
      });
      
      const achievements = result.current.journeyState.achievements;
      expect(achievements).toHaveLength(1);
      expect(achievements[0].title).toContain('First Step Taken');
    });
  });

  describe('Discovery Phase Requirements', () => {
    it('should have correct milestones in discovery phase', () => {
      const discoveryMilestones = LIBERATION_PHASES.discovery.requiredMilestones;
      
      expect(discoveryMilestones).toContain('first-tool-use');
      expect(discoveryMilestones).toContain('basic-data-entry');
      expect(discoveryMilestones).toContain('real-wage-calculated');
      expect(discoveryMilestones).toContain('cognitive-debt-assessed');
      expect(discoveryMilestones).toContain('values-identified');
      expect(discoveryMilestones).toHaveLength(5);
    });

    it('should calculate discovery phase completion correctly', () => {
      const milestones = LIBERATION_MILESTONES.map(m => ({ ...m, progress: 0 }));
      
      // Complete 3 out of 5 discovery milestones
      milestones.find(m => m.id === 'first-tool-use')!.progress = 100;
      milestones.find(m => m.id === 'basic-data-entry')!.progress = 100;
      milestones.find(m => m.id === 'cognitive-debt-assessed')!.progress = 100;
      
      const completion = calculatePhaseCompletion('discovery', milestones);
      
      expect(completion.completed).toBe(3);
      expect(completion.total).toBe(5);
      expect(completion.percentage).toBe(60);
    });
  });

  describe('Values-Vocation Matcher Integration', () => {
    it('should only complete values-identified milestone if >=3 matches found', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      // Test with insufficient matches
      act(() => {
        result.current.updateMilestone('values-identified', 60, { 
          topMatches: 2, 
          meetsRequirement: false 
        });
      });
      
      const milestone = result.current.journeyState.milestones.find(m => m.id === 'values-identified');
      expect(milestone?.progress).toBe(60);
      
      // Test with sufficient matches
      act(() => {
        result.current.updateMilestone('values-identified', 100, { 
          topMatches: 4, 
          meetsRequirement: true 
        });
      });
      
      const updatedMilestone = result.current.journeyState.milestones.find(m => m.id === 'values-identified');
      expect(updatedMilestone?.progress).toBe(100);
      expect(updatedMilestone?.completedAt).toBeTruthy();
    });
  });

  describe('Cognitive Debt Assessment Integration', () => {
    it('should complete cognitive-debt-assessed milestone', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        result.current.updateMilestone('cognitive-debt-assessed', 100, {
          debtPercentage: 65,
          riskLevel: 'high',
          primaryConcerns: ['emotional_exhaustion', 'mental_fog'],
          score: 65
        });
      });
      
      const milestone = result.current.journeyState.milestones.find(m => m.id === 'cognitive-debt-assessed');
      expect(milestone?.progress).toBe(100);
      expect(milestone?.completedAt).toBeTruthy();
      
      // Should update tool insights
      expect(result.current.journeyState.toolInsights['cognitive-debt-assessment']).toEqual({
        riskLevel: 'high',
        debtPercentage: 65,
        primaryConcerns: ['emotional_exhaustion', 'mental_fog'],
        score: 65,
        lastUpdated: expect.any(Date)
      });
    });
  });

  describe('Real Hourly Wage Integration', () => {
    it('should complete real-wage-calculated milestone', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        result.current.updateMilestone('real-wage-calculated', 100, {
          statedWage: 30,
          realWage: 22.5,
          efficiency: 'low'
        });
      });
      
      const milestone = result.current.journeyState.milestones.find(m => m.id === 'real-wage-calculated');
      expect(milestone?.progress).toBe(100);
      expect(milestone?.completedAt).toBeTruthy();
    });
  });

  describe('Phase Structure Validation', () => {
    it('should have correct milestone distribution across phases', () => {
      const discoveryCount = LIBERATION_PHASES.discovery.requiredMilestones.length;
      const planningCount = LIBERATION_PHASES.planning.requiredMilestones.length;
      const buildingCount = LIBERATION_PHASES.building.requiredMilestones.length;
      const transitioningCount = LIBERATION_PHASES.transitioning.requiredMilestones.length;
      const liberatedCount = LIBERATION_PHASES.liberated.requiredMilestones.length;
      
      expect(discoveryCount).toBe(5); // Updated count after moving values to discovery
      expect(planningCount).toBe(2);  // Reduced after moving values out
      expect(buildingCount).toBe(3);
      expect(transitioningCount).toBe(3);
      expect(liberatedCount).toBe(2);
    });

    it('should advance through phases correctly', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      // Start in discovery
      expect(result.current.journeyState.currentPhase).toBe('discovery');
      
      // Complete discovery phase milestones
      act(() => {
        // These should push overall score above 25%
        result.current.updateMilestone('first-tool-use', 100); // 3 points
        result.current.updateMilestone('basic-data-entry', 100); // 4 points  
        result.current.updateMilestone('real-wage-calculated', 100); // 5 points
        result.current.updateMilestone('cognitive-debt-assessed', 100); // 6 points
        result.current.updateMilestone('values-identified', 100); // 8 points
        result.current.updateMilestone('financial-clarity', 100); // 7 points
        // Total: 33 points out of 106 total = 31.1% > 25% threshold
      });
      
      // Should advance to planning phase
      expect(result.current.journeyState.currentPhase).toBe('planning');
      expect(result.current.journeyState.overallScore).toBeGreaterThan(25);
    });
  });

  describe('Tool Insights Tracking', () => {
    it('should update tool insights correctly', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        result.current.updateToolInsights('runway-calculator', {
          runwayMonths: 8.5,
          trend: 'improving'
        });
      });
      
      expect(result.current.journeyState.toolInsights['runway-calculator']).toEqual({
        trend: 'improving',
        runwayMonths: 8.5,
        lastUpdated: expect.any(Date)
      });
    });
  });

  describe('Event Recording', () => {
    it('should record events and update tool insights', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        result.current.recordEvent({
          type: 'tool_used',
          toolId: 'cognitive-debt-assessment',
          metadata: { action: 'assessment_completed' }
        });
      });
      
      expect(result.current.journeyState.toolInsights['cognitive-debt-assessment']).toEqual({
        riskLevel: 'unknown',
        lastUpdated: expect.any(Date)
      });
    });
  });

  describe('Persistence', () => {
    it('should save state to localStorage when updated', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      act(() => {
        result.current.updateMilestone('first-tool-use', 100);
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'liberation-journey-state',
        expect.stringContaining('"first-tool-use"')
      );
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const { result } = renderHook(() => useLiberationJourney());
      
      // Should fall back to default state
      expect(result.current.journeyState.currentPhase).toBe('discovery');
      expect(result.current.journeyState.overallScore).toBe(0);
    });
  });

  describe('Journey Reset', () => {
    it('should reset journey state correctly', () => {
      const { result } = renderHook(() => useLiberationJourney());
      
      // Complete some milestones
      act(() => {
        result.current.updateMilestone('first-tool-use', 100);
        result.current.updateMilestone('basic-data-entry', 100);
      });
      
      expect(result.current.journeyState.overallScore).toBeGreaterThan(0);
      
      // Reset journey
      act(() => {
        result.current.resetJourney();
      });
      
      expect(result.current.journeyState.overallScore).toBe(0);
      expect(result.current.journeyState.currentPhase).toBe('discovery');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('liberation-journey-state');
    });
  });
});

describe('Liberation Milestones Configuration', () => {
  it('should have valid milestone definitions', () => {
    LIBERATION_MILESTONES.forEach(milestone => {
      expect(milestone.id).toBeTruthy();
      expect(milestone.title).toBeTruthy();
      expect(milestone.description).toBeTruthy();
      expect(milestone.tool).toBeTruthy();
      expect(milestone.category).toBeTruthy();
      expect(typeof milestone.weight).toBe('number');
      expect(milestone.weight).toBeGreaterThan(0);
      expect(milestone.progress).toBe(0);
    });
  });

  it('should have expected milestone IDs for discovery phase', () => {
    const discoveryMilestones = ['first-tool-use', 'basic-data-entry', 'real-wage-calculated', 'cognitive-debt-assessed', 'values-identified'];
    
    discoveryMilestones.forEach(milestoneId => {
      const milestone = LIBERATION_MILESTONES.find(m => m.id === milestoneId);
      expect(milestone).toBeTruthy();
    });
  });

  it('should have unique milestone IDs', () => {
    const ids = LIBERATION_MILESTONES.map(m => m.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });
});