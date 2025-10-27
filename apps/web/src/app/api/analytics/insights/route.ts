import { NextRequest, NextResponse } from 'next/server';

const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'usage';
    
    let endpoint = '/api/insights/usage';
    switch (type) {
      case 'geographic':
        endpoint = '/api/insights/geographic';
        break;
      case 'financial':
        endpoint = '/api/insights/financial';
        break;
      default:
        endpoint = '/api/insights/usage';
    }

    const response = await fetch(`${ANALYTICS_SERVICE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Analytics service error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Analytics service unavailable' },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics insights API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}