/**
 * WebAssembly AI Engine - Client-Side Liberation AI
 * Uses Transformers.js to run AI models entirely in the browser
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import { pipeline, env } from '@xenova/transformers';

// Configure for client-side use ONLY - no Node.js backends
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.simd = true;

// Force web-only backend to prevent Node.js binary imports
if (typeof window !== 'undefined') {
  // We're in the browser
  env.backends.onnx.logLevel = 'warning';
}

export interface AIModelConfig {
  task: 'text-generation' | 'text-classification' | 'sentiment-analysis' | 'summarization';
  model: string;
  maxTokens?: number;
  temperature?: number;
}

import type { LiberationContext, LiberationPlan, LiberationPhase } from '@greenfieldoverride/types';

export class SovereignAI {
  private models: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    console.log('🤖 Sovereign AI initializing - Your liberation begins...');
  }

  /**
   * Initialize the AI engine with liberation-focused models
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📦 Loading liberation planning model...');
      
      // Load a lightweight text generation model for planning
      // We'll start with a small, fast model for proof-of-concept
      const textGenerator = await pipeline(
        'text-generation',
        'Xenova/distilgpt2', // 340MB model, good for basic text generation
        { 
          quantized: true, // Use quantized version for smaller size
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`⬇️ Downloading: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );
      
      this.models.set('text-generation', textGenerator);

      // Load sentiment analysis for cognitive debt assessment
      console.log('🧠 Loading cognitive assessment model...');
      const sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
      
      this.models.set('sentiment-analysis', sentimentAnalyzer);

      this.isInitialized = true;
      console.log('✅ Sovereign AI ready for liberation planning!');
    } catch (error) {
      console.error('❌ Failed to initialize AI engine:', error);
      throw new Error('AI initialization failed - check network connection');
    }
  }

  /**
   * Analyze user's liberation readiness
   */
  async assessLiberationReadiness(context: LiberationContext): Promise<string> {
    await this.initialize();

    // Create assessment prompt based on user data
    const assessmentText = `
    Financial runway: ${context.runwayMonths} months
    Real hourly wage: $${context.realHourlyWage}
    Cognitive debt: ${context.cognitiveDebtPercentage}%
    Skills: ${context.skills.join(', ')}
    Industry: ${context.industry}
    Risk tolerance: ${context.riskTolerance}
    `;

    // Use sentiment analysis to assess overall situation
    const sentimentAnalyzer = this.models.get('sentiment-analysis');
    const sentiment = await sentimentAnalyzer(assessmentText);

    // Generate liberation readiness assessment
    let readiness = '';
    if (context.runwayMonths >= 6) {
      readiness = 'HIGH - You have strong financial foundation for liberation';
    } else if (context.runwayMonths >= 3) {
      readiness = 'MEDIUM - You have breathing room to plan your escape';
    } else {
      readiness = 'BUILDING - Focus on extending your runway while planning';
    }

    return `Liberation Readiness: ${readiness}

Your situation analysis:
• ${context.runwayMonths} months of financial runway gives you ${context.runwayMonths >= 6 ? 'excellent' : context.runwayMonths >= 3 ? 'good' : 'limited'} freedom to maneuver
• Real wage of $${context.realHourlyWage}/hour reveals your true compensation reality
• Cognitive debt at ${context.cognitiveDebtPercentage}% indicates ${context.cognitiveDebtPercentage >= 70 ? 'critical burnout requiring immediate attention' : context.cognitiveDebtPercentage >= 50 ? 'significant stress requiring intervention' : 'manageable stress levels'}
• Your ${context.skills.join(' + ')} skills in ${context.industry} provide liberation opportunities
• ${context.riskTolerance} risk tolerance shapes your transition strategy`;
  }

  /**
   * Generate personalized liberation plan
   */
  async generateLiberationPlan(context: LiberationContext): Promise<LiberationPlan> {
    await this.initialize();

    const textGenerator = this.models.get('text-generation');
    
    // Create structured prompt for liberation planning
    const prompt = `Liberation Plan for ${context.industry} professional:

Financial Foundation:
- Runway: ${context.runwayMonths} months
- Real wage: $${context.realHourlyWage}/hour
- Risk tolerance: ${context.riskTolerance}

Skills & Assets:
- Core skills: ${context.skills.join(', ')}
- Cognitive debt: ${context.cognitiveDebtPercentage}%

Strategic Sabbatical Plan:`;

    // Generate plan content
    const result = await textGenerator(prompt, {
      max_length: 200,
      temperature: 0.7,
      do_sample: true,
      return_full_text: false
    });

    // Structure the generated text into a proper liberation plan
    const generatedText = result[0]?.generated_text || '';

    // Create structured phases based on user's runway
    const phases = this.createLiberationPhases(context);
    
    return {
      assessment: await this.assessLiberationReadiness(context),
      timeline: context.runwayMonths >= 6 ? '6-month Strategic Sabbatical' : context.runwayMonths >= 3 ? '3-month Rapid Transition' : '90-day Foundation Building',
      phases,
      contingencies: this.generateContingencies(context),
      resources: this.generateResources(context)
    };
  }

  /**
   * Create liberation phases based on user context
   */
  private createLiberationPhases(context: LiberationContext): LiberationPhase[] {
    const phases = [];

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

    // Phase 2: Building or transitioning
    if (context.runwayMonths >= 3) {
      phases.push({
        name: 'Building Your Platform',
        duration: '60 days',
        actions: [
          'Launch first small bet (consulting/freelancing)',
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

    // Phase 3: Liberation or sustainable transition
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
   * Generate contingency plans
   */
  private generateContingencies(context: LiberationContext): string[] {
    const contingencies = [
      'If market conditions worsen: extend runway by reducing expenses further',
      'If first income stream fails: pivot to validated alternative within 30 days',
      'If cognitive debt increases: prioritize mental health over timeline',
    ];

    if (context.runwayMonths < 6) {
      contingencies.push('If runway runs low: consider strategic return to employment while maintaining liberated mindset');
    }

    if (context.riskTolerance === 'low') {
      contingencies.push('Maintain conservative approach: ensure 6-month emergency fund before full transition');
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
    if (context.skills.includes('programming') || context.skills.includes('development')) {
      resources.push('Freelance developer platforms', 'Open source contribution opportunities');
    }

    if (context.skills.includes('writing') || context.skills.includes('content')) {
      resources.push('Independent publication platforms', 'Newsletter monetization tools');
    }

    if (context.skills.includes('design')) {
      resources.push('Design freelance platforms', 'Creative project funding sources');
    }

    return resources;
  }

  /**
   * Get model loading status
   */
  getStatus(): { initialized: boolean; modelsLoaded: string[] } {
    return {
      initialized: this.isInitialized,
      modelsLoaded: Array.from(this.models.keys())
    };
  }
}

// Singleton instance for the app
export const sovereignAI = new SovereignAI();