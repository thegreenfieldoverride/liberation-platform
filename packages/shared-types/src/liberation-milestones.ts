/**
 * Liberation Milestones Configuration
 * Defines the specific milestones for each tool and phase
 */

import { LiberationMilestone, LiberationPhaseDefinition } from './liberation-journey';

export const LIBERATION_PHASES: Record<LiberationPhaseDefinition['id'], LiberationPhaseDefinition> = {
  discovery: {
    id: 'discovery',
    title: 'Discovery Phase',
    description: 'Learning about your current situation and exploring possibilities',
    scoreRange: [0, 25],
    requiredMilestones: ['first-tool-use', 'basic-data-entry', 'real-wage-calculated', 'cognitive-debt-assessed', 'values-identified'],
    recommendedActions: [
      'Calculate your runway',
      'Assess your real hourly wage',
      'Complete cognitive debt assessment',
      'Complete values-vocation assessment'
    ],
    color: '#6366F1', // Indigo
    icon: 'Direction'
  },
  planning: {
    id: 'planning',
    title: 'Planning Phase', 
    description: 'Creating strategy and understanding your path forward',
    scoreRange: [25, 50],
    requiredMilestones: ['financial-clarity', 'first-insight-generated'],
    recommendedActions: [
      'Set financial targets',
      'Create first strategic insight',
      'Plan your transition strategy'
    ],
    color: '#0EA5E9', // Sky
    icon: 'Focus'
  },
  building: {
    id: 'building',
    title: 'Building Phase',
    description: 'Taking action and building your liberation foundation',
    scoreRange: [50, 75],
    requiredMilestones: ['first-decision-made', 'action-initiated', 'consistency-achieved'],
    recommendedActions: [
      'Start your first small bet',
      'Implement strategic decisions',
      'Track progress consistently'
    ],
    color: '#10B981', // Emerald
    icon: 'Growth'
  },
  transitioning: {
    id: 'transitioning',
    title: 'Transitioning Phase',
    description: 'Actively moving toward your liberation goals',
    scoreRange: [75, 90],
    requiredMilestones: ['momentum-achieved', 'multiple-successes', 'advanced-insights'],
    recommendedActions: [
      'Scale successful bets',
      'Reduce dependencies',
      'Build sustainable income streams'
    ],
    color: '#F59E0B', // Amber
    icon: 'Progress'
  },
  liberated: {
    id: 'liberated',
    title: 'Liberated',
    description: 'Achieved sustainable freedom and autonomy',
    scoreRange: [90, 100],
    requiredMilestones: ['sustainable-income', 'autonomy-achieved'],
    recommendedActions: [
      'Optimize your portfolio',
      'Help others on their journey',
      'Pursue meaningful projects'
    ],
    color: '#8B5CF6', // Violet
    icon: 'Freedom'
  }
};

export const LIBERATION_MILESTONES: LiberationMilestone[] = [
  // Discovery Phase Milestones
  {
    id: 'first-tool-use',
    title: 'First Step Taken',
    description: 'Used your first liberation tool',
    tool: 'runway-calculator', // Default, but can be any
    category: 'financial',
    weight: 3,
    completionCriteria: {
      type: 'data_entered',
      details: { anyTool: true }
    },
    progress: 0
  },
  {
    id: 'basic-data-entry',
    title: 'Basic Info Provided',
    description: 'Entered basic financial information',
    tool: 'runway-calculator',
    category: 'financial',
    weight: 4,
    completionCriteria: {
      type: 'data_entered',
      details: { expenses: true, savings: true }
    },
    progress: 0
  },
  {
    id: 'real-wage-calculated',
    title: 'Real Wage Calculated',
    description: 'Discovered your true hourly compensation',
    tool: 'real-hourly-wage',
    category: 'financial',
    weight: 5,
    completionCriteria: {
      type: 'assessment_completed',
      details: { calculatedWage: true }
    },
    progress: 0
  },
  {
    id: 'cognitive-debt-assessed',
    title: 'Cognitive Debt Assessed',
    description: 'Evaluated your mental and emotional costs',
    tool: 'cognitive-debt-assessment',
    category: 'wellbeing',
    weight: 6,
    completionCriteria: {
      type: 'assessment_completed',
      details: { assessmentComplete: true }
    },
    progress: 0
  },

  // Planning Phase Milestones
  {
    id: 'financial-clarity',
    title: 'Financial Clarity Achieved',
    description: 'Clear picture of your financial situation',
    tool: 'runway-calculator',
    category: 'financial',
    weight: 7,
    completionCriteria: {
      type: 'threshold_reached',
      details: { runwayMonths: 3 } // At least 3 months runway
    },
    progress: 0
  },
  {
    id: 'values-identified',
    title: 'Values Identified',
    description: 'Completed values assessment and found matches',
    tool: 'values-vocation-matcher',
    category: 'career',
    weight: 8,
    completionCriteria: {
      type: 'assessment_completed',
      details: { topMatches: 3 } // At least 3 career matches
    },
    progress: 0
  },
  {
    id: 'first-insight-generated',
    title: 'Strategic Insight Generated',
    description: 'Created your first strategic analysis',
    tool: 'insight-engine',
    category: 'insight',
    weight: 6,
    completionCriteria: {
      type: 'assessment_completed',
      details: { blueprintGenerated: true }
    },
    progress: 0
  },

  // Building Phase Milestones
  {
    id: 'first-decision-made',
    title: 'First Strategic Decision',
    description: 'Made your first recorded strategic decision',
    tool: 'insight-engine',
    category: 'insight',
    weight: 8,
    completionCriteria: {
      type: 'decision_made',
      details: { decisionRecorded: true }
    },
    progress: 0
  },
  {
    id: 'action-initiated',
    title: 'Action Initiated',
    description: 'Started your first small bet or action',
    tool: 'small-bets-portfolio',
    category: 'action',
    weight: 9,
    completionCriteria: {
      type: 'data_entered',
      details: { activeBets: 1 }
    },
    progress: 0
  },
  {
    id: 'consistency-achieved',
    title: 'Consistency Achieved',
    description: 'Regular tool usage and progress tracking',
    tool: 'runway-calculator', // Any tool
    category: 'action',
    weight: 5,
    completionCriteria: {
      type: 'threshold_reached',
      details: { weeklyUsage: 2 } // 2+ weeks of regular use
    },
    progress: 0
  },

  // Transitioning Phase Milestones  
  {
    id: 'momentum-achieved',
    title: 'Momentum Achieved',
    description: 'Multiple successful actions and improving metrics',
    tool: 'small-bets-portfolio',
    category: 'action',
    weight: 10,
    completionCriteria: {
      type: 'threshold_reached',
      details: { activeBets: 3, monthlyRevenue: 100 }
    },
    progress: 0
  },
  {
    id: 'multiple-successes',
    title: 'Multiple Successes',
    description: 'Several bets showing positive results',
    tool: 'small-bets-portfolio',
    category: 'action',
    weight: 8,
    completionCriteria: {
      type: 'threshold_reached',
      details: { successfulBets: 2 }
    },
    progress: 0
  },
  {
    id: 'advanced-insights',
    title: 'Advanced Strategic Thinking',
    description: 'Multiple complex decisions with high confidence',
    tool: 'insight-engine',
    category: 'insight',
    weight: 7,
    completionCriteria: {
      type: 'threshold_reached',
      details: { decisionsCount: 3, averageConfidence: 8 }
    },
    progress: 0
  },

  // Liberation Phase Milestones
  {
    id: 'sustainable-income',
    title: 'Sustainable Income Achieved',
    description: 'Portfolio generating significant recurring income',
    tool: 'small-bets-portfolio',
    category: 'action',
    weight: 10,
    completionCriteria: {
      type: 'threshold_reached',
      details: { monthlyIncome: 2000, runway: 12 }
    },
    progress: 0
  },
  {
    id: 'autonomy-achieved',
    title: 'True Autonomy',
    description: 'Full control over time and decisions',
    tool: 'small-bets-portfolio',
    category: 'action',
    weight: 10,
    completionCriteria: {
      type: 'goal_achieved',
      details: { 
        autonomyScore: 9, // High autonomy in work
        financialIndependence: true
      }
    },
    progress: 0
  }
];

// Utility function to get milestones for a specific phase
export function getMilestonesForPhase(phaseId: LiberationPhaseDefinition['id']): LiberationMilestone[] {
  const phase = LIBERATION_PHASES[phaseId];
  return LIBERATION_MILESTONES.filter(milestone => 
    phase.requiredMilestones.includes(milestone.id)
  );
}

// Utility function to calculate phase completion
export function calculatePhaseCompletion(
  phaseId: LiberationPhaseDefinition['id'], 
  milestones: LiberationMilestone[]
): { completed: number; total: number; percentage: number } {
  const phaseMilestones = getMilestonesForPhase(phaseId);
  const completed = phaseMilestones.filter(pm => 
    milestones.find(m => m.id === pm.id && m.progress === 100)
  ).length;
  
  return {
    completed,
    total: phaseMilestones.length,
    percentage: phaseMilestones.length > 0 ? (completed / phaseMilestones.length) * 100 : 0
  };
}