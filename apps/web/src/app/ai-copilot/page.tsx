'use client';

import { AICoPilot, LiberationDashboard, LiberationDataCollector } from '@greenfieldoverride/ai-copilot/react';
import type { LiberationPlan } from '@greenfieldoverride/types';
import { useState } from 'react';
import { LibIcon } from '../../components/icons/LiberationIcons';

export default function AICoPilotPage() {
  const [generatedPlan, setGeneratedPlan] = useState<LiberationPlan | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dynamicLiberationData, setDynamicLiberationData] = useState<any>(null);

  // Sample liberation data for demo (fallback when no dynamic data available)
  const sampleLiberationData = {
    financial: {
      runwayMonths: 8.5,
      realHourlyWage: 22.50,
      savings: 45000,
      monthlyExpenses: 3200
    },
    cognitive: {
      overallScore: 62,
      riskLevel: 'moderate',
      primaryConcerns: ['emotional_exhaustion', 'work_life_balance']
    },
    career: {
      jobSatisfaction: 4,
      workLifeBalance: 3,
      skillsDevelopment: 6,
      marketValue: 7
    }
  };

  const handlePlanGenerated = (plan: LiberationPlan) => {
    setGeneratedPlan(plan);
    console.log('Liberation plan generated:', plan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-24 pt-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/70 text-sm mb-6">
            <LibIcon icon="Privacy" size="xs" className="text-green-400 animate-pulse" />
            Privacy-First AI Processing
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Liberation AI
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Co-Pilot
            </span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Your privacy-first AI assistant for planning your corporate escape. 
            All AI processing happens in your browser - nothing is sent to any servers.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="text-center mb-12">
          <div className="inline-flex bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 p-1.5 shadow-2xl">
            <button
              onClick={() => setShowDashboard(false)}
              className={`px-8 py-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                !showDashboard 
                  ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <LibIcon 
                icon="AICopilot" 
                size="sm" 
                className={!showDashboard ? 'text-gray-900' : 'text-white/80'} 
              />
              AI Chat Interface
            </button>
            <button
              onClick={() => setShowDashboard(true)}
              className={`px-8 py-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                showDashboard 
                  ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <LibIcon 
                icon="Analytics" 
                size="sm" 
                className={showDashboard ? 'text-gray-900' : 'text-white/80'} 
              />
              Smart Dashboard
            </button>
          </div>
        </div>
        
        {/* Data Collector - Invisible component that listens for data updates */}
        <LiberationDataCollector 
          onDataUpdate={setDynamicLiberationData}
        />

        <div className="max-w-6xl mx-auto bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          {showDashboard ? (
            <div className="bg-white rounded-2xl p-8 shadow-inner">
              <LiberationDashboard 
                liberationData={dynamicLiberationData || sampleLiberationData}
                onStrategyGenerated={(strategy) => {
                  console.log('AI strategy generated:', strategy);
                }}
              />
              
              {/* Data Status Indicator */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LibIcon 
                      icon={dynamicLiberationData ? "ActivityChart" : "Documentation"} 
                      size="sm" 
                      className={`${dynamicLiberationData ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Data Source: {dynamicLiberationData ? 'Live from Tools' : 'Sample Data'}
                    </span>
                  </div>
                  {!dynamicLiberationData && (
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                      Use liberation tools to see your real data here
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <AICoPilot 
              onPlanGenerated={handlePlanGenerated}
              className="text-white"
            />
          )}
        </div>

        {!showDashboard && generatedPlan && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <LibIcon icon="Documentation" size="lg" className="text-white" />
            Plan Summary
          </h2>
              <div className="text-white/80 space-y-2">
                <p><strong>Timeline:</strong> {generatedPlan.timeline}</p>
                <p><strong>Phases:</strong> {generatedPlan.phases.length}</p>
                <p><strong>Contingencies:</strong> {generatedPlan.contingencies.length}</p>
                <p><strong>Resources:</strong> {generatedPlan.resources.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Showcase */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <LibIcon icon="Energy" size="xl" className="text-yellow-400" />
              Advanced Liberation Features
            </h2>
            <p className="text-lg text-white/80">
              Complete AI-powered platform for escaping corporate burnout
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:transform hover:scale-105 transition-all duration-300 group">
              <div className="mb-6 flex justify-center">
                <LibIcon 
                  icon="Focus" 
                  size="2xl" 
                  className="text-white/90 group-hover:scale-110 transition-transform duration-300 group-hover:text-white" 
                />
              </div>
              <h3 className="font-semibold text-white mb-3 text-lg">Advanced Scenarios</h3>
              <p className="text-white/70 leading-relaxed">
                Multiple liberation pathways with stress testing and strategic insights
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:transform hover:scale-105 transition-all duration-300 group">
              <div className="mb-6 flex justify-center">
                <LibIcon 
                  icon="Freedom" 
                  size="2xl" 
                  className="text-white/90 group-hover:scale-110 transition-transform duration-300 group-hover:text-white" 
                />
              </div>
              <h3 className="font-semibold text-white mb-3 text-lg">Wage Liberation</h3>
              <p className="text-white/70 leading-relaxed">
                Remote work scenarios, freelance analysis, and work-life optimization
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:transform hover:scale-105 transition-all duration-300 group">
              <div className="mb-6 flex justify-center">
                <LibIcon 
                  icon="Wellbeing" 
                  size="2xl" 
                  className="text-white/90 group-hover:scale-110 transition-transform duration-300 group-hover:text-white" 
                />
              </div>
              <h3 className="font-semibold text-white mb-3 text-lg">Cognitive Health</h3>
              <p className="text-white/70 leading-relaxed">
                Enhanced visualization and category-specific recovery strategies
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:transform hover:scale-105 transition-all duration-300 group">
              <div className="mb-6 flex justify-center">
                <LibIcon 
                  icon="Magic" 
                  size="2xl" 
                  className="text-white/90 group-hover:scale-110 transition-transform duration-300 group-hover:text-white" 
                />
              </div>
              <h3 className="font-semibold text-white mb-3 text-lg">AI Integration</h3>
              <p className="text-white/70 leading-relaxed">
                Cross-tool analysis with personalized liberation strategies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}