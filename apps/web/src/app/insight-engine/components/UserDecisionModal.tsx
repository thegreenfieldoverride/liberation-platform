'use client';

import { useState } from 'react';
import { LibIcon } from '../../../components/icons/LiberationIcons';
interface UserDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: any; // The blueprint from AI
  userChoice: any; // The user's original choice
  onDecision: (decision: {
    chosenPath: 'A' | 'B' | 'neither' | 'custom';
    reasoning: string;
    confidence: number;
    decidedAt: Date;
  }) => void;
}

export function UserDecisionModal({ isOpen, onClose, blueprint, userChoice, onDecision }: UserDecisionModalProps) {
  const [chosenPath, setChosenPath] = useState<'A' | 'B' | 'neither' | 'custom'>('A');
  const [reasoning, setReasoning] = useState('');
  const [confidence, setConfidence] = useState(7);
  const [customPlan, setCustomPlan] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const decision = {
      chosenPath,
      reasoning: chosenPath === 'custom' ? customPlan : reasoning,
      confidence,
      decidedAt: new Date()
    };
    
    onDecision(decision);
    onClose();
  };

  const getChoicePath = (choice: 'A' | 'B') => 
    choice === 'A' ? userChoice.optionA : userChoice.optionB;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Decision</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <LibIcon icon="Close" size="lg" />
            </button>
          </div>

          <div className="space-y-6">
            {/* AI Recommendation Recap */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                AI Recommends: Option {blueprint.recommendation.choice} ({blueprint.recommendation.confidence}% confidence)
              </h3>
              <p className="text-green-800 text-sm">
                {blueprint.recommendation.reasoning}
              </p>
            </div>

            {/* Your Decision */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What do YOU decide?</h3>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="decision"
                    value="A"
                    checked={chosenPath === 'A'}
                    onChange={(e) => setChosenPath(e.target.value as 'A')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Option A</div>
                    <div className="text-sm text-gray-600">{getChoicePath('A')}</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="decision"
                    value="B"
                    checked={chosenPath === 'B'}
                    onChange={(e) => setChosenPath(e.target.value as 'B')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Option B</div>
                    <div className="text-sm text-gray-600">{getChoicePath('B')}</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="decision"
                    value="neither"
                    checked={chosenPath === 'neither'}
                    onChange={(e) => setChosenPath(e.target.value as 'neither')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Wait/Stay Current</div>
                    <div className="text-sm text-gray-600">I'm not ready to move forward with either path right now</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="decision"
                    value="custom"
                    checked={chosenPath === 'custom'}
                    onChange={(e) => setChosenPath(e.target.value as 'custom')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Custom Path</div>
                    <div className="text-sm text-gray-600">I want to do something different</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Custom Plan Input */}
            {chosenPath === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your custom approach:
                </label>
                <textarea
                  value={customPlan}
                  onChange={(e) => setCustomPlan(e.target.value)}
                  placeholder="What are you actually going to do instead?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Reasoning */}
            {chosenPath !== 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why did you choose this path? (Optional but helpful for tracking)
                </label>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="e.g., The AI's analysis convinced me... or I disagree because..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>
            )}

            {/* Confidence Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How confident are you in this decision? (1 = Very Uncertain, 10 = Completely Certain)
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-600">10</span>
                <span className="text-lg font-bold text-green-600 ml-2">{confidence}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              I'll Decide Later
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={chosenPath === 'custom' && !customPlan.trim()}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg"
            >
              Save My Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}