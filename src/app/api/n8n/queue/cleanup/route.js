import { NextResponse } from 'next/server';
import { cleanupOldRequests } from '../../../../../db/queue';

export async function POST() {
  try {
    const cleanedItems = await cleanupOldRequests();
    return NextResponse.json({ 
      success: true,
      message: `Cleaned up ${cleanedItems.length} old requests`,
      cleanedItems 
    });
  } catch (error) {
    console.error('Error cleaning up old requests:', error);
    return NextResponse.json({ 
      error: 'Failed to cleanup old requests',
      details: error.message 
    }, { status: 500 });
  }
} 