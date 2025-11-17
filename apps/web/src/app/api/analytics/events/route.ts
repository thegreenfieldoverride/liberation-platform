import { NextRequest, NextResponse } from 'next/server';

const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to our analytics service
    // Return success immediately if analytics service is not configured
    if (!ANALYTICS_SERVICE_URL || ANALYTICS_SERVICE_URL === 'http://localhost:8080') {
      console.warn('Analytics service not configured or using default localhost - event not tracked');
      return NextResponse.json({ 
        success: true, 
        message: 'Analytics service not configured - event logged locally only' 
      });
    }

    const response = await fetch(`${ANALYTICS_SERVICE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });

    if (!response.ok) {
      console.error('Analytics service error:', response.status, response.statusText);
      // Don't fail the request - analytics is non-critical
      return NextResponse.json({ 
        success: true, 
        message: 'Analytics service unavailable - event logged locally only' 
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics API error:', error);
    // Don't fail the request - analytics is non-critical
    return NextResponse.json({ 
      success: true, 
      message: 'Analytics error - event logged locally only' 
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