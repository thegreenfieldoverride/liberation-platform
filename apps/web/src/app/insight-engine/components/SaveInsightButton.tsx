'use client';

import { useState } from 'react';
import { useUserContext } from '@greenfieldoverride/user-context';

interface SaveInsightButtonProps {
  blueprint: any;
  userChoice: any;
}

export function SaveInsightButton({ blueprint, userChoice }: SaveInsightButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { context, updateAI } = useUserContext();

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Create insight decision data structure
      const insightDecision = {
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userChoice: {
          currentSituation: userChoice.currentSituation,
          currentFeeling: userChoice.currentFeeling,
          energyLevel: userChoice.energyLevel,
          optionA: userChoice.optionA,
          optionB: userChoice.optionB,
          whichIsCurrent: userChoice.whichIsCurrent,
          emotionalPull: userChoice.emotionalPull,
          fallbackOption: userChoice.fallbackOption,
          safetyNetLevel: userChoice.safetyNetLevel,
          constraints: userChoice.constraints.map((c: any) => ({
            description: c.description,
            category: c.category
          }))
        },
        aiRecommendation: {
          choice: blueprint.recommendation.choice,
          confidence: blueprint.recommendation.confidence,
          reasoning: blueprint.recommendation.reasoning,
          pathAnalysis: {
            optionA: {
              viabilityScore: blueprint.pathAnalysis.optionA.viabilityScore,
              strengths: blueprint.pathAnalysis.optionA.strengthsAnalysis,
              challenges: blueprint.pathAnalysis.optionA.weaknessesAnalysis
            },
            optionB: {
              viabilityScore: blueprint.pathAnalysis.optionB.viabilityScore,
              strengths: blueprint.pathAnalysis.optionB.strengthsAnalysis,
              challenges: blueprint.pathAnalysis.optionB.weaknessesAnalysis
            }
          }
        },
        createdAt: new Date(),
        tags: ['insight-engine', 'strategic-decision']
      };

      // TODO: Save to user context once types are properly distributed
      // For now, we'll save to localStorage and create the foundation for cross-tool integration

      // Save to localStorage with enhanced structure for future integration
      localStorage.setItem('insight-engine-blueprint', JSON.stringify({
        blueprint,
        userChoice,
        insightDecision,
        generatedAt: new Date().toISOString()
      }));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save insight:', error);
      alert('Failed to save insight. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`px-6 py-3 border font-medium rounded-lg transition-colors ${
        saved 
          ? 'border-green-600 bg-green-50 text-green-700' 
          : saving 
            ? 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed'
            : 'border-green-600 text-green-600 hover:bg-green-50'
      }`}
    >
      {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Blueprint'}
    </button>
  );
}