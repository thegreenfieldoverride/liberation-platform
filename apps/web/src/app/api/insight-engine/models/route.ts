import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = await genAI.ListModels ? await genAI.ListModels() : await genAI.listModels();
    
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