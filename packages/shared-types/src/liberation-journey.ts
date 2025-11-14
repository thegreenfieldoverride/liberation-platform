/**
 * Liberation Journey Progress Types
 * Cross-tool progress tracking and milestone system
 */

export interface LiberationMilestone {
  id: string;
  title: string;
  description: string;
  tool: 'runway-calculator' | 'real-hourly-wage' | 'cognitive-debt-assessment' | 'values-vocation-matcher' | 'insight-engine' | 'ai-copilot' | 'small-bets-portfolio';
  category: 'financial' | 'career' | 'wellbeing' | 'action' | 'insight';
  weight: number; // Contribution to overall liberation score (1-10)
  completionCriteria: {
    type: 'data_entered' | 'assessment_completed' | 'decision_made' | 'goal_achieved' | 'threshold_reached';
    details: any; // Specific criteria based on type
  };
  completedAt?: Date;
  progress: number; // 0-100
}

export interface LiberationPhaseDefinition {
  id: 'discovery' | 'planning' | 'building' | 'transitioning' | 'liberated';
  title: string;
  description: string;
  scoreRange: [number, number]; // [min, max] liberation score
  requiredMilestones: string[]; // Milestone IDs that must be completed
  recommendedActions: string[];
  color: string; // For UI visualization
  icon: string; // Icon name from LiberationIcons
}

export interface LiberationJourneyState {
  currentPhase: LiberationPhaseDefinition['id'];
  overallScore: number; // 0-100
  milestones: LiberationMilestone[];
  
  // Phase-specific progress
  phaseProgress: Record<LiberationPhaseDefinition['id'], {
    score: number;
    completedMilestones: number;
    totalMilestones: number;
    unlockedAt?: Date;
    completedAt?: Date;
  }>;
  
  // Tool-specific insights
  toolInsights: {
    'runway-calculator': {
      runwayMonths?: number;
      trend: 'improving' | 'stable' | 'declining' | 'unknown';
      lastUpdated?: Date;
    };
    'real-hourly-wage': {
      realWage?: number;
      efficiency: 'high' | 'medium' | 'low' | 'unknown';
      lastUpdated?: Date;
    };
    'cognitive-debt-assessment': {
      debtPercentage?: number;
      riskLevel: 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
      lastUpdated?: Date;
    };
    'values-vocation-matcher': {
      alignmentScore?: number;
      topMatchesCount: number;
      clarity: 'high' | 'medium' | 'low' | 'unknown';
      lastUpdated?: Date;
    };
    'insight-engine': {
      decisionsCount: number;
      confidenceAverage?: number;
      recentDecision?: {
        choice: 'A' | 'B' | 'neither' | 'custom';
        confidence: number;
        date: Date;
      };
    };
    'ai-copilot': {
      lastUsed?: Date;
      sessionCount?: number;
      totalInteractions?: number;
    };
    'small-bets-portfolio': {
      activeBetsCount: number;
      successRate?: number;
      monthlyIncome?: number;
      momentum: 'accelerating' | 'steady' | 'slowing' | 'unknown';
    };
  };
  
  // Achievements and streaks
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
    category: LiberationMilestone['category'];
  }>;
  
  streaks: {
    dailyProgress: number; // Days with any tool activity
    weeklyGoals: number; // Weeks with milestone progress
    monthlyMomentum: number; // Months with significant advancement
  };
  
  lastUpdated: Date;
}

export interface LiberationJourneyEvent {
  type: 'milestone_completed' | 'phase_advanced' | 'tool_used' | 'decision_made' | 'achievement_unlocked';
  toolId: LiberationMilestone['tool'];
  milestoneId?: string;
  metadata: any;
  timestamp: Date;
}