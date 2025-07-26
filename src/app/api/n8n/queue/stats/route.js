import { NextResponse } from 'next/server';
import { getQueueStats } from '../../../../../db/queue';

export async function GET() {
  try {
    const stats = await getQueueStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting queue stats:', error);
    return NextResponse.json({ 
      error: 'Failed to get queue statistics',
      details: error.message 
    }, { status: 500 });
  }
} 