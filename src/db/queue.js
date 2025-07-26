import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Add a new request to the queue
export async function addToQueue({ type, payload, userId }) {
  try {
    const { data, error } = await supabase
      .from('ai_request_queue')
      .insert({
        user_id: userId,
        request_type: type,
        payload: payload,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to queue:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in addToQueue:', error);
    throw error;
  }
}

// Get the status of a queue item
export async function getQueueStatus(queueId) {
  try {
    const { data, error } = await supabase
      .from('ai_request_queue')
      .select('*')
      .eq('id', queueId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error getting queue status:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in getQueueStatus:', error);
    throw error;
  }
}

// Update the status of a queue item
export async function updateQueueStatus(queueId, updates) {
  try {
    const { data, error } = await supabase
      .from('ai_request_queue')
      .update(updates)
      .eq('id', queueId)
      .select()
      .single();

    if (error) {
      console.error('Error updating queue status:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in updateQueueStatus:', error);
    throw error;
  }
}

// Get all pending requests for processing
export async function getPendingRequests(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('ai_request_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error getting pending requests:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in getPendingRequests:', error);
    throw error;
  }
}

// Get queue statistics
export async function getQueueStats() {
  try {
    const { data, error } = await supabase
      .from('ai_request_queue')
      .select('status, created_at');

    if (error) {
      console.error('Error getting queue stats:', error);
      throw new Error(error.message);
    }

    const stats = {
      total: data.length,
      pending: data.filter(item => item.status === 'pending').length,
      processing: data.filter(item => item.status === 'processing').length,
      completed: data.filter(item => item.status === 'completed').length,
      failed: data.filter(item => item.status === 'failed').length,
      today: data.filter(item => {
        const today = new Date();
        const itemDate = new Date(item.created_at);
        return itemDate.toDateString() === today.toDateString();
      }).length
    };

    return stats;
  } catch (error) {
    console.error('Database error in getQueueStats:', error);
    throw error;
  }
}

// Clean up old completed/failed requests (older than 30 days)
export async function cleanupOldRequests() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('ai_request_queue')
      .delete()
      .in('status', ['completed', 'failed'])
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select();

    if (error) {
      console.error('Error cleaning up old requests:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in cleanupOldRequests:', error);
    throw error;
  }
}

// Cache management functions
export async function getCachedResponse(promptHash) {
  try {
    const { data, error } = await supabase
      .from('ai_response_cache')
      .select('*')
      .eq('prompt_hash', promptHash)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found or expired
      }
      console.error('Error getting cached response:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in getCachedResponse:', error);
    throw error;
  }
}

export async function cacheResponse(promptHash, response, model = 'gemini-1.5-flash') {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Cache for 24 hours

    const { data, error } = await supabase
      .from('ai_response_cache')
      .upsert({
        prompt_hash: promptHash,
        response: response,
        model: model,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error caching response:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in cacheResponse:', error);
    throw error;
  }
}

// Resume optimization history
export async function logOptimizationHistory(resumeId, optimizationType, beforeContent, afterContent, aiSuggestions) {
  try {
    const { data, error } = await supabase
      .from('resume_optimization_history')
      .insert({
        resume_id: resumeId,
        optimization_type: optimizationType,
        before_content: beforeContent,
        after_content: afterContent,
        ai_suggestions: aiSuggestions
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging optimization history:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in logOptimizationHistory:', error);
    throw error;
  }
}

// Get optimization history for a resume
export async function getOptimizationHistory(resumeId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('resume_optimization_history')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting optimization history:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Database error in getOptimizationHistory:', error);
    throw error;
  }
} 