/**
 * Small Bets Portfolio Engine
 * Core logic for managing income stream portfolios
 */

import { SmallBet, SmallBetsPortfolio, CoreValue } from '@greenfieldoverride/types';

export interface BetAnalysis {
  profitability: {
    roi: number; // Return on investment %
    hourlyReturn: number; // $ per hour
    paybackPeriod: number; // months to recover investment
    profitMargin: number; // %
  };
  growth: {
    revenueGrowthRate: number; // % per month
    scalabilityScore: number; // 1-10
    timeCommitmentTrend: 'increasing' | 'stable' | 'decreasing';
  };
  risk: {
    riskScore: number; // 1-10 (1 = low risk)
    diversificationBenefit: number; // How much this bet helps portfolio diversity
    marketDependency: 'low' | 'medium' | 'high';
  };
  alignment: {
    valuesAlignment: number; // 1-10
    satisfactionTrend: 'improving' | 'stable' | 'declining';
    burnoutRisk: number; // 1-10 (1 = low risk)
  };
}

export interface PortfolioInsights {
  overall: {
    monthlyIncomeReliability: number; // 1-10
    totalHoursEfficiency: number; // Revenue per hour across portfolio
    riskDiversification: number; // 1-10
    valueAlignment: number; // 1-10
  };
  recommendations: Array<{
    type: 'start' | 'scale' | 'pivot' | 'stop' | 'optimize';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    expectedImpact: string;
    timeframe: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  opportunities: Array<{
    category: SmallBet['category'];
    rationale: string;
    estimatedROI: number;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  warnings: Array<{
    type: 'concentration' | 'burnout' | 'values' | 'financial' | 'time';
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }>;
}

export class PortfolioEngine {
  /**
   * Analyze individual small bet performance
   */
  static analyzeBet(bet: SmallBet): BetAnalysis {
    // Profitability analysis
    const roi = bet.initialInvestment > 0 ? 
      (bet.totalProfit / bet.initialInvestment) * 100 : 0;
    
    const hourlyReturn = bet.totalHoursInvested > 0 ? 
      bet.totalRevenue / bet.totalHoursInvested : 0;
    
    const monthlyProfit = bet.monthlyRevenue - bet.monthlyExpenses;
    const paybackPeriod = monthlyProfit > 0 ? 
      bet.initialInvestment / monthlyProfit : Infinity;
    
    const profitMargin = bet.monthlyRevenue > 0 ? 
      ((bet.monthlyRevenue - bet.monthlyExpenses) / bet.monthlyRevenue) * 100 : 0;

    // Growth analysis
    const revenueGrowthRate = this.calculateGrowthRate(bet);
    const scalabilityScore = this.assessScalability(bet);
    const timeCommitmentTrend = this.analyzeTimeCommitment(bet);

    // Risk analysis
    const riskScore = this.calculateRiskScore(bet);
    const diversificationBenefit = this.assessDiversificationBenefit(bet);
    const marketDependency = this.assessMarketDependency(bet);

    // Alignment analysis
    const valuesAlignment = bet.alignedValues.length > 0 ? 
      (bet.alignedValues.length / 5) * 10 : 5; // Assume 5 core values max
    const satisfactionTrend = this.analyzeSatisfactionTrend(bet);
    const burnoutRisk = this.calculateBurnoutRisk(bet);

    return {
      profitability: {
        roi,
        hourlyReturn,
        paybackPeriod,
        profitMargin
      },
      growth: {
        revenueGrowthRate,
        scalabilityScore,
        timeCommitmentTrend
      },
      risk: {
        riskScore,
        diversificationBenefit,
        marketDependency
      },
      alignment: {
        valuesAlignment,
        satisfactionTrend,
        burnoutRisk
      }
    };
  }

  /**
   * Generate comprehensive portfolio insights
   */
  static generateInsights(portfolio: SmallBetsPortfolio, userValues?: CoreValue[]): PortfolioInsights {
    const { bets } = portfolio;
    const betAnalyses = bets.map(bet => ({ bet, analysis: this.analyzeBet(bet) }));

    // Overall portfolio metrics
    const totalRevenue = bets.reduce((sum, bet) => sum + bet.monthlyRevenue, 0);
    const totalHours = bets.reduce((sum, bet) => sum + bet.hoursPerWeek * 4.33, 0); // Monthly hours
    const totalHoursEfficiency = totalHours > 0 ? totalRevenue / totalHours : 0;

    const monthlyIncomeReliability = this.calculateIncomeReliability(bets);
    const riskDiversification = this.calculateRiskDiversification(bets);
    const valueAlignment = this.calculateValueAlignment(bets, userValues);

    // Generate recommendations
    const recommendations = this.generateRecommendations(betAnalyses, portfolio);
    const opportunities = this.identifyOpportunities(betAnalyses, portfolio);
    const warnings = this.identifyWarnings(betAnalyses, portfolio);

    return {
      overall: {
        monthlyIncomeReliability,
        totalHoursEfficiency,
        riskDiversification,
        valueAlignment
      },
      recommendations,
      opportunities,
      warnings
    };
  }

  /**
   * Suggest optimal portfolio allocation
   */
  static suggestAllocation(
    currentPortfolio: SmallBetsPortfolio,
    targetMonthlyIncome: number,
    riskTolerance: 'low' | 'medium' | 'high',
    availableHours: number
  ): Array<{
    action: 'increase' | 'decrease' | 'maintain' | 'start' | 'stop';
    betId?: string;
    category?: SmallBet['category'];
    hoursChange: number;
    expectedIncomeChange: number;
    rationale: string;
  }> {
    // Implementation would analyze current performance and suggest changes
    return [];
  }

  // Private helper methods
  private static calculateGrowthRate(bet: SmallBet): number {
    // Simplified - would use historical data in real implementation
    const baseGrowth = bet.status === 'successful' ? 5 : 
                     bet.status === 'active' ? 2 : 0;
    
    const categoryMultiplier = {
      'content': 1.2,
      'service': 0.8,
      'product': 1.5,
      'investment': 0.5,
      'skill': 1.0,
      'other': 1.0
    };
    
    return baseGrowth * (categoryMultiplier[bet.category] || 1.0);
  }

  private static assessScalability(bet: SmallBet): number {
    const categoryScalability = {
      'content': 8,
      'product': 9,
      'service': 4,
      'investment': 7,
      'skill': 6,
      'other': 5
    };
    
    let score = categoryScalability[bet.category] || 5;
    
    // Adjust based on time investment vs revenue
    const efficiency = bet.hoursPerWeek > 0 ? bet.monthlyRevenue / (bet.hoursPerWeek * 4.33) : 0;
    if (efficiency > 50) score += 1;
    if (efficiency > 100) score += 1;
    
    return Math.min(score, 10);
  }

  private static analyzeTimeCommitment(bet: SmallBet): 'increasing' | 'stable' | 'decreasing' {
    // Simplified - would analyze historical time data
    if (bet.status === 'successful' && bet.hoursPerWeek < 10) {
      return 'decreasing';
    }
    if (bet.status === 'testing' || bet.status === 'active') {
      return 'stable';
    }
    return 'stable';
  }

  private static calculateRiskScore(bet: SmallBet): number {
    let risk = 5; // Base risk
    
    // Adjust for investment amount
    if (bet.initialInvestment > 5000) risk += 2;
    else if (bet.initialInvestment > 1000) risk += 1;
    
    // Adjust for revenue stability
    if (bet.monthlyRevenue > bet.monthlyExpenses * 2) risk -= 1;
    if (bet.totalRevenue > bet.initialInvestment * 2) risk -= 1;
    
    // Adjust for category
    const categoryRisk = {
      'investment': 7,
      'product': 6,
      'service': 3,
      'content': 4,
      'skill': 2,
      'other': 5
    };
    
    risk = (risk + (categoryRisk[bet.category] || 5)) / 2;
    
    return Math.max(1, Math.min(risk, 10));
  }

  private static assessDiversificationBenefit(bet: SmallBet): number {
    // Would compare against other bets in portfolio
    return 5; // Placeholder
  }

  private static assessMarketDependency(bet: SmallBet): 'low' | 'medium' | 'high' {
    const dependencyMap: Record<SmallBet['category'], 'low' | 'medium' | 'high'> = {
      'service': 'low',
      'skill': 'low',
      'content': 'medium',
      'product': 'medium',
      'investment': 'high',
      'other': 'medium'
    };
    
    return dependencyMap[bet.category] || 'medium';
  }

  private static analyzeSatisfactionTrend(bet: SmallBet): 'improving' | 'stable' | 'declining' {
    // Would analyze historical satisfaction scores
    if (bet.satisfactionScore >= 8) return 'stable';
    if (bet.satisfactionScore >= 6) return 'stable';
    return 'declining';
  }

  private static calculateBurnoutRisk(bet: SmallBet): number {
    let risk = 5;
    
    // High hours = higher burnout risk
    if (bet.hoursPerWeek > 40) risk += 3;
    else if (bet.hoursPerWeek > 20) risk += 1;
    
    // Low satisfaction = higher burnout risk
    if (bet.satisfactionScore < 5) risk += 2;
    else if (bet.satisfactionScore < 7) risk += 1;
    
    // Values misalignment = higher burnout risk
    if (bet.alignedValues.length < 2) risk += 2;
    
    return Math.max(1, Math.min(risk, 10));
  }

  private static calculateIncomeReliability(bets: SmallBet[]): number {
    if (bets.length === 0) return 0;
    
    const reliableBets = bets.filter(bet => 
      bet.status === 'successful' || 
      (bet.status === 'active' && bet.monthlyRevenue > bet.monthlyExpenses)
    );
    
    const reliabilityRatio = reliableBets.length / bets.length;
    const incomeStability = reliableBets.reduce((avg, bet) => {
      const stability = bet.monthlyRevenue > 0 ? 
        Math.min(bet.monthlyRevenue / (bet.monthlyExpenses || 1), 5) : 0;
      return avg + stability;
    }, 0) / (reliableBets.length || 1);
    
    return Math.min((reliabilityRatio * 5 + incomeStability), 10);
  }

  private static calculateRiskDiversification(bets: SmallBet[]): number {
    if (bets.length === 0) return 0;
    
    const categories = new Set(bets.map(bet => bet.category));
    const statusTypes = new Set(bets.map(bet => bet.status));
    
    const categoryDiversity = Math.min(categories.size / 4, 1) * 5; // Max 5 points
    const statusDiversity = Math.min(statusTypes.size / 3, 1) * 3; // Max 3 points
    const numberBonus = Math.min(bets.length / 5, 1) * 2; // Max 2 points
    
    return categoryDiversity + statusDiversity + numberBonus;
  }

  private static calculateValueAlignment(bets: SmallBet[], userValues?: CoreValue[]): number {
    if (!userValues || userValues.length === 0) return 5;
    if (bets.length === 0) return 0;
    
    const totalAlignment = bets.reduce((sum, bet) => {
      const alignedCount = bet.alignedValues.filter(value => 
        userValues.includes(value)
      ).length;
      return sum + (alignedCount / userValues.length) * 10;
    }, 0);
    
    return totalAlignment / bets.length;
  }

  private static generateRecommendations(
    betAnalyses: Array<{ bet: SmallBet; analysis: BetAnalysis }>,
    portfolio: SmallBetsPortfolio
  ): PortfolioInsights['recommendations'] {
    const recommendations: PortfolioInsights['recommendations'] = [];
    
    // Identify high-performing bets to scale
    betAnalyses.forEach(({ bet, analysis }) => {
      if (analysis.profitability.roi > 100 && analysis.risk.riskScore < 5) {
        recommendations.push({
          type: 'scale',
          priority: 'high',
          title: `Scale ${bet.name}`,
          description: `This bet shows strong ROI (${analysis.profitability.roi.toFixed(1)}%) with low risk. Consider increasing time investment.`,
          expectedImpact: 'Increase monthly income by 25-50%',
          timeframe: '1-3 months',
          effort: 'medium'
        });
      }
    });
    
    // Identify underperforming bets
    betAnalyses.forEach(({ bet, analysis }) => {
      if (analysis.profitability.roi < 10 && analysis.alignment.burnoutRisk > 7) {
        recommendations.push({
          type: 'pivot',
          priority: 'medium',
          title: `Pivot or stop ${bet.name}`,
          description: `Low ROI (${analysis.profitability.roi.toFixed(1)}%) and high burnout risk. Consider changing approach or stopping.`,
          expectedImpact: 'Free up time for better opportunities',
          timeframe: '1 month',
          effort: 'low'
        });
      }
    });
    
    // Portfolio-level recommendations
    if (portfolio.bets.length < 3) {
      recommendations.push({
        type: 'start',
        priority: 'medium',
        title: 'Increase portfolio diversity',
        description: 'Your portfolio has limited diversity. Consider starting 1-2 small bets in different categories.',
        expectedImpact: 'Reduce risk and increase opportunity',
        timeframe: '2-4 months',
        effort: 'medium'
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private static identifyOpportunities(
    betAnalyses: Array<{ bet: SmallBet; analysis: BetAnalysis }>,
    portfolio: SmallBetsPortfolio
  ): PortfolioInsights['opportunities'] {
    const existingCategories = new Set(portfolio.bets.map(bet => bet.category));
    const opportunities: PortfolioInsights['opportunities'] = [];
    
    const categoryOpportunities = [
      {
        category: 'content' as const,
        rationale: 'High scalability and passive income potential',
        estimatedROI: 150,
        riskLevel: 'medium' as const
      },
      {
        category: 'service' as const,
        rationale: 'Lower risk and immediate income generation',
        estimatedROI: 80,
        riskLevel: 'low' as const
      },
      {
        category: 'product' as const,
        rationale: 'High scalability but requires upfront investment',
        estimatedROI: 200,
        riskLevel: 'high' as const
      }
    ];
    
    return categoryOpportunities.filter(opp => !existingCategories.has(opp.category));
  }

  private static identifyWarnings(
    betAnalyses: Array<{ bet: SmallBet; analysis: BetAnalysis }>,
    portfolio: SmallBetsPortfolio
  ): PortfolioInsights['warnings'] {
    const warnings: PortfolioInsights['warnings'] = [];
    
    // Check for concentration risk
    const categoryCount = new Map<string, number>();
    portfolio.bets.forEach(bet => {
      categoryCount.set(bet.category, (categoryCount.get(bet.category) || 0) + 1);
    });
    
    categoryCount.forEach((count, category) => {
      if (count > portfolio.bets.length * 0.6) {
        warnings.push({
          type: 'concentration',
          severity: 'medium',
          description: `Over 60% of your bets are in ${category}. This creates concentration risk.`,
          suggestion: 'Consider diversifying into other categories to reduce risk.'
        });
      }
    });
    
    // Check for burnout risk
    const totalHours = portfolio.bets.reduce((sum, bet) => sum + bet.hoursPerWeek, 0);
    if (totalHours > 60) {
      warnings.push({
        type: 'burnout',
        severity: 'high',
        description: `You're investing ${totalHours} hours per week across all bets. This is unsustainable.`,
        suggestion: 'Consider reducing time commitment or stopping some bets to prevent burnout.'
      });
    }
    
    return warnings;
  }
}