/**
 * Progressive AI Engine - Smart fallback with real AI when possible
 * This version attempts to load real AI models but gracefully falls back to templates
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
  mode?: 'ai-enhanced' | 'smart-templates';
}

export class SovereignAI {
  private models: Map<string, any> = new Map();
  private isInitialized = false;
  private useRealAI = false;
  private mode: 'ai-enhanced' | 'smart-templates' = 'smart-templates';

  constructor() {
    console.log('🤖 Sovereign AI (Progressive) initializing - Your liberation begins...');
  }

  /**
   * Initialize the AI engine - tries real models first, falls back to templates
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📦 Loading liberation planning system...');
      
      // Check if we can potentially use real AI
      const canTryRealAI = typeof window !== 'undefined' && 
                           'WebAssembly' in window &&
                           typeof document !== 'undefined' &&
                           !process.env.NODE_ENV?.includes('test');
      
      if (canTryRealAI) {
        console.log('🧠 Attempting to load AI models...');
        try {
          await this.loadRealModels();
          this.useRealAI = true;
          this.mode = 'ai-enhanced';
          console.log('✅ AI models loaded successfully - Enhanced mode activated');
        } catch (error) {
          console.warn('AI models failed to load, using smart templates:', error);
          this.useRealAI = false;
          this.mode = 'smart-templates';
        }
      } else {
        console.log('📋 Using smart template-based planning');
        this.useRealAI = false;
        this.mode = 'smart-templates';
      }
      
      // Simulate realistic loading time for consistency
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.isInitialized = true;
      console.log(`✅ Sovereign AI ready in ${this.mode} mode!`);
    } catch (error) {
      console.warn('AI initialization failed, falling back to template mode:', error);
      this.useRealAI = false;
      this.mode = 'smart-templates';
      this.isInitialized = true;
    }
  }

  /**
   * Attempt to load real AI models with dynamic import
   */
  private async loadRealModels(): Promise<void> {
    try {
      // Dynamic import to avoid bundling issues
      const transformersModule = await this.dynamicImportTransformers();
      
      if (!transformersModule) {
        throw new Error('Transformers.js not available');
      }
      
      const { pipeline, env } = transformersModule;
      
      // Configure for web-only usage
      env.allowRemoteModels = true;
      env.allowLocalModels = false;
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.simd = true;
      
      // Load a lightweight sentiment analysis model for cognitive debt assessment
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
      console.log('✅ AI models loaded successfully');
    } catch (error) {
      console.warn('Failed to load AI models:', error);
      throw error;
    }
  }

  /**
   * Safely attempt to import transformers with fallback
   */
  private async dynamicImportTransformers(): Promise<any> {
    try {
      // Try to import transformers
      const module = await import('@xenova/transformers');
      return module;
    } catch (error) {
      console.warn('Transformers.js not available:', error);
      return null;
    }
  }

  /**
   * Generate personalized liberation plan
   */
  async generateLiberationPlan(context: LiberationContext): Promise<LiberationPlan> {
    await this.initialize();
    
    // Simulate thoughtful processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let assessment = '';
    
    if (this.useRealAI && this.models.has('sentiment-analysis')) {
      assessment = await this.generateAIEnhancedAssessment(context);
    } else {
      assessment = this.generateSmartAssessment(context);
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
      // Analyze sentiment of user's situation description
      const situationText = `I have ${context.runwayMonths} months of savings, earn $${context.realHourlyWage} per hour effectively, and my burnout level is ${context.cognitiveDebtPercentage}%. I work in ${context.industry} with skills in ${context.skills.join(', ')}.`;
      
      const sentiment = await sentimentAnalyzer(situationText);
      const sentimentScore = sentiment[0];
      
      const confidence = (sentimentScore.score * 100).toFixed(1);
      
      if (sentimentScore.label === 'POSITIVE') {
        aiInsights = `🤖 AI Analysis: Your situation shows positive readiness indicators (confidence: ${confidence}%). Language patterns suggest mental preparation for transition.`;
      } else {
        aiInsights = `🤖 AI Analysis: Your situation indicates stress patterns that strongly support liberation need (confidence: ${confidence}%). Emotional markers confirm change is necessary for wellbeing.`;
      }
      
      // Enhanced risk assessment based on AI analysis
      if (sentimentScore.score > 0.8 && sentimentScore.label === 'NEGATIVE') {
        aiInsights += '\n• AI Recommendation: High-confidence stress detection - prioritize immediate burnout intervention';
      } else if (sentimentScore.score > 0.7 && sentimentScore.label === 'POSITIVE') {
        aiInsights += '\n• AI Recommendation: Strong positive mindset detected - optimal window for bold liberation moves';
      }
      
    } catch (error) {
      console.warn('AI analysis failed:', error);
      aiInsights = '🤖 AI Analysis: Unable to perform deep sentiment analysis, using enhanced template assessment.';
    }
    
    const baseAssessment = this.generateSmartAssessment(context);
    return `${baseAssessment}\n\n${aiInsights}`;
  }

  /**
   * Generate smart template-based assessment (same as web-only version)
   */
  private generateSmartAssessment(context: LiberationContext): string {
    let readinessLevel = '';
    let readinessColor = '';
    
    if (context.runwayMonths >= 6) {
      readinessLevel = 'HIGH - You have strong financial foundation for liberation';
      readinessColor = '🟢';
    } else if (context.runwayMonths >= 3) {
      readinessLevel = 'MEDIUM - You have breathing room to plan your escape';
      readinessColor = '🟡';
    } else {
      readinessLevel = 'BUILDING - Focus on extending your runway while planning';
      readinessColor = '🟠';
    }

    const cognitiveStatus = context.cognitiveDebtPercentage >= 70 
      ? 'critical burnout requiring immediate attention'
      : context.cognitiveDebtPercentage >= 50 
        ? 'significant stress requiring intervention' 
        : 'manageable stress levels';

    const cognitiveColor = context.cognitiveDebtPercentage >= 70 ? '🔴' : 
                          context.cognitiveDebtPercentage >= 50 ? '🟠' : '🟢';

    // Add personalized insights based on context patterns
    let strategicInsights = this.generateStrategicInsights(context);
    
    // Smart risk/opportunity analysis
    let riskOpportunityAnalysis = this.analyzeRiskOpportunity(context);

    return `${readinessColor} Liberation Readiness: ${readinessLevel}

🎯 Strategic Analysis:
• ${context.runwayMonths} months of financial runway gives you ${context.runwayMonths >= 6 ? 'excellent' : context.runwayMonths >= 3 ? 'good' : 'limited'} freedom to maneuver
• Real wage of $${context.realHourlyWage}/hour reveals your true compensation reality
• ${cognitiveColor} Cognitive debt at ${context.cognitiveDebtPercentage}% indicates ${cognitiveStatus}
• Your ${context.skills.join(' + ')} skills in ${context.industry} provide liberation opportunities
• ${context.riskTolerance} risk tolerance shapes your transition strategy

${strategicInsights}

${riskOpportunityAnalysis}`;
  }

  /**
   * Generate strategic insights based on context patterns
   */
  private generateStrategicInsights(context: LiberationContext): string {
    let insights = '💡 Strategic Insights:\n';
    
    // Runway vs Risk Tolerance Analysis
    if (context.riskTolerance === 'high' && context.runwayMonths >= 6) {
      insights += '• Perfect storm for bold moves: High risk tolerance + solid runway = maximum liberation potential\n';
    } else if (context.riskTolerance === 'low' && context.runwayMonths < 3) {
      insights += '• Conservative foundation building required: Low risk tolerance + limited runway suggests extending preparation phase\n';
    } else if (context.riskTolerance === 'high' && context.runwayMonths < 3) {
      insights += '• Risk-reward mismatch: Your appetite for risk exceeds your financial cushion - consider hybrid approach\n';
    }

    // Cognitive Debt Analysis
    if (context.cognitiveDebtPercentage >= 80) {
      insights += '• URGENT: Extreme burnout detected - prioritize immediate mental health intervention over timeline\n';
    } else if (context.cognitiveDebtPercentage >= 70 && context.runwayMonths >= 6) {
      insights += '• Liberation window open: High burnout + solid runway = ideal time for extended recovery sabbatical\n';
    }

    // Skills-Industry Match Analysis
    const skillsLower = context.skills.map(s => s.toLowerCase());
    const industryLower = context.industry.toLowerCase();
    
    if (industryLower.includes('tech') && skillsLower.some(s => s.includes('programming'))) {
      insights += '• High-value skills detected: Tech + programming = strong freelance/consulting opportunities\n';
    } else if (skillsLower.some(s => s.includes('writing') || s.includes('content'))) {
      insights += '• Creator economy potential: Writing skills enable newsletter/content monetization paths\n';
    }

    // Wage Analysis
    if (context.realHourlyWage < 20) {
      insights += '• Value extraction detected: Real wage below market suggests significant corporate markup on your labor\n';
    } else if (context.realHourlyWage > 50) {
      insights += '• High-value position: Your real wage suggests premium skills that translate well to independent work\n';
    }

    return insights;
  }

  /**
   * Analyze risk/opportunity balance
   */
  private analyzeRiskOpportunity(context: LiberationContext): string {
    let analysis = '⚖️ Risk/Opportunity Analysis:\n';
    
    // Calculate liberation score
    let score = 0;
    score += Math.min(context.runwayMonths * 10, 60); // Max 60 points for runway
    score += context.realHourlyWage > 30 ? 20 : context.realHourlyWage > 15 ? 10 : 0; // Wage factor
    score -= context.cognitiveDebtPercentage >= 70 ? 20 : context.cognitiveDebtPercentage >= 50 ? 10 : 0; // Burnout penalty
    score += context.riskTolerance === 'high' ? 10 : context.riskTolerance === 'medium' ? 5 : 0;
    score += context.skills.length * 5; // Skills bonus

    if (score >= 80) {
      analysis += '• Liberation Score: 🟢 OPTIMAL (80+) - All systems go for immediate transition planning\n';
    } else if (score >= 60) {
      analysis += '• Liberation Score: 🟡 GOOD (60-79) - Strong position with some areas to strengthen\n';
    } else if (score >= 40) {
      analysis += '• Liberation Score: 🟠 DEVELOPING (40-59) - Foundation building phase recommended\n';
    } else {
      analysis += '• Liberation Score: 🔴 PREPARATION (under 40) - Focus on runway extension and skill development\n';
    }

    // Opportunity windows
    if (context.runwayMonths >= 6 && context.cognitiveDebtPercentage >= 60) {
      analysis += '• WINDOW OPEN: Perfect conditions for strategic sabbatical - act within next 90 days\n';
    }

    return analysis;
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
   * Create liberation phases based on user context (same as web-only version)
   */
  private createLiberationPhases(context: LiberationContext): LiberationPhase[] {
    const phases: LiberationPhase[] = [];

    // Phase 1: Recovery and Foundation
    const phase1Actions = [
      'Complete digital detox to reduce cognitive debt',
      'Conduct comprehensive skills inventory and market research',
      'Establish healthy daily routines and boundaries',
    ];

    if (context.cognitiveDebtPercentage >= 70) {
      phase1Actions.unshift('PRIORITY: Seek professional mental health support');
      phase1Actions.push('Implement stress reduction techniques (meditation, exercise)');
    }

    phase1Actions.push(...this.getPhase1IndustryActions(context));

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
      const phase2Actions = this.getIndustrySpecificActions(context.industry, context.skills);
      
      phases.push({
        name: 'Building Your Platform',
        duration: '60 days',
        actions: [
          ...phase2Actions,
          'Build professional network outside corporate system',
          'Create portfolio showcasing your best work',
          'Test market demand with small projects',
          'Develop multiple income stream prototypes'
        ],
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
   * Get Phase 1 industry-specific actions
   */
  private getPhase1IndustryActions(context: LiberationContext): string[] {
    const actions = [];
    const industryLower = context.industry.toLowerCase();
    const skillsLower = context.skills.map(s => s.toLowerCase());
    
    if (industryLower.includes('tech') || skillsLower.some(s => s.includes('programming'))) {
      actions.push('Research current freelance rates for your tech stack');
      actions.push('Audit and update your GitHub/portfolio');
    } else if (skillsLower.some(s => s.includes('writing'))) {
      actions.push('Research content monetization opportunities');
      actions.push('Analyze successful newsletters in your niche');
    } else if (skillsLower.some(s => s.includes('design'))) {
      actions.push('Research design freelance market rates');
      actions.push('Curate your best work into a portfolio');
    } else {
      actions.push('Research consulting opportunities in your industry');
      actions.push('Document your unique value proposition');
    }
    
    return actions;
  }

  /**
   * Get industry-specific platform building actions
   */
  private getIndustrySpecificActions(industry: string, skills: string[]): string[] {
    const actions = ['Launch first small bet (consulting/freelancing)'];
    
    const industryLower = industry.toLowerCase();
    const skillsLower = skills.map(s => s.toLowerCase());
    
    if (industryLower.includes('tech') || skillsLower.some(s => s.includes('programming') || s.includes('development'))) {
      actions.push('Build and ship an open source project');
      actions.push('Start technical blog or newsletter');
      actions.push('Join developer communities and contribute value');
    } else if (skillsLower.some(s => s.includes('writing') || s.includes('content'))) {
      actions.push('Launch weekly newsletter in your expertise area');
      actions.push('Pitch articles to 5+ publications');
      actions.push('Build email list of 100+ engaged readers');
    } else if (skillsLower.some(s => s.includes('design'))) {
      actions.push('Create stunning portfolio website');
      actions.push('Complete 3 small design projects');
      actions.push('Build design community presence');
    } else if (industryLower.includes('finance') || industryLower.includes('consulting')) {
      actions.push('Develop proprietary methodology or framework');
      actions.push('Create valuable industry content');
      actions.push('Build thought leadership presence');
    } else {
      actions.push('Identify and articulate your unique value proposition');
      actions.push('Create professional service offering');
      actions.push('Build industry-specific thought leadership');
    }
    
    return actions;
  }

  /**
   * Generate context-aware contingency plans
   */
  private generateContingencies(context: LiberationContext): string[] {
    const contingencies = [
      'If market conditions worsen: extend runway by reducing expenses 20-30%',
      'If first income stream fails: pivot to pre-validated alternative within 30 days',
      'If cognitive debt increases: prioritize mental health over timeline'
    ];

    if (context.runwayMonths < 6) {
      contingencies.push('If runway runs critically low: consider strategic return to employment while maintaining liberation mindset');
    }

    if (context.riskTolerance === 'low') {
      contingencies.push('Maintain conservative approach: ensure 6-month emergency fund before full transition');
    }

    if (context.cognitiveDebtPercentage >= 70) {
      contingencies.push('If burnout worsens: immediately prioritize rest and professional mental health support');
    }

    if (context.realHourlyWage < 20) {
      contingencies.push('If income replacement struggles: focus on high-value skill development first');
    }

    // Industry-specific contingencies
    const industryLower = context.industry.toLowerCase();
    if (industryLower.includes('tech')) {
      contingencies.push('If tech market contracts: leverage technical skills in non-tech industries');
    }

    return contingencies;
  }

  /**
   * Generate personalized resources based on context
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
      resources.push('Premium freelance platforms (Toptal, Gun.io, Freelancermap)');
      resources.push('Open source contribution opportunities');
      resources.push('Technical community building (DevTo, Hashnode)');
    }

    if (skillsLower.some(s => s.includes('writing') || s.includes('content'))) {
      resources.push('Newsletter platforms (Substack, ConvertKit, Beehiiv)');
      resources.push('Freelance writing markets (Contently, ClearVoice)');
      resources.push('Writing community resources (Write of Passage, Ship 30 for 30)');
    }

    if (skillsLower.some(s => s.includes('design'))) {
      resources.push('Design freelance platforms (99designs, Dribbble Pro)');
      resources.push('Creative funding (Patreon, Gumroad)');
      resources.push('Design community building (Designer Hangout, Dribbble)');
    }

    // Industry-specific resources
    const industryLower = context.industry.toLowerCase();
    if (industryLower.includes('finance')) {
      resources.push('Financial independence communities (FIRE, Bogleheads)');
      resources.push('Investment education resources');
    }

    if (context.runwayMonths >= 6) {
      resources.push('Sabbatical planning guides and communities');
      resources.push('Location independence resources (Nomad List, Remote Year)');
    }

    return resources;
  }

  /**
   * Get model loading status
   */
  getStatus(): AIStatus {
    const modelNames = this.useRealAI 
      ? Array.from(this.models.keys()).concat(['smart-templates-v3'])
      : ['smart-templates-v3'];
      
    return {
      initialized: this.isInitialized,
      modelsLoaded: modelNames,
      mode: this.mode
    };
  }
}

// Singleton instance for the app
export const sovereignAI = new SovereignAI();