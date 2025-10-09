/**
 * WebAssembly AI Engine - Client-Side Liberation AI (Web-Only Version)
 * Uses Transformers.js with strict web-only configuration
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { LiberationContext, LiberationPlan, LiberationPhase } from '@thegreenfieldoverride/types';

// Dynamic import to avoid bundling issues
let transformersLoaded = false;
let pipeline: any = null;
let env: any = null;

async function loadTransformers() {
  if (transformersLoaded) return { pipeline, env };
  
  try {
    // Dynamic import to prevent server-side execution
    if (typeof window === 'undefined') {
      throw new Error('Transformers.js is only available in the browser');
    }
    
    const transformers = await import('@xenova/transformers');
    pipeline = transformers.pipeline;
    env = transformers.env;
    
    // Force web-only configuration
    env.allowRemoteModels = true;
    env.allowLocalModels = false;
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.simd = true;
    env.backends.onnx.logLevel = 'warning';
    
    // Disable problematic backends
    env.backends.onnx.webgl = false; // Can be unstable
    
    transformersLoaded = true;
    return { pipeline, env };
  } catch (error) {
    console.error('Failed to load Transformers.js:', error);
    throw new Error('AI models require a modern browser with WebAssembly support');
  }
}

export interface AIStatus {
  initialized: boolean;
  modelsLoaded: string[];
  loading?: boolean;
  error?: string;
}

export class SovereignAI {
  private models: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    console.log('🤖 Sovereign AI (Real Models) initializing - Your liberation begins...');
  }

  /**
   * Initialize the AI engine with liberation-focused models
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📦 Loading liberation planning models...');
      
      // Load Transformers.js dynamically
      const { pipeline: pipelineFunc } = await loadTransformers();
      
      // Load a lightweight text generation model for planning
      console.log('🧠 Loading text generation model...');
      const textGenerator = await pipelineFunc(
        'text-generation',
        'Xenova/distilgpt2', // Small 82MB model, good for basic text generation
        { 
          quantized: true,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`⬇️ Downloading model: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );
      
      this.models.set('text-generation', textGenerator);

      // Load sentiment analysis for cognitive assessment
      console.log('📊 Loading cognitive assessment model...');
      const sentimentAnalyzer = await pipelineFunc(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english', // 67MB model
        {
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`⬇️ Downloading sentiment model: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );
      
      this.models.set('sentiment-analysis', sentimentAnalyzer);

      this.isInitialized = true;
      console.log('✅ Sovereign AI ready for liberation planning!');
    } catch (error) {
      console.error('❌ Failed to initialize AI engine:', error);
      throw new Error('AI initialization failed - check network connection and browser compatibility');
    }
  }

  /**
   * Generate personalized liberation plan using real AI models
   */
  async generateLiberationPlan(context: LiberationContext): Promise<LiberationPlan> {
    await this.initialize();

    const textGenerator = this.models.get('text-generation');
    
    // Create a sophisticated prompt for liberation planning
    const prompt = this.createLiberationPrompt(context);
    
    console.log('🤖 Generating liberation strategy...');
    
    try {
      // Generate enhanced assessment and insights
      const aiInsights = await this.generateAIInsights(prompt, textGenerator);
      
      // Combine AI insights with template-based logic for reliability
      const assessment = await this.generateEnhancedAssessment(context, aiInsights);
      const phases = this.createLiberationPhases(context);
      const timeline = this.determineTimeline(context);
      
      return {
        assessment,
        timeline,
        phases,
        contingencies: this.generateContingencies(context),
        resources: this.generateResources(context)
      };
    } catch (error) {
      console.error('AI generation failed, falling back to template-based planning:', error);
      // Fallback to template-based planning if AI fails
      return this.generateFallbackPlan(context);
    }
  }

  /**
   * Create a sophisticated prompt for the AI model
   */
  private createLiberationPrompt(context: LiberationContext): string {
    return `You are a strategic advisor helping someone plan their liberation from corporate employment.

Context:
- Financial runway: ${context.runwayMonths} months
- Real hourly wage: $${context.realHourlyWage}
- Cognitive debt: ${context.cognitiveDebtPercentage}%
- Skills: ${context.skills.join(', ')}
- Industry: ${context.industry}
- Risk tolerance: ${context.riskTolerance}

Generate strategic insights for their liberation journey focusing on practical steps, psychological readiness, and sustainable transition strategies. Consider their unique situation and provide personalized guidance.

Strategic analysis:`;
  }

  /**
   * Generate AI insights using the text generation model
   */
  private async generateAIInsights(prompt: string, textGenerator: any): Promise<string> {
    try {
      const result = await textGenerator(prompt, {
        max_length: 150,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false,
        pad_token_id: 50256, // For GPT-2 models
      });

      return result[0]?.generated_text || '';
    } catch (error) {
      console.warn('AI text generation failed:', error);
      return '';
    }
  }

  /**
   * Generate enhanced assessment combining AI insights with structured analysis
   */
  private async generateEnhancedAssessment(context: LiberationContext, aiInsights: string): Promise<string> {
    // Analyze sentiment of the user's situation
    const sentimentAnalyzer = this.models.get('sentiment-analysis');
    let sentimentAnalysis = '';
    
    try {
      const situationText = `I have ${context.runwayMonths} months of savings, earn $${context.realHourlyWage} per hour effectively, and my burnout level is ${context.cognitiveDebtPercentage}%. I work in ${context.industry} with skills in ${context.skills.join(', ')}.`;
      const sentiment = await sentimentAnalyzer(situationText);
      
      const sentimentScore = sentiment[0];
      sentimentAnalysis = sentimentScore.label === 'POSITIVE' 
        ? `Your situation shows positive indicators for transition (confidence: ${(sentimentScore.score * 100).toFixed(1)}%).`
        : `Your situation indicates stress that supports the need for change (confidence: ${(sentimentScore.score * 100).toFixed(1)}%).`;
    } catch (error) {
      console.warn('Sentiment analysis failed:', error);
    }

    // Combine AI insights with structured assessment
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

    let assessment = `Liberation Readiness: ${readinessLevel}

Your situation analysis:
• ${context.runwayMonths} months of financial runway gives you ${context.runwayMonths >= 6 ? 'excellent' : context.runwayMonths >= 3 ? 'good' : 'limited'} freedom to maneuver
• Real wage of $${context.realHourlyWage}/hour reveals your true compensation reality  
• Cognitive debt at ${context.cognitiveDebtPercentage}% indicates ${cognitiveStatus}
• Your ${context.skills.join(' + ')} skills in ${context.industry} provide liberation opportunities
• ${context.riskTolerance} risk tolerance shapes your transition strategy`;

    if (sentimentAnalysis) {
      assessment += `\n\nAI Analysis: ${sentimentAnalysis}`;
    }

    if (aiInsights && aiInsights.trim().length > 10) {
      assessment += `\n\nStrategic Insights: ${aiInsights.trim()}`;
    }

    return assessment;
  }

  /**
   * Fallback plan generation using template-based logic
   */
  private generateFallbackPlan(context: LiberationContext): LiberationPlan {
    console.log('📋 Using template-based planning as fallback');
    
    const assessment = this.generateBasicAssessment(context);
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
   * Generate basic assessment (fallback)
   */
  private generateBasicAssessment(context: LiberationContext): string {
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

    return `Liberation Readiness: ${readinessLevel}

Your situation analysis:
• ${context.runwayMonths} months of financial runway gives you ${context.runwayMonths >= 6 ? 'excellent' : context.runwayMonths >= 3 ? 'good' : 'limited'} freedom to maneuver
• Real wage of $${context.realHourlyWage}/hour reveals your true compensation reality  
• Cognitive debt at ${context.cognitiveDebtPercentage}% indicates ${cognitiveStatus}
• Your ${context.skills.join(' + ')} skills in ${context.industry} provide liberation opportunities
• ${context.riskTolerance} risk tolerance shapes your transition strategy`;
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
    return {
      initialized: this.isInitialized,
      modelsLoaded: Array.from(this.models.keys())
    };
  }
}

// Singleton instance for the app
export const sovereignAI = new SovereignAI();