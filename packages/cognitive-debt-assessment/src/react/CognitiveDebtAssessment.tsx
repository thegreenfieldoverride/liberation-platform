import React, { useState, useCallback } from 'react';
import type { CognitiveDebtResponse, CognitiveDebtResult, CognitiveDebtQuestion } from '@greenfield/types';
import { 
  createAssessmentQuestions, 
  calculateCognitiveDebt, 
  getCategoryDisplayName,
  getCategoryDescription
} from '../core';

export interface CognitiveDebtAssessmentProps {
  onResult?: (result: CognitiveDebtResult) => void;
  className?: string;
}

export function CognitiveDebtAssessment({ onResult, className = '' }: CognitiveDebtAssessmentProps) {
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
      const finalResult = calculateCognitiveDebt({ responses: updatedResponses });
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
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelBg = (level: string): string => {
    switch (level) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (isComplete && result) {
    return (
      <div className={`cognitive-debt-results space-y-8 ${className}`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cognitive Debt Assessment
          </h2>
          <div className={`inline-block px-6 py-3 rounded-lg border-2 ${getRiskLevelBg(result.riskLevel)}`}>
            <span className={`text-lg font-semibold capitalize ${getRiskLevelColor(result.riskLevel)}`}>
              {result.riskLevel} Risk Level
            </span>
            <div className="text-sm text-gray-600 mt-1">
              {result.percentageScore.toFixed(1)}% cognitive debt
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg border-2 ${getRiskLevelBg(result.riskLevel)}`}>
          <p className="text-lg leading-relaxed text-gray-800">
            {result.message}
          </p>
        </div>

        {result.primaryConcerns.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Primary Areas of Concern</h3>
            <div className="grid gap-4">
              {result.primaryConcerns.map(concern => (
                <div key={concern} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">
                      {getCategoryDisplayName(concern)}
                    </h4>
                    <span className="text-sm font-medium text-gray-600">
                      {result.categoryScores[concern].percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getCategoryDescription(concern)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center pt-6">
          <button
            onClick={restart}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
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
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
            {currentQuestion.question}
          </h2>
          {currentQuestion.description && (
            <p className="text-gray-600 text-lg">
              {currentQuestion.description}
            </p>
          )}
        </div>

        {/* Response Options */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">
            How often do you experience this?
          </p>
          <div className="grid gap-3">
            {[0, 1, 2, 3, 4].map((score) => (
              <button
                key={score}
                onClick={() => handleResponse(score)}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:border-blue-500"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    {getScoreLabel(score)}
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i <= score ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Privacy-first assessment • Data stays in your browser
        </span>
      </div>
    </div>
  );
}