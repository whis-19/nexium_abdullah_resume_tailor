import { NextResponse } from 'next/server';
import { addToQueue, getQueueStatus, updateQueueStatus } from '../../../../db/queue';
import { generateAISuggestions, correctText } from '../../../ai/generate';

// Helper function to check if n8n is available
async function checkN8nAvailability() {
  try {
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678';
    const response = await fetch(`${n8nUrl}/healthz`, { 
      method: 'GET',
      timeout: 3000 // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.log('n8n not available, falling back to direct API:', error.message);
    return false;
  }
}

// Helper function to process AI requests directly (fallback)
async function processDirectAIRequest(action, data) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  switch (action) {
    case 'generate_suggestions':
      if (!data?.jobDescription) {
        throw new Error('Job description is required');
      }
      return await generateAISuggestions(data.jobDescription, apiKey);
      
    case 'correct_text':
      if (!data?.text) {
        throw new Error('Text to correct is required');
      }
      return await correctText(data.text, apiKey);
      
    default:
      throw new Error(`Unsupported action for direct processing: ${action}`);
  }
}

export async function POST(request) {
  try {
    const { action, data, userId } = await request.json();
    
    // Check if n8n is available
    const n8nAvailable = await checkN8nAvailability();
    
    if (!n8nAvailable) {
      // Fallback to direct API processing - no queue involved
      console.log(`n8n not available, processing ${action} directly with Gemini API`);
      
      try {
        const result = await processDirectAIRequest(action, data);
        
        // Return results directly without any queue involvement
        const resultKey = action === 'correct_text' ? 'correctedText' : 'suggestions';
        return NextResponse.json({ 
          status: 'completed',
          result: { [resultKey]: result },
          message: 'AI request processed directly (n8n fallback)'
        });
        
      } catch (error) {
        console.error('Direct API processing failed:', error);
        return NextResponse.json({ 
          error: 'AI processing failed',
          details: error.message 
        }, { status: 500 });
      }
    }
    
    // n8n is available, use queue system as before
    switch (action) {
      case 'generate_suggestions':
        if (!data?.jobDescription) {
          return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
        }
        
        const queueItem = await addToQueue({
          type: 'suggestions',
          payload: { jobDescription: data.jobDescription },
          userId: userId || 'anonymous'
        });
        
        return NextResponse.json({ 
          queueId: queueItem.id, 
          status: 'queued',
          message: 'AI suggestions request queued successfully'
        });
        
      case 'correct_text':
        if (!data?.text) {
          return NextResponse.json({ error: 'Text to correct is required' }, { status: 400 });
        }
        
        const correctionItem = await addToQueue({
          type: 'correction',
          payload: { text: data.text },
          userId: userId || 'anonymous'
        });
        
        return NextResponse.json({ 
          queueId: correctionItem.id, 
          status: 'queued',
          message: 'Text correction request queued successfully'
        });
        
      case 'optimize_resume':
        if (!data?.resumeId) {
          return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
        }
        
        const optimizationItem = await addToQueue({
          type: 'optimization',
          payload: { 
            resumeId: data.resumeId,
            optimizationType: data.optimizationType || 'general'
          },
          userId: userId || 'anonymous'
        });
        
        return NextResponse.json({ 
          queueId: optimizationItem.id, 
          status: 'queued',
          message: 'Resume optimization request queued successfully'
        });
        
      default:
        return NextResponse.json({ 
          error: 'Invalid action. Supported actions: generate_suggestions, correct_text, optimize_resume' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('n8n webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queueId = searchParams.get('queueId');
    
    if (!queueId) {
      return NextResponse.json({ error: 'Queue ID is required' }, { status: 400 });
    }
    
    const status = await getQueueStatus(queueId);
    
    if (!status) {
      return NextResponse.json({ error: 'Queue item not found' }, { status: 404 });
    }
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Queue status check error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { queueId, status, result, error } = await request.json();
    
    if (!queueId || !status) {
      return NextResponse.json({ error: 'Queue ID and status are required' }, { status: 400 });
    }
    
    const updated = await updateQueueStatus(queueId, {
      status,
      result,
      error,
      processedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Queue status updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Queue status update error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 