/**
 * Values-to-Vocation Matching Engine - Liberation path discovery algorithm
 * Intelligent matching between authentic values and meaningful work opportunities
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { 
  ValueProfile, 
  VocationOption, 
  VocationMatch, 
  VocationMatchingResult, 
  CoreValue,
  WorkArrangement
} from '@thegreenfieldoverride/types';

import { VOCATION_DATABASE } from './vocation-database';
import { generateValueInsights } from './values-assessment';

/**
 * Primary matching algorithm - calculates compatibility between user values and vocation options
 */
export function matchVocationsToValues(valueProfile: ValueProfile, preferences?: {
  preferredArrangements?: WorkArrangement[];
  avoidCategories?: string[];
  prioritizeIncome?: boolean;
  riskTolerance?: 'low' | 'medium' | 'high';
}): VocationMatchingResult {
  
  const allMatches = VOCATION_DATABASE.map(vocation => 
    calculateVocationMatch(vocation, valueProfile, preferences)
  );

  // Sort by alignment score and filter for quality matches
  const topMatches = allMatches
    .filter(match => match.alignmentScore >= 40) // Only include reasonable matches
    .sort((a, b) => b.alignmentScore - a.alignmentScore)
    .slice(0, 10); // Top 10 matches

  // Generate insights based on the matching results
  const insights = generateMatchingInsights(valueProfile, topMatches);
  
  // Create exploration suggestions
  const explorationSuggestions = generateExplorationSuggestions(valueProfile, topMatches);

  return {
    userProfile: valueProfile,
    topMatches,
    insights,
    explorationSuggestions
  };
}

/**
 * Calculate detailed match between a specific vocation and user's value profile
 */
function calculateVocationMatch(
  vocation: VocationOption, 
  valueProfile: ValueProfile,
  preferences?: any
): VocationMatch {
  
  const { dominantValues, coreValues } = valueProfile;
  
  // Calculate value alignment scores
  const valueMatches = calculateValueMatches(vocation, coreValues);
  const conflictAreas = calculateValueConflicts(vocation, coreValues);
  
  // Calculate overall alignment score (0-100)
  const alignmentScore = calculateOverallAlignment(vocation, valueProfile, valueMatches, conflictAreas, preferences);
  
  // Analyze work arrangement compatibility
  const recommendedArrangements = analyzeWorkArrangements(vocation, valueProfile, preferences);
  
  // Generate transition strategy
  const transitionStrategy = generateTransitionStrategy(vocation, valueProfile, alignmentScore);

  return {
    vocation,
    alignmentScore,
    valueMatches,
    conflictAreas,
    recommendedArrangements,
    transitionStrategy
  };
}

/**
 * Calculate how well each of the user's values aligns with the vocation
 */
function calculateValueMatches(vocation: VocationOption, coreValues: any[]): Array<{
  value: CoreValue;
  importance: number;
  vocationSupport: number;
  alignment: number;
}> {
  return coreValues.map(userValue => {
    const importance = userValue.percentage;
    
    // Calculate how well this vocation supports this value
    let vocationSupport = 0;
    
    if (vocation.primaryValues.includes(userValue.value)) {
      vocationSupport = 90; // Strong support for primary values
    } else if (vocation.secondaryValues.includes(userValue.value)) {
      vocationSupport = 60; // Moderate support for secondary values  
    } else if (vocation.conflictingValues.includes(userValue.value)) {
      vocationSupport = 10; // Poor support for conflicting values
    } else {
      vocationSupport = 40; // Neutral/unknown support
    }
    
    // Alignment is weighted combination of importance and support
    const alignment = (importance * 0.6) + (vocationSupport * 0.4);
    
    return {
      value: userValue.value,
      importance,
      vocationSupport,
      alignment
    };
  });
}

/**
 * Identify areas where the vocation conflicts with user values
 */
function calculateValueConflicts(vocation: VocationOption, coreValues: any[]): Array<{
  value: CoreValue;
  conflictSeverity: number;
  description: string;
}> {
  const conflicts: Array<{
    value: CoreValue;
    conflictSeverity: number;
    description: string;
  }> = [];

  coreValues.forEach(userValue => {
    if (vocation.conflictingValues.includes(userValue.value) && userValue.percentage >= 60) {
      const conflictSeverity = userValue.percentage; // Higher user importance = higher conflict
      const description = generateConflictDescription(userValue.value, vocation.title);
      
      conflicts.push({
        value: userValue.value,
        conflictSeverity,
        description
      });
    }
  });

  return conflicts.sort((a, b) => b.conflictSeverity - a.conflictSeverity);
}

/**
 * Generate human-readable description of value conflicts
 */
function generateConflictDescription(value: CoreValue, vocationTitle: string): string {
  const conflictDescriptions: Record<CoreValue, string> = {
    autonomy: `${vocationTitle} may involve client dependencies or market constraints that limit complete autonomy`,
    creativity: `${vocationTitle} might have limited opportunities for creative expression`,
    impact: `${vocationTitle} may not provide the level of social impact you're seeking`,
    growth: `${vocationTitle} could have limited learning and development opportunities`,
    security: `${vocationTitle} involves financial uncertainty and irregular income`,
    balance: `${vocationTitle} may require long hours or high stress periods`,
    connection: `${vocationTitle} might involve significant solo work with limited collaboration`,
    recognition: `${vocationTitle} may not provide the professional recognition you value`,
    challenge: `${vocationTitle} might not offer sufficient intellectual stimulation`,
    service: `${vocationTitle} may have limited direct service to others`,
    authenticity: `${vocationTitle} might require compromising on personal values`,
    mastery: `${vocationTitle} may have limited opportunities for deep skill development`,
    variety: `${vocationTitle} could involve repetitive or routine work`,
    leadership: `${vocationTitle} might not provide leadership opportunities`,
    adventure: `${vocationTitle} may offer limited excitement or risk`,
    spirituality: `${vocationTitle} might not connect to higher purpose or meaning`,
    justice: `${vocationTitle} may not contribute to social justice or fairness`,
    beauty: `${vocationTitle} might have limited aesthetic or artistic elements`,
    knowledge: `${vocationTitle} may not involve significant intellectual pursuit`,
    family: `${vocationTitle} could conflict with family time and priorities`
  };

  return conflictDescriptions[value] || `${vocationTitle} may not fully support your ${value} values`;
}

/**
 * Calculate overall alignment score based on multiple factors
 */
function calculateOverallAlignment(
  vocation: VocationOption,
  valueProfile: ValueProfile,
  valueMatches: any[],
  conflictAreas: any[],
  preferences?: any
): number {
  let score = 0;
  
  // Weight top 5 values most heavily (60% of score)
  const topValueMatches = valueMatches
    .filter(match => valueProfile.dominantValues.includes(match.value))
    .slice(0, 5);
  
  const topValuesScore = topValueMatches.reduce((sum, match) => sum + match.alignment, 0) / 5;
  score += topValuesScore * 0.6;
  
  // Secondary values contribute 25% of score
  const secondaryMatches = valueMatches.filter(match => 
    !valueProfile.dominantValues.includes(match.value)
  );
  const secondaryScore = secondaryMatches.length > 0 
    ? secondaryMatches.reduce((sum, match) => sum + match.alignment, 0) / secondaryMatches.length
    : 50;
  score += secondaryScore * 0.25;
  
  // Liberation potential contributes 10% of score
  const liberationScore = (
    vocation.liberationPotential.autonomyLevel +
    vocation.liberationPotential.flexibilityLevel +
    vocation.liberationPotential.growthCeiling
  ) / 3 * 10;
  score += liberationScore * 0.1;
  
  // Reality check contributes 5% of score
  const realityScore = (10 - vocation.realityCheck.difficultyLevel) * 10;
  score += realityScore * 0.05;
  
  // Penalty for major conflicts
  const conflictPenalty = conflictAreas.reduce((penalty, conflict) => {
    if (conflict.conflictSeverity >= 80) return penalty + 15;
    if (conflict.conflictSeverity >= 60) return penalty + 10;
    return penalty + 5;
  }, 0);
  
  score = Math.max(0, score - conflictPenalty);
  
  // Apply preference modifiers
  if (preferences) {
    if (preferences.preferredArrangements) {
      const hasPreferredArrangement = vocation.arrangements.some(arr => 
        preferences.preferredArrangements.includes(arr)
      );
      if (!hasPreferredArrangement) score *= 0.8;
    }
    
    if (preferences.prioritizeIncome && vocation.realityCheck.averageIncome.includes('$30k')) {
      score *= 0.7; // Penalty for low income when income is prioritized
    }
    
    if (preferences.riskTolerance === 'low' && vocation.realityCheck.difficultyLevel >= 8) {
      score *= 0.6; // Penalty for high difficulty when risk tolerance is low
    }
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Analyze work arrangement compatibility
 */
function analyzeWorkArrangements(
  vocation: VocationOption,
  valueProfile: ValueProfile,
  preferences?: any
): Array<{
  arrangement: WorkArrangement;
  suitabilityScore: number;
  reasoning: string;
}> {
  return vocation.arrangements.map(arrangement => {
    let suitabilityScore = 70; // Base score
    let reasoning = '';
    
    // Adjust based on values
    if (valueProfile.dominantValues.includes('autonomy')) {
      if (['freelancer', 'entrepreneur', 'solopreneur'].includes(arrangement)) {
        suitabilityScore += 20;
        reasoning += 'High autonomy match. ';
      }
    }
    
    if (valueProfile.dominantValues.includes('balance')) {
      if (['part_time_multi', 'remote_employee', 'seasonal_work'].includes(arrangement)) {
        suitabilityScore += 15;
        reasoning += 'Supports work-life balance. ';
      }
    }
    
    if (valueProfile.dominantValues.includes('security')) {
      if (['traditional_employee', 'hybrid_employee'].includes(arrangement)) {
        suitabilityScore += 10;
        reasoning += 'Provides more security. ';
      } else if (['entrepreneur', 'freelancer'].includes(arrangement)) {
        suitabilityScore -= 15;
        reasoning += 'Lower security than desired. ';
      }
    }
    
    if (valueProfile.dominantValues.includes('variety')) {
      if (['portfolio_career', 'digital_nomad', 'project_based'].includes(arrangement)) {
        suitabilityScore += 15;
        reasoning += 'Offers variety and change. ';
      }
    }
    
    // Apply preferences
    if (preferences?.preferredArrangements?.includes(arrangement)) {
      suitabilityScore += 10;
      reasoning += 'Matches stated preference. ';
    }
    
    if (!reasoning) {
      reasoning = 'Standard compatibility for this arrangement.';
    }
    
    return {
      arrangement,
      suitabilityScore: Math.min(100, Math.max(0, suitabilityScore)),
      reasoning: reasoning.trim()
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

/**
 * Generate transition strategy based on vocation and user profile
 */
function generateTransitionStrategy(
  vocation: VocationOption,
  valueProfile: ValueProfile,
  alignmentScore: number
): {
  difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
  timeframe: string;
  keySteps: string[];
  skillGaps: string[];
  riskLevel: 'low' | 'medium' | 'high';
} {
  
  // Determine difficulty based on vocation complexity and alignment
  let difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
  if (vocation.realityCheck.difficultyLevel <= 4 && alignmentScore >= 70) {
    difficulty = 'easy';
  } else if (vocation.realityCheck.difficultyLevel <= 6 && alignmentScore >= 60) {
    difficulty = 'moderate';
  } else if (vocation.realityCheck.difficultyLevel <= 8) {
    difficulty = 'challenging';
  } else {
    difficulty = 'difficult';
  }
  
  // Use vocation's timeToViability as base timeframe
  const timeframe = vocation.realityCheck.timeToViability;
  
  // Extract key steps from best-matching pathway
  const bestPathway = vocation.pathways[0]; // First pathway as default
  const keySteps = bestPathway ? [...bestPathway.steps] : [];
  
  // Add transition-specific steps
  if (valueProfile.dominantValues.includes('security')) {
    keySteps.unshift('Build 6-12 month emergency fund before transition');
  }
  
  if (valueProfile.authenticityScore < 50) {
    keySteps.unshift('Clarify values and ensure strong alignment before committing');
  }
  
  // Identify skill gaps (simplified - would be more sophisticated in full implementation)
  const skillGaps = vocation.skillsRequired.filter((skill, index) => index < 3); // First 3 as examples
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high';
  if (vocation.liberationPotential.incomeStability >= 7) {
    riskLevel = 'low';
  } else if (vocation.liberationPotential.incomeStability >= 5) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }
  
  return {
    difficulty,
    timeframe,
    keySteps,
    skillGaps,
    riskLevel
  };
}

/**
 * Generate insights about the matching results
 */
function generateMatchingInsights(
  valueProfile: ValueProfile,
  topMatches: VocationMatch[]
): {
  valueAlignment: string;
  careerThemes: string[];
  strengthAreas: string[];
  cautionAreas: string[];
  recommendations: string[];
} {
  const { dominantValues } = valueProfile;
  const basicInsights = generateValueInsights(valueProfile);
  
  // Analyze patterns in top matches
  const topCategories = topMatches.slice(0, 5).map(m => m.vocation.category);
  const categoryCount: Record<string, number> = {};
  topCategories.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  
  const dominantCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  // Generate value alignment summary
  const avgAlignment = topMatches.length > 0 
    ? topMatches.reduce((sum, match) => sum + match.alignmentScore, 0) / topMatches.length
    : 0;
  
  let valueAlignment = '';
  if (avgAlignment >= 75) {
    valueAlignment = 'Excellent values alignment with multiple career paths. Your authentic self has strong market opportunities.';
  } else if (avgAlignment >= 60) {
    valueAlignment = 'Good values alignment with several options. Some compromise may be needed but authentic paths exist.';
  } else if (avgAlignment >= 45) {
    valueAlignment = 'Moderate alignment found. Consider values clarification or skill development to improve options.';
  } else {
    valueAlignment = 'Limited alignment with current options. Deep values work or significant skill development may be needed.';
  }
  
  // Generate career themes based on dominant category and values
  const careerThemes = [...basicInsights.careerThemes];
  if (dominantCategory) {
    careerThemes.push(`Strong fit for ${dominantCategory.replace('_', ' ')} sector`);
  }
  
  // Analyze strengths and cautions from matches
  const strengthAreas = [...basicInsights.topStrengths];
  const cautionAreas = [...basicInsights.potentialChallenges];
  
  if (topMatches.some(m => m.vocation.liberationPotential.autonomyLevel >= 8)) {
    strengthAreas.push('High autonomy potential in top matches');
  }
  
  if (topMatches.some(m => m.vocation.realityCheck.difficultyLevel >= 8)) {
    cautionAreas.push('Some top matches require significant skill development');
  }
  
  // Generate specific recommendations
  const recommendations = [...basicInsights.recommendations];
  
  if (topMatches.length > 0) {
    const topMatch = topMatches[0];
    recommendations.push(`Consider exploring: ${topMatch.vocation.title} (${topMatch.alignmentScore}% match)`);
    
    if (topMatch.transitionStrategy.difficulty === 'easy') {
      recommendations.push('You have accessible transition options - consider taking action soon');
    } else {
      recommendations.push('Top matches require preparation - start building relevant skills now');
    }
  }
  
  return {
    valueAlignment,
    careerThemes,
    strengthAreas,
    cautionAreas,
    recommendations
  };
}

/**
 * Generate specific exploration suggestions
 */
function generateExplorationSuggestions(
  valueProfile: ValueProfile,
  topMatches: VocationMatch[]
): Array<{
  action: string;
  purpose: string;
  timeframe: string;
}> {
  const suggestions: Array<{
    action: string;
    purpose: string;
    timeframe: string;
  }> = [];
  
  if (topMatches.length > 0) {
    const topMatch = topMatches[0];
    
    suggestions.push({
      action: `Conduct informational interviews with ${topMatch.vocation.title}s`,
      purpose: 'Validate assumptions and understand day-to-day reality',
      timeframe: 'This month'
    });
    
    suggestions.push({
      action: `Start a small experiment in ${topMatch.vocation.category}`,
      purpose: 'Test your interest and aptitude before full commitment',
      timeframe: 'Next 3 months'
    });
    
    if (topMatch.transitionStrategy.skillGaps.length > 0) {
      suggestions.push({
        action: `Begin learning: ${topMatch.transitionStrategy.skillGaps[0]}`,
        purpose: 'Close critical skill gap for your top career match',
        timeframe: 'Next 6 months'
      });
    }
  }
  
  // Values-based suggestions
  if (valueProfile.authenticityScore < 60) {
    suggestions.push({
      action: 'Complete a deeper values clarification exercise',
      purpose: 'Improve self-understanding before making major career decisions',
      timeframe: 'This month'
    });
  }
  
  if (valueProfile.dominantValues.includes('autonomy')) {
    suggestions.push({
      action: 'Join local entrepreneur or freelancer meetups',
      purpose: 'Build network and learn from others on similar paths',
      timeframe: 'Ongoing'
    });
  }
  
  return suggestions;
}