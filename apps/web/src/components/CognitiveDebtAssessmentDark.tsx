'use client';

import React, { useState, useCallback } from 'react';
import type { CognitiveDebtResponse, CognitiveDebtResult, CognitiveDebtQuestion } from '@thegreenfieldoverride/types';
import { 
  createAssessmentQuestions, 
  calculateCognitiveDebt, 
  getCategoryDisplayName,
  getCategoryDescription
} from '@thegreenfieldoverride/cognitive-debt-assessment/core';
import { LibIcon } from './icons/LiberationIcons';

export interface CognitiveDebtAssessmentDarkProps {
  onResult?: (result: CognitiveDebtResult) => void;
  className?: string;
}

export function CognitiveDebtAssessmentDark({ onResult, className = '' }: CognitiveDebtAssessmentDarkProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<CognitiveDebtResponse[]>([]);
  const [result, setResult] = useState<CognitiveDebtResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const questions = createAssessmentQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleResponse = useCallback((score: number) => {
    const newResponse: CognitiveDebtResponse = {
      questionId: currentQuestion.id,
      score
    };
    
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Assessment complete
      const finalResult: CognitiveDebtResult = calculateCognitiveDebt({ responses: updatedResponses });
      setResult(finalResult);
      setIsComplete(true);
      onResult?.(finalResult);
    }
  }, [currentQuestion, responses, currentQuestionIndex, questions.length, onResult]);

  const restart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setResult(null);
    setIsComplete(false);
  }, []);

  const getScoreLabel = (score: number): string => {
    const labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    return labels[score] || '';
  };

  const getRiskLevelColor = (level: string): string => {
    switch (level) {
      case 'low': return 'text-green-300';
      case 'moderate': return 'text-yellow-300';
      case 'high': return 'text-orange-300';
      case 'critical': return 'text-red-300';
      default: return 'text-white';
    }
  };

  const getRiskLevelBg = (level: string): string => {
    switch (level) {
      case 'low': return 'bg-green-900/30 border-green-400/40';
      case 'moderate': return 'bg-yellow-900/30 border-yellow-400/40';
      case 'high': return 'bg-orange-900/30 border-orange-400/40';
      case 'critical': return 'bg-red-900/30 border-red-400/40';
      default: return 'bg-white/10 border-white/20';
    }
  };

  const RiskLevelIcon = ({ level }: { level: string }) => {
    switch (level) {
      case 'low': return <LibIcon icon="Growth" size="xl" className="text-green-400" />;
      case 'moderate': return <LibIcon icon="Warning" size="xl" className="text-yellow-400" />;
      case 'high': return <LibIcon icon="Alert" size="xl" className="text-orange-400" />;
      case 'critical': return <LibIcon icon="Error" size="xl" className="text-red-400" />;
      default: return <LibIcon icon="Mind" size="xl" className="text-gray-400" />;
    }
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
      case 'mental_fog': return <LibIcon icon="Mind" size="lg" className="text-blue-400" />;
      case 'emotional_exhaustion': return <LibIcon icon="Wellbeing" size="lg" className="text-purple-400" />;
      case 'creative_shutdown': return <LibIcon icon="Energy" size="lg" className="text-orange-400" />;
      case 'relationship_decay': return <LibIcon icon="Wellbeing" size="lg" className="text-pink-400" />;
      case 'physical_symptoms': return <LibIcon icon="Alert" size="lg" className="text-red-400" />;
      case 'identity_erosion': return <LibIcon icon="Focus" size="lg" className="text-gray-400" />;
      default: return <LibIcon icon="Mind" size="lg" className="text-gray-400" />;
    }
  };

  if (isComplete && result) {
    return (
      <div className={`cognitive-debt-results space-y-8 ${className}`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Cognitive Debt Assessment
          </h2>
          <div className={`inline-block px-6 py-3 rounded-lg border-2 ${getRiskLevelBg(result.riskLevel)}`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <RiskLevelIcon level={result.riskLevel} />
              <span className={`text-lg font-semibold capitalize ${getRiskLevelColor(result.riskLevel)}`}>
                {result.riskLevel} Risk Level
              </span>
            </div>
            <div className="text-sm text-white/60">
              {result.percentageScore.toFixed(1)}% cognitive debt
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg border-2 ${getRiskLevelBg(result.riskLevel)}`}>
          <p className="text-lg leading-relaxed text-white/90">
            {result.message}
          </p>
        </div>

        {result.primaryConcerns.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Primary Areas of Concern</h3>
            <div className="grid gap-4">
              {result.primaryConcerns.map(concern => (
                <div key={concern} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <CategoryIcon category={concern} />
                      <h4 className="font-medium text-white">
                        {getCategoryDisplayName(concern)}
                      </h4>
                    </div>
                    <span className="text-sm font-medium text-white/70">
                      {result.categoryScores[concern].percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-white/70 ml-8">
                    {getCategoryDescription(concern)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <LibIcon icon="Energy" size="lg" className="text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-blue-300 mt-1 text-lg">→</span>
                  <span className="text-white/80 leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center pt-6">
          <button
            onClick={restart}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30 flex items-center gap-2 mx-auto"
          >
            <span>🔄</span>
            Take Assessment Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`cognitive-debt-assessment max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-white/60">
          <div className="flex items-center gap-2">
            <CategoryIcon category={currentQuestion.category} />
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-blue-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white leading-tight">
            {currentQuestion.question}
          </h2>
          {currentQuestion.description && (
            <p className="text-white/70 text-lg">
              {currentQuestion.description}
            </p>
          )}
        </div>

        {/* Response Options */}
        <div className="space-y-3">
          <p className="text-sm text-white/50 mb-4">
            How often do you experience this?
          </p>
          <div className="grid gap-3">
            {[0, 1, 2, 3, 4].map((score) => {
              const ScoreIcon = ({ s }: { s: number }) => {
                switch (s) {
                  case 0: return <LibIcon icon="Success" size="sm" className="text-green-400" />; // Never
                  case 1: return <div className="w-3 h-3 bg-green-400 rounded-full"></div>; // Rarely  
                  case 2: return <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>; // Sometimes
                  case 3: return <div className="w-3 h-3 bg-orange-400 rounded-full"></div>; // Often
                  case 4: return <LibIcon icon="Error" size="sm" className="text-red-400" />; // Always
                  default: return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
                }
              };

              return (
                <button
                  key={score}
                  onClick={() => handleResponse(score)}
                  className="p-4 text-left border-2 border-white/20 rounded-lg hover:border-blue-300/50 hover:bg-blue-500/10 transition-all duration-200 focus:outline-none focus:border-blue-400/70 backdrop-blur-sm group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <ScoreIcon s={score} />
                      <span className="font-medium text-white group-hover:text-blue-200">
                        {getScoreLabel(score)}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            i <= score ? 'bg-blue-400 group-hover:bg-blue-300' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 text-white/60 hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-white/50">
          Privacy-first assessment • Data stays in your browser
        </span>
      </div>
    </div>
  );
}