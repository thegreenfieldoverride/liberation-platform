/**
 * Small Bets Portfolio Builder - React Component
 * Liberation-focused income stream management
 */

import React, { useState, useEffect } from 'react';
import { useUserContext } from '@greenfieldoverride/user-context';
import { SmallBet, CoreValue } from '@greenfieldoverride/types';
import { PortfolioEngine, BetAnalysis, PortfolioInsights } from '../core';

interface SmallBetsPortfolioProps {
  className?: string;
  onBetAdded?: (bet: SmallBet) => void;
  onBetUpdated?: (bet: SmallBet) => void;
  onBetDeleted?: (betId: string) => void;
}

export const SmallBetsPortfolio: React.FC<SmallBetsPortfolioProps> = ({
  className = '',
  onBetAdded,
  onBetUpdated,
  onBetDeleted
}) => {
  const { context, loading, error, addSmallBet, updateSmallBet, deleteSmallBet } = useUserContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'bets' | 'add' | 'insights'>('overview');
  const [insights, setInsights] = useState<PortfolioInsights | null>(null);
  const [selectedBet, setSelectedBet] = useState<SmallBet | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate insights when portfolio changes
  useEffect(() => {
    if (context?.smallBets) {
      const userValues = context.career.valueProfile?.dominantValues || [];
      const portfolioInsights = PortfolioEngine.generateInsights(context.smallBets, userValues);
      setInsights(portfolioInsights);
    }
  }, [context?.smallBets, context?.career.valueProfile]);

  const handleAddBet = async (bet: SmallBet) => {
    try {
      await addSmallBet(bet);
      onBetAdded?.(bet);
      setActiveTab('bets');
    } catch (err) {
      console.error('Failed to add bet:', err);
    }
  };

  const handleUpdateBet = async (updates: Partial<SmallBet>) => {
    if (!selectedBet) return;
    
    try {
      const updatedBet = { ...selectedBet, ...updates };
      await updateSmallBet(selectedBet.id, updates);
      onBetUpdated?.(updatedBet);
      setSelectedBet(updatedBet);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update bet:', err);
    }
  };

  const handleDeleteBet = async (betId: string) => {
    if (!confirm('Are you sure you want to delete this small bet?')) return;
    
    try {
      await deleteSmallBet(betId);
      onBetDeleted?.(betId);
      setSelectedBet(null);
    } catch (err) {
      console.error('Failed to delete bet:', err);
    }
  };

  if (loading) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-red-600 mb-4">⚠️ Error loading portfolio</div>
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    );
  }

  const portfolio = context?.smallBets;
  if (!portfolio) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <p className="text-gray-600">No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Small Bets Portfolio</h2>
            <p className="text-gray-600 mt-1">
              Track and optimize your liberation-focused income streams
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${portfolio.portfolioMetrics.monthlyIncome.toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">Monthly Income</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {portfolio.bets.length}
              </div>
              <div className="text-sm text-gray-500">Active Bets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'bets', label: 'My Bets' },
            { id: 'add', label: 'Add Bet' },
            { id: 'insights', label: 'Insights' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <PortfolioOverview 
            portfolio={portfolio} 
            insights={insights}
            onViewBet={(bet) => {
              setSelectedBet(bet);
              setActiveTab('bets');
            }}
          />
        )}
        
        {activeTab === 'bets' && (
          <BetsManagement
            bets={portfolio.bets}
            selectedBet={selectedBet}
            isEditing={isEditing}
            onSelectBet={setSelectedBet}
            onEditBet={() => setIsEditing(true)}
            onUpdateBet={handleUpdateBet}
            onDeleteBet={handleDeleteBet}
            onCancelEdit={() => setIsEditing(false)}
          />
        )}
        
        {activeTab === 'add' && (
          <AddBetForm 
            onAddBet={handleAddBet}
            userValues={context?.career.valueProfile?.dominantValues || []}
          />
        )}
        
        {activeTab === 'insights' && insights && (
          <PortfolioInsightsView insights={insights} />
        )}
      </div>
    </div>
  );
};

// Portfolio Overview Component
interface PortfolioOverviewProps {
  portfolio: any;
  insights: PortfolioInsights | null;
  onViewBet: (bet: SmallBet) => void;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio, insights, onViewBet }) => {
  const activeBets = portfolio.bets.filter((bet: SmallBet) => bet.status === 'active');
  const successfulBets = portfolio.bets.filter((bet: SmallBet) => bet.status === 'successful');

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Income"
          value={`$${portfolio.portfolioMetrics.monthlyIncome.toFixed(0)}`}
          subtitle="Total revenue"
          trend="+12%"
          positive
        />
        <MetricCard
          title="Total Profit"
          value={`$${portfolio.totalProfit.toFixed(0)}`}
          subtitle="All-time"
          trend="+8%"
          positive
        />
        <MetricCard
          title="Hourly Rate"
          value={`$${insights?.overall.totalHoursEfficiency.toFixed(0) || '0'}`}
          subtitle="Per hour"
          trend="+5%"
          positive
        />
        <MetricCard
          title="Risk Score"
          value={`${insights?.overall.riskDiversification.toFixed(1) || '0'}/10`}
          subtitle="Diversification"
          trend="Stable"
        />
      </div>

      {/* Active Bets Quick View */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Bets</h3>
        <div className="space-y-3">
          {activeBets.slice(0, 3).map((bet: SmallBet) => (
            <div
              key={bet.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onViewBet(bet)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(bet.status)}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{bet.name}</div>
                  <div className="text-sm text-gray-500">{bet.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">${bet.monthlyRevenue}/mo</div>
                <div className="text-sm text-gray-500">{bet.hoursPerWeek}h/week</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      {insights && insights.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Recommendations</h3>
          <div className="space-y-3">
            {insights.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">{rec.title}</h4>
                    <p className="text-sm text-blue-700 mt-1">{rec.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
  positive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend, positive }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="text-sm font-medium text-gray-500">{title}</div>
    <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    <div className="flex items-center justify-between mt-2">
      <div className="text-sm text-gray-500">{subtitle}</div>
      {trend && (
        <div className={`text-sm ${positive ? 'text-green-600' : 'text-gray-500'}`}>
          {trend}
        </div>
      )}
    </div>
  </div>
);

// Bets Management Component (simplified - would be expanded)
interface BetsManagementProps {
  bets: SmallBet[];
  selectedBet: SmallBet | null;
  isEditing: boolean;
  onSelectBet: (bet: SmallBet) => void;
  onEditBet: () => void;
  onUpdateBet: (updates: Partial<SmallBet>) => void;
  onDeleteBet: (betId: string) => void;
  onCancelEdit: () => void;
}

const BetsManagement: React.FC<BetsManagementProps> = ({
  bets,
  selectedBet,
  isEditing,
  onSelectBet,
  onEditBet,
  onUpdateBet,
  onDeleteBet,
  onCancelEdit
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bets List */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Bets</h3>
        <div className="space-y-2">
          {bets.map(bet => (
            <div
              key={bet.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedBet?.id === bet.id
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => onSelectBet(bet)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{bet.name}</div>
                  <div className="text-sm text-gray-500">{bet.category}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(bet.status)}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Details */}
      <div className="lg:col-span-2">
        {selectedBet ? (
          isEditing ? (
            <BetEditForm
              bet={selectedBet}
              onSave={onUpdateBet}
              onCancel={onCancelEdit}
            />
          ) : (
            <BetDetailsView
              bet={selectedBet}
              onEdit={onEditBet}
              onDelete={onDeleteBet}
            />
          )
        ) : (
          <div className="text-center text-gray-500 py-12">
            Select a bet to view details
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components (simplified implementations)
const BetDetailsView: React.FC<{
  bet: SmallBet;
  onEdit: () => void;
  onDelete: (id: string) => void;
}> = ({ bet, onEdit, onDelete }) => {
  const analysis = PortfolioEngine.analyzeBet(bet);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{bet.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(bet.id)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="flex items-center mt-1">
              <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(bet.status)}`}></div>
              <span className="capitalize text-gray-900">{bet.status}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Monthly Revenue</label>
            <div className="text-lg font-semibold text-gray-900">${bet.monthlyRevenue}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Hours per Week</label>
            <div className="text-lg font-semibold text-gray-900">{bet.hoursPerWeek}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">ROI</label>
            <div className="text-lg font-semibold text-gray-900">
              {analysis.profitability.roi.toFixed(1)}%
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Hourly Return</label>
            <div className="text-lg font-semibold text-gray-900">
              ${analysis.profitability.hourlyReturn.toFixed(0)}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Satisfaction</label>
            <div className="text-lg font-semibold text-gray-900">
              {bet.satisfactionScore}/10
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500">Description</label>
        <p className="text-gray-900 mt-1">{bet.description}</p>
      </div>

      {bet.lessonsLearned.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-500">Lessons Learned</label>
          <ul className="list-disc list-inside text-gray-900 mt-1 space-y-1">
            {bet.lessonsLearned.map((lesson, index) => (
              <li key={index}>{lesson}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const BetEditForm: React.FC<{
  bet: SmallBet;
  onSave: (updates: Partial<SmallBet>) => void;
  onCancel: () => void;
}> = ({ bet, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: bet.name,
    description: bet.description,
    status: bet.status,
    monthlyRevenue: bet.monthlyRevenue,
    monthlyExpenses: bet.monthlyExpenses,
    hoursPerWeek: bet.hoursPerWeek,
    satisfactionScore: bet.satisfactionScore,
    notes: bet.notes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as SmallBet['status'] })}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="idea">Idea</option>
          <option value="testing">Testing</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Revenue ($)</label>
          <input
            type="number"
            value={formData.monthlyRevenue}
            onChange={(e) => setFormData({ ...formData, monthlyRevenue: Number(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Expenses ($)</label>
          <input
            type="number"
            value={formData.monthlyExpenses}
            onChange={(e) => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hours per Week</label>
          <input
            type="number"
            value={formData.hoursPerWeek}
            onChange={(e) => setFormData({ ...formData, hoursPerWeek: Number(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Satisfaction (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.satisfactionScore}
            onChange={(e) => setFormData({ ...formData, satisfactionScore: Number(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const AddBetForm: React.FC<{
  onAddBet: (bet: SmallBet) => void;
  userValues: CoreValue[];
}> = ({ onAddBet, userValues }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'service' as SmallBet['category'],
    initialInvestment: 0,
    status: 'idea' as SmallBet['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBet: SmallBet = {
      id: 'bet_' + Date.now().toString(36),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      startDate: new Date(),
      initialInvestment: formData.initialInvestment,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      totalRevenue: 0,
      totalProfit: 0,
      hoursPerWeek: 0,
      totalHoursInvested: 0,
      milestones: [],
      lessonsLearned: [],
      skills: [],
      connections: [],
      alignedValues: userValues.slice(0, 3), // Use top user values
      satisfactionScore: 5,
      nextSteps: [],
      tags: [],
      notes: ''
    };

    onAddBet(newBet);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'service',
      initialInvestment: 0,
      status: 'idea'
    });
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Small Bet</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Freelance Writing, SaaS Tool, Online Course"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as SmallBet['category'] })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="service">Service</option>
            <option value="product">Product</option>
            <option value="content">Content</option>
            <option value="investment">Investment</option>
            <option value="skill">Skill Development</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Investment ($)</label>
          <input
            type="number"
            min="0"
            value={formData.initialInvestment}
            onChange={(e) => setFormData({ ...formData, initialInvestment: Number(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="What is this small bet about? What problem does it solve?"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as SmallBet['status'] })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="idea">Idea</option>
            <option value="testing">Testing</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Small Bet
          </button>
        </div>
      </form>
    </div>
  );
};

const PortfolioInsightsView: React.FC<{ insights: PortfolioInsights }> = ({ insights }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Portfolio Insights</h3>
      
      {/* Recommendations */}
      {insights.recommendations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{rec.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>Impact: {rec.expectedImpact}</span>
                      <span className="mx-2">•</span>
                      <span>Effort: {rec.effort}</span>
                      <span className="mx-2">•</span>
                      <span>Timeline: {rec.timeframe}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ml-4 ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {insights.warnings.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Warnings</h4>
          <div className="space-y-3">
            {insights.warnings.map((warning, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">{warning.description}</p>
                    <p className="text-sm text-yellow-700 mt-1 font-medium">{warning.suggestion}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ml-4 ${
                    warning.severity === 'high' ? 'bg-red-100 text-red-800' :
                    warning.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {warning.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getStatusColor = (status: SmallBet['status']): string => {
  const colors = {
    'idea': 'bg-gray-400',
    'testing': 'bg-blue-400',
    'active': 'bg-green-400',
    'paused': 'bg-yellow-400',
    'successful': 'bg-emerald-400',
    'failed': 'bg-red-400'
  };
  return colors[status] || 'bg-gray-400';
};

export default SmallBetsPortfolio;