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