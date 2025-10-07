/**
 * Smart AI Engine - Progressive Enhancement
 * Uses real AI models when available, falls back to smart templates
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { LiberationContext, LiberationPlan, LiberationPhase } from '@greenfield/types';

export interface AIStatus {
  initialized: boolean;
  modelsLoaded: string[];
  loading?: boolean;
  error?: string;
}

export class SovereignAI {
  private models: Map<string, any> = new Map();
  private isInitialized = false;
  private useRealAI = false;

  constructor() {
    console.log('🤖 Sovereign AI (Smart Mode) initializing - Your liberation begins...');
    
    // We'll determine if we can use real AI when actually needed
    this.useRealAI = false;
  }

  /**
   * Initialize the AI engine - tries real models first, falls back to templates
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📦 Loading liberation planning system...');
      
      // Check if we can use real AI (only in browser runtime)
      const canUseRealAI = typeof window !== 'undefined' && 
                           'WebAssembly' in window &&
                           typeof document !== 'undefined' &&
                           !window.location.href.includes('_next');
      
      if (canUseRealAI) {
        console.log('🧠 Attempting to load AI models...');
        try {
          await this.loadRealModels();
          this.useRealAI = true;
        } catch (error) {
          console.warn('AI models failed to load, using templates:', error);
          this.useRealAI = false;
        }
      } else {
        console.log('📋 Using template-based planning');
        this.useRealAI = false;
        // Simulate loading time for consistency
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      this.isInitialized = true;
      console.log('✅ Sovereign AI ready for liberation planning!');
    } catch (error) {
      console.warn('AI initialization failed, falling back to template mode:', error);
      this.useRealAI = false;
      this.isInitialized = true;
    }
  }

  /**
   * Attempt to load real AI models
   */
  private async loadRealModels(): Promise<void> {
    try {
      // Dynamic import to avoid build issues
      const transformers = await import('@xenova/transformers');
      const { pipeline, env } = transformers;
      
      // Configure for web-only usage
      env.allowRemoteModels = true;
      env.allowLocalModels = false;
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.simd = true;
      
      // Load small, fast models
      console.log('📊 Loading sentiment analysis model...');
      const sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        {
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`⬇️ Model download: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );
      
      this.models.set('sentiment-analysis', sentimentAnalyzer);
      
      // For now, skip text generation as it's more complex to bundle
      // We'll use template-based generation with AI-enhanced analysis
      
      console.log('✅ AI models loaded successfully');
    } catch (error) {
      console.warn('Failed to load AI models:', error);
      throw error;
    }
  }

  /**
   * Generate personalized liberation plan
   */
  async generateLiberationPlan(context: LiberationContext): Promise<LiberationPlan> {
    await this.initialize();
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let assessment = '';
    
    if (this.useRealAI && this.models.has('sentiment-analysis')) {
      assessment = await this.generateAIEnhancedAssessment(context);
    } else {
      assessment = this.generateTemplateAssessment(context);
    }
    
    const phases = this.createLiberationPhases(context);
    const timeline = this.determineTimeline(context);
    
    return {
      assessment,
      timeline,
      phases,
      contingencies: this.generateContingencies(context),
      resources: this.generateResources(context)
    };
  }

  /**
   * Generate AI-enhanced assessment using sentiment analysis
   */
  private async generateAIEnhancedAssessment(context: LiberationContext): Promise<string> {
    const sentimentAnalyzer = this.models.get('sentiment-analysis');
    let aiInsights = '';
    
    try {
      // Analyze sentiment of user's situation
      const situationText = `I have ${context.runwayMonths} months of savings, earn $${context.realHourlyWage} per hour effectively, and my burnout level is ${context.cognitiveDebtPercentage}%. I work in ${context.industry} with skills in ${context.skills.join(', ')}.`;
      
      const sentiment = await sentimentAnalyzer(situationText);
      const sentimentScore = sentiment[0];
      
      const confidence = (sentimentScore.score * 100).toFixed(1);
      
      if (sentimentScore.label === 'POSITIVE') {
        aiInsights = `AI Analysis: Your situation shows positive indicators for transition (confidence: ${confidence}%). The language patterns suggest readiness for change.`;
      } else {
        aiInsights = `AI Analysis: Your situation indicates stress that strongly supports the need for liberation (confidence: ${confidence}%). The emotional markers confirm that change is necessary.`;
      }
      
      // Enhanced risk assessment based on AI analysis
      if (sentimentScore.score > 0.8 && sentimentScore.label === 'NEGATIVE') {
        aiInsights += ' Priority recommendation: Address burnout immediately before planning transition.';
      } else if (sentimentScore.score > 0.7 && sentimentScore.label === 'POSITIVE') {
        aiInsights += ' Your mindset is well-positioned for a successful liberation journey.';
      }
      
    } catch (error) {
      console.warn('AI analysis failed:', error);
      aiInsights = 'AI Analysis: Unable to perform sentiment analysis, using template-based assessment.';
    }
    
    const baseAssessment = this.generateTemplateAssessment(context);
    return `${baseAssessment}\n\n${aiInsights}`;
  }

  /**
   * Generate template-based assessment
   */
  private generateTemplateAssessment(context: LiberationContext): string {
    let readinessLevel = '';
    if (context.runwayMonths >= 6) {
      readinessLevel = 'HIGH - You have strong financial foundation for liberation';
    } else if (context.runwayMonths >= 3) {
      readinessLevel = 'MEDIUM - You have breathing room to plan your escape';  
    } else {
      readinessLevel = 'BUILDING - Focus on extending your runway while planning';
    }

    const cognitiveStatus = context.cognitiveDebtPercentage >= 70 
      ? 'critical burnout requiring immediate attention'
      : context.cognitiveDebtPercentage >= 50 
        ? 'significant stress requiring intervention' 
        : 'manageable stress levels';

    // Add personalized insights based on context
    let personalizedNote = '';
    if (context.riskTolerance === 'high' && context.runwayMonths >= 6) {
      personalizedNote = '\n\nStrategic Advantage: Your high risk tolerance combined with solid runway creates an excellent opportunity for bold moves.';
    } else if (context.riskTolerance === 'low' && context.runwayMonths < 3) {
      personalizedNote = '\n\nCautious Approach: Your conservative risk profile suggests building additional runway before major transitions.';
    } else if (context.cognitiveDebtPercentage >= 80) {
      personalizedNote = '\n\nUrgent Priority: Your extremely high burnout level indicates the need for immediate action to protect your mental health.';
    }

    return `Liberation Readiness: ${readinessLevel}

Your situation analysis:
• ${context.runwayMonths} months of financial runway gives you ${context.runwayMonths >= 6 ? 'excellent' : context.runwayMonths >= 3 ? 'good' : 'limited'} freedom to maneuver
• Real wage of $${context.realHourlyWage}/hour reveals your true compensation reality  
• Cognitive debt at ${context.cognitiveDebtPercentage}% indicates ${cognitiveStatus}
• Your ${context.skills.join(' + ')} skills in ${context.industry} provide liberation opportunities
• ${context.riskTolerance} risk tolerance shapes your transition strategy${personalizedNote}`;
  }

  /**
   * Determine appropriate timeline based on context
   */
  private determineTimeline(context: LiberationContext): string {
    if (context.runwayMonths >= 6) {
      return '6-month Strategic Sabbatical';
    } else if (context.runwayMonths >= 3) {
      return '3-month Rapid Transition';
    } else {
      return '90-day Foundation Building';
    }
  }

  /**
   * Create liberation phases based on user context
   */
  private createLiberationPhases(context: LiberationContext): LiberationPhase[] {
    const phases: LiberationPhase[] = [];

    // Phase 1: Always starts with recovery and planning
    phases.push({
      name: 'Recovery & Foundation',
      duration: '30 days',
      actions: [
        'Complete digital detox to reduce cognitive debt',
        'Conduct comprehensive skills inventory',
        'Research market opportunities in your field',
        'Build daily meditation/mindfulness practice',
        'Reconnect with suppressed creative interests'
      ],
      milestones: [
        'Cognitive debt reduced by 20%',
        'Complete skills documentation',
        'Identify 3 potential income streams',
        'Establish healthy daily routines'
      ]
    });

    // Phase 2: Building or transitioning (if runway allows)
    if (context.runwayMonths >= 3) {
      const industrySpecificActions = this.getIndustryActions(context.industry, context.skills);
      
      phases.push({
        name: 'Building Your Platform',
        duration: '60 days',
        actions: [
          ...industrySpecificActions,
          'Build professional network outside corporate system',
          'Create portfolio showcasing your best work',
          'Test market demand for your services',
          'Develop 2-3 income diversification strategies'
        ],
        milestones: [
          'Generate first $1000 in independent income',
          'Build network of 50+ sovereign professionals', 
          'Complete professional portfolio',
          'Validate 1 sustainable income stream'
        ]
      });
    }

    // Phase 3: Full liberation (if substantial runway)
    if (context.runwayMonths >= 6) {
      phases.push({
        name: 'Full Liberation',
        duration: '90+ days', 
        actions: [
          'Scale independent income to replace salary',
          'Join or create sovereign professional collective',
          'Mentor others in liberation process',
          'Build systems for location independence',
          'Focus on mission-driven projects'
        ],
        milestones: [
          'Achieve 75% salary replacement',
          'Join liberation community',
          'Help 3 others start their escape',
          'Build sustainable sovereign practice'
        ]
      });
    }

    return phases;
  }

  /**
   * Get industry-specific actions
   */
  private getIndustryActions(industry: string, skills: string[]): string[] {
    const actions = ['Launch first small bet (consulting/freelancing)'];
    
    const industryLower = industry.toLowerCase();
    const skillsLower = skills.map(s => s.toLowerCase());
    
    if (industryLower.includes('tech') || skillsLower.some(s => s.includes('programming') || s.includes('development'))) {
      actions.push('Build open source portfolio project');
      actions.push('Start technical blog or newsletter');
    } else if (skillsLower.some(s => s.includes('writing') || s.includes('content'))) {
      actions.push('Launch newsletter or blog');
      actions.push('Pitch freelance articles to publications');  
    } else if (skillsLower.some(s => s.includes('design'))) {
      actions.push('Create design portfolio website');
      actions.push('Take on small design projects');
    } else {
      actions.push('Identify your unique value proposition');
      actions.push('Create professional service offering');
    }
    
    return actions;
  }

  /**
   * Generate contingency plans
   */
  private generateContingencies(context: LiberationContext): string[] {
    const contingencies = [
      'If market conditions worsen: extend runway by reducing expenses further',
      'If first income stream fails: pivot to validated alternative within 30 days',
      'If cognitive debt increases: prioritize mental health over timeline'
    ];

    if (context.runwayMonths < 6) {
      contingencies.push('If runway runs low: consider strategic return to employment while maintaining liberated mindset');
    }

    if (context.riskTolerance === 'low') {
      contingencies.push('Maintain conservative approach: ensure 6-month emergency fund before full transition');
    }

    if (context.cognitiveDebtPercentage >= 70) {
      contingencies.push('If burnout worsens: prioritize immediate rest and professional support');
    }

    return contingencies;
  }

  /**
   * Generate resources based on context
   */
  private generateResources(context: LiberationContext): string[] {
    const resources = [
      'The Greenfield Override diagnostic tools',
      'Local sovereign professional meetups',
      'Online communities for corporate refugees',
      'Mental health resources for burnout recovery'
    ];

    // Add skill-specific resources
    const skillsLower = context.skills.map(s => s.toLowerCase());
    
    if (skillsLower.some(s => s.includes('programming') || s.includes('development'))) {
      resources.push('Freelance developer platforms (Toptal, Gun.io)');
      resources.push('Open source contribution opportunities');
    }

    if (skillsLower.some(s => s.includes('writing') || s.includes('content'))) {
      resources.push('Independent publication platforms (Substack, Medium)');
      resources.push('Newsletter monetization tools (ConvertKit, Beehiiv)');
    }

    if (skillsLower.some(s => s.includes('design'))) {
      resources.push('Design freelance platforms (99designs, Dribbble)');
      resources.push('Creative project funding sources (Patreon, Kickstarter)');
    }

    if (context.industry.toLowerCase().includes('finance')) {
      resources.push('Financial independence communities (FIRE, Bogleheads)');
      resources.push('Investment education resources');
    }

    return resources;
  }

  /**
   * Get model loading status
   */
  getStatus(): AIStatus {
    const modelNames = this.useRealAI 
      ? Array.from(this.models.keys()).concat(['smart-templates'])
      : ['smart-templates-v2'];
      
    return {
      initialized: this.isInitialized,
      modelsLoaded: modelNames
    };
  }
}

// Singleton instance for the app
export const sovereignAI = new SovereignAI();