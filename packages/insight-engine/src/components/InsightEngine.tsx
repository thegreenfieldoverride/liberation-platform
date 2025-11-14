import { useState, useCallback } from 'react';
import { UserChoice, InsightEngineState } from '../types/insight-engine';
import { ChoiceDefinition } from './ChoiceDefinition';
import { DisciplineAudit } from './DisciplineAudit';
import { BridgeBlueprintDisplay } from './BridgeBlueprint';
import { generateBridgeBlueprint } from '../services/aiService';
import { storageService } from '../services/storageService';

export const InsightEngine: React.FC = () => {
  const [state, setState] = useState<InsightEngineState>({
    currentStep: 'choice',
    isGenerating: false
  });

  const handleChoiceComplete = useCallback((choice: UserChoice) => {
    setState(prev => ({
      ...prev,
      userChoice: choice,
      currentStep: 'audit'
    }));
  }, []);

  const handleAuditComplete = useCallback(async (updatedChoice: UserChoice) => {
    setState(prev => ({ ...prev, isGenerating: true, error: undefined }));

    try {
      const blueprint = await generateBridgeBlueprint(updatedChoice);
      
      // Save to local storage
      storageService.saveBlueprint(blueprint);
      
      setState(prev => ({
        ...prev,
        userChoice: updatedChoice,
        blueprint,
        currentStep: 'results',
        isGenerating: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate blueprint',
        isGenerating: false
      }));
    }
  }, []);

  const handleBackToAudit = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'audit',
      error: undefined
    }));
  }, []);

  const handleBackToChoice = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'choice',
      error: undefined
    }));
  }, []);

  const handleStartOver = useCallback(() => {
    setState({
      currentStep: 'choice',
      isGenerating: false
    });
  }, []);

  // Loading screen during AI generation
  if (state.isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Paths</h2>
          <p className="text-gray-600 max-w-md">
            Our AI is carefully analyzing your constraints and building personalized bridge strategies. 
            This may take up to 30 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Generation Failed</h2>
            <p className="text-red-700 mb-4">{state.error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setState(prev => ({ ...prev, error: undefined }))}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
              <button
                onClick={handleStartOver}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {[
                { key: 'choice', label: 'Define Paths', number: 1 },
                { key: 'audit', label: 'Categorize Constraints', number: 2 },
                { key: 'results', label: 'Bridge Blueprint', number: 3 }
              ].map((step) => {
                const isActive = state.currentStep === step.key;
                const isCompleted = 
                  (step.key === 'choice' && state.currentStep !== 'choice') ||
                  (step.key === 'audit' && state.currentStep === 'results');
                
                return (
                  <div key={step.key} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${isCompleted ? 'bg-green-600 text-white' :
                        isActive ? 'bg-green-100 text-green-600 border-2 border-green-600' :
                        'bg-gray-200 text-gray-500'}
                    `}>
                      {isCompleted ? '✓' : step.number}
                    </div>
                    <span className={`ml-3 font-medium ${
                      isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {state.currentStep === 'choice' && (
          <ChoiceDefinition
            onNext={handleChoiceComplete}
            existingChoice={state.userChoice}
          />
        )}

        {state.currentStep === 'audit' && state.userChoice && (
          <DisciplineAudit
            choice={state.userChoice}
            onNext={handleAuditComplete}
            onBack={handleBackToChoice}
          />
        )}

        {state.currentStep === 'results' && state.blueprint && (
          <BridgeBlueprintDisplay
            blueprint={state.blueprint}
            onBack={handleBackToAudit}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
};