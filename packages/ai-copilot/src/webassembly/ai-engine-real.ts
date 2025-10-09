/**
 * Real AI Engine - Transformers.js Web-Only Mode
 * This version forces web-only mode and uses real AI models
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { LiberationContext, LiberationPlan, LiberationPhase } from '@thegreenfieldoverride/types';

export interface AIStatus {
  initialized: boolean;
  modelsLoaded: string[];
  loading?: boolean;
  error?: string;
  mode: 'real-ai' | 'loading' | 'error';
}

// Force web-only environment BEFORE any imports
if (typeof window !== 'undefined') {
  // Override environment detection
  (globalThis as any).process = { 
    env: { NODE_ENV: 'production' },
    browser: true 
  };
  
  // Force web-only backend
  (globalThis as any).ONNX_WEB_ONLY = true;
}

export class SovereignAI {
  private models: Map<string, any> = new Map();
  private isInitialized = false;
  private pipeline: any = null;
  private env: any = null;

  constructor() {
    console.log('🤖 Sovereign AI (Real AI Mode) initializing - Your liberation begins...');
  }

  /**
   * Initialize the AI engine with real models
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📦 Loading real AI models...');
      
      // Only proceed if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Real AI mode requires browser environment');
      }

      // Dynamic import with web-only forcing
      const transformersModule = await this.loadTransformersWebOnly();
      
      if (!transformersModule) {
        throw new Error('Failed to load Transformers.js');
      }

      const { pipeline, env } = transformersModule;
      this.pipeline = pipeline;
      this.env = env;

      // Configure for aggressive web-only usage
      env.allowRemoteModels = true;
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      env.backends.onnx.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 1, 4);
      env.backends.onnx.wasm.simd = true;
      
      // Disable any Node.js backends explicitly
      if (env.backends.onnx.node) {
        env.backends.onnx.node = false;
      }

      console.log('🧠 Loading sentiment analysis model...');
      
      // Load lightweight models for liberation planning
      const sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        {
          quantized: true, // Use quantized for faster loading
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`⬇️ Sentiment model: ${Math.round(progress.progress || 0)}%`);
            } else if (progress.status === 'loading') {
              console.log('🔄 Loading model into memory...');
            }
          }
        }
      );
      
      this.models.set('sentiment-analysis', sentimentAnalyzer);

      // Load a small text classification model for skill assessment
      console.log('🎯 Loading skill classification model...');
      const classifier = await pipeline(
        'zero-shot-classification',
        'Xenova/distilbert-base-uncased-mnli',
        {
          quantized: true,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`⬇️ Classification model: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );
      
      this.models.set('zero-shot-classification', classifier);

      this.isInitialized = true;
      console.log('✅ Real AI models loaded successfully! Liberation analysis ready.');
      
    } catch (error) {
      console.error('❌ Failed to initialize real AI models:', error);
      throw new Error(`AI initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load Transformers.js in web-only mode
   */
  private async loadTransformersWebOnly(): Promise<any> {
    try {
      // Force environment variables before import
      const originalProcess = (globalThis as any).process;
      
      // Override process.env to force web mode
      (globalThis as any).process = {
        ...originalProcess,
        env: { 
          ...originalProcess?.env,
          NODE_ENV: 'production',
          TRANSFORMERS_WEB_ONLY: 'true'
        },
        browser: true,
        versions: { node: undefined }
      };

      // Import transformers
      const transformers = await import('@xenova/transformers');
      
      // Restore original process if it existed
      if (originalProcess) {
        (globalThis as any).process = originalProcess;
      }

      return transformers;
    } catch (error) {
      console.error('Failed to load Transformers.js:', error);
      throw error;
    }
  }

  /**
   * Generate personalized liberation plan with real AI analysis
   */
  async generateLiberationPlan(context: LiberationContext): Promise<LiberationPlan> {
    await this.initialize();
    
    // Show real processing time
    console.log('🧠 Analyzing your liberation context with AI...');
    
    const assessment = await this.generateRealAIAssessment(context);
    const phases = await this.createIntelligentLiberationPhases(context);
    const timeline = this.determineTimeline(context);
    
    return {
      assessment,
      timeline,
      phases,
      contingencies: await this.generateIntelligentContingencies(context),
      resources: await this.generatePersonalizedResources(context)
    };
  }

  /**
   * Generate assessment using real AI models
   */
  private async generateRealAIAssessment(context: LiberationContext): Promise<string> {
    const sentimentAnalyzer = this.models.get('sentiment-analysis');
    const classifier = this.models.get('zero-shot-classification');
    
    if (!sentimentAnalyzer || !classifier) {
      throw new Error('AI models not loaded');
    }

    // Analyze emotional state from context
    const situationText = `I have ${context.runwayMonths} months of financial runway, earning $${context.realHourlyWage} per hour effectively. My cognitive debt is at ${context.cognitiveDebtPercentage}%, working in ${context.industry} with ${context.skills.join(', ')} skills. My risk tolerance is ${context.riskTolerance}.`;
    
    console.log('🔍 Analyzing emotional indicators...');
    const sentiment = await sentimentAnalyzer(situationText);
    const sentimentScore = sentiment[0];
    
    // Classify liberation readiness categories
    console.log('📊 Classifying liberation readiness...');
    const readinessLabels = [
      'ready for immediate transition',
      'needs preparation time', 
      'requires foundation building',
      'facing significant challenges'
    ];
    
    const readinessClassification = await classifier(situationText, readinessLabels);
    const topReadiness = readinessClassification.labels[0];
    const readinessConfidence = (readinessClassification.scores[0] * 100).toFixed(1);

    // Classify risk factors
    console.log('⚠️ Analyzing risk factors...');
    const riskLabels = [
      'low financial risk',
      'moderate financial risk',
      'high financial risk', 
      'severe burnout risk',
      'career transition risk'
    ];
    
    const riskClassification = await classifier(situationText, riskLabels);
    const topRisk = riskClassification.labels[0];
    const riskConfidence = (riskClassification.scores[0] * 100).toFixed(1);

    // Generate readiness assessment
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

    // AI-enhanced insights
    let aiInsights = '';
    if (sentimentScore.label === 'POSITIVE') {
      aiInsights = `Your communication patterns show positive mental readiness (${(sentimentScore.score * 100).toFixed(1)}% confidence).`;
    } else {
      aiInsights = `Your situation shows stress indicators that validate the need for change (${(sentimentScore.score * 100).toFixed(1)}% confidence).`;
    }

    return `${readinessColor} Liberation Readiness: ${readinessLevel}

🎯 Strategic Analysis:
• ${context.runwayMonths} months of financial runway gives you ${context.runwayMonths >= 6 ? 'excellent' : context.runwayMonths >= 3 ? 'good' : 'limited'} freedom to maneuver
• Real wage of $${context.realHourlyWage}/hour reveals your true compensation reality
• Cognitive debt at ${context.cognitiveDebtPercentage}% indicates ${cognitiveStatus}
• Your ${context.skills.join(' + ')} skills in ${context.industry} provide liberation opportunities
• ${context.riskTolerance} risk tolerance shapes your transition strategy

🤖 AI Analysis:
• Emotional State: ${aiInsights}
• Liberation Readiness: ${topReadiness} (${readinessConfidence}% confidence)
• Primary Risk Factor: ${topRisk} (${riskConfidence}% confidence)
• AI Recommendation: ${this.generateAIRecommendation(context, sentimentScore, topReadiness, topRisk)}`;
  }

  /**
   * Generate AI-powered recommendations
   */
  private generateAIRecommendation(context: LiberationContext, sentiment: any, readiness: string, risk: string): string {
    if (readiness.includes('immediate') && sentiment.label === 'POSITIVE' && context.runwayMonths >= 6) {
      return 'Strong indicators for bold liberation moves - consider accelerated timeline';
    } else if (risk.includes('severe burnout') || context.cognitiveDebtPercentage >= 80) {
      return 'Prioritize immediate mental health intervention before transition planning';
    } else if (readiness.includes('preparation') && context.runwayMonths < 3) {
      return 'Focus on runway extension and skill validation before major moves';
    } else if (risk.includes('high financial') && context.riskTolerance === 'low') {
      return 'Conservative approach recommended - build stronger foundation first';
    } else {
      return 'Balanced approach - proceed with careful planning and milestone validation';
    }
  }

  /**
   * Create AI-enhanced liberation phases
   */
  private async createIntelligentLiberationPhases(context: LiberationContext): Promise<LiberationPhase[]> {
    const classifier = this.models.get('zero-shot-classification');
    const phases: LiberationPhase[] = [];

    // Classify user's primary skills for targeted actions
    const skillCategories = [
      'technical and programming skills',
      'creative and design skills', 
      'writing and communication skills',
      'business and management skills',
      'specialized domain expertise'
    ];
    
    const skillsText = `My skills include: ${context.skills.join(', ')}`;
    const skillClassification = await classifier(skillsText, skillCategories);
    const primarySkillCategory = skillClassification.labels[0];

    // Phase 1: Recovery & Foundation
    const phase1Actions = [
      'Complete digital detox to reduce cognitive debt',
      'Conduct comprehensive skills inventory and market research',
      'Establish healthy daily routines and boundaries',
    ];

    // Add AI-recommended actions based on skill category
    if (primarySkillCategory.includes('technical')) {
      phase1Actions.push('Audit GitHub profile and technical portfolio');
      phase1Actions.push('Research current freelance rates for your tech stack');
    } else if (primarySkillCategory.includes('creative')) {
      phase1Actions.push('Curate best creative work into portfolio');
      phase1Actions.push('Research design freelance and creator economy opportunities');
    } else if (primarySkillCategory.includes('writing')) {
      phase1Actions.push('Analyze successful newsletters in your domain');
      phase1Actions.push('Research content monetization strategies');
    }

    if (context.cognitiveDebtPercentage >= 70) {
      phase1Actions.unshift('PRIORITY: Seek professional mental health support');
    }

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

    // Phase 2: Building Platform (if runway allows)
    if (context.runwayMonths >= 3) {
      const phase2Actions = ['Launch first small bet (consulting/freelancing)'];
      
      // AI-enhanced actions based on skill classification
      if (primarySkillCategory.includes('technical')) {
        phase2Actions.push('Build and ship an open source project');
        phase2Actions.push('Start technical blog or newsletter');
        phase2Actions.push('Join developer communities and contribute value');
      } else if (primarySkillCategory.includes('creative')) {
        phase2Actions.push('Create stunning portfolio website');
        phase2Actions.push('Complete 3 small design projects');
        phase2Actions.push('Build design community presence');
      } else if (primarySkillCategory.includes('writing')) {
        phase2Actions.push('Launch weekly newsletter in your expertise area');
        phase2Actions.push('Pitch articles to 5+ publications');
        phase2Actions.push('Build email list of 100+ engaged readers');
      }
      
      phase2Actions.push('Build professional network outside corporate system');
      phase2Actions.push('Test market demand with small projects');
      
      phases.push({
        name: 'Building Your Platform',
        duration: '60 days',
        actions: phase2Actions,
        milestones: [
          'Generate first $1000 in independent income',
          'Build network of 50+ sovereign professionals',
          'Complete professional portfolio/website',
          'Validate 1-2 sustainable income streams'
        ]
      });
    }

    // Phase 3: Full Liberation (if substantial runway)
    if (context.runwayMonths >= 6) {
      phases.push({
        name: 'Full Liberation',
        duration: '90+ days',
        actions: [
          'Scale independent income to replace 75% of salary',
          'Join or create sovereign professional collective',
          'Mentor others in liberation process',
          'Build systems for location/time independence',
          'Focus on mission-driven projects and values alignment'
        ],
        milestones: [
          'Achieve sustainable salary replacement',
          'Join liberation community',
          'Help 3+ others start their escape journey',
          'Build location-independent sovereign practice',
          'Establish long-term mission-driven focus'
        ]
      });
    }

    return phases;
  }

  /**
   * Generate AI-enhanced contingency plans
   */
  private async generateIntelligentContingencies(context: LiberationContext): Promise<string[]> {
    const classifier = this.models.get('zero-shot-classification');
    
    // Classify primary vulnerabilities
    const vulnerabilityText = `${context.runwayMonths} months runway, $${context.realHourlyWage}/hour, ${context.cognitiveDebtPercentage}% burnout, ${context.riskTolerance} risk tolerance`;
    const vulnerabilityLabels = [
      'financial runway vulnerability',
      'market dependency risk',
      'health and burnout risk',
      'skill obsolescence risk',
      'network isolation risk'
    ];
    
    const vulnClassification = await classifier(vulnerabilityText, vulnerabilityLabels);
    const primaryVuln = vulnClassification.labels[0];

    const contingencies = [
      'If market conditions worsen: extend runway by reducing expenses 20-30%',
      'If first income stream fails: pivot to pre-validated alternative within 30 days',
      'If cognitive debt increases: prioritize mental health over timeline'
    ];

    // Add AI-recommended contingencies based on primary vulnerability
    if (primaryVuln.includes('financial')) {
      contingencies.push('If runway depletes faster than expected: activate emergency freelance network');
    } else if (primaryVuln.includes('health')) {
      contingencies.push('If burnout worsens: immediately implement 2-week recovery protocol');
    } else if (primaryVuln.includes('market')) {
      contingencies.push('If primary market contracts: leverage transferable skills in adjacent markets');
    }

    if (context.runwayMonths < 6) {
      contingencies.push('If runway runs critically low: consider strategic return to employment while maintaining liberation mindset');
    }

    return contingencies;
  }

  /**
   * Generate AI-personalized resources
   */
  private async generatePersonalizedResources(context: LiberationContext): Promise<string[]> {
    const classifier = this.models.get('zero-shot-classification');
    
    // Classify learning style preferences based on skills and industry
    const profileText = `${context.industry} professional with ${context.skills.join(', ')} skills, ${context.riskTolerance} risk tolerance`;
    const learningLabels = [
      'community-driven learning',
      'self-directed research',
      'hands-on experimentation',
      'structured course learning',
      'mentor-guided development'
    ];
    
    const learningClassification = await classifier(profileText, learningLabels);
    const preferredLearning = learningClassification.labels[0];

    const resources = [
      'The Greenfield Override diagnostic tools',
      'Local sovereign professional meetups',
      'Online communities for corporate refugees',
      'Mental health resources for burnout recovery'
    ];

    // Add AI-recommended resources based on learning preference
    if (preferredLearning.includes('community')) {
      resources.push('Sovereign professional Slack/Discord communities');
      resources.push('Local liberation-focused meetup groups');
    } else if (preferredLearning.includes('structured')) {
      resources.push('Comprehensive liberation planning courses');
      resources.push('Financial independence certification programs');
    } else if (preferredLearning.includes('hands-on')) {
      resources.push('Liberation challenge groups (30-day experiments)');
      resources.push('Small bets experimentation frameworks');
    }

    // Add skill-specific resources
    const skillsLower = context.skills.map(s => s.toLowerCase());
    
    if (skillsLower.some(s => s.includes('programming') || s.includes('development'))) {
      resources.push('Premium freelance platforms (Toptal, Gun.io)');
      resources.push('Technical community building (DevTo, Hashnode)');
    }

    if (skillsLower.some(s => s.includes('writing') || s.includes('content'))) {
      resources.push('Newsletter platforms (Substack, ConvertKit, Beehiiv)');
      resources.push('Writing community resources (Write of Passage)');
    }

    return resources;
  }

  /**
   * Determine timeline with AI insights
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
   * Get model loading status
   */
  getStatus(): AIStatus {
    return {
      initialized: this.isInitialized,
      modelsLoaded: Array.from(this.models.keys()),
      mode: this.isInitialized ? 'real-ai' : 'loading'
    };
  }
}

// Singleton instance for the app
export const sovereignAI = new SovereignAI();