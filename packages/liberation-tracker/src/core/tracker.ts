/**
 * Liberation Tracker - Progress monitoring for your journey to freedom
 * Tracks financial, cognitive, and career liberation metrics over time
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

export interface LiberationMetrics {
  timestamp: string;
  financial: {
    runwayMonths: number;
    realHourlyWage: number;
    savings: number;
    monthlyExpenses: number;
    debtToIncomeRatio?: number;
  };
  cognitive: {
    overallScore: number;
    mentalFog: number;
    emotionalExhaustion: number;
    creativeShutdown: number;
    relationshipDecay: number;
    physicalSymptoms: number;
    identityErosion: number;
  };
  career: {
    jobSatisfaction: number; // 1-10
    workLifeBalance: number; // 1-10
    skillsDevelopment: number; // 1-10
    networkStrength: number; // 1-10
    marketValue: number; // 1-10
  };
  liberation: {
    overallProgress: number; // 0-100
    phase: 'trapped' | 'awakening' | 'planning' | 'transitioning' | 'free' | 'optimizing';
    autonomyLevel: number; // 1-10
    purposeAlignment: number; // 1-10
  };
}

export interface LiberationGoal {
  id: string;
  category: 'financial' | 'cognitive' | 'career' | 'lifestyle' | 'skills';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  milestones: Array<{
    id: string;
    description: string;
    targetValue: number;
    completed: boolean;
    completedDate?: string;
  }>;
  insights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LiberationJourney {
  startDate: string;
  currentPhase: 'trapped' | 'awakening' | 'planning' | 'transitioning' | 'free' | 'optimizing';
  metrics: LiberationMetrics[];
  goals: LiberationGoal[];
  insights: Array<{
    date: string;
    type: 'achievement' | 'setback' | 'insight' | 'milestone';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  totalLiberationScore: number;
  daysInJourney: number;
}

export class LiberationTracker {
  private journey: LiberationJourney;
  
  constructor(existingJourney?: LiberationJourney) {
    this.journey = existingJourney || this.initializeJourney();
  }
  
  private initializeJourney(): LiberationJourney {
    return {
      startDate: new Date().toISOString(),
      currentPhase: 'trapped',
      metrics: [],
      goals: [],
      insights: [],
      totalLiberationScore: 0,
      daysInJourney: 0
    };
  }
  
  addMetrics(metrics: Omit<LiberationMetrics, 'timestamp'>): LiberationMetrics {
    const timestampedMetrics: LiberationMetrics = {
      timestamp: new Date().toISOString(),
      ...metrics
    };
    
    this.journey.metrics.push(timestampedMetrics);
    this.updateJourneyStats();
    this.detectPhaseTransition();
    this.generateInsights(timestampedMetrics);
    
    return timestampedMetrics;
  }
  
  createGoal(goalData: Omit<LiberationGoal, 'id' | 'createdAt' | 'updatedAt'>): LiberationGoal {
    const goal: LiberationGoal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...goalData
    };
    
    this.journey.goals.push(goal);
    return goal;
  }
  
  updateGoalProgress(goalId: string, newValue: number, notes?: string): boolean {
    const goal = this.journey.goals.find(g => g.id === goalId);
    if (!goal) return false;
    
    const oldValue = goal.currentValue;
    goal.currentValue = newValue;
    goal.updatedAt = new Date().toISOString();
    
    // Check for milestone completion
    goal.milestones.forEach(milestone => {
      if (!milestone.completed && newValue >= milestone.targetValue) {
        milestone.completed = true;
        milestone.completedDate = new Date().toISOString();
        
        this.journey.insights.push({
          date: new Date().toISOString(),
          type: 'milestone',
          title: `Milestone achieved: ${milestone.description}`,
          description: `Reached ${milestone.targetValue} ${goal.unit} in ${goal.title}`,
          impact: 'medium'
        });
      }
    });
    
    // Check for goal completion
    if (goal.status !== 'completed' && newValue >= goal.targetValue) {
      goal.status = 'completed';
      this.journey.insights.push({
        date: new Date().toISOString(),
        type: 'achievement',
        title: `Goal completed: ${goal.title}`,
        description: `Successfully achieved ${goal.targetValue} ${goal.unit}`,
        impact: 'high'
      });
    }
    
    // Generate progress insight
    if (notes) {
      this.journey.insights.push({
        date: new Date().toISOString(),
        type: 'insight',
        title: `Progress update: ${goal.title}`,
        description: notes,
        impact: 'low'
      });
    }
    
    return true;
  }
  
  getProgressSummary(): {
    overall: number;
    financial: number;
    cognitive: number;
    career: number;
    recentTrends: Array<{
      metric: string;
      trend: 'improving' | 'declining' | 'stable';
      change: number;
    }>;
  } {
    if (this.journey.metrics.length === 0) {
      return {
        overall: 0,
        financial: 0,
        cognitive: 0,
        career: 0,
        recentTrends: []
      };
    }
    
    const latest = this.journey.metrics[this.journey.metrics.length - 1];
    const previous = this.journey.metrics.length > 1 
      ? this.journey.metrics[this.journey.metrics.length - 2]
      : null;
    
    // Calculate domain scores (0-100)
    const financial = this.calculateFinancialScore(latest.financial);
    const cognitive = 100 - latest.cognitive.overallScore; // Invert cognitive debt
    const career = this.calculateCareerScore(latest.career);
    const overall = (financial + cognitive + career) / 3;
    
    const recentTrends = previous ? this.calculateTrends(previous, latest) : [];
    
    return {
      overall,
      financial,
      cognitive,
      career,
      recentTrends
    };
  }
  
  private calculateFinancialScore(financial: LiberationMetrics['financial']): number {
    let score = 0;
    
    // Runway score (0-40 points)
    if (financial.runwayMonths >= 18) score += 40;
    else if (financial.runwayMonths >= 12) score += 30;
    else if (financial.runwayMonths >= 6) score += 20;
    else if (financial.runwayMonths >= 3) score += 10;
    
    // Real wage score (0-30 points)
    if (financial.realHourlyWage >= 30) score += 30;
    else if (financial.realHourlyWage >= 20) score += 20;
    else if (financial.realHourlyWage >= 15) score += 15;
    else if (financial.realHourlyWage >= 10) score += 10;
    
    // Savings growth (0-30 points)
    const savingsRatio = financial.savings / (financial.monthlyExpenses * 12);
    if (savingsRatio >= 2) score += 30;
    else if (savingsRatio >= 1.5) score += 20;
    else if (savingsRatio >= 1) score += 15;
    else if (savingsRatio >= 0.5) score += 10;
    
    return Math.min(100, score);
  }
  
  private calculateCareerScore(career: LiberationMetrics['career']): number {
    return (
      career.jobSatisfaction +
      career.workLifeBalance +
      career.skillsDevelopment +
      career.networkStrength +
      career.marketValue
    ) * 2; // Convert from 50 max to 100 max
  }
  
  private calculateTrends(previous: LiberationMetrics, current: LiberationMetrics) {
    const trends: Array<{
      metric: string;
      trend: 'improving' | 'declining' | 'stable';
      change: number;
    }> = [];
    
    // Financial trends
    const runwayChange = current.financial.runwayMonths - previous.financial.runwayMonths;
    trends.push({
      metric: 'Financial Runway',
      trend: runwayChange > 0.5 ? 'improving' : runwayChange < -0.5 ? 'declining' : 'stable',
      change: runwayChange
    });
    
    const wageChange = current.financial.realHourlyWage - previous.financial.realHourlyWage;
    trends.push({
      metric: 'Real Hourly Wage',
      trend: wageChange > 1 ? 'improving' : wageChange < -1 ? 'declining' : 'stable',
      change: wageChange
    });
    
    // Cognitive trends (note: lower is better for cognitive debt)
    const cognitiveChange = previous.cognitive.overallScore - current.cognitive.overallScore;
    trends.push({
      metric: 'Cognitive Health',
      trend: cognitiveChange > 5 ? 'improving' : cognitiveChange < -5 ? 'declining' : 'stable',
      change: cognitiveChange
    });
    
    // Career trends
    const careerChange = (
      (current.career.jobSatisfaction - previous.career.jobSatisfaction) +
      (current.career.workLifeBalance - previous.career.workLifeBalance) +
      (current.career.skillsDevelopment - previous.career.skillsDevelopment)
    ) / 3;
    
    trends.push({
      metric: 'Career Satisfaction',
      trend: careerChange > 0.5 ? 'improving' : careerChange < -0.5 ? 'declining' : 'stable',
      change: careerChange
    });
    
    return trends;
  }
  
  private updateJourneyStats(): void {
    const startDate = new Date(this.journey.startDate);
    const now = new Date();
    this.journey.daysInJourney = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const summary = this.getProgressSummary();
    this.journey.totalLiberationScore = summary.overall;
  }
  
  private detectPhaseTransition(): void {
    const summary = this.getProgressSummary();
    const newPhase = this.determinePhase(summary);
    
    if (newPhase !== this.journey.currentPhase) {
      this.journey.insights.push({
        date: new Date().toISOString(),
        type: 'milestone',
        title: `Phase transition: ${this.journey.currentPhase} → ${newPhase}`,
        description: `Your liberation journey has progressed to the ${newPhase} phase`,
        impact: 'high'
      });
      
      this.journey.currentPhase = newPhase;
    }
  }
  
  private determinePhase(summary: any): 'trapped' | 'awakening' | 'planning' | 'transitioning' | 'free' | 'optimizing' {
    if (summary.overall >= 85) return 'optimizing';
    if (summary.overall >= 70) return 'free';
    if (summary.overall >= 50) return 'transitioning';
    if (summary.overall >= 30) return 'planning';
    if (summary.overall >= 15) return 'awakening';
    return 'trapped';
  }
  
  private generateInsights(metrics: LiberationMetrics): void {
    // Financial insights
    if (metrics.financial.runwayMonths >= 12 && !this.hasRecentInsight('runway_milestone')) {
      this.journey.insights.push({
        date: new Date().toISOString(),
        type: 'achievement',
        title: 'Financial security milestone reached',
        description: `You now have ${metrics.financial.runwayMonths.toFixed(1)} months of runway - excellent position for strategic moves`,
        impact: 'high'
      });
    }
    
    // Cognitive health insights
    if (metrics.cognitive.overallScore <= 25 && !this.hasRecentInsight('cognitive_improvement')) {
      this.journey.insights.push({
        date: new Date().toISOString(),
        type: 'achievement',
        title: 'Cognitive health improvement',
        description: 'Your cognitive debt levels have reached healthy ranges - your mind is clearing',
        impact: 'medium'
      });
    }
    
    // Career progression insights
    const careerAvg = (
      metrics.career.jobSatisfaction +
      metrics.career.workLifeBalance +
      metrics.career.skillsDevelopment +
      metrics.career.networkStrength +
      metrics.career.marketValue
    ) / 5;
    
    if (careerAvg >= 8 && !this.hasRecentInsight('career_excellence')) {
      this.journey.insights.push({
        date: new Date().toISOString(),
        type: 'achievement',
        title: 'Career excellence achieved',
        description: 'Your career metrics are consistently strong across all dimensions',
        impact: 'high'
      });
    }
  }
  
  private hasRecentInsight(type: string): boolean {
    const recent = this.journey.insights.filter(insight => {
      const insightDate = new Date(insight.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return insightDate > monthAgo && insight.title.toLowerCase().includes(type.replace('_', ' '));
    });
    
    return recent.length > 0;
  }
  
  getJourney(): LiberationJourney {
    return { ...this.journey };
  }
  
  exportData(): string {
    return JSON.stringify(this.journey, null, 2);
  }
  
  importData(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      // Validate structure here...
      this.journey = imported;
      return true;
    } catch (error) {
      return false;
    }
  }
}