import { NextResponse } from 'next/server';

// GET /api/health - Health check endpoint for Status Page monitoring
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'Support Portal',
    timestamp: new Date().toISOString(),
  });
}
