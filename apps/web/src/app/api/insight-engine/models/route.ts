import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return hardcoded model info since listModels API is not available
    // This is primarily for development/debugging purposes
    const modelList = [
      {
        name: 'gemini-2.5-flash',
        displayName: 'Gemini 2.5 Flash', 
        description: 'Fast, lightweight model for text generation',
        supportedGenerationMethods: ['generateContent']
      }
    ];

    return NextResponse.json({ 
      models: modelList,
      count: modelList.length,
      note: 'Hardcoded model list - listModels API not available'
    });
  } catch (error) {
    console.error('Error in models endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available models' },
      { status: 500 }
    );
  }
}

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = await genAI.listModels();
    
    const modelList = models.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedGenerationMethods: model.supportedGenerationMethods,
      inputTokenLimit: model.inputTokenLimit,
      outputTokenLimit: model.outputTokenLimit
    }));

    return NextResponse.json({
      availableModels: modelList,
      count: modelList.length
    });

  } catch (error) {
    console.error('Error listing models:', error);
    return NextResponse.json({
      error: 'Failed to list models',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}