import { NextResponse } from 'next/server';
import { getPendingRequests, updateQueueStatus, getCachedResponse, cacheResponse } from '../../../../db/queue';
import { generateAISuggestions, correctText } from '../../../ai/generate';

// Simple hash function for caching
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

export async function POST(request) {
  try {
    const { action } = await request.json();
    
    if (action === 'process_pending') {
      // Get pending requests
      const pendingRequests = await getPendingRequests(5); // Process 5 at a time
      
      for (const request of pendingRequests) {
        try {
          // Mark as processing
          await updateQueueStatus(request.id, { status: 'processing' });
          
          let result;
          
          if (request.request_type === 'suggestions') {
            const jobDescription = request.payload.jobDescription;
            const promptHash = simpleHash(jobDescription);
            
            // Check cache first
            const cached = await getCachedResponse(promptHash);
            if (cached) {
              result = { suggestions: cached.response };
            } else {
              // Generate new suggestions
              const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
              const suggestions = await generateAISuggestions(jobDescription, apiKey);
              
              // Cache the result
              await cacheResponse(promptHash, suggestions);
              
              result = { suggestions };
            }
          } else if (request.request_type === 'correction') {
            const text = request.payload.text;
            const promptHash = simpleHash(text);
            
            // Check cache first
            const cached = await getCachedResponse(promptHash);
            if (cached) {
              result = { correctedText: cached.response };
            } else {
              // Generate correction
              const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
              const corrected = await correctText(text, apiKey);
              
              // Cache the result
              await cacheResponse(promptHash, corrected);
              
              result = { correctedText: corrected };
            }
          } else if (request.request_type === 'optimization') {
            // Resume optimization logic
            result = { 
              message: 'Resume optimization completed',
              optimizationType: request.payload.optimizationType 
            };
          }
          
          // Mark as completed
          await updateQueueStatus(request.id, { 
            status: 'completed',
            result: result
          });
          
        } catch (error) {
          console.error(`Error processing request ${request.id}:`, error);
          
          // Mark as failed
          await updateQueueStatus(request.id, { 
            status: 'failed',
            error: error.message
          });
        }
      }
      
      return NextResponse.json({ 
        success: true,
        processed: pendingRequests.length,
        message: `Processed ${pendingRequests.length} requests`
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Processor error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 