import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, request: aiRequest } = await request.json();

    // Validate required fields
    if (!prompt || !aiRequest) {
      return NextResponse.json(
        { error: 'Missing prompt or request data' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    // Initialize Gemini with a working model from the available list
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use a current working model (from the listModels output)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'  // Current working model
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    let aiResponse;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      aiResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', text);
      
      // Return a structured error response
      return NextResponse.json({
        error: 'Failed to parse AI response',
        details: parseError instanceof Error ? parseError.message : 'Unknown error',
        rawResponse: text.substring(0, 500) // First 500 chars for debugging
      }, { status: 500 });
    }

    // Validate the AI response structure
    const requiredFields = ['recommendation', 'pathAnalysis', 'bridges', 'accommodations', 'timeline', 'contingencies'];
    const missingFields = requiredFields.filter(field => !(field in aiResponse));
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Invalid AI response structure - please check the prompt format',
        missingFields,
        receivedFields: Object.keys(aiResponse),
        hint: 'The AI may need clearer JSON format instructions'
      }, { status: 500 });
    }

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('Insight Engine API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}