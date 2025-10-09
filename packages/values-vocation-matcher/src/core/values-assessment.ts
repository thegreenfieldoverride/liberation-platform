/**
 * Values Assessment Engine - Core liberation values framework
 * Identifies what truly matters to you beyond corporate conditioning
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { 
  CoreValue, 
  ValueAssessmentQuestion, 
  ValueResponse, 
  ValueAssessmentInputs, 
  ValueProfile 
} from '@thegreenfieldoverride/types';

/**
 * Comprehensive values assessment questions designed to surface authentic priorities
 * Questions focus on revealing true preferences, not socially acceptable answers
 */
export const VALUE_ASSESSMENT_QUESTIONS: ValueAssessmentQuestion[] = [
  // Autonomy cluster
  {
    id: 'autonomy_1',
    value: 'autonomy',
    scenario: 'Decision-making freedom in your work',
    description: 'How important is it to have control over how, when, and where you work?',
    weight: 1.2
  },
  {
    id: 'autonomy_2', 
    value: 'autonomy',
    scenario: 'Freedom from micromanagement',
    description: 'How important is it to work without constant oversight or approval-seeking?',
    weight: 1.0
  },
  {
    id: 'autonomy_3',
    value: 'autonomy', 
    scenario: 'Setting your own schedule',
    description: 'How important is it to determine your own work hours and rhythms?',
    weight: 1.1
  },

  // Creativity cluster
  {
    id: 'creativity_1',
    value: 'creativity',
    scenario: 'Expressing original ideas',
    description: 'How important is it to generate and implement new ideas in your work?',
    weight: 1.0
  },
  {
    id: 'creativity_2',
    value: 'creativity',
    scenario: 'Artistic or aesthetic expression',
    description: 'How important is it to create something beautiful or aesthetically pleasing?',
    weight: 1.1
  },
  {
    id: 'creativity_3',
    value: 'creativity',
    scenario: 'Innovation and experimentation',
    description: 'How important is it to try new approaches and break conventional thinking?',
    weight: 1.0
  },

  // Impact cluster  
  {
    id: 'impact_1',
    value: 'impact',
    scenario: 'Making a meaningful difference',
    description: 'How important is it that your work creates positive change in the world?',
    weight: 1.3
  },
  {
    id: 'impact_2',
    value: 'impact',
    scenario: 'Legacy and lasting contribution',
    description: 'How important is it to create something that outlasts your immediate effort?',
    weight: 1.1
  },
  {
    id: 'impact_3',
    value: 'impact',
    scenario: 'Solving important problems',
    description: 'How important is it to work on challenges that really matter to society?',
    weight: 1.2
  },

  // Growth cluster
  {
    id: 'growth_1',
    value: 'growth',
    scenario: 'Continuous learning',
    description: 'How important is it to constantly develop new skills and knowledge?',
    weight: 1.0
  },
  {
    id: 'growth_2',
    value: 'growth', 
    scenario: 'Personal evolution',
    description: 'How important is it that your work challenges you to become a better person?',
    weight: 1.1
  },
  {
    id: 'growth_3',
    value: 'growth',
    scenario: 'Expanding capabilities',
    description: 'How important is it to regularly push beyond your comfort zone?',
    weight: 1.0
  },

  // Security cluster
  {
    id: 'security_1',
    value: 'security',
    scenario: 'Financial predictability',
    description: 'How important is it to have stable, predictable income?',
    weight: 1.2
  },
  {
    id: 'security_2',
    value: 'security',
    scenario: 'Job stability',
    description: 'How important is it to have long-term employment security?',
    weight: 1.0
  },
  {
    id: 'security_3',
    value: 'security',
    scenario: 'Clear expectations',
    description: 'How important is it to know exactly what is expected of you?',
    weight: 0.9
  },

  // Balance cluster
  {
    id: 'balance_1',
    value: 'balance',
    scenario: 'Time for personal life',
    description: 'How important is it to have adequate time for family, friends, and hobbies?',
    weight: 1.3
  },
  {
    id: 'balance_2',
    value: 'balance',
    scenario: 'Avoiding overwork',
    description: 'How important is it to maintain reasonable working hours?',
    weight: 1.1
  },
  {
    id: 'balance_3',
    value: 'balance',
    scenario: 'Energy preservation', 
    description: 'How important is it to avoid work that drains you completely?',
    weight: 1.2
  },

  // Connection cluster
  {
    id: 'connection_1',
    value: 'connection',
    scenario: 'Building relationships',
    description: 'How important is it to form meaningful relationships through your work?',
    weight: 1.0
  },
  {
    id: 'connection_2',
    value: 'connection',
    scenario: 'Collaborative work',
    description: 'How important is it to work closely with others toward shared goals?',
    weight: 0.9
  },
  {
    id: 'connection_3',
    value: 'connection',
    scenario: 'Community building',
    description: 'How important is it to help create or strengthen communities?',
    weight: 1.1
  },

  // Recognition cluster
  {
    id: 'recognition_1',
    value: 'recognition',
    scenario: 'Acknowledgment of contributions',
    description: 'How important is it to receive credit and appreciation for your work?',
    weight: 0.9
  },
  {
    id: 'recognition_2',
    value: 'recognition',
    scenario: 'Professional reputation',
    description: 'How important is it to be known and respected in your field?',
    weight: 1.0
  },
  {
    id: 'recognition_3',
    value: 'recognition',
    scenario: 'Status and prestige',
    description: 'How important is it to have a position that others view as successful?',
    weight: 0.8
  },

  // Challenge cluster
  {
    id: 'challenge_1',
    value: 'challenge',
    scenario: 'Complex problem-solving',
    description: 'How important is it to work on difficult, intellectually demanding problems?',
    weight: 1.0
  },
  {
    id: 'challenge_2',
    value: 'challenge',
    scenario: 'Mental stimulation',
    description: 'How important is it to be intellectually engaged and stimulated?',
    weight: 1.1
  },
  {
    id: 'challenge_3',
    value: 'challenge',
    scenario: 'Pushing boundaries',
    description: 'How important is it to tackle things others think are impossible?',
    weight: 0.9
  },

  // Service cluster
  {
    id: 'service_1',
    value: 'service',
    scenario: 'Helping others directly',
    description: 'How important is it to personally help individuals improve their lives?',
    weight: 1.2
  },
  {
    id: 'service_2',
    value: 'service',
    scenario: 'Contributing to society',
    description: 'How important is it that your work serves the broader community?',
    weight: 1.1
  },
  {
    id: 'service_3',
    value: 'service',
    scenario: 'Caring and compassion',
    description: 'How important is it to work in a caring, supportive environment?',
    weight: 1.0
  },

  // Authenticity cluster
  {
    id: 'authenticity_1',
    value: 'authenticity',
    scenario: 'Being true to yourself',
    description: 'How important is it to express your genuine personality at work?',
    weight: 1.4
  },
  {
    id: 'authenticity_2',
    value: 'authenticity',
    scenario: 'Aligning values and actions',
    description: 'How important is it that your work reflects your personal values?',
    weight: 1.3
  },
  {
    id: 'authenticity_3',
    value: 'authenticity',
    scenario: 'Avoiding compromising situations',
    description: 'How important is it to avoid work that conflicts with your principles?',
    weight: 1.2
  },

  // Mastery cluster
  {
    id: 'mastery_1',
    value: 'mastery',
    scenario: 'Developing deep expertise',
    description: 'How important is it to become exceptionally skilled at something?',
    weight: 1.0
  },
  {
    id: 'mastery_2',
    value: 'mastery',
    scenario: 'Craftsmanship and quality',
    description: 'How important is it to create high-quality, excellent work?',
    weight: 1.1
  },
  {
    id: 'mastery_3',
    value: 'mastery',
    scenario: 'Technical excellence',
    description: 'How important is it to be known for your technical or professional skills?',
    weight: 0.9
  },

  // Additional values with fewer questions for efficiency
  {
    id: 'variety_1',
    value: 'variety',
    scenario: 'Diverse experiences',
    description: 'How important is it to have varied, non-repetitive work?',
    weight: 1.0
  },
  {
    id: 'variety_2',
    value: 'variety',
    scenario: 'Avoiding routine',
    description: 'How important is it to avoid predictable, routine tasks?',
    weight: 0.9
  },

  {
    id: 'leadership_1',
    value: 'leadership',
    scenario: 'Guiding and influencing others',
    description: 'How important is it to lead teams or influence decision-making?',
    weight: 1.0
  },
  {
    id: 'leadership_2',
    value: 'leadership',
    scenario: 'Driving change',
    description: 'How important is it to be responsible for creating organizational change?',
    weight: 1.1
  },

  {
    id: 'adventure_1',
    value: 'adventure',
    scenario: 'Excitement and novelty',
    description: 'How important is it to have exciting, unpredictable work experiences?',
    weight: 1.0
  },
  {
    id: 'adventure_2',
    value: 'adventure',
    scenario: 'Risk and uncertainty',
    description: 'How important is it to work in environments with some risk or uncertainty?',
    weight: 0.8
  },

  {
    id: 'spirituality_1',
    value: 'spirituality',
    scenario: 'Higher purpose',
    description: 'How important is it that your work connects to something greater than material success?',
    weight: 1.2
  },
  {
    id: 'spirituality_2',
    value: 'spirituality',
    scenario: 'Meaning and transcendence',
    description: 'How important is it that your work contributes to spiritual or philosophical growth?',
    weight: 1.1
  },

  {
    id: 'justice_1',
    value: 'justice',
    scenario: 'Fighting unfairness',
    description: 'How important is it to work against injustice and inequality?',
    weight: 1.2
  },
  {
    id: 'justice_2',
    value: 'justice',
    scenario: 'Advocating for others',
    description: 'How important is it to stand up for those who cannot advocate for themselves?',
    weight: 1.1
  },

  {
    id: 'beauty_1',
    value: 'beauty',
    scenario: 'Creating beautiful things',
    description: 'How important is it to create or work with aesthetically pleasing things?',
    weight: 1.0
  },

  {
    id: 'knowledge_1',
    value: 'knowledge',
    scenario: 'Understanding and discovery',
    description: 'How important is it to expand human knowledge or understanding?',
    weight: 1.0
  },

  {
    id: 'family_1',
    value: 'family',
    scenario: 'Prioritizing family time',
    description: 'How important is it that your work allows quality time with family?',
    weight: 1.3
  },
  {
    id: 'family_2',
    value: 'family',
    scenario: 'Supporting family needs',
    description: 'How important is it that your work supports your family\'s wellbeing?',
    weight: 1.2
  }
];

/**
 * Calculate comprehensive value profile from assessment responses
 */
export function calculateValueProfile(inputs: ValueAssessmentInputs): ValueProfile {
  const { responses } = inputs;
  
  // Initialize value scores
  const valueScores: Record<CoreValue, number> = {
    autonomy: 0, creativity: 0, impact: 0, growth: 0, security: 0,
    balance: 0, connection: 0, recognition: 0, challenge: 0, service: 0,
    authenticity: 0, mastery: 0, variety: 0, leadership: 0, adventure: 0,
    spirituality: 0, justice: 0, beauty: 0, knowledge: 0, family: 0
  };

  const valueMaxScores: Record<CoreValue, number> = {
    autonomy: 0, creativity: 0, impact: 0, growth: 0, security: 0,
    balance: 0, connection: 0, recognition: 0, challenge: 0, service: 0,
    authenticity: 0, mastery: 0, variety: 0, leadership: 0, adventure: 0,
    spirituality: 0, justice: 0, beauty: 0, knowledge: 0, family: 0
  };

  // Calculate weighted scores for each value
  responses.forEach((response: ValueResponse) => {
    const question = VALUE_ASSESSMENT_QUESTIONS.find(q => q.id === response.questionId);
    if (question) {
      const weightedScore = response.importance * question.weight;
      const maxWeightedScore = 5 * question.weight; // Max importance (5) * weight
      
      valueScores[question.value] += weightedScore;
      valueMaxScores[question.value] += maxWeightedScore;
    }
  });

  // Convert to percentages and create ranked list
  const coreValues = (Object.keys(valueScores) as CoreValue[])
    .map(value => ({
      value,
      score: valueScores[value],
      percentage: valueMaxScores[value] > 0 ? (valueScores[value] / valueMaxScores[value]) * 100 : 0,
      rank: 0 // Will be set after sorting
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  // Get top 5 dominant values
  const dominantValues = coreValues.slice(0, 5).map(cv => cv.value);

  // Identify conflicting values (values that commonly create tension)
  const conflictingValues = identifyValueConflicts(dominantValues, coreValues);

  // Calculate authenticity score (placeholder - would integrate with current role assessment)
  const authenticityScore = calculateAuthenticityScore(inputs, coreValues);

  return {
    coreValues,
    valueDistribution: valueScores,
    dominantValues,
    conflictingValues,
    authenticityScore
  };
}

/**
 * Identify potential conflicts between highly-valued but competing values
 */
function identifyValueConflicts(dominantValues: CoreValue[], allValues: Array<{value: CoreValue; percentage: number}>): Array<{
  value1: CoreValue;
  value2: CoreValue;
  tensionLevel: number;
}> {
  const conflicts: Array<{ value1: CoreValue; value2: CoreValue; tensionLevel: number }> = [];

  // Define common value conflicts with tension levels (1-10)
  const valueConflicts: Record<string, number> = {
    'security_adventure': 8,
    'security_autonomy': 6,
    'balance_challenge': 7,
    'balance_leadership': 6,
    'balance_growth': 5,
    'security_creativity': 5,
    'recognition_authenticity': 6,
    'family_challenge': 7,
    'family_leadership': 8,
    'family_adventure': 9,
    'stability_variety': 8,
    'mastery_variety': 6,
    'service_recognition': 4,
    'spirituality_recognition': 7
  };

  // Check for conflicts between dominant values
  for (let i = 0; i < dominantValues.length; i++) {
    for (let j = i + 1; j < dominantValues.length; j++) {
      const value1 = dominantValues[i];
      const value2 = dominantValues[j];
      
      const conflictKey1 = `${value1}_${value2}`;
      const conflictKey2 = `${value2}_${value1}`;
      
      const tensionLevel = valueConflicts[conflictKey1] || valueConflicts[conflictKey2];
      
      if (tensionLevel && tensionLevel >= 5) {
        // Only include significant conflicts, and only if both values are highly ranked
        const value1Score = allValues.find((v: any) => v.value === value1)?.percentage || 0;
        const value2Score = allValues.find((v: any) => v.value === value2)?.percentage || 0;
        
        if (value1Score >= 60 && value2Score >= 60) {
          conflicts.push({ value1, value2, tensionLevel });
        }
      }
    }
  }

  return conflicts.sort((a, b) => b.tensionLevel - a.tensionLevel);
}

/**
 * Calculate how well current work situation aligns with values
 * (Placeholder for future integration with role assessment)
 */
function calculateAuthenticityScore(inputs: ValueAssessmentInputs, coreValues: any[]): number {
  // This would integrate with current role assessment in a full implementation
  // For now, return a baseline score
  
  if (inputs.currentRole && inputs.industry) {
    // Could analyze role/industry alignment with top values
    return 65; // Placeholder average
  }
  
  return 50; // Unknown/neutral baseline
}

/**
 * Get default assessment questions for UI rendering
 */
export function getAssessmentQuestions(): ValueAssessmentQuestion[] {
  return VALUE_ASSESSMENT_QUESTIONS;
}

/**
 * Create a formatted summary of the user's value profile
 */
export function generateValueInsights(profile: ValueProfile): {
  topStrengths: string[];
  potentialChallenges: string[];
  careerThemes: string[];
  recommendations: string[];
} {
  const { dominantValues, conflictingValues, authenticityScore } = profile;
  
  const topStrengths: string[] = [];
  const potentialChallenges: string[] = [];
  const careerThemes: string[] = [];
  const recommendations: string[] = [];

  // Generate insights based on top values
  if (dominantValues.includes('autonomy')) {
    topStrengths.push('Strong drive for independence and self-direction');
    careerThemes.push('Remote work, freelancing, or entrepreneurship');
    if (dominantValues.includes('security')) {
      potentialChallenges.push('Tension between freedom and financial security');
    }
  }

  if (dominantValues.includes('impact')) {
    topStrengths.push('Mission-driven approach to work and life');
    careerThemes.push('Social impact, non-profit, or purpose-driven companies');
  }

  if (dominantValues.includes('creativity')) {
    topStrengths.push('Innovative thinking and creative problem-solving');
    careerThemes.push('Creative industries, design, or innovation roles');
  }

  if (dominantValues.includes('balance')) {
    topStrengths.push('Sustainable approach to work and life integration');
    if (dominantValues.includes('challenge') || dominantValues.includes('leadership')) {
      potentialChallenges.push('Balancing ambition with work-life boundaries');
    }
  }

  if (dominantValues.includes('authenticity')) {
    topStrengths.push('Strong sense of personal integrity and values alignment');
    if (authenticityScore < 60) {
      recommendations.push('Consider roles that better align with your authentic self');
    }
  }

  // Add conflict-based challenges
  conflictingValues.forEach((conflict: any) => {
    if (conflict.tensionLevel >= 7) {
      potentialChallenges.push(
        `High tension between ${conflict.value1} and ${conflict.value2} may require careful career choices`
      );
    }
  });

  // General recommendations based on profile
  if (authenticityScore < 50) {
    recommendations.push('Significant values misalignment detected - consider major career pivot');
  } else if (authenticityScore < 70) {
    recommendations.push('Moderate alignment - look for ways to incorporate more of your values into current work');
  }

  if (dominantValues.slice(0, 3).every((v: CoreValue) => ['autonomy', 'creativity', 'impact'].includes(v))) {
    recommendations.push('Your profile strongly suggests entrepreneurial or freelance paths');
  }

  if (dominantValues.includes('service') && dominantValues.includes('impact')) {
    recommendations.push('Consider social enterprise or mission-driven organizations');
  }

  return {
    topStrengths,
    potentialChallenges,
    careerThemes,
    recommendations
  };
}