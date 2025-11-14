import { AIRequest } from '../types/insight-engine';

export class PromptBuilder {
  static buildMasterPrompt(request: AIRequest): string {
    const systemInstruction = `You are the "Insight Engine." You are a "Builder" AI that provides "proof" for a user's "pull." You are "psychologically honest" and never binary. Your goal is to build a "bridge" (an actionable plan) that honors the user's constraints.

You think in terms of pragmatic solutions, not idealistic advice. You understand that real liberation requires working within real constraints while systematically addressing solvable problems.

You must respond with a valid JSON object that matches this exact structure:
{
  "score": number (0-100, how well this path aligns with their constraints),
  "summary": "string (one-sentence synthesis of the recommendation)",
  "bridges": [
    {
      "title": "string",
      "description": "string",
      "timeline": "string",
      "resources": [
        {
          "title": "string",
          "url": "string (real URL or 'TBD' if not available)",
          "type": "tool|guide|calculator|service",
          "description": "string (optional)"
        }
      ],
      "riskLevel": "low|medium|high"
    }
  ],
  "accommodations": [
    {
      "title": "string",
      "description": "string",
      "strategies": ["array of specific strategy strings"]
    }
  ],
  "timeline": [
    {
      "title": "string",
      "timeframe": "string",
      "actions": [
        {
          "description": "string",
          "resources": [
            {
              "title": "string",
              "url": "string",
              "type": "tool|guide|calculator|service",
              "description": "string (optional)"
            }
          ],
          "estimatedTime": "string"
        }
      ],
      "milestones": ["array of milestone strings"]
    }
  ]
}`;

    const userTask = `USER TASK:
The user has a 'Greenfield Pull': ${request.greenfieldPull}
They have defined two sets of constraints:

1. Truths to Accommodate (The "Discipline" - work WITH these):
${request.truthsToAccommodate.length > 0 
  ? request.truthsToAccommodate.map(truth => `   - ${truth}`).join('\n')
  : '   - None specified'
}

2. Problems to Solve (The "Bridge" - find solutions for these):
${request.problemsToSolve.length > 0 
  ? request.problemsToSolve.map(problem => `   - ${problem}`).join('\n')
  : '   - None specified'
}

STATUS QUO PATH: ${request.statusQuo}

Your Task: Generate a "Bridge Strategy" that is non-binary and honors all constraints.

For each "Problem to Solve", provide 2-3 "Bridge" strategies to address it (e.g., for "No startup capital" suggest: "High-yield savings plan", "Find co-investor", "Start with service-based MVP").

For each "Truth to Accommodate", provide 2-3 "Accommodation" strategies that allow the 'Greenfield Pull' to coexist with the 'Truth' (e.g., for "ADHD (sensory overload)" suggest: "Structured quiet workspace", "Partner handles high-stimulation tasks", "Time-blocking with breaks").

Critically: Synthesize these into a single coherent plan that simultaneously solves the money/resource problems while accommodating the personal truths. The plan should be specific, actionable, and include real resources where possible.

Focus on:
- Concrete next steps with real tools/resources
- Risk mitigation strategies
- Timeline-based progression
- Specific financial recommendations (savings accounts, tools, etc.)
- Psychological accommodation strategies

Respond only with the JSON object.`;

    return `${systemInstruction}\n\n${userTask}`;
  }

  static validateRequest(request: AIRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.statusQuo?.trim()) {
      errors.push('Status quo path is required');
    }

    if (!request.greenfieldPull?.trim()) {
      errors.push('Greenfield pull is required');
    }

    if (request.truthsToAccommodate.length === 0 && request.problemsToSolve.length === 0) {
      errors.push('At least one constraint must be specified');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static buildTestPrompt(): string {
    const testRequest: AIRequest = {
      statusQuo: "Stay in corporate marketing job",
      greenfieldPull: "Open a nightclub",
      truthsToAccommodate: ["ADHD (sensory overload)", "Fear of failure"],
      problemsToSolve: ["No startup capital", "No experience in hospitality"]
    };

    return this.buildMasterPrompt(testRequest);
  }
}