/**
 * Unit Tests for LiberationJourneyWidget Component
 * Tests responsive behavior, milestone display, and user interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LiberationJourneyWidget } from '@/components/liberation-journey/LiberationJourneyWidget';
import { useLiberationJourney } from '@/hooks/useLiberationJourney';

// Mock the hook
jest.mock('@/hooks/useLiberationJourney');

const mockUseLiberationJourney = useLiberationJourney as jest.MockedFunction<typeof useLiberationJourney>;

describe('LiberationJourneyWidget Component', () => {
  const defaultJourneyState = {
    currentPhase: 'discovery' as const,
    overallScore: 15,
    milestones: [
      {
        id: 'first-tool-use',
        title: 'First Step Taken',
        description: 'Used your first liberation tool',
        tool: 'runway-calculator' as const,
        category: 'financial' as const,
        weight: 3,
        completionCriteria: { type: 'data_entered' as const, details: { anyTool: true } },
        progress: 100,
        completedAt: new Date()
      },
      {
        id: 'basic-data-entry',
        title: 'Basic Info Provided',
        description: 'Entered basic financial information',
        tool: 'runway-calculator' as const,
        category: 'financial' as const,
        weight: 4,
        completionCriteria: { type: 'data_entered' as const, details: { expenses: true, savings: true } },
        progress: 50
      }
    ],
    phaseProgress: {
      discovery: { score: 30, completedMilestones: 1, totalMilestones: 4 },
      planning: { score: 0, completedMilestones: 0, totalMilestones: 3 },
      building: { score: 0, completedMilestones: 0, totalMilestones: 3 },
      transitioning: { score: 0, completedMilestones: 0, totalMilestones: 3 },
      liberated: { score: 0, completedMilestones: 0, totalMilestones: 2 }
    },
    toolInsights: {
      'runway-calculator': { trend: 'improving' as const },
      'real-hourly-wage': { efficiency: 'unknown' as const },
      'cognitive-debt-assessment': { riskLevel: 'unknown' as const },
      'values-vocation-matcher': { topMatchesCount: 0, clarity: 'unknown' as const },
      'insight-engine': { decisionsCount: 0 },
      'ai-copilot': { sessionCount: 0 },
      'small-bets-portfolio': { activeBetsCount: 0, momentum: 'unknown' as const }
    },
    achievements: [
      {
        id: 'milestone-first-tool-use',
        title: 'First Step Taken Completed',
        description: 'Used your first liberation tool',
        unlockedAt: new Date(),
        category: 'financial' as const
      }
    ],
    streaks: { dailyProgress: 1, weeklyGoals: 0, monthlyMomentum: 0 },
    lastUpdated: new Date()
  };

  const mockHookReturnValue = {
    journeyState: defaultJourneyState,
    isLoading: false,
    updateMilestone: jest.fn(),
    recordEvent: jest.fn(),
    updateToolInsights: jest.fn(),
    resetJourney: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLiberationJourney.mockReturnValue(mockHookReturnValue);
    
    // Mock window.innerWidth for mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock resize event listeners
    global.addEventListener = jest.fn();
    global.removeEventListener = jest.fn();
  });

  describe('Rendering', () => {
    it('should render compact view by default', () => {
      render(<LiberationJourneyWidget />);
      
      expect(screen.getByText('Discovery Phase')).toBeInTheDocument();
      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.queryByText('Liberation Journey')).not.toBeInTheDocument();
    });

    it('should show current phase with correct emoji', () => {
      render(<LiberationJourneyWidget />);
      
      expect(screen.getByText('🔍')).toBeInTheDocument(); // Discovery phase emoji
    });

    it('should display progress bar with correct percentage', () => {
      render(<LiberationJourneyWidget />);
      
      const progressBar = screen.getByText('15%').previousSibling as HTMLElement;
      expect(progressBar).toHaveStyle(`width: 15%`);
    });

    it('should apply correct progress bar color based on score', () => {
      const testCases = [
        { score: 10, expectedColor: 'bg-indigo-500' },
        { score: 30, expectedColor: 'bg-sky-500' },
        { score: 60, expectedColor: 'bg-emerald-500' },
        { score: 80, expectedColor: 'bg-amber-500' },
        { score: 95, expectedColor: 'bg-violet-500' }
      ];

      testCases.forEach(({ score, expectedColor }) => {
        mockUseLiberationJourney.mockReturnValue({
          ...mockHookReturnValue,
          journeyState: { ...defaultJourneyState, overallScore: score }
        });

        const { container } = render(<LiberationJourneyWidget />);
        const progressElement = container.querySelector(`.${expectedColor}`);
        expect(progressElement).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('should expand to detailed view when clicked', async () => {
      render(<LiberationJourneyWidget />);
      
      const expandButton = screen.getByLabelText('Expand journey widget');
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('Liberation Journey')).toBeInTheDocument();
        expect(screen.getByText('Phase Timeline')).toBeInTheDocument();
      });
    });

    it('should collapse from detailed view when close button clicked', async () => {
      render(<LiberationJourneyWidget />);
      
      // First expand
      const expandButton = screen.getByLabelText('Expand journey widget');
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('Liberation Journey')).toBeInTheDocument();
      });

      // Then collapse
      const collapseButton = screen.getByLabelText('Collapse journey widget');
      fireEvent.click(collapseButton);

      await waitFor(() => {
        expect(screen.queryByText('Liberation Journey')).not.toBeInTheDocument();
      });
    });
  });

  describe('Expanded View Content', () => {
    beforeEach(async () => {
      render(<LiberationJourneyWidget />);
      const expandButton = screen.getByLabelText('Expand journey widget');
      fireEvent.click(expandButton);
      await waitFor(() => {
        expect(screen.getByText('Liberation Journey')).toBeInTheDocument();
      });
    });

    it('should show current phase overview', () => {
      expect(screen.getByText('Discovery Phase')).toBeInTheDocument();
      expect(screen.getByText('Learning about your current situation and exploring possibilities')).toBeInTheDocument();
      expect(screen.getByText('Overall Progress')).toBeInTheDocument();
      expect(screen.getByText('Phase Progress')).toBeInTheDocument();
    });

    it('should display phase timeline with all phases', () => {
      expect(screen.getByText('Phase Timeline')).toBeInTheDocument();
      expect(screen.getByText('Discovery Phase')).toBeInTheDocument();
      expect(screen.getByText('Planning Phase')).toBeInTheDocument();
      expect(screen.getByText('Building Phase')).toBeInTheDocument();
      expect(screen.getByText('Transitioning Phase')).toBeInTheDocument();
      expect(screen.getByText('Liberated')).toBeInTheDocument();
    });

    it('should highlight current phase in timeline', () => {
      const currentPhaseElement = screen.getByText('Discovery Phase').closest('.ring-1');
      expect(currentPhaseElement).toHaveClass('ring-blue-200');
    });

    it('should show phase progress with milestone counts', () => {
      expect(screen.getByText('1 / 4 milestones')).toBeInTheDocument();
    });

    it('should display recent achievements', () => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('First Step Taken Completed')).toBeInTheDocument();
    });

    it('should show "no achievements" message when none exist', () => {
      mockUseLiberationJourney.mockReturnValue({
        ...mockHookReturnValue,
        journeyState: { ...defaultJourneyState, achievements: [] }
      });

      render(<LiberationJourneyWidget />);
      const expandButton = screen.getByLabelText('Expand journey widget');
      fireEvent.click(expandButton);

      expect(screen.getByText('No achievements yet. Start using the tools!')).toBeInTheDocument();
    });
  });

  describe('Mobile Variant', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 600,
        writable: true
      });
    });

    it('should render mobile drawer variant on small screens', () => {
      render(<LiberationJourneyWidget variant="mobile-drawer" />);
      
      expect(screen.getByLabelText('Open liberation journey')).toBeInTheDocument();
    });

    it('should show mobile trigger button with target emoji', () => {
      render(<LiberationJourneyWidget variant="mobile-drawer" />);
      
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('should open mobile drawer when trigger button clicked', async () => {
      render(<LiberationJourneyWidget variant="mobile-drawer" />);
      
      const triggerButton = screen.getByLabelText('Open liberation journey');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('Liberation Journey')).toBeInTheDocument();
      });
    });

    it('should close mobile drawer when overlay clicked', async () => {
      render(<LiberationJourneyWidget variant="mobile-drawer" />);
      
      const triggerButton = screen.getByLabelText('Open liberation journey');
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('Liberation Journey')).toBeInTheDocument();
      });

      // Click overlay (parent div with bg-black bg-opacity-50)
      const overlay = screen.getByText('Liberation Journey').closest('.fixed')?.querySelector('.bg-black');
      if (overlay) {
        fireEvent.click(overlay);
      }

      await waitFor(() => {
        expect(screen.queryByText('Liberation Journey')).not.toBeInTheDocument();
      });
    });
  });

  describe('Inline Variant', () => {
    it('should render as inline widget', () => {
      render(<LiberationJourneyWidget variant="inline" />);
      
      // Should not have fixed positioning classes
      const widget = screen.getByText('Discovery Phase').closest('.w-full');
      expect(widget).toHaveClass('max-w-md');
    });
  });

  describe('Different Journey States', () => {
    it('should render planning phase correctly', () => {
      const planningState = {
        ...defaultJourneyState,
        currentPhase: 'planning' as const,
        overallScore: 35
      };

      mockUseLiberationJourney.mockReturnValue({
        ...mockHookReturnValue,
        journeyState: planningState
      });

      render(<LiberationJourneyWidget />);
      
      expect(screen.getByText('📋')).toBeInTheDocument(); // Planning phase emoji
    });

    it('should render building phase correctly', () => {
      const buildingState = {
        ...defaultJourneyState,
        currentPhase: 'building' as const,
        overallScore: 65
      };

      mockUseLiberationJourney.mockReturnValue({
        ...mockHookReturnValue,
        journeyState: buildingState
      });

      render(<LiberationJourneyWidget />);
      
      expect(screen.getByText('🔨')).toBeInTheDocument(); // Building phase emoji
    });

    it('should render transitioning phase correctly', () => {
      const transitioningState = {
        ...defaultJourneyState,
        currentPhase: 'transitioning' as const,
        overallScore: 85
      };

      mockUseLiberationJourney.mockReturnValue({
        ...mockHookReturnValue,
        journeyState: transitioningState
      });

      render(<LiberationJourneyWidget />);
      
      expect(screen.getByText('🚀')).toBeInTheDocument(); // Transitioning phase emoji
    });

    it('should render liberated phase correctly', () => {
      const liberatedState = {
        ...defaultJourneyState,
        currentPhase: 'liberated' as const,
        overallScore: 95
      };

      mockUseLiberationJourney.mockReturnValue({
        ...mockHookReturnValue,
        journeyState: liberatedState
      });

      render(<LiberationJourneyWidget />);
      
      expect(screen.getByText('🌟')).toBeInTheDocument(); // Liberated phase emoji
    });
  });

  describe('Responsive Behavior', () => {
    it('should detect mobile viewport and adjust accordingly', () => {
      // Mock resize event
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      render(<LiberationJourneyWidget />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<LiberationJourneyWidget />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<LiberationJourneyWidget />);
      
      expect(screen.getByLabelText('Expand journey widget')).toBeInTheDocument();
    });

    it('should update ARIA labels in expanded state', async () => {
      render(<LiberationJourneyWidget />);
      
      const expandButton = screen.getByLabelText('Expand journey widget');
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Collapse journey widget')).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      render(<LiberationJourneyWidget />);
      
      const expandButton = screen.getByLabelText('Expand journey widget');
      
      // Focus and press Enter
      expandButton.focus();
      fireEvent.keyDown(expandButton, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Liberation Journey')).toBeInTheDocument();
      });
    });
  });
});