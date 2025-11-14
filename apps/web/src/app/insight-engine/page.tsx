'use client';

import { useState, useCallback, useEffect } from 'react';
import { LibIcon } from '../../components/icons/LiberationIcons';

// Enhanced types for exceptional analysis
interface Constraint {
  id: string;
  description: string;
  category: 'truth' | 'problem' | 'uncategorized';
}

interface UserChoice {
  id: string;
  currentSituation: string;
  currentFeeling: string;
  energyLevel: number; // 1-10
  optionA: string;
  optionB: string;
  whichIsCurrent: 'A' | 'B' | 'neither';
  emotionalPull: 'A' | 'B' | 'unsure';
  fallbackOption: string;
  safetyNetLevel: 'low' | 'medium' | 'high';
  constraints: Constraint[];
  createdAt: Date;
}

interface PathAnalysis {
  title: string;
  viabilityScore: number;
  strengthsAnalysis: string;
  weaknessesAnalysis: string;
  optimizationStrategy?: string;
  bridgeStrategy?: string;
  riskMitigation?: string;
  exitConditions?: string[];
}

interface BridgeStrategy {
  id: string;
  title: string;
  description: string;
  timeline: string;
  riskLevel: 'low' | 'medium' | 'high';
  suitability: string;
  resources: Array<{
    title: string;
    type: string;
    description: string;
    url?: string;
    cost: string;
  }>;
}

interface Blueprint {
  recommendation: {
    choice: 'A' | 'B';
    confidence: number;
    reasoning: string;
  };
  pathAnalysis: {
    optionA: PathAnalysis;
    optionB: PathAnalysis;
  };
  bridges: BridgeStrategy[];
  accommodations: Array<{
    id: string;
    truthConstraint: string;
    accommodationStrategy: string;
    tactics: string[];
    examples: string[];
  }>;
  timeline: Array<{
    id: string;
    phase: string;
    timeframe: string;
    objective: string;
    actions: Array<{
      action: string;
      estimatedTime: string;
      difficulty: string;
      dependencies: string[];
      resources: string[];
    }>;
    milestones: string[];
    riskFactors: string[];
  }>;
  contingencies: {
    ifRecommendedPathFails: string;
    emergencyExits: string[];
    signalsToWatch: string[];
  };
}

type Step = 'choice' | 'audit' | 'generating' | 'results';

// Exceptional insight engine
function InsightEngine() {
  const [currentStep, setCurrentStep] = useState<Step>('choice');
  const [userChoice, setUserChoice] = useState<UserChoice | null>(null);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll to top on step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100">
      {/* Progress Indicator */}
      <div className="bg-white/60 backdrop-blur-md border-b border-white/30 sticky top-0 z-40 mt-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {[
                { key: 'choice', label: 'Define Paths', number: 1 },
                { key: 'audit', label: 'Categorize Constraints', number: 2 },
                { key: 'results', label: 'Bridge Blueprint', number: 3 }
              ].map((step) => {
                const isActive = currentStep === step.key || 
                  (step.key === 'results' && currentStep === 'generating');
                const isCompleted = 
                  (step.key === 'choice' && ['audit', 'generating', 'results'].includes(currentStep)) ||
                  (step.key === 'audit' && ['generating', 'results'].includes(currentStep));
                
                const canNavigateTo = 
                  step.key === 'choice' || 
                  (step.key === 'audit' && userChoice) ||
                  (step.key === 'results' && blueprint);
                
                const handleStepClick = () => {
                  if (!canNavigateTo || isActive || currentStep === 'generating') return;
                  
                  if (step.key === 'choice') {
                    setCurrentStep('choice');
                  } else if (step.key === 'audit' && userChoice) {
                    setCurrentStep('audit');
                  } else if (step.key === 'results' && blueprint) {
                    setCurrentStep('results');
                  }
                };
                
                return (
                  <div 
                    key={step.key} 
                    className={`flex items-center ${canNavigateTo && !isActive && currentStep !== 'generating' ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={handleStepClick}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${isCompleted ? 'bg-green-600 text-white' :
                        isActive ? 'bg-green-100 text-green-600 border-2 border-green-600' :
                        'bg-gray-200 text-gray-500'}
                    `}>
                      {isCompleted ? <LibIcon icon="Success" size="sm" className="text-white" /> : 
                       (step.key === 'results' && currentStep === 'generating') ? 
                       <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div> :
                       step.number}
                    </div>
                    <span className={`ml-3 font-medium ${
                      isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.key === 'results' && currentStep === 'generating' ? 'Generating Blueprint...' : step.label}
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
        {currentStep === 'choice' && (
          <ChoiceDefinition
            existingChoice={userChoice}
            onNext={(choice) => {
              setUserChoice(choice);
              setCurrentStep('audit');
            }}
          />
        )}

        {error && (
          <div className="max-w-2xl mx-auto p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-red-900 font-semibold mb-2">Generation Failed</h3>
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setCurrentStep('audit');
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {currentStep === 'audit' && userChoice && (
          <DisciplineAudit
            choice={userChoice}
            onNext={async (updatedChoice) => {
              setUserChoice(updatedChoice);
              setCurrentStep('generating');
              setError(null);
              
              // Call the AI API
              try {
                const truthsToAccommodate = updatedChoice.constraints
                  .filter(c => c.category === 'truth')
                  .map(c => c.description);
                  
                const problemsToSolve = updatedChoice.constraints
                  .filter(c => c.category === 'problem')
                  .map(c => c.description);

                // Build the exceptional AI prompt
                const prompt = `You are an elite strategic consultant specializing in life path optimization. Your client faces a binary choice and has intelligently categorized their constraints using the "Truth vs Problem" framework.

CRITICAL: Use their EXACT words and situation. Do not give generic advice. Reference their specific details, energy level, emotional pull, and safety net reality. Write in clear, natural language - avoid awkward phrase fragments or unclear references.

Your mission: Provide an exceptionally thorough analysis of BOTH paths, explain your reasoning, and deliver actionable strategies that account for their specific constraint profile.

## Core Analysis Framework:
1. **Quote their exact situation** - use their words, not generic corporate vs entrepreneur advice
2. **Reference their energy level** - ${updatedChoice.energyLevel}/10 matters for recommendations
3. **Respect their heart** - their emotional pull should heavily influence your recommendation
4. **Match their safety net reality** - ${updatedChoice.safetyNetLevel} safety net changes everything
5. **Be specific** - use their actual options, not placeholder corporate advice

## The Decision Context:

**CURRENT SITUATION:** ${updatedChoice.currentSituation}

**CURRENT FEELING/ENERGY:** ${updatedChoice.currentFeeling} (Energy Level: ${updatedChoice.energyLevel}/10)

**OPTION A:** ${updatedChoice.optionA}

**OPTION B:** ${updatedChoice.optionB}

**WHICH IS CURRENT:** ${updatedChoice.whichIsCurrent === 'A' ? 'Option A is my current situation' : updatedChoice.whichIsCurrent === 'B' ? 'Option B is my current situation' : 'Neither - I\'m somewhere else entirely'}

**HEART SAYS:** ${updatedChoice.emotionalPull === 'A' ? 'If money/logistics weren\'t a factor, I\'d choose Option A' : updatedChoice.emotionalPull === 'B' ? 'If money/logistics weren\'t a factor, I\'d choose Option B' : 'I\'m genuinely unsure which I\'d choose emotionally'}

**SAFETY NET:** ${updatedChoice.safetyNetLevel} - Fallback plan: ${updatedChoice.fallbackOption}

**TRUTHS TO ACCOMMODATE (Non-negotiable realities to work around):**
${truthsToAccommodate.length > 0 ? truthsToAccommodate.map((truth, i) => `${i + 1}. ${truth}`).join('\n') : 'None identified'}

**PROBLEMS TO SOLVE (Temporary obstacles that can be addressed):**
${problemsToSolve.length > 0 ? problemsToSolve.map((problem, i) => `${i + 1}. ${problem}`).join('\n') : 'None identified'}

## Required Response Format:
Respond with a JSON object that shows your complete strategic thinking. Write all descriptions in clear, complete sentences. Avoid fragmented phrases or unclear references:

{
  "recommendation": {
    "choice": "A" or "B",
    "confidence": <1-100>,
    "reasoning": "<2-3 sentences explaining your logic>"
  },
  "pathAnalysis": {
    "optionA": {
      "title": "<descriptive name for this path>",
      "viabilityScore": <1-100>,
      "strengthsAnalysis": "<why this path could work - write in natural, complete sentences>",
      "weaknessesAnalysis": "<what makes this path challenging - write in natural, complete sentences>",
      "optimizationStrategy": "<how to make this path better if chosen - complete sentences>",
      "exitConditions": ["<when to reconsider this path - complete thoughts>"]
    },
    "optionB": {
      "title": "<descriptive name for this path>", 
      "viabilityScore": <1-100>,
      "strengthsAnalysis": "<why this path could work - write in natural, complete sentences>",
      "weaknessesAnalysis": "<what makes this path challenging - write in natural, complete sentences>",
      "bridgeStrategy": "<how to transition - write in complete, flowing sentences>",
      "riskMitigation": "<how to reduce risks - complete sentences>"
    }
  },
  "bridges": [
    {
      "id": "<unique-id>",
      "title": "<specific bridge strategy name>",
      "description": "<detailed implementation approach>",
      "timeline": "<realistic timeframe>",
      "riskLevel": "low|medium|high",
      "suitability": "<why this bridge fits their constraint profile>",
      "resources": [
        {
          "title": "<specific resource>",
          "type": "platform|tool|guide|course|service",
          "description": "<what this provides>",
          "url": "<if available>",
          "cost": "<free|paid|varies>"
        }
      ]
    }
  ],
  "accommodations": [
    {
      "id": "<unique-id>",
      "truthConstraint": "<the specific truth being accommodated>",
      "accommodationStrategy": "<creative approach to work around this truth>", 
      "tactics": ["<specific action 1>", "<specific action 2>"],
      "examples": ["<real-world example of this working>"]
    }
  ],
  "timeline": [
    {
      "id": "<unique-id>",
      "phase": "<phase name>",
      "timeframe": "<duration>",
      "objective": "<what this phase accomplishes>",
      "actions": [
        {
          "action": "<specific action>",
          "estimatedTime": "<time investment>",
          "difficulty": "easy|moderate|challenging",
          "dependencies": ["<what must be done first>"],
          "resources": ["<tools/resources needed>"]
        }
      ],
      "milestones": ["<measurable outcome 1>", "<measurable outcome 2>"],
      "riskFactors": ["<what could go wrong in this phase>"]
    }
  ],
  "contingencies": {
    "ifRecommendedPathFails": "<backup strategy>",
    "emergencyExits": ["<when/how to pivot if things go wrong>"],
    "signalsToWatch": ["<early indicators of success/failure>"]
  }
}`;

                const response = await fetch('/api/insight-engine/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    prompt,
                    request: {
                      currentSituation: updatedChoice.currentSituation,
                      optionA: updatedChoice.optionA,
                      optionB: updatedChoice.optionB,
                      emotionalPull: updatedChoice.emotionalPull,
                      safetyNetLevel: updatedChoice.safetyNetLevel,
                      truthsToAccommodate,
                      problemsToSolve
                    }
                  })
                });

                if (!response.ok) {
                  throw new Error('Failed to generate blueprint');
                }

                const aiResponse = await response.json();
                console.log('AI Response:', aiResponse);
                
                setBlueprint(aiResponse);
                setCurrentStep('results');
                
              } catch (error) {
                console.error('Error generating blueprint:', error);
                setError(error instanceof Error ? error.message : 'Failed to generate blueprint');
                setCurrentStep('audit');
              }
            }}
            onBack={() => setCurrentStep('choice')}
          />
        )}

        {currentStep === 'generating' && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="relative mb-8">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Analyzing Your Paths
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our AI is performing deep strategic analysis of both your paths, 
                evaluating constraints, and building personalized bridge strategies. 
                This comprehensive analysis takes 15-30 seconds.
              </p>
               <div className="mt-6 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <LibIcon icon="Energy" size="sm" className="text-yellow-500" />
                  Analyzing path viability
                </p>
                <p className="flex items-center gap-2">
                  <LibIcon icon="Mind" size="sm" className="text-purple-500" />
                  Evaluating constraint categories
                </p>
                <p className="flex items-center gap-2">
                  <LibIcon icon="Arrow" size="sm" className="text-blue-500" />
                  Designing bridge strategies
                </p>
                <p className="flex items-center gap-2">
                  <LibIcon icon="TimeTracking" size="sm" className="text-green-500" />
                  Building actionable timeline
                </p>
               </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && blueprint && (
          <BlueprintDisplay
            blueprint={blueprint}
            userChoice={userChoice!}
            onStartOver={() => {
              setCurrentStep('choice');
              setUserChoice(null);
              setBlueprint(null);
              setError(null);
            }}
            onEditChoice={() => setCurrentStep('choice')}
            onBackToAudit={() => setCurrentStep('audit')}
          />
        )}

        {/* Fallback if blueprint failed to load */}
        {currentStep === 'results' && !blueprint && (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-yellow-900 mb-4">
                Blueprint Loading Issue
              </h1>
              <p className="text-yellow-800 mb-6">
                The analysis completed but we're having trouble displaying the results. 
                Check the browser console for the raw AI response.
              </p>
              <button
                onClick={() => setCurrentStep('audit')}
                className="mr-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setCurrentStep('choice');
                  setUserChoice(null);
                  setBlueprint(null);
                  setError(null);
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Heart-First Choice Definition Component
function ChoiceDefinition({ 
  onNext, 
  existingChoice 
}: { 
  onNext: (choice: UserChoice) => void;
  existingChoice?: UserChoice | null;
}) {
  // Current reality assessment - populate from existing data if available
  const [currentSituation, setCurrentSituation] = useState(existingChoice?.currentSituation || '');
  const [currentFeeling, setCurrentFeeling] = useState(existingChoice?.currentFeeling || '');
  const [energyLevel, setEnergyLevel] = useState(existingChoice?.energyLevel || 5);
  
  // Two options
  const [optionA, setOptionA] = useState(existingChoice?.optionA || '');
  const [optionB, setOptionB] = useState(existingChoice?.optionB || '');
  const [whichIsCurrent, setWhichIsCurrent] = useState<'A' | 'B' | 'neither'>(existingChoice?.whichIsCurrent || 'neither');
  const [emotionalPull, setEmotionalPull] = useState<'A' | 'B' | 'unsure'>(existingChoice?.emotionalPull || 'unsure');
  
  // Safety net assessment
  const [fallbackOption, setFallbackOption] = useState(existingChoice?.fallbackOption || '');
  const [safetyNetLevel, setSafetyNetLevel] = useState<'low' | 'medium' | 'high'>(existingChoice?.safetyNetLevel || 'medium');
  
  // Constraints (now simplified) - populate from existing data if available
  const [constraints, setConstraints] = useState<string[]>(
    existingChoice?.constraints.length 
      ? existingChoice.constraints.map(c => c.description)
      : ['']
  );

  const addConstraint = () => {
    setConstraints([...constraints, '']);
  };

  const updateConstraint = (index: number, value: string) => {
    const updated = [...constraints];
    updated[index] = value;
    setConstraints(updated);
  };

  const removeConstraint = (index: number) => {
    if (constraints.length > 1) {
      setConstraints(constraints.filter((_, i) => i !== index));
    }
  };

  const handleNext = () => {
    const filteredConstraints = constraints.filter(c => c.trim() !== '');
    
    if (!currentSituation.trim() || !optionA.trim() || !optionB.trim()) {
      return;
    }

    const choice: UserChoice = {
      id: `choice-${Date.now()}`,
      currentSituation: currentSituation.trim(),
      currentFeeling: currentFeeling.trim(),
      energyLevel,
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      whichIsCurrent,
      emotionalPull,
      fallbackOption: fallbackOption.trim(),
      safetyNetLevel,
      constraints: filteredConstraints.map((desc, index): Constraint => ({
        id: `constraint-${index}-${Date.now()}`,
        description: desc.trim(),
        category: 'uncategorized'
      })),
      createdAt: new Date()
    };

    onNext(choice);
  };

  const isValid = currentSituation.trim() && optionA.trim() && optionB.trim();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Where Are You Right Now?
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
          Let's start with your current reality, then explore your options
        </p>
      </div>

      <div className="space-y-8">
        {/* Current Reality */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Current Situation</h2>
          
          <div className="space-y-4">
            <div className="mb-8">
              <label className="block text-xl font-medium text-gray-800 mb-4">
                What's happening in your life right now?
              </label>
              <textarea
                value={currentSituation}
                onChange={(e) => setCurrentSituation(e.target.value)}
                placeholder="e.g., Working at a tech company, feeling burned out, considering a career change..."
                className="w-full p-6 text-lg border-0 bg-white/70 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-purple-400 focus:bg-white/90 transition-all resize-none shadow-sm"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                How do you feel about where you are? (Optional but helpful)
              </label>
              <textarea
                value={currentFeeling}
                onChange={(e) => setCurrentFeeling(e.target.value)}
                placeholder="e.g., Exhausted, trapped, excited about possibilities, confused..."
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Energy Level (1 = Completely Drained, 10 = Fully Energized)
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-blue-700">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-blue-700">10</span>
                <span className="text-xl font-bold text-blue-900 ml-2">{energyLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Options */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Two Paths</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-purple-700 mb-4">Option A</h3>
              <textarea
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="e.g., Stay at current job and work toward promotion..."
                className="w-full p-6 text-lg border-0 bg-white/70 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-purple-400 focus:bg-white/90 transition-all resize-none shadow-sm"
                rows={3}
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-teal-700 mb-4">Option B</h3>
              <textarea
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="e.g., Start my own consulting business..."
                className="w-full p-6 text-lg border-0 bg-white/70 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-teal-400 focus:bg-white/90 transition-all resize-none shadow-sm"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Heart Check */}
         <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
           <h2 className="text-xl font-semibold text-pink-900 mb-4 flex items-center gap-3">
             <LibIcon icon="Wellbeing" size="lg" className="text-pink-700" />
             Quick Heart Check
           </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pink-800 mb-3">
                Which is your current situation?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="current"
                    value="A"
                    checked={whichIsCurrent === 'A'}
                    onChange={(e) => setWhichIsCurrent(e.target.value as 'A')}
                    className="mr-2"
                  />
                  Option A
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="current"
                    value="B"
                    checked={whichIsCurrent === 'B'}
                    onChange={(e) => setWhichIsCurrent(e.target.value as 'B')}
                    className="mr-2"
                  />
                  Option B
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="current"
                    value="neither"
                    checked={whichIsCurrent === 'neither'}
                    onChange={(e) => setWhichIsCurrent(e.target.value as 'neither')}
                    className="mr-2"
                  />
                  Neither - I'm somewhere else
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-800 mb-3">
                If money/logistics weren't a factor, which would you choose?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="emotional"
                    value="A"
                    checked={emotionalPull === 'A'}
                    onChange={(e) => setEmotionalPull(e.target.value as 'A')}
                    className="mr-2"
                  />
                  Option A
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="emotional"
                    value="B"
                    checked={emotionalPull === 'B'}
                    onChange={(e) => setEmotionalPull(e.target.value as 'B')}
                    className="mr-2"
                  />
                  Option B
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="emotional"
                    value="unsure"
                    checked={emotionalPull === 'unsure'}
                    onChange={(e) => setEmotionalPull(e.target.value as 'unsure')}
                    className="mr-2"
                  />
                  I'm genuinely unsure
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Net Assessment */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-orange-900 mb-4">Safety Net Reality Check</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">
                If your preferred option doesn't work out, what's your fallback?
              </label>
              <textarea
                value={fallbackOption}
                onChange={(e) => setFallbackOption(e.target.value)}
                placeholder="e.g., Go back to software engineering, move in with family, freelance part-time..."
                className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">
                How would you describe your financial safety net?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="safety"
                    value="low"
                    checked={safetyNetLevel === 'low'}
                    onChange={(e) => setSafetyNetLevel(e.target.value as 'low')}
                    className="mr-2"
                  />
                  Low - Living paycheck to paycheck, few options
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="safety"
                    value="medium"
                    checked={safetyNetLevel === 'medium'}
                    onChange={(e) => setSafetyNetLevel(e.target.value as 'medium')}
                    className="mr-2"
                  />
                  Medium - Some savings, could survive a few months without income
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="safety"
                    value="high"
                    checked={safetyNetLevel === 'high'}
                    onChange={(e) => setSafetyNetLevel(e.target.value as 'high')}
                    className="mr-2"
                  />
                  High - Financially secure, could take significant risks
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Constraints (simplified) */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Constraints (Optional)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Any major practical considerations we should know about?
          </p>
          
          <div className="space-y-3">
            {constraints.map((constraint, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => updateConstraint(index, e.target.value)}
                  placeholder="e.g., Health insurance needs, family obligations, visa restrictions..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                {constraints.length > 1 && (
                  <button
                    onClick={() => removeConstraint(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addConstraint}
              className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium"
              type="button"
            >
              + Add Another Constraint
            </button>
          </div>
        </div>

        {/* Next Button */}
        <div className="pt-6">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg"
          >
            Next: Analyze Your Constraints →
          </button>
          {!isValid && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Please fill in your current situation and both options to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Discipline Audit Component
function DisciplineAudit({ 
  choice, 
  onNext, 
  onBack 
}: { 
  choice: UserChoice; 
  onNext: (choice: UserChoice) => void; 
  onBack: () => void; 
}) {
  const [constraints, setConstraints] = useState<Constraint[]>(choice.constraints);

  const updateConstraintCategory = (constraintId: string, category: 'truth' | 'problem') => {
    setConstraints(prev => 
      prev.map(constraint => 
        constraint.id === constraintId 
          ? { ...constraint, category }
          : constraint
      )
    );
  };

  const handleNext = () => {
    const updatedChoice: UserChoice = {
      ...choice,
      constraints
    };
    onNext(updatedChoice);
  };

  const categorizedCount = constraints.filter(c => c.category !== 'uncategorized').length;
  const allCategorized = categorizedCount === constraints.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          The Discipline Audit
        </h1>
        <p className="text-xl text-gray-600 mb-6 leading-relaxed max-w-4xl">
          For each constraint, decide: Is this a <strong>Truth to Accommodate</strong> or a <strong>Problem to Solve</strong>?
        </p>
        
        <div className="bg-gray-200 rounded-full h-2 max-w-md mx-auto mb-6">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(categorizedCount / constraints.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {categorizedCount} of {constraints.length} constraints categorized
        </p>
      </div>

      {/* Explanation Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
           <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-3">
             <LibIcon icon="Shield" size="lg" className="text-blue-700" />
             Truth to Accommodate
           </h3>
          <p className="text-blue-800 mb-3">
            Non-negotiable realities you must work around. These require creative bridge-building, not elimination.
          </p>
          <div className="text-sm text-blue-700">
            <strong>Examples:</strong> Having young children, visa restrictions, physical limitations, family obligations
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
           <h3 className="text-xl font-semibold text-red-900 mb-3 flex items-center gap-3">
             <LibIcon icon="Settings" size="lg" className="text-red-700" />
             Problem to Solve
           </h3>
          <p className="text-red-800 mb-3">
            Temporary obstacles that can be addressed, reduced, or eliminated with time and strategy.
          </p>
          <div className="text-sm text-red-700">
            <strong>Examples:</strong> Lack of savings, missing skills, imposter syndrome, unclear business plan
          </div>
        </div>
      </div>

      {/* Constraint Categorization */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Categorize Your Constraints
        </h2>
        
        {constraints.map((constraint, index) => (
          <div key={constraint.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                  {index + 1}
                </span>
                <p className="text-lg text-gray-800 flex-1">
                  {constraint.description}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
               <button
                 onClick={() => updateConstraintCategory(constraint.id, 'truth')}
                 className={`p-4 rounded-lg border-2 text-left transition-all ${
                   constraint.category === 'truth'
                     ? 'border-blue-500 bg-blue-50 text-blue-900'
                     : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                 }`}
               >
                 <div className="flex items-center gap-2 mb-2">
                   <LibIcon icon="Shield" size="md" className="text-blue-600" />
                   <span className="font-semibold">Truth to Accommodate</span>
                   {constraint.category === 'truth' && (
                     <LibIcon icon="Success" size="sm" className="text-blue-600 ml-auto" />
                   )}
                 </div>
                <p className="text-sm opacity-75">
                  This is a reality I need to work around
                </p>
              </button>
              
               <button
                 onClick={() => updateConstraintCategory(constraint.id, 'problem')}
                 className={`p-4 rounded-lg border-2 text-left transition-all ${
                   constraint.category === 'problem'
                     ? 'border-red-500 bg-red-50 text-red-900'
                     : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                 }`}
               >
                 <div className="flex items-center gap-2 mb-2">
                   <LibIcon icon="Settings" size="md" className="text-red-600" />
                   <span className="font-semibold">Problem to Solve</span>
                   {constraint.category === 'problem' && (
                     <LibIcon icon="Success" size="sm" className="text-red-600 ml-auto" />
                   )}
                 </div>
                <p className="text-sm opacity-75">
                  This is an obstacle I can address over time
                </p>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!allCategorized}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Generate Bridge Blueprint →
        </button>
      </div>
      
      {!allCategorized && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Please categorize all constraints to continue
        </p>
      )}
    </div>
  );
}

// Comprehensive Blueprint Display Component
function BlueprintDisplay({ 
  blueprint, 
  userChoice, 
  onStartOver, 
  onBackToAudit,
  onEditChoice
}: { 
  blueprint: Blueprint; 
  userChoice: UserChoice; 
  onStartOver: () => void;
  onBackToAudit: () => void;
  onEditChoice: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'recommendation' | 'paths' | 'bridges' | 'timeline' | 'contingencies'>('recommendation');

  const getChoicePath = (choice: 'A' | 'B') => 
    choice === 'A' ? userChoice.optionA : userChoice.optionB;

  const getRecommendedPath = () =>
    blueprint.recommendation.choice === 'A' ? blueprint.pathAnalysis.optionA : blueprint.pathAnalysis.optionB;

  const getAlternativePath = () =>
    blueprint.recommendation.choice === 'A' ? blueprint.pathAnalysis.optionB : blueprint.pathAnalysis.optionA;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header - Recommendation Summary */}
      <div className="mb-12">
        <div className="mb-8">
          <div className={`inline-flex items-center px-6 py-3 rounded-lg border-2 ${getConfidenceColor(blueprint.recommendation.confidence)}`}>
            <span className="text-2xl font-bold mr-3">{blueprint.recommendation.confidence}%</span>
            <span className="font-medium">Confidence</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          Your Strategic Analysis
        </h1>
        
        <div className="max-w-4xl">
           <div className="flex items-start gap-4 mb-6">
             <LibIcon icon="Focus" size="3xl" className="text-green-600 mt-1" />
             <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Recommended Path: Option {blueprint.recommendation.choice}
              </h2>
              <p className="text-xl md:text-2xl font-medium text-gray-800 mb-4 leading-relaxed">
                {getChoicePath(blueprint.recommendation.choice).replace(/^[""]|[""]$/g, '')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {blueprint.recommendation.reasoning.replace(/^[""]|[""]$/g, '')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'recommendation', label: 'Analysis Summary' },
            { id: 'paths', label: 'Both Paths Compared' },
            { id: 'bridges', label: 'Bridge Strategies' },
            { id: 'timeline', label: 'Action Timeline' },
            { id: 'contingencies', label: 'Backup Plans' }
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'recommendation' && (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{getRecommendedPath().viabilityScore}</div>
              <div className="text-gray-600 font-medium">Recommended Path Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{blueprint.bridges.length}</div>
              <div className="text-gray-600 font-medium">Bridge Strategies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">{blueprint.timeline.length}</div>
              <div className="text-gray-600 font-medium">Implementation Phases</div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="max-w-4xl">
             <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               <LibIcon icon="Focus" size="xl" className="text-purple-600" />
               Strategic Insights
             </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-green-900 mb-3">Why {getRecommendedPath().title}:</h4>
                <p className="text-lg text-gray-700 leading-relaxed">{getRecommendedPath().strengthsAnalysis}</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Key Challenge to Address:</h4>
                <p className="text-lg text-gray-700 leading-relaxed">{getRecommendedPath().weaknessesAnalysis}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'paths' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recommended Path */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-green-900 flex items-center gap-3">
                 <LibIcon icon="Focus" size="lg" className="text-green-700" />
                 {getRecommendedPath().title}
               </h3>
              <span className="text-2xl font-bold text-green-600">
                {getRecommendedPath().viabilityScore}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Strengths:</h4>
                <p className="text-green-700 text-sm">{getRecommendedPath().strengthsAnalysis}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Challenges:</h4>
                <p className="text-green-700 text-sm">{getRecommendedPath().weaknessesAnalysis}</p>
              </div>

              {getRecommendedPath().bridgeStrategy && (
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Bridge Strategy:</h4>
                  <p className="text-green-700 text-sm">{getRecommendedPath().bridgeStrategy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Alternative Path */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {getAlternativePath().title}
              </h3>
              <span className="text-2xl font-bold text-gray-600">
                {getAlternativePath().viabilityScore}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Strengths:</h4>
                <p className="text-gray-700 text-sm">{getAlternativePath().strengthsAnalysis}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Challenges:</h4>
                <p className="text-gray-700 text-sm">{getAlternativePath().weaknessesAnalysis}</p>
              </div>

              {getAlternativePath().optimizationStrategy && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">How to Optimize:</h4>
                  <p className="text-gray-700 text-sm">{getAlternativePath().optimizationStrategy}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bridges' && (
        <div className="space-y-6">
          <p className="text-gray-600">
            Specific strategies designed around your constraint profile to bridge from your current state to your recommended path.
          </p>
          
          {blueprint.bridges.map((bridge, index) => (
            <div key={bridge.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-600 text-sm font-bold px-3 py-1 rounded-full">
                  Strategy {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">{bridge.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(bridge.riskLevel)}`}>
                  {bridge.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{bridge.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Why This Fits You:</h4>
                  <p className="text-gray-700 text-sm">{bridge.suitability}</p>
                  <p className="text-sm text-gray-500 mt-2">Timeline: {bridge.timeline}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Resources:</h4>
                  <div className="space-y-2">
                    {bridge.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="bg-gray-50 border border-gray-200 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{resource.title}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded uppercase">
                            {resource.cost}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{resource.description}</p>
                        <span className="text-xs text-blue-600">{resource.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <p className="text-gray-600">
            A phased approach to implementing your recommended path, with specific actions and risk awareness.
          </p>
          
          {blueprint.timeline.map((phase, index) => (
            <div key={phase.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-purple-100 text-purple-600 text-sm font-bold px-3 py-1 rounded-full">
                  Phase {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">{phase.phase}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {phase.timeframe}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 font-medium">{phase.objective}</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                  <div className="space-y-2">
                    {phase.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-sm font-medium text-gray-900">{action.action}</p>
                         <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                           <span className="flex items-center gap-1">
                             <LibIcon icon="TimeTracking" size="xs" />
                             {action.estimatedTime}
                           </span>
                           <span className="flex items-center gap-1">
                             <LibIcon icon="BarChart3" size="xs" />
                             {action.difficulty}
                           </span>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Milestones</h4>
                  <div className="space-y-2">
                    {phase.milestones.map((milestone, milestoneIndex) => (
                      <div key={milestoneIndex} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Risk Factors</h4>
                  <div className="space-y-2">
                    {phase.riskFactors.map((risk, riskIndex) => (
                      <div key={riskIndex} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contingencies' && (
        <div className="space-y-6">
          <p className="text-gray-600">
            Backup strategies and early warning signals to help you adapt if circumstances change.
          </p>
          
          <div className="grid gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-3">
                 <LibIcon icon="Warning" size="lg" className="text-yellow-700" />
                 If Recommended Path Fails
               </h3>
              <p className="text-yellow-800">{blueprint.contingencies.ifRecommendedPathFails}</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-3">
                 <LibIcon icon="ExternalLink" size="lg" className="text-red-700" />
                 Emergency Exits
               </h3>
              <ul className="space-y-2">
                {blueprint.contingencies.emergencyExits.map((exit, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-800">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    {exit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-3">
                 <LibIcon icon="Analytics" size="lg" className="text-blue-700" />
                 Signals to Watch
               </h3>
              <ul className="space-y-2">
                {blueprint.contingencies.signalsToWatch.map((signal, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-800">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-8 mt-12">
        <div className="flex justify-between items-center">
          <button
            onClick={onBackToAudit}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ← Refine Analysis
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onEditChoice}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
            >
              Edit Choices
            </button>
            <button
              onClick={() => {
                // Save blueprint to localStorage
                localStorage.setItem('insight-engine-blueprint', JSON.stringify({
                  blueprint,
                  userChoice,
                  generatedAt: new Date().toISOString()
                }));
                alert('Blueprint saved to your browser storage!');
              }}
              className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium"
            >
              Save Blueprint
            </button>
            <button
              onClick={onStartOver}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InsightEnginePage() {
  return <InsightEngine />;
}