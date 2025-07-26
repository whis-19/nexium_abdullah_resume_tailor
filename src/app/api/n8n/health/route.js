import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678';
    const response = await fetch(`${n8nUrl}/healthz`, { 
      method: 'GET',
      timeout: 3000 // 3 second timeout
    });
    
    return NextResponse.json({ 
      available: response.ok,
      status: response.status,
      message: response.ok ? 'n8n is available' : 'n8n is not available'
    });
  } catch (error) {
    console.log('n8n health check failed:', error.message);
    return NextResponse.json({ 
      available: false,
      status: 'error',
      message: 'n8n is not available',
      error: error.message
    });
  }
} 