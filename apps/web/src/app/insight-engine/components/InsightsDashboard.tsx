'use client';

import { useState, useEffect } from 'react';
import { LibIcon } from '../../../components/icons/LiberationIcons';

interface SavedInsight {
  id: string;
  userChoice: any;
  aiRecommendation: any;
  createdAt: string;
  userDecision?: {
    chosenPath: 'A' | 'B' | 'neither' | 'custom';
    reasoning: string;
    confidence: number;
    decidedAt: string;
  };
}

export function InsightsDashboard() {
  const [insights, setInsights] = useState<SavedInsight[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    loadSavedInsights();
  }, []);

  const loadSavedInsights = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('insight-engine-blueprint'));
    const savedInsights: SavedInsight[] = [];

    keys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.insightDecision) {
          savedInsights.push(data.insightDecision);
        }
      } catch (error) {
        console.warn('Failed to parse insight from localStorage:', error);
      }
    });

    // Sort by creation date, most recent first
    savedInsights.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setInsights(savedInsights);
  };

  const makeDecision = (insightId: string, decision: SavedInsight['userDecision']) => {
    const updatedInsights = insights.map(insight => 
      insight.id === insightId 
        ? { ...insight, userDecision: decision }
        : insight
    );
    
    setInsights(updatedInsights);
    
    // Update localStorage
    const key = 'insight-engine-blueprint';
    const existingData = JSON.parse(localStorage.getItem(key) || '{}');
    existingData.insightDecision = updatedInsights.find(i => i.id === insightId);
    localStorage.setItem(key, JSON.stringify(existingData));
  };

  if (insights.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <div className="text-center">
          <LibIcon icon="Analytics" size="xl" className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Insights Yet</h3>
          <p className="text-gray-600">
            Complete an analysis above and save it to start tracking your strategic decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-8">
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <LibIcon icon="Analytics" size="lg" className="text-blue-600" />
            Your Saved Insights ({insights.length})
          </h3>
          <LibIcon 
            icon={showDashboard ? "ChevronRight" : "ChevronRight"} 
            size="md" 
            className={`text-gray-400 transition-transform ${showDashboard ? 'rotate-90' : ''}`}
          />
        </button>
      </div>

      {showDashboard && (
        <div className="p-6">
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={insight.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Analysis #{insights.length - index}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {insight.userChoice.currentSituation}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Option A:</span>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                      {insight.userChoice.optionA}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Option B:</span>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                      {insight.userChoice.optionB}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium text-blue-700">AI Recommends:</span>
                    <span className="text-blue-600 ml-1">
                      Option {insight.aiRecommendation.choice} ({insight.aiRecommendation.confidence}%)
                    </span>
                  </div>

                  {insight.userDecision ? (
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        ✓ You chose: {insight.userDecision.chosenPath === 'custom' ? 'Custom' : `Option ${insight.userDecision.chosenPath}`}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const decision = {
                          chosenPath: insight.aiRecommendation.choice as 'A' | 'B',
                          reasoning: 'Following AI recommendation',
                          confidence: 7,
                          decidedAt: new Date().toISOString()
                        };
                        makeDecision(insight.id, decision);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Make Decision
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}