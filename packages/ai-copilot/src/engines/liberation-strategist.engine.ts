/**
 * Liberation Strategist - AI engine that combines all liberation tools
 * Provides holistic analysis and strategic guidance across financial, cognitive, and career domains
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { AIResponse } from '../interfaces/ai-engine.interface';

export interface LiberationProfile {
  // Financial data from runway calculator
  runway: {
    months: number;
    scenarios: Array<{
      name: string;
      months: number;
      viability: string;
    }>;
    stressTests: Array<{
      name: string;
      impact: string;
    }>;
  };
  
  // Real wage data
  realWage: {
    hourlyWage: number;
    statedWage: number;
    reduction: number;
    scenarios: Array<{
      name: string;
      hourlyWage: number;
      liberationPotential: string;
    }>;
  };
  
  // Cognitive debt assessment
  cognitiveDebt: {
    overallScore: number;
    riskLevel: string;
    primaryConcerns: string[];
    categoryScores: Record<string, number>;
  };
  
  // User context
  context: {
    industry?: string;
    role?: string;
    experienceYears?: number;
    dependents?: number;
    riskTolerance: 'low' | 'medium' | 'high';
    timeframe: '3months' | '6months' | '1year' | '2years';
  };
}

export interface LiberationStrategy {
  phase: 'preparation' | 'transition' | 'execution' | 'optimization';
  timeframe: string;
  priority: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  actions: Array<{
    category: 'financial' | 'cognitive' | 'career' | 'skills' | 'network';
    action: string;
    timeline: string;
    priority: number;
    rationale: string;
  }>;
  risks: Array<{
    type: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  milestones: Array<{
    description: string;
    timeframe: string;
    metrics: string[];
  }>;
}

export class LiberationStrategistEngine {
  async analyzeLiberation(profile: LiberationProfile): Promise<AIResponse> {
    const strategy = this.generateLiberationStrategy(profile);
    const insights = this.generateHolisticInsights(profile);
    
    const content = this.formatStrategicGuidance(strategy, insights, profile);
    
    return {
      content,
      confidence: 0.85,
      sources: ['liberation-tools-integration', 'strategic-analysis'],
      type: 'plan',
      metadata: {
        strategy,
        profile,
        generatedAt: new Date().toISOString()
      }
    };
  }
  
  private generateLiberationStrategy(profile: LiberationProfile): LiberationStrategy {
    const { runway, realWage, cognitiveDebt, context } = profile;
    
    // Determine current phase based on multiple factors
    const phase = this.determinePhase(runway, cognitiveDebt, context);
    
    // Generate actions based on integrated analysis
    const actions = this.generateActions(profile, phase);
    
    // Assess risks holistically
    const risks = this.assessRisks(profile);
    
    // Define success milestones
    const milestones = this.defineMilestones(profile, phase);
    
    return {
      phase,
      timeframe: context.timeframe,
      priority: this.determinePriority(cognitiveDebt, runway),
      actions,
      risks,
      milestones
    };
  }
  
  private determinePhase(runway: any, cognitiveDebt: any, context: any): 'preparation' | 'transition' | 'execution' | 'optimization' {
    // Critical cognitive debt = immediate action needed
    if (cognitiveDebt.riskLevel === 'critical') {
      return 'execution'; // Need to escape now
    }
    
    // Good runway + manageable stress = can optimize current situation
    if (runway.months >= 12 && cognitiveDebt.riskLevel === 'low') {
      return 'optimization';
    }
    
    // Moderate runway + building stress = prepare for transition
    if (runway.months >= 6 && cognitiveDebt.riskLevel !== 'critical') {
      return 'preparation';
    }
    
    // Low runway but need to change = transition carefully
    return 'transition';
  }
  
  private generateActions(profile: LiberationProfile, phase: string): Array<any> {
    const actions: Array<any> = [];
    const { runway, realWage, cognitiveDebt, context } = profile;
    
    // Financial actions based on runway analysis
    if (runway.months < 6) {
      actions.push({
        category: 'financial',
        action: 'Build emergency fund to 6+ months expenses',
        timeline: 'immediate',
        priority: 10,
        rationale: 'Insufficient runway for safe career transition'
      });
    }
    
    if (runway.months >= 6 && phase === 'preparation') {
      actions.push({
        category: 'financial',
        action: 'Optimize expenses using lean transition scenario',
        timeline: '1-2 months',
        priority: 8,
        rationale: 'Extend runway and practice sustainable lifestyle'
      });
    }
    
    // Cognitive health actions
    if (cognitiveDebt.riskLevel === 'critical' || cognitiveDebt.riskLevel === 'high') {
      actions.push({
        category: 'cognitive',
        action: 'Implement immediate stress reduction and boundary setting',
        timeline: 'immediate',
        priority: 10,
        rationale: 'Current cognitive debt levels are unsustainable'
      });
    }
    
    if (cognitiveDebt.primaryConcerns.includes('identity_erosion')) {
      actions.push({
        category: 'cognitive',
        action: 'Reconnect with values and life purpose through reflection/coaching',
        timeline: '2-4 weeks',
        priority: 9,
        rationale: 'Identity erosion threatens long-term decision-making ability'
      });
    }
    
    // Career actions based on real wage analysis
    if (realWage.reduction > 50) {
      actions.push({
        category: 'career',
        action: 'Negotiate remote work or reduced commute immediately',
        timeline: '2-4 weeks',
        priority: 9,
        rationale: 'Hidden costs are severely impacting real compensation'
      });
    }
    
    // Skills and networking (always important)
    actions.push({
      category: 'skills',
      action: 'Identify and develop skills for target liberation career',
      timeline: '1-3 months',
      priority: 7,
      rationale: 'Skill development creates options and reduces transition risk'
    });
    
    actions.push({
      category: 'network',
      action: 'Build professional network in target industry/role',
      timeline: '2-6 months',
      priority: 6,
      rationale: 'Strong network reduces job search time and creates opportunities'
    });
    
    return actions.sort((a, b) => b.priority - a.priority);
  }
  
  private assessRisks(profile: LiberationProfile): Array<any> {
    const risks: Array<any> = [];
    const { runway, realWage, cognitiveDebt, context } = profile;
    
    // Financial risks
    if (runway.months < 3) {
      risks.push({
        type: 'Financial instability',
        probability: 'high',
        impact: 'high',
        mitigation: 'Build emergency fund before making any career moves'
      });
    }
    
    // Health risks from cognitive debt
    if (cognitiveDebt.riskLevel === 'critical') {
      risks.push({
        type: 'Mental health deterioration',
        probability: 'high',
        impact: 'high',
        mitigation: 'Seek professional support and consider immediate time off'
      });
    }
    
    // Market risks
    risks.push({
      type: 'Economic downturn affecting job market',
      probability: 'medium',
      impact: 'medium',
      mitigation: 'Build larger runway and develop recession-proof skills'
    });
    
    // Identity/decision-making risks
    if (cognitiveDebt.primaryConcerns.includes('identity_erosion')) {
      risks.push({
        type: 'Poor decision-making due to identity confusion',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Address identity issues before making major life changes'
      });
    }
    
    return risks;
  }
  
  private defineMilestones(profile: LiberationProfile, phase: string): Array<any> {
    const milestones: Array<any> = [];
    
    // Phase-specific milestones
    switch (phase) {
      case 'preparation':
        milestones.push({
          description: 'Financial foundation secured',
          timeframe: '3-6 months',
          metrics: ['6+ months runway', 'Optimized expenses', 'Stress test passed']
        });
        milestones.push({
          description: 'Skills and network developed',
          timeframe: '3-9 months',
          metrics: ['Target skills acquired', 'Professional network established', 'Industry knowledge gained']
        });
        break;
        
      case 'transition':
        milestones.push({
          description: 'Transition plan activated',
          timeframe: '1-3 months',
          metrics: ['Notice given', 'Transition timeline set', 'Support systems activated']
        });
        break;
        
      case 'execution':
        milestones.push({
          description: 'Immediate relief achieved',
          timeframe: '2-8 weeks',
          metrics: ['Reduced work stress', 'Boundaries established', 'Cognitive debt declining']
        });
        break;
    }
    
    // Universal milestones
    milestones.push({
      description: 'Liberation mindset established',
      timeframe: 'ongoing',
      metrics: ['Regular self-assessment', 'Maintained boundaries', 'Continued growth']
    });
    
    return milestones;
  }
  
  private determinePriority(cognitiveDebt: any, runway: any): 'immediate' | 'short-term' | 'medium-term' | 'long-term' {
    if (cognitiveDebt.riskLevel === 'critical') return 'immediate';
    if (cognitiveDebt.riskLevel === 'high' || runway.months < 3) return 'short-term';
    if (cognitiveDebt.riskLevel === 'moderate' || runway.months < 12) return 'medium-term';
    return 'long-term';
  }
  
  private generateHolisticInsights(profile: LiberationProfile): string[] {
    const insights: string[] = [];
    const { runway, realWage, cognitiveDebt, context } = profile;
    
    // Cross-tool correlation insights
    if (cognitiveDebt.riskLevel === 'high' && runway.months < 6) {
      insights.push('🚨 You\'re in a high-stress, low-runway situation - this is unsustainable and requires immediate action');
    }
    
    if (realWage.reduction > 40 && cognitiveDebt.primaryConcerns.includes('emotional_exhaustion')) {
      insights.push('💸 Low real wages combined with emotional exhaustion suggests your job is extracting value from your life');
    }
    
    if (runway.months >= 12 && cognitiveDebt.riskLevel === 'low') {
      insights.push('🌟 You\'re in an excellent position to make strategic career moves - you have both financial security and mental clarity');
    }
    
    // Leverage insights
    const remoteScenario = realWage.scenarios.find(s => s.name === 'Remote Work');
    if (remoteScenario && remoteScenario.hourlyWage > realWage.hourlyWage * 1.2 && runway.months >= 6) {
      insights.push('🏠 Remote work could significantly boost your real wages while reducing stress - excellent liberation strategy');
    }
    
    // Risk/opportunity balance
    if (cognitiveDebt.riskLevel !== 'critical' && runway.months >= 9) {
      insights.push('✅ You have the luxury of making thoughtful, strategic decisions rather than reactive ones');
    }
    
    return insights;
  }
  
  private formatStrategicGuidance(strategy: LiberationStrategy, insights: string[], profile: LiberationProfile): string {
    let content = `# Your Personalized Liberation Strategy\n\n`;
    
    // Current situation assessment
    content += `## Current Situation Analysis\n\n`;
    content += `**Phase**: ${strategy.phase.charAt(0).toUpperCase() + strategy.phase.slice(1)}\n`;
    content += `**Priority Level**: ${strategy.priority}\n`;
    content += `**Timeframe**: ${strategy.timeframe}\n\n`;
    
    // Key insights
    content += `## Key Insights\n\n`;
    insights.forEach(insight => {
      content += `${insight}\n\n`;
    });
    
    // Immediate actions
    content += `## Immediate Actions (Next 30 Days)\n\n`;
    const immediateActions = strategy.actions.filter(a => a.timeline.includes('immediate') || a.timeline.includes('week'));
    immediateActions.forEach((action, index) => {
      content += `${index + 1}. **${action.action}** (${action.category})\n`;
      content += `   *Rationale*: ${action.rationale}\n\n`;
    });
    
    // Medium-term strategy
    content += `## Strategic Roadmap (3-6 Months)\n\n`;
    const mediumActions = strategy.actions.filter(a => !immediateActions.includes(a));
    mediumActions.forEach((action, index) => {
      content += `${index + 1}. **${action.action}** (${action.timeline})\n`;
      content += `   *Why this matters*: ${action.rationale}\n\n`;
    });
    
    // Risk management
    content += `## Risk Management\n\n`;
    strategy.risks.forEach(risk => {
      content += `**${risk.type}** (${risk.probability} probability, ${risk.impact} impact)\n`;
      content += `*Mitigation*: ${risk.mitigation}\n\n`;
    });
    
    // Success milestones
    content += `## Success Milestones\n\n`;
    strategy.milestones.forEach(milestone => {
      content += `**${milestone.description}** (${milestone.timeframe})\n`;
      content += `Success metrics: ${milestone.metrics.join(', ')}\n\n`;
    });
    
    content += `\n---\n\n*This strategy was generated by analyzing your financial runway, real wage situation, and cognitive debt levels. Update your data regularly for refined guidance.*`;
    
    return content;
  }
  
  // Utility methods for compatibility
  async generateResponse(prompt: string): Promise<AIResponse> {
    return {
      content: 'Liberation Strategist requires structured data input via analyzeLiberation() method',
      confidence: 0.3,
      sources: ['method-guidance'],
      type: 'guidance'
    };
  }
  
  async analyzeSentiment(text: string): Promise<{ score: number; label: string; confidence: number }> {
    // Basic liberation-focused sentiment analysis
    const liberationTerms = ['freedom', 'escape', 'liberation', 'autonomy', 'independent'];
    const stressTerms = ['burnout', 'exhausted', 'trapped', 'overwhelmed', 'stuck'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (liberationTerms.some(term => word.includes(term))) score += 0.2;
      if (stressTerms.some(term => word.includes(term))) score -= 0.3;
    });
    
    const normalizedScore = Math.max(-1, Math.min(1, score));
    
    return {
      score: normalizedScore,
      label: normalizedScore > 0.1 ? 'liberation-focused' : normalizedScore < -0.1 ? 'stress-focused' : 'neutral',
      confidence: 0.7
    };
  }

  async initialize(): Promise<void> {
    // No initialization needed for strategic analysis
  }
}