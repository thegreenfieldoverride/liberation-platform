import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log analytics event locally (console only for now)
    // In the future, this could store to a database or send to a service
    console.log('📊 Analytics event:', {
      type: body.type,
      tool: body.tool,
      timestamp: new Date().toISOString(),
      data: body.data
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Event tracked'
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    // Don't fail the request - analytics is non-critical
    return NextResponse.json({ 
      success: true, 
      message: 'Event logged'
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}