/**
 * Cognitive Debt Assessment - Measures corporate burnout and mental health costs
 * Reveals the psychological toll of extractive employment relationships
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { 
  CognitiveDebtQuestion, 
  CognitiveDebtInputs, 
  CognitiveDebtResult, 
  CognitiveDebtCategory,
  CognitiveDebtResponse 
} from '@greenfield/types';

/**
 * Cognitive Debt Assessment - The "red pill" for mental health costs
 * Measures the hidden psychological toll of corporate burnout
 */

export function createAssessmentQuestions(): CognitiveDebtQuestion[] {
  return [
    // Mental Fog - Reduced cognitive function
    {
      id: 'mf1',
      category: 'mental_fog',
      question: 'I have trouble concentrating or focusing on tasks',
      description: 'Difficulty maintaining attention, easily distracted',
      weight: 1.2
    },
    {
      id: 'mf2', 
      category: 'mental_fog',
      question: 'I feel mentally "cloudy" or like my thinking is slower than usual',
      description: 'Processing information takes more effort, decisions feel harder',
      weight: 1.1
    },
    {
      id: 'mf3',
      category: 'mental_fog',
      question: 'I forget things more often than I used to',
      description: 'Memory lapses, missing appointments, forgetting conversations',
      weight: 1.0
    },
    
    // Emotional Exhaustion - Drained, overwhelmed, cynical
    {
      id: 'ee1',
      category: 'emotional_exhaustion',
      question: 'I feel emotionally drained after work',
      description: 'Depleted energy for personal life, relationships, hobbies',
      weight: 1.3
    },
    {
      id: 'ee2',
      category: 'emotional_exhaustion',
      question: 'I feel cynical or negative about my work and colleagues',
      description: 'Growing resentment, loss of faith in the system',
      weight: 1.2
    },
    {
      id: 'ee3',
      category: 'emotional_exhaustion', 
      question: 'Small frustrations at work feel overwhelming',
      description: 'Minor issues trigger disproportionate emotional responses',
      weight: 1.1
    },
    
    // Creative Shutdown - Loss of inspiration and innovation
    {
      id: 'cs1',
      category: 'creative_shutdown',
      question: 'I rarely have new ideas or creative insights anymore',
      description: 'Mental stagnation, loss of innovative thinking',
      weight: 1.2
    },
    {
      id: 'cs2',
      category: 'creative_shutdown',
      question: 'I avoid taking on challenging or novel projects',
      description: 'Preferring routine, safe tasks over growth opportunities',
      weight: 1.1
    },
    {
      id: 'cs3',
      category: 'creative_shutdown',
      question: 'I have lost interest in learning new skills or pursuing curiosity',
      description: 'Intellectual apathy, no desire for growth or exploration',
      weight: 1.3
    },
    
    // Relationship Decay - Damaged personal connections
    {
      id: 'rd1',
      category: 'relationship_decay',
      question: 'I am too tired or stressed to invest in my relationships',
      description: 'Neglecting family, friends, romantic partnerships',
      weight: 1.4
    },
    {
      id: 'rd2',
      category: 'relationship_decay',
      question: 'I avoid social situations or feel disconnected when I attend them',
      description: 'Social isolation, feeling like an outsider',
      weight: 1.2
    },
    {
      id: 'rd3',
      category: 'relationship_decay',
      question: 'My work stress negatively affects my mood at home',
      description: 'Bringing workplace toxicity into personal life',
      weight: 1.3
    },
    
    // Physical Symptoms - Stress-induced health issues
    {
      id: 'ps1',
      category: 'physical_symptoms',
      question: 'I experience physical symptoms like headaches, tension, or stomach issues',
      description: 'Body manifestations of chronic stress',
      weight: 1.1
    },
    {
      id: 'ps2',
      category: 'physical_symptoms', 
      question: 'My sleep quality has deteriorated',
      description: 'Trouble falling asleep, staying asleep, or feeling rested',
      weight: 1.2
    },
    {
      id: 'ps3',
      category: 'physical_symptoms',
      question: 'I rely on substances (caffeine, alcohol, etc.) to cope with work stress',
      description: 'Using external aids to manage overwhelming feelings',
      weight: 1.3
    },
    
    // Identity Erosion - Loss of sense of self
    {
      id: 'ie1',
      category: 'identity_erosion',
      question: 'I have lost touch with my personal values and what matters to me',
      description: 'Values drift, feeling disconnected from core beliefs',
      weight: 1.4
    },
    {
      id: 'ie2',
      category: 'identity_erosion',
      question: 'I feel like I am just going through the motions',
      description: 'Existential emptiness, lack of purpose or meaning',
      weight: 1.3
    },
    {
      id: 'ie3',
      category: 'identity_erosion',
      question: 'I no longer recognize the person I have become',
      description: 'Fundamental shift away from authentic self',
      weight: 1.5
    }
  ];
}

export function calculateCognitiveDebt(inputs: CognitiveDebtInputs): CognitiveDebtResult {
  const questions = createAssessmentQuestions();
  const { responses } = inputs;
  
  // Create response lookup
  const responseMap = new Map(responses.map(r => [r.questionId, r.score]));
  
  // Calculate scores by category
  const categoryScores: Record<CognitiveDebtCategory, { score: number; maxScore: number; percentage: number }> = {
    mental_fog: { score: 0, maxScore: 0, percentage: 0 },
    emotional_exhaustion: { score: 0, maxScore: 0, percentage: 0 },
    creative_shutdown: { score: 0, maxScore: 0, percentage: 0 },
    relationship_decay: { score: 0, maxScore: 0, percentage: 0 },
    physical_symptoms: { score: 0, maxScore: 0, percentage: 0 },
    identity_erosion: { score: 0, maxScore: 0, percentage: 0 }
  };
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // Calculate weighted scores
  questions.forEach(question => {
    const response = responseMap.get(question.id) || 0;
    const weightedScore = response * question.weight;
    const maxWeightedScore = 4 * question.weight; // Max response is 4
    
    totalScore += weightedScore;
    maxPossibleScore += maxWeightedScore;
    
    categoryScores[question.category].score += weightedScore;
    categoryScores[question.category].maxScore += maxWeightedScore;
  });
  
  // Calculate percentages
  const percentageScore = (totalScore / maxPossibleScore) * 100;
  
  Object.keys(categoryScores).forEach(category => {
    const cat = category as CognitiveDebtCategory;
    if (categoryScores[cat].maxScore > 0) {
      categoryScores[cat].percentage = (categoryScores[cat].score / categoryScores[cat].maxScore) * 100;
    }
  });
  
  // Determine risk level
  const riskLevel = determineRiskLevel(percentageScore);
  
  // Identify primary concerns (categories scoring > 60%)
  const primaryConcerns = Object.entries(categoryScores)
    .filter(([_, data]) => data.percentage > 60)
    .map(([category, _]) => category as CognitiveDebtCategory)
    .sort((a, b) => categoryScores[b].percentage - categoryScores[a].percentage);
  
  // Generate recommendations
  const recommendations = generateRecommendations(categoryScores, riskLevel);
  
  // Generate personalized message
  const message = generatePersonalizedMessage(percentageScore, riskLevel, primaryConcerns);
  
  return {
    totalScore,
    maxPossibleScore,
    percentageScore,
    categoryScores,
    riskLevel,
    primaryConcerns,
    recommendations,
    message
  };
}

function determineRiskLevel(percentageScore: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (percentageScore >= 75) return 'critical';
  if (percentageScore >= 50) return 'high';
  if (percentageScore >= 25) return 'moderate';
  return 'low';
}

function generateRecommendations(
  categoryScores: Record<CognitiveDebtCategory, { score: number; maxScore: number; percentage: number }>,
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
): string[] {
  const recommendations: string[] = [];
  
  if (riskLevel === 'critical') {
    recommendations.push("Consider speaking with a mental health professional immediately");
    recommendations.push("Take time off work if possible to reset and recover");
  }
  
  if (riskLevel === 'high' || riskLevel === 'critical') {
    recommendations.push("Begin planning your exit strategy with the Runway Calculator");
    recommendations.push("Set firm boundaries between work and personal time");
  }
  
  // Category-specific recommendations
  Object.entries(categoryScores).forEach(([category, data]) => {
    if (data.percentage > 50) {
      switch (category as CognitiveDebtCategory) {
        case 'mental_fog':
          recommendations.push("Practice mindfulness meditation to improve focus");
          recommendations.push("Reduce multitasking and implement single-tasking periods");
          break;
        case 'emotional_exhaustion':
          recommendations.push("Build a daily decompression routine after work");
          recommendations.push("Connect with others who understand your situation");
          break;
        case 'creative_shutdown':
          recommendations.push("Engage in creative activities outside of work");
          recommendations.push("Challenge yourself with new learning opportunities");
          break;
        case 'relationship_decay':
          recommendations.push("Schedule regular quality time with loved ones");
          recommendations.push("Communicate openly about your work stress");
          break;
        case 'physical_symptoms':
          recommendations.push("Consult with a healthcare provider about stress symptoms");
          recommendations.push("Incorporate regular exercise and stress-reduction techniques");
          break;
        case 'identity_erosion':
          recommendations.push("Reconnect with your core values and life purpose");
          recommendations.push("Consider working with a life coach or therapist");
          break;
      }
    }
  });
  
  if (recommendations.length === 0) {
    recommendations.push("Continue monitoring your cognitive debt levels");
    recommendations.push("Maintain healthy work-life boundaries");
  }
  
  return recommendations;
}

function generatePersonalizedMessage(
  percentageScore: number, 
  riskLevel: 'low' | 'moderate' | 'high' | 'critical', 
  primaryConcerns: CognitiveDebtCategory[]
): string {
  if (riskLevel === 'critical') {
    return "Your cognitive debt levels are in the critical range. This is not sustainable and requires immediate attention. You are paying a severe psychological price for your current work situation.";
  }
  
  if (riskLevel === 'high') {
    const concernText = primaryConcerns.length > 0 
      ? ` Your primary areas of concern are ${formatConcerns(primaryConcerns)}.`
      : "";
    return `Your cognitive debt is substantial and unsustainable.${concernText} It's time to seriously consider your options and plan your path to freedom.`;
  }
  
  if (riskLevel === 'moderate') {
    return "You're experiencing moderate cognitive debt. While manageable in the short term, these levels suggest you should begin planning changes to prevent further deterioration.";
  }
  
  return "Your cognitive debt levels are relatively low. You're managing the mental costs of your work situation well, but continue to monitor and maintain healthy boundaries.";
}

function formatConcerns(concerns: CognitiveDebtCategory[]): string {
  const formatted = concerns.map(concern => concern.replace(/_/g, ' '));
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
}

export function getCategoryDisplayName(category: CognitiveDebtCategory): string {
  const names: Record<CognitiveDebtCategory, string> = {
    mental_fog: 'Mental Fog',
    emotional_exhaustion: 'Emotional Exhaustion', 
    creative_shutdown: 'Creative Shutdown',
    relationship_decay: 'Relationship Decay',
    physical_symptoms: 'Physical Symptoms',
    identity_erosion: 'Identity Erosion'
  };
  return names[category];
}

export function getCategoryDescription(category: CognitiveDebtCategory): string {
  const descriptions: Record<CognitiveDebtCategory, string> = {
    mental_fog: 'Reduced cognitive function, difficulty concentrating and thinking clearly',
    emotional_exhaustion: 'Feeling drained, overwhelmed, and increasingly cynical',
    creative_shutdown: 'Loss of inspiration, innovation, and original thinking',
    relationship_decay: 'Damaged personal relationships and increasing isolation',
    physical_symptoms: 'Stress-induced health issues and reliance on coping substances',
    identity_erosion: 'Loss of sense of self, purpose, and core values'
  };
  return descriptions[category];
}