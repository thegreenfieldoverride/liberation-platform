/**
 * Values-to-Vocation Matcher React Component
 * Interactive assessment and matching tool for finding authentic career paths
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import React, { useState, useCallback } from 'react';
import type { 
  ValueAssessmentQuestion,
  ValueResponse,
  ValueProfile,
  VocationMatchingResult,
  VocationMatch,
  WorkArrangement
} from '@greenfieldoverride/types';

import { 
  getAssessmentQuestions,
  calculateValueProfile,
  matchVocationsToValues,
  generateValueInsights
} from '../core';

// Component interfaces
interface ValuesVocationMatcherProps {
  onComplete?: (result: VocationMatchingResult) => void;
  className?: string;
  showDetailedResults?: boolean;
}

interface AssessmentStepProps {
  questions: ValueAssessmentQuestion[];
  responses: ValueResponse[];
  onResponseChange: (questionId: string, importance: number) => void;
  onNext: () => void;
  className?: string;
}

interface PreferencesStepProps {
  onPreferencesSet: (preferences: {
    preferredArrangements?: WorkArrangement[];
    currentRole?: string;
    industry?: string;
    yearsExperience?: number;
    prioritizeIncome?: boolean;
    riskTolerance?: 'low' | 'medium' | 'high';
  }) => void;
  className?: string;
}

interface ResultsDisplayProps {
  result: VocationMatchingResult;
  onRestart: () => void;
  showDetailed?: boolean;
  className?: string;
}

// Main component
export const ValuesVocationMatcher: React.FC<ValuesVocationMatcherProps> = ({
  onComplete,
  className = '',
  showDetailedResults = true
}) => {
  const [currentStep, setCurrentStep] = useState<'assessment' | 'preferences' | 'results'>('assessment');
  const [responses, setResponses] = useState<ValueResponse[]>([]);
  const [preferences, setPreferences] = useState<any>({});
  const [result, setResult] = useState<VocationMatchingResult | null>(null);
  
  const questions = getAssessmentQuestions();

  const handleResponseChange = useCallback((questionId: string, importance: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r => r.questionId === questionId ? { ...r, importance } : r);
      } else {
        return [...prev, { questionId, importance }];
      }
    });
  }, []);

  const handleAssessmentComplete = useCallback(() => {
    setCurrentStep('preferences');
  }, []);

  const handlePreferencesSet = useCallback((prefs: any) => {
    setPreferences(prefs);
    
    // Calculate value profile
    const valueProfile = calculateValueProfile({
      responses,
      currentRole: prefs.currentRole,
      industry: prefs.industry,
      yearsExperience: prefs.yearsExperience
    });

    // Generate matches
    const matchingResult = matchVocationsToValues(valueProfile, {
      preferredArrangements: prefs.preferredArrangements,
      prioritizeIncome: prefs.prioritizeIncome,
      riskTolerance: prefs.riskTolerance
    });

    setResult(matchingResult);
    setCurrentStep('results');
    onComplete?.(matchingResult);
  }, [responses, onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentStep('assessment');
    setResponses([]);
    setPreferences({});
    setResult(null);
  }, []);

  return (
    <div className={`values-vocation-matcher ${className}`}>
      {currentStep === 'assessment' && (
        <AssessmentStep
          questions={questions}
          responses={responses}
          onResponseChange={handleResponseChange}
          onNext={handleAssessmentComplete}
        />
      )}

      {currentStep === 'preferences' && (
        <PreferencesStep
          onPreferencesSet={handlePreferencesSet}
        />
      )}

      {currentStep === 'results' && result && (
        <ResultsDisplay
          result={result}
          onRestart={handleRestart}
          showDetailed={showDetailedResults}
        />
      )}
    </div>
  );
};

// Assessment step component
const AssessmentStep: React.FC<AssessmentStepProps> = ({
  questions,
  responses,
  onResponseChange,
  onNext,
  className = ''
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showProgress, setShowProgress] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleImportanceSelect = (importance: number) => {
    onResponseChange(currentQuestion.id, importance);
    // Auto-advance after a short delay
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  if (!currentQuestion) return null;

  return (
    <div className={`assessment-step space-y-8 ${className}`}>
      {/* Progress bar */}
      {showProgress && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Question counter */}
      <div className="text-center text-sm text-gray-600">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      {/* Question content */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {currentQuestion.scenario}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {currentQuestion.description}
            </p>
          </div>

          {/* Importance scale */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-600 text-center">
              How important is this to you?
            </p>
            
            <div className="grid grid-cols-5 gap-3">
              {[
                { value: 1, label: 'Not Important', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
                { value: 2, label: 'Slightly Important', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
                { value: 3, label: 'Moderately Important', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' },
                { value: 4, label: 'Very Important', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
                { value: 5, label: 'Extremely Important', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' }
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleImportanceSelect(value)}
                  className={`
                    p-4 rounded-lg text-sm font-medium transition-all duration-200
                    ${currentResponse?.importance === value 
                      ? 'ring-2 ring-blue-500 scale-105' 
                      : 'hover:scale-105'
                    }
                    ${color}
                  `}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{value}</div>
                    <div className="text-xs mt-1">{label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="text-sm text-gray-500">
          Value: <span className="font-medium capitalize">{currentQuestion.value.replace('_', ' ')}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!currentResponse}
          className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
        </button>
      </div>
    </div>
  );
};

// Preferences step component
const PreferencesStep: React.FC<PreferencesStepProps> = ({
  onPreferencesSet,
  className = ''
}) => {
  const [preferredArrangements, setPreferredArrangements] = useState<WorkArrangement[]>([]);
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsExperience, setYearsExperience] = useState<number>(0);
  const [prioritizeIncome, setPrioritizeIncome] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');

  const workArrangements: { value: WorkArrangement; label: string; description: string }[] = [
    { value: 'remote_employee', label: 'Remote Employee', description: 'Work for a company but from anywhere' },
    { value: 'freelancer', label: 'Freelancer', description: 'Independent contractor working with multiple clients' },
    { value: 'entrepreneur', label: 'Entrepreneur', description: 'Start and scale your own business' },
    { value: 'consultant', label: 'Consultant', description: 'Provide expert advice to organizations' },
    { value: 'digital_nomad', label: 'Digital Nomad', description: 'Work remotely while traveling' },
    { value: 'portfolio_career', label: 'Portfolio Career', description: 'Multiple part-time roles or projects' },
    { value: 'solopreneur', label: 'Solopreneur', description: 'Solo business owner with minimal employees' },
    { value: 'hybrid_employee', label: 'Hybrid Employee', description: 'Mix of office and remote work' }
  ];

  const handleArrangementToggle = (arrangement: WorkArrangement) => {
    setPreferredArrangements(prev => {
      if (prev.includes(arrangement)) {
        return prev.filter(a => a !== arrangement);
      } else {
        return [...prev, arrangement];
      }
    });
  };

  const handleSubmit = () => {
    onPreferencesSet({
      preferredArrangements: preferredArrangements.length > 0 ? preferredArrangements : undefined,
      currentRole: currentRole || undefined,
      industry: industry || undefined,
      yearsExperience: yearsExperience || undefined,
      prioritizeIncome,
      riskTolerance
    });
  };

  return (
    <div className={`preferences-step space-y-8 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Tell us about your preferences</h2>
        <p className="text-gray-600">This helps us personalize your career matches</p>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 space-y-8">
        {/* Current situation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Situation</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Role (optional)
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g., Software Developer, Manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry (optional)
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Technology, Healthcare"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
              min="0"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Work arrangements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Preferred Work Arrangements</h3>
          <p className="text-sm text-gray-600">Select all that interest you</p>
          
          <div className="grid md:grid-cols-2 gap-3">
            {workArrangements.map(({ value, label, description }) => (
              <button
                key={value}
                onClick={() => handleArrangementToggle(value)}
                className={`
                  p-4 text-left rounded-lg border-2 transition-all duration-200
                  ${preferredArrangements.includes(value)
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-medium">{label}</div>
                <div className="text-sm opacity-75">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Priorities</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={prioritizeIncome}
                onChange={(e) => setPrioritizeIncome(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Prioritize high income potential</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Tolerance
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Low Risk', description: 'Prefer stability and security' },
                  { value: 'medium', label: 'Moderate Risk', description: 'Balanced approach' },
                  { value: 'high', label: 'High Risk', description: 'Comfortable with uncertainty' }
                ].map(({ value, label, description }) => (
                  <button
                    key={value}
                    onClick={() => setRiskTolerance(value as 'low' | 'medium' | 'high')}
                    className={`
                      p-3 text-center rounded-lg border-2 transition-all duration-200
                      ${riskTolerance === value
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs opacity-75">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200"
        >
          Find My Career Matches
        </button>
      </div>
    </div>
  );
};

// Results display component
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  onRestart,
  showDetailed = true,
  className = ''
}) => {
  const [selectedMatch, setSelectedMatch] = useState<VocationMatch | null>(null);
  const [showInsights, setShowInsights] = useState(true);

  const { userProfile, topMatches, insights, explorationSuggestions } = result;

  return (
    <div className={`results-display space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Your Career Matches</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your values assessment, here are career paths that align with what truly matters to you.
        </p>
      </div>

      {/* Value Profile Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Top Values</h3>
        <div className="flex flex-wrap gap-2">
          {userProfile.dominantValues.slice(0, 5).map((value, index) => {
            const valueData = userProfile.coreValues.find(cv => cv.value === value);
            return (
              <span
                key={value}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                #{index + 1} {value.replace('_', ' ')} ({valueData?.percentage.toFixed(0)}%)
              </span>
            );
          })}
        </div>
      </div>

      {/* Top Matches */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Your Best Matches</h3>
        
        <div className="grid gap-4">
          {topMatches.slice(0, 5).map((match, index) => (
            <VocationMatchCard
              key={match.vocation.id}
              match={match}
              rank={index + 1}
              onClick={() => setSelectedMatch(match)}
              isSelected={selectedMatch?.vocation.id === match.vocation.id}
            />
          ))}
        </div>
      </div>

      {/* Insights */}
      {showInsights && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Values Alignment</h4>
              <p className="text-gray-600 text-sm">{insights.valueAlignment}</p>
            </div>

            {insights.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {insights.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exploration Suggestions */}
      {explorationSuggestions.length > 0 && (
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
          
          <div className="space-y-3">
            {explorationSuggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{suggestion.action}</div>
                  <div className="text-sm text-gray-600">{suggestion.purpose}</div>
                  <div className="text-xs text-green-600 font-medium">{suggestion.timeframe}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Match View */}
      {selectedMatch && showDetailed && (
        <VocationDetailView
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Restart button */}
      <div className="text-center pt-6">
        <button
          onClick={onRestart}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Take Assessment Again
        </button>
      </div>
    </div>
  );
};

// Vocation match card component
interface VocationMatchCardProps {
  match: VocationMatch;
  rank: number;
  onClick: () => void;
  isSelected: boolean;
}

const VocationMatchCard: React.FC<VocationMatchCardProps> = ({
  match,
  rank,
  onClick,
  isSelected
}) => {
  const { vocation, alignmentScore, transitionStrategy } = match;

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-blue-600 bg-blue-100';
      case 'challenging': return 'text-yellow-600 bg-yellow-100';
      case 'difficult': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              #{rank}
            </div>
            <h4 className="text-lg font-semibold text-gray-900">{vocation.title}</h4>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vocation.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {vocation.primaryValues.slice(0, 3).map(value => (
              <span key={value} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                {value.replace('_', ' ')}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Match:</span>
              <span className={`px-2 py-1 rounded font-medium ${getAlignmentColor(alignmentScore)}`}>
                {alignmentScore.toFixed(0)}%
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Transition:</span>
              <span className={`px-2 py-1 rounded font-medium capitalize ${getDifficultyColor(transitionStrategy.difficulty)}`}>
                {transitionStrategy.difficulty}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Income:</span>
              <span className="text-gray-700 font-medium">{vocation.realityCheck.averageIncome}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detailed vocation view component
interface VocationDetailViewProps {
  match: VocationMatch;
  onClose: () => void;
}

const VocationDetailView: React.FC<VocationDetailViewProps> = ({
  match,
  onClose
}) => {
  const { vocation, alignmentScore, valueMatches, transitionStrategy } = match;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{vocation.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
            <p className="text-gray-700">{vocation.description}</p>
          </div>

          {/* Value Alignment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Value Alignment ({alignmentScore.toFixed(0)}%)</h3>
            <div className="space-y-2">
              {valueMatches
                .filter(vm => vm.importance >= 50)
                .sort((a, b) => b.alignment - a.alignment)
                .slice(0, 8)
                .map(vm => (
                  <div key={vm.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{vm.value.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Your importance: {vm.importance.toFixed(0)}%</span>
                      <span className="text-sm text-gray-600">Career support: {vm.vocationSupport.toFixed(0)}%</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        vm.alignment >= 70 ? 'bg-green-100 text-green-700' :
                        vm.alignment >= 50 ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {vm.alignment.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Transition Strategy */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Transition Strategy</h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <div className="font-medium capitalize">{transitionStrategy.difficulty}</div>
                </div>
                <div>
                  <span className="text-gray-600">Timeframe:</span>
                  <div className="font-medium">{transitionStrategy.timeframe}</div>
                </div>
                <div>
                  <span className="text-gray-600">Risk Level:</span>
                  <div className="font-medium capitalize">{transitionStrategy.riskLevel}</div>
                </div>
                <div>
                  <span className="text-gray-600">Liberation Timeline:</span>
                  <div className="font-medium">{vocation.liberationPotential.timeToFreedom}</div>
                </div>
              </div>
              
              {transitionStrategy.keySteps.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Steps:</h4>
                  <ol className="space-y-1 text-sm">
                    {transitionStrategy.keySteps.slice(0, 5).map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Reality Check */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reality Check</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Income:</span>
                  <span className="font-medium">{vocation.realityCheck.averageIncome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time to Viability:</span>
                  <span className="font-medium">{vocation.realityCheck.timeToViability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Demand:</span>
                  <span className="font-medium capitalize">{vocation.realityCheck.marketDemand}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty Level:</span>
                  <span className="font-medium">{vocation.realityCheck.difficultyLevel}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Potential:</span>
                  <span className="font-medium capitalize">{vocation.realityCheck.growthPotential}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Autonomy Level:</span>
                  <span className="font-medium">{vocation.liberationPotential.autonomyLevel}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pathways */}
          {vocation.pathways.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Pathways</h3>
              <div className="space-y-4">
                {vocation.pathways.map((pathway, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{pathway.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pathway.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        pathway.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pathway.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pathway.description}</p>
                    <div className="text-xs text-gray-500">Timeframe: {pathway.timeframe}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValuesVocationMatcher;