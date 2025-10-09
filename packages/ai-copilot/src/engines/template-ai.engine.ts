/**
 * Template AI Engine - Smart templates with personalization fallback
 * Ensures the system always works, even without AI models
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { 
  ISovereignAI, 
  IAIEngine,
  IPersonalizationEngine, 
  AIStatus, 
  AIInsights,
  AIEngineConfig,
  PersonalizationContext
} from '../interfaces/ai-engine.interface';
import type { LiberationContext, LiberationPlan, LiberationPhase } from '@thegreenfieldoverride/types';
import { BrowserPersonalizationEngine } from './personalization.engine';

export class TemplateAIEngine implements ISovereignAI {
  private isInitialized = false;
  private config: AIEngineConfig;
  private _memory: IPersonalizationEngine;

  constructor(config: AIEngineConfig) {
    this.config = config;
    this._memory = new BrowserPersonalizationEngine();
    console.log('📋 Template AI Engine initializing...');
  }

  get memory(): IPersonalizationEngine {
    return this._memory;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('📦 Loading smart template system...');
    
    // Initialize personalization if enabled
    if (this.config.personalization?.enabled) {
      await this._memory.initialize();
    }
    
    // Simulate initialization time for consistency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.isInitialized = true;
    console.log('✅ Template AI Engine ready!');
  }

  async generateLiberationPlan(
    context: LiberationContext, 
    personalization?: PersonalizationContext
  ): Promise<LiberationPlan> {
    await this.initialize();
    
    console.log('🧠 Generating template-based liberation plan...');
    
    // Get personal insights if available
    let personalInsights: string[] = [];
    if (this.config.personalization?.enabled) {
      personalInsights = await this._memory.generateInsights(context);
    }
    
    const assessment = this.generateSmartAssessment(context, personalInsights);
    const phases = this.createIntelligentPhases(context);
    
    return {
      assessment,
      timeline: this.determineTimeline(context),
      phases,
      contingencies: this.generateContingencies(context),
      resources: this.generateResources(context)
    };
  }

  async generatePersonalizedPlan(context: LiberationContext): Promise<LiberationPlan & {
    personalInsights: string[];
    historicalContext: string[];
    adaptiveRecommendations: string[];
  }> {
    const plan = await this.generateLiberationPlan(context);
    const personalInsights = await this._memory.generateInsights(context);
    
    // Search for relevant historical context
    const historicalContext: string[] = [];
    const searchResults = await this._memory.searchContext(
      `liberation planning ${context.industry} ${context.skills.join(' ')}`
    );
    historicalContext.push(...searchResults.slice(0, 3).map(r => r.content));
    
    const adaptiveRecommendations = this.generateAdaptiveRecommendations(context, personalInsights);
    
    return {
      ...plan,
      personalInsights,
      historicalContext,
      adaptiveRecommendations
    };
  }

  async analyzeContext(context: LiberationContext): Promise<AIInsights> {
    await this.initialize();
    
    // Template-based analysis (no real AI)
    const insights: AIInsights = {
      sentiment: {
        label: context.cognitiveDebtPercentage >= 70 ? 'NEGATIVE' : 'POSITIVE',
        confidence: 0.85,
        analysis: this.generateSentimentAnalysis(context)
      },
      classification: {
        category: this.classifyReadiness(context),
        confidence: 0.80,
        alternatives: this.getAlternativeReadiness(context)
      },
      riskAssessment: this.assessRisk(context),
      opportunities: this.identifyOpportunities(context)
    };
    
    return insights;
  }

  async assessLiberationReadiness(context: LiberationContext): Promise<{
    score: number;
    level: 'building' | 'ready' | 'optimal';
    factors: { name: string; score: number; impact: string }[];
    recommendations: string[];
  }> {
    const factors = [
      {
        name: 'Financial Runway',
        score: Math.min(context.runwayMonths * 16.67, 100),
        impact: context.runwayMonths >= 6 ? 'Strong foundation for transition' : 'Consider extending runway'
      },
      {
        name: 'Cognitive Health',
        score: Math.max(100 - context.cognitiveDebtPercentage, 0),
        impact: context.cognitiveDebtPercentage >= 70 ? 'High burnout risk' : 'Manageable stress levels'
      },
      {
        name: 'Skill Marketability',
        score: this.scoreSkillMarketability(context.skills, context.industry),
        impact: 'Skills assessment based on market patterns'
      },
      {
        name: 'Risk Alignment',
        score: this.scoreRiskAlignment(context),
        impact: 'Risk tolerance matches financial position'
      }
    ];
    
    const overallScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length;
    
    let level: 'building' | 'ready' | 'optimal';
    if (overallScore >= 80) level = 'optimal';
    else if (overallScore >= 60) level = 'ready';
    else level = 'building';
    
    const recommendations = this.generateReadinessRecommendations(factors);
    
    return { score: overallScore, level, factors, recommendations };
  }

  async generateRecommendations(
    context: LiberationContext,
    category: 'skills' | 'financial' | 'network' | 'wellbeing' | 'strategy'
  ): Promise<string[]> {
    const baseRecommendations = {
      skills: [
        'Assess current market demand for your skills',
        'Identify complementary skills to develop',
        'Build portfolio showcasing your best work'
      ],
      financial: [
        'Calculate true monthly expenses',
        'Build 6-month emergency fund',
        'Research income diversification opportunities'
      ],
      network: [
        'Connect with professionals in your target industry',
        'Join relevant professional communities',
        'Attend liberation-focused meetups'
      ],
      wellbeing: [
        'Implement daily stress management techniques',
        'Prioritize sleep and exercise',
        'Consider professional mental health support'
      ],
      strategy: [
        'Start with small, low-risk experiments',
        'Validate market demand before big moves',
        'Create timeline with clear milestones'
      ]
    };

    return baseRecommendations[category] || [];
  }

  getStatus(): AIStatus {
    return {
      initialized: this.isInitialized,
      modelsLoaded: ['smart-templates-v3'],
      mode: this.isInitialized ? 'smart-templates' : 'loading',
      capabilities: this.config.capabilities
    };
  }

  getMetadata() {
    return {
      name: 'Smart Template Engine',
      version: '3.0.0',
      type: 'local' as const,
      privacy: 'full' as const,
      dependencies: [] as string[]
    };
  }

  // Private implementation methods
  private generateSmartAssessment(context: LiberationContext, personalInsights: string[]): string {
    let readinessLevel = '';
    let readinessColor = '';
    
    if (context.runwayMonths >= 6) {
      readinessLevel = 'HIGH - Strong financial foundation for liberation';
      readinessColor = '🟢';
    } else if (context.runwayMonths >= 3) {
      readinessLevel = 'MEDIUM - Breathing room for planned transition';
      readinessColor = '🟡';
    } else {
      readinessLevel = 'BUILDING - Focus on extending runway while planning';
      readinessColor = '🟠';
    }

    const cognitiveStatus = context.cognitiveDebtPercentage >= 70 
      ? 'critical burnout requiring immediate attention'
      : context.cognitiveDebtPercentage >= 50 
        ? 'significant stress requiring intervention' 
        : 'manageable stress levels';

    const cognitiveColor = context.cognitiveDebtPercentage >= 70 ? '🔴' : 
                          context.cognitiveDebtPercentage >= 50 ? '🟠' : '🟢';

    let assessment = `${readinessColor} Liberation Readiness: ${readinessLevel}

🎯 Strategic Analysis:
• ${context.runwayMonths} months of financial runway gives you ${context.runwayMonths >= 6 ? 'excellent' : context.runwayMonths >= 3 ? 'good' : 'limited'} freedom to maneuver
• Real wage of $${context.realHourlyWage}/hour reveals your true compensation reality
• ${cognitiveColor} Cognitive debt at ${context.cognitiveDebtPercentage}% indicates ${cognitiveStatus}
• Your ${context.skills.join(' + ')} skills in ${context.industry} provide liberation opportunities
• ${context.riskTolerance} risk tolerance shapes your transition strategy

${this.generateStrategicInsights(context)}

${this.analyzeRiskOpportunity(context)}`;

    if (personalInsights.length > 0) {
      assessment += `\n\n💡 Personal Insights:\n${personalInsights.map(i => `• ${i}`).join('\n')}`;
    }

    return assessment;
  }

  private generateStrategicInsights(context: LiberationContext): string {
    let insights = '💡 Strategic Insights:\n';
    
    if (context.riskTolerance === 'high' && context.runwayMonths >= 6) {
      insights += '• Perfect storm for bold moves: High risk tolerance + solid runway = maximum liberation potential\n';
    } else if (context.riskTolerance === 'low' && context.runwayMonths < 3) {
      insights += '• Conservative foundation building required: Low risk tolerance + limited runway suggests extending preparation phase\n';
    }

    if (context.cognitiveDebtPercentage >= 80) {
      insights += '• URGENT: Extreme burnout detected - prioritize immediate mental health intervention over timeline\n';
    }

    const skillsLower = context.skills.map(s => s.toLowerCase());
    if (skillsLower.some(s => s.includes('programming') || s.includes('tech'))) {
      insights += '• High-value skills detected: Tech + programming = strong freelance/consulting opportunities\n';
    }

    return insights;
  }

  private analyzeRiskOpportunity(context: LiberationContext): string {
    let analysis = '⚖️ Risk/Opportunity Analysis:\n';
    
    let score = 0;
    score += Math.min(context.runwayMonths * 10, 60);
    score += context.realHourlyWage > 30 ? 20 : context.realHourlyWage > 15 ? 10 : 0;
    score -= context.cognitiveDebtPercentage >= 70 ? 20 : context.cognitiveDebtPercentage >= 50 ? 10 : 0;
    score += context.riskTolerance === 'high' ? 10 : context.riskTolerance === 'medium' ? 5 : 0;
    score += context.skills.length * 5;

    if (score >= 80) {
      analysis += '• Liberation Score: 🟢 OPTIMAL (80+) - All systems go for immediate transition planning\n';
    } else if (score >= 60) {
      analysis += '• Liberation Score: 🟡 GOOD (60-79) - Strong position with some areas to strengthen\n';
    } else if (score >= 40) {
      analysis += '• Liberation Score: 🟠 DEVELOPING (40-59) - Foundation building phase recommended\n';
    } else {
      analysis += '• Liberation Score: 🔴 PREPARATION (under 40) - Focus on runway extension and skill development\n';
    }

    return analysis;
  }

  private createIntelligentPhases(context: LiberationContext): LiberationPhase[] {
    const phases: LiberationPhase[] = [];

    // Phase 1: Recovery and Foundation
    const phase1Actions = [
      'Complete digital detox to reduce cognitive debt',
      'Conduct comprehensive skills inventory and market research',
      'Establish healthy daily routines and boundaries',
    ];

    if (context.cognitiveDebtPercentage >= 70) {
      phase1Actions.unshift('PRIORITY: Seek professional mental health support');
    }

    phase1Actions.push(...this.getIndustrySpecificActions(context));

    phases.push({
      name: 'Recovery & Foundation',
      duration: context.cognitiveDebtPercentage >= 70 ? '45 days' : '30 days',
      actions: phase1Actions,
      milestones: [
        'Cognitive debt reduced by 20%',
        'Complete skills and market documentation',
        'Establish sustainable daily routines',
        'Identify 3-5 potential income streams'
      ]
    });

    if (context.runwayMonths >= 3) {
      phases.push({
        name: 'Building Your Platform',
        duration: '60 days',
        actions: [
          'Launch first small bet (consulting/freelancing)',
          'Build professional network outside corporate system',
          'Create portfolio showcasing your best work',
          'Test market demand with small projects'
        ],
        milestones: [
          'Generate first $1000 in independent income',
          'Build network of 50+ sovereign professionals',
          'Complete professional portfolio',
          'Validate 1-2 sustainable income streams'
        ]
      });
    }

    if (context.runwayMonths >= 6) {
      phases.push({
        name: 'Full Liberation',
        duration: '90+ days',
        actions: [
          'Scale independent income to replace 75% of salary',
          'Join or create sovereign professional collective',
          'Mentor others in liberation process',
          'Build systems for location/time independence'
        ],
        milestones: [
          'Achieve sustainable salary replacement',
          'Join liberation community',
          'Help 3+ others start their escape journey',
          'Build location-independent practice'
        ]
      });
    }

    return phases;
  }

  private getIndustrySpecificActions(context: LiberationContext): string[] {
    const actions = [];
    const industryLower = context.industry.toLowerCase();
    const skillsLower = context.skills.map(s => s.toLowerCase());
    
    if (industryLower.includes('tech') || skillsLower.some(s => s.includes('programming'))) {
      actions.push('Research current freelance rates for your tech stack');
      actions.push('Audit and update your GitHub/portfolio');
    } else if (skillsLower.some(s => s.includes('writing'))) {
      actions.push('Research content monetization opportunities');
    } else if (skillsLower.some(s => s.includes('design'))) {
      actions.push('Research design freelance market rates');
    } else {
      actions.push('Research consulting opportunities in your industry');
    }
    
    return actions;
  }

  private determineTimeline(context: LiberationContext): string {
    if (context.runwayMonths >= 6) {
      return '6-month Strategic Sabbatical';
    } else if (context.runwayMonths >= 3) {
      return '3-month Rapid Transition';
    } else {
      return '90-day Foundation Building';
    }
  }

  private generateContingencies(context: LiberationContext): string[] {
    const contingencies = [
      'If market conditions worsen: extend runway by reducing expenses 20-30%',
      'If first income stream fails: pivot to validated alternative within 30 days',
      'If cognitive debt increases: prioritize mental health over timeline'
    ];

    if (context.runwayMonths < 6) {
      contingencies.push('If runway runs critically low: consider strategic return to employment');
    }

    if (context.cognitiveDebtPercentage >= 70) {
      contingencies.push('If burnout worsens: immediately prioritize rest and professional support');
    }

    return contingencies;
  }

  private generateResources(context: LiberationContext): string[] {
    const resources = [
      'The Greenfield Override diagnostic tools',
      'Local sovereign professional meetups',
      'Online communities for corporate refugees',
      'Mental health resources for burnout recovery'
    ];

    const skillsLower = context.skills.map(s => s.toLowerCase());
    
    if (skillsLower.some(s => s.includes('programming'))) {
      resources.push('Premium freelance platforms (Toptal, Gun.io)');
    }

    if (skillsLower.some(s => s.includes('writing'))) {
      resources.push('Newsletter platforms (Substack, ConvertKit)');
    }

    return resources;
  }

  private generateAdaptiveRecommendations(context: LiberationContext, personalInsights: string[]): string[] {
    const recommendations = [];
    
    if (personalInsights.some(i => i.includes('pattern'))) {
      recommendations.push('Based on your historical patterns, maintain consistency in your approach');
    }
    
    if (personalInsights.some(i => i.includes('successful'))) {
      recommendations.push('Leverage your track record of successful experiments');
    }
    
    return recommendations;
  }

  // Template-based analysis methods
  private generateSentimentAnalysis(context: LiberationContext): string {
    if (context.cognitiveDebtPercentage >= 70) {
      return 'Your situation indicates high stress patterns that strongly support the need for liberation (85% confidence).';
    } else {
      return 'Your situation shows positive readiness indicators for transition planning (85% confidence).';
    }
  }

  private classifyReadiness(context: LiberationContext): string {
    if (context.runwayMonths >= 6 && context.cognitiveDebtPercentage < 60) {
      return 'ready for immediate transition';
    } else if (context.runwayMonths >= 3) {
      return 'needs preparation time';
    } else {
      return 'requires foundation building';
    }
  }

  private getAlternativeReadiness(context: LiberationContext): string[] {
    const alternatives = [];
    if (context.runwayMonths >= 3) alternatives.push('moderate preparation needed');
    if (context.cognitiveDebtPercentage >= 70) alternatives.push('health intervention priority');
    alternatives.push('foundation building recommended');
    return alternatives.slice(0, 2);
  }

  private assessRisk(context: LiberationContext): AIInsights['riskAssessment'] {
    const factors = [];
    const mitigation = [];
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (context.runwayMonths < 3) {
      factors.push('Limited financial runway');
      mitigation.push('Extend runway before major transitions');
      level = 'high';
    }
    
    if (context.cognitiveDebtPercentage >= 80) {
      factors.push('Critical burnout levels');
      mitigation.push('Prioritize mental health intervention');
      level = 'critical';
    }
    
    return { level, factors, mitigation };
  }

  private identifyOpportunities(context: LiberationContext): AIInsights['opportunities'] {
    const skillsLower = context.skills.map(s => s.toLowerCase());
    
    let primary = 'Skill-based consulting and freelancing';
    const secondary: string[] = [];
    
    if (skillsLower.some(s => s.includes('programming'))) {
      primary = 'Technical consulting and product development';
      secondary.push('Open source contributions', 'Technical writing');
    } else if (skillsLower.some(s => s.includes('writing'))) {
      primary = 'Content creation and newsletter monetization';
      secondary.push('Freelance writing', 'Course creation');
    }
    
    const timeline = context.runwayMonths >= 6 ? '3-6 months' : 
                    context.runwayMonths >= 3 ? '1-3 months' : '3-6 weeks';
    
    return { primary, secondary, timeline };
  }

  private scoreSkillMarketability(skills: string[], industry: string): number {
    const techSkills = skills.filter(s => 
      s.toLowerCase().includes('programming') || 
      s.toLowerCase().includes('software')
    ).length;
    
    return Math.min(50 + (techSkills * 25), 100);
  }

  private scoreRiskAlignment(context: LiberationContext): number {
    if (context.riskTolerance === 'high' && context.runwayMonths >= 6) return 90;
    if (context.riskTolerance === 'low' && context.runwayMonths >= 6) return 85;
    if (context.riskTolerance === 'medium') return 75;
    return 60;
  }

  private generateReadinessRecommendations(factors: any[]): string[] {
    const recommendations = [];
    
    const lowScoreFactors = factors.filter(f => f.score < 60);
    for (const factor of lowScoreFactors) {
      recommendations.push(`Improve ${factor.name}: ${factor.impact}`);
    }
    
    return recommendations;
  }
}