import { AIRequest, AIResponse, BridgeBlueprint, UserChoice } from '../types/insight-engine';
import { PromptBuilder } from '../utils/promptBuilder';

class AIService {
  private apiEndpoint: string = '/api/insight-engine/generate';

  async generateBlueprint(request: AIRequest): Promise<BridgeBlueprint> {
    // Validate request
    const validation = PromptBuilder.validateRequest(request);
    if (!validation.isValid) {
      throw new Error(`Invalid request: ${validation.errors.join(', ')}`);
    }

    // Build the prompt
    const prompt = PromptBuilder.buildMasterPrompt(request);

    try {
      // Call our API endpoint (which will call Gemini)
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          request
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API call failed: ${response.status} ${error}`);
      }

      const aiResponse: AIResponse = await response.json();
      
      // Transform AI response to BridgeBlueprint
      return this.transformToBridgeBlueprint(aiResponse, request);
    } catch (error) {
      console.error('AI service error:', error);
      
      // For development, return a mock response
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock AI response for development');
        return this.getMockBlueprint(request);
      }
      
      throw new Error(`Failed to generate blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private transformToBridgeBlueprint(aiResponse: AIResponse, request: AIRequest): BridgeBlueprint {
    const now = new Date();
    
    return {
      id: `blueprint-${now.getTime()}`,
      userChoiceId: `choice-${now.getTime()}`, // This should be passed in
      score: aiResponse.score,
      summary: aiResponse.summary,
      bridges: aiResponse.bridges.map((bridge, index) => ({
        ...bridge,
        id: `bridge-${index}-${now.getTime()}`
      })),
      accommodations: aiResponse.accommodations.map((acc, index) => ({
        ...acc,
        id: `accommodation-${index}-${now.getTime()}`,
        constraintId: `constraint-${index}` // This should map to actual constraints
      })),
      timeline: aiResponse.timeline.map((phase, index) => ({
        ...phase,
        id: `phase-${index}-${now.getTime()}`,
        actions: phase.actions.map((action, actionIndex) => ({
          ...action,
          id: `action-${actionIndex}-${now.getTime()}`,
          completed: false
        }))
      })),
      createdAt: now
    };
  }

  // Mock response for development/testing
  private getMockBlueprint(request: AIRequest): BridgeBlueprint {
    const now = new Date();
    
    return {
      id: `mock-blueprint-${now.getTime()}`,
      userChoiceId: `mock-choice-${now.getTime()}`,
      score: 78,
      summary: `The '${request.greenfieldPull}' path aligns well with your constraints but requires strategic planning around identified challenges.`,
      bridges: [
        {
          id: `mock-bridge-1-${now.getTime()}`,
          title: "Capital Bridge Strategy",
          description: "Create a step-by-step savings and investment plan to address startup capital needs",
          timeline: "6-12 months",
          resources: [
            {
              title: "Marcus High-Yield Savings",
              url: "https://www.marcus.com/us/en/savings",
              type: "tool" as const,
              description: "4.5% APY savings account for building startup capital"
            },
            {
              title: "SCORE Mentorship",
              url: "https://www.score.org/",
              type: "service" as const,
              description: "Free business mentorship and planning resources"
            }
          ],
          riskLevel: "medium" as const
        }
      ],
      accommodations: [
        {
          id: `mock-accommodation-1-${now.getTime()}`,
          title: "Constraint Management",
          description: "Strategies to work with your personal truths while pursuing your greenfield path",
          strategies: [
            "Create structured daily routines to manage energy levels",
            "Build in buffer time for decision-making processes",
            "Establish clear boundaries around high-stress activities"
          ],
          constraintId: "constraint-1"
        }
      ],
      timeline: [
        {
          id: `mock-phase-1-${now.getTime()}`,
          title: "Foundation Phase",
          timeframe: "Next 30 days",
          actions: [
            {
              id: `mock-action-1-${now.getTime()}`,
              description: "Open high-yield savings account and set up automatic transfers",
              resources: [
                {
                  title: "Marcus High-Yield Savings",
                  url: "https://www.marcus.com/us/en/savings",
                  type: "tool" as const
                }
              ],
              completed: false,
              estimatedTime: "2 hours"
            }
          ],
          milestones: [
            "Savings account opened",
            "Monthly savings goal established",
            "First $500 saved"
          ]
        }
      ],
      createdAt: now
    };
  }

  // Test the prompt building
  getTestPrompt(): string {
    return PromptBuilder.buildTestPrompt();
  }
}

export const aiService = new AIService();

// Helper function to transform UserChoice to AIRequest and generate blueprint
export async function generateBridgeBlueprint(userChoice: UserChoice): Promise<BridgeBlueprint> {
  const truthsToAccommodate = userChoice.constraints
    .filter(c => c.category === 'truth')
    .map(c => c.description);
    
  const problemsToSolve = userChoice.constraints
    .filter(c => c.category === 'problem')
    .map(c => c.description);

  const aiRequest: AIRequest = {
    statusQuo: userChoice.statusQuo,
    greenfieldPull: userChoice.greenfieldPull,
    truthsToAccommodate,
    problemsToSolve
  };

  return aiService.generateBlueprint(aiRequest);
}