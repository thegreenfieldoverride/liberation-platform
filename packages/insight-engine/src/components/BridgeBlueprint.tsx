import { useState } from 'react';
import { BridgeBlueprint } from '../types/insight-engine';

interface BridgeBlueprintProps {
  blueprint: BridgeBlueprint;
  onBack: () => void;
  onStartOver: () => void;
}

export const BridgeBlueprintDisplay: React.FC<BridgeBlueprintProps> = ({ 
  blueprint, 
  onBack, 
  onStartOver 
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'bridges' | 'timeline' | 'accommodations'>('summary');
  const [expandedBridge, setExpandedBridge] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskLevelColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your Bridge Blueprint
        </h1>
        <div className={`inline-flex items-center px-6 py-3 rounded-lg border-2 ${getScoreColor(blueprint.score)}`}>
          <span className="text-2xl font-bold mr-2">{blueprint.score}</span>
          <span className="text-sm font-medium">Bridge Viability Score</span>
        </div>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          {blueprint.summary}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'summary', label: 'Overview', count: null },
            { id: 'bridges', label: 'Bridge Options', count: blueprint.bridges.length },
            { id: 'timeline', label: 'Timeline', count: blueprint.timeline.length },
            { id: 'accommodations', label: 'Truth Accommodations', count: blueprint.accommodations.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{blueprint.bridges.length}</div>
              <div className="text-blue-800 font-medium">Bridge Options</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{blueprint.timeline.length}</div>
              <div className="text-purple-800 font-medium">Timeline Phases</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{blueprint.accommodations.length}</div>
              <div className="text-orange-800 font-medium">Truth Accommodations</div>
            </div>
          </div>

          {/* Top Bridge Preview */}
          {blueprint.bridges.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Recommended Bridge</h3>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-800">{blueprint.bridges[0].title}</h4>
                <p className="text-gray-600">{blueprint.bridges[0].description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Timeline: {blueprint.bridges[0].timeline}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(blueprint.bridges[0].riskLevel)}`}>
                    {blueprint.bridges[0].riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bridges' && (
        <div className="space-y-6">
          <p className="text-gray-600 mb-6">
            Different approaches to bridge your current path with your greenfield vision. Each option considers your constraints and provides specific resources.
          </p>
          
          {blueprint.bridges.map((bridge, index) => (
            <div key={bridge.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedBridge(expandedBridge === bridge.id ? null : bridge.id)}
                className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-600 text-sm font-bold px-3 py-1 rounded-full">
                        Option {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">{bridge.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(bridge.riskLevel)}`}>
                        {bridge.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{bridge.description}</p>
                    <p className="text-sm text-gray-500">Timeline: {bridge.timeline}</p>
                  </div>
                  <div className="ml-4">
                    <span className="text-gray-400">
                      {expandedBridge === bridge.id ? '−' : '+'}
                    </span>
                  </div>
                </div>
              </button>
              
              {expandedBridge === bridge.id && (
                <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Resources & Tools</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {bridge.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="bg-white border border-gray-200 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase font-medium">
                            {resource.type}
                          </span>
                          <span className="font-medium text-sm">{resource.title}</span>
                        </div>
                        {resource.description && (
                          <p className="text-xs text-gray-600">{resource.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <p className="text-gray-600 mb-6">
            A phased approach to implementing your chosen bridge, with specific milestones and actions.
          </p>
          
          {blueprint.timeline.map((phase, index) => (
            <div key={phase.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-purple-100 text-purple-600 text-sm font-bold px-3 py-1 rounded-full">
                        Phase {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">{phase.title}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {phase.timeframe}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="text-gray-400">
                      {expandedPhase === phase.id ? '−' : '+'}
                    </span>
                  </div>
                </div>
              </button>
              
              {expandedPhase === phase.id && (
                <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Actions</h4>
                      <div className="space-y-2">
                        {phase.actions.map((action) => (
                          <div key={action.id} className="bg-white border border-gray-200 rounded p-3">
                            <p className="text-sm font-medium text-gray-900">{action.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Est. time: {action.estimatedTime}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Milestones</h4>
                      <div className="space-y-2">
                        {phase.milestones.map((milestone, milestoneIndex) => (
                          <div key={milestoneIndex} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-sm text-gray-700">{milestone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'accommodations' && (
        <div className="space-y-6">
          <p className="text-gray-600 mb-6">
            Strategies for working with the truths you identified - the non-negotiable realities that require creative accommodation.
          </p>
          
          {blueprint.accommodations.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                No specific accommodations needed - all constraints were categorized as problems to solve.
              </p>
            </div>
          ) : (
            blueprint.accommodations.map((accommodation) => (
              <div key={accommodation.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">{accommodation.title}</h3>
                <p className="text-blue-800 mb-4">{accommodation.description}</p>
                
                <h4 className="font-medium text-blue-900 mb-2">Strategies:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {accommodation.strategies.map((strategy, index) => (
                    <li key={index} className="text-blue-800 text-sm">{strategy}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-8 mt-12">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ← Refine Constraints
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onStartOver}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Start New Analysis
            </button>
            <button
              onClick={() => {
                // This would integrate with the storage service to save the blueprint
                alert('Blueprint saved! (Storage integration needed)');
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Save Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};