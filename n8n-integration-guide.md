# 🚀 n8n Integration Guide for Resume AI Automation

## Overview
This guide shows how to integrate n8n with your resume tailoring project to automate AI workflows, reduce API costs, and improve user experience.

## 🎯 Benefits of n8n Integration

### 1. **Cost Optimization**
- Batch process AI requests during off-peak hours
- Implement rate limiting and caching
- Reduce redundant API calls

### 2. **Enhanced User Experience**
- Asynchronous processing for long AI operations
- Real-time progress updates
- Background job processing

### 3. **Advanced Automation**
- Auto-generate resume suggestions based on job postings
- Scheduled resume optimization
- Integration with job boards and LinkedIn

## 📋 Setup Instructions

### 1. **Install n8n**
```bash
# Using npm
npm install n8n -g

# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. **Environment Variables**
Create `.env` file in your n8n directory:
```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_URI=your_mongodb_uri

# Webhook URLs
RESUME_APP_WEBHOOK=https://your-app.com/api/n8n/webhook
```

### 3. **Database Schema Updates**
Add these tables to your Supabase database:

```sql
-- AI Request Queue
CREATE TABLE ai_request_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  request_type TEXT NOT NULL, -- 'suggestions', 'correction', 'optimization'
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- AI Response Cache
CREATE TABLE ai_response_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_hash TEXT UNIQUE NOT NULL,
  response JSONB NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Resume Optimization History
CREATE TABLE resume_optimization_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id TEXT NOT NULL,
  optimization_type TEXT NOT NULL,
  before_content JSONB,
  after_content JSONB,
  ai_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔄 Workflow Examples

### 1. **Basic AI Request Processing**
```javascript
// n8n workflow: Process AI requests from queue
const workflow = {
  trigger: "cron", // Run every 5 minutes
  nodes: [
    {
      name: "Get Pending Requests",
      type: "supabase",
      operation: "select",
      table: "ai_request_queue",
      where: "status = 'pending'"
    },
    {
      name: "Process AI Request",
      type: "gemini",
      operation: "generate",
      model: "gemini-1.5-flash"
    },
    {
      name: "Update Queue Status",
      type: "supabase",
      operation: "update",
      table: "ai_request_queue"
    }
  ]
};
```

### 2. **Smart Resume Optimization**
```javascript
// n8n workflow: Auto-optimize resumes
const optimizationWorkflow = {
  trigger: "webhook",
  nodes: [
    {
      name: "Analyze Resume",
      type: "ai",
      operation: "analyze_resume_strengths"
    },
    {
      name: "Generate Improvements",
      type: "ai",
      operation: "suggest_improvements"
    },
    {
      name: "Apply Changes",
      type: "mongodb",
      operation: "update_resume"
    },
    {
      name: "Notify User",
      type: "email",
      operation: "send_optimization_report"
    }
  ]
};
```

### 3. **Job Description Analysis**
```javascript
// n8n workflow: Analyze job descriptions
const jobAnalysisWorkflow = {
  trigger: "webhook",
  nodes: [
    {
      name: "Extract Keywords",
      type: "ai",
      operation: "extract_keywords"
    },
    {
      name: "Generate Tailored Suggestions",
      type: "ai",
      operation: "generate_suggestions"
    },
    {
      name: "Score Resume Match",
      type: "ai",
      operation: "calculate_match_score"
    }
  ]
};
```

## 🔧 Integration with Your App

### 1. **Update API Routes**
Create new API endpoints for n8n integration:

```javascript
// src/app/api/n8n/webhook/route.js
import { NextResponse } from 'next/server';
import { addToQueue, getQueueStatus } from '../../../db/queue';

export async function POST(request) {
  const { action, data, userId } = await request.json();
  
  switch (action) {
    case 'generate_suggestions':
      const queueItem = await addToQueue({
        type: 'suggestions',
        payload: { jobDescription: data.jobDescription },
        userId
      });
      return NextResponse.json({ 
        queueId: queueItem.id, 
        status: 'queued' 
      });
      
    case 'correct_text':
      const correctionItem = await addToQueue({
        type: 'correction',
        payload: { text: data.text },
        userId
      });
      return NextResponse.json({ 
        queueId: correctionItem.id, 
        status: 'queued' 
      });
      
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queueId = searchParams.get('queueId');
  
  if (!queueId) {
    return NextResponse.json({ error: 'Queue ID required' }, { status: 400 });
  }
  
  const status = await getQueueStatus(queueId);
  return NextResponse.json(status);
}
```

### 2. **Update Frontend**
Modify your dashboard to use n8n workflows:

```javascript
// src/app/dashboard/page.jsx - Updated AI handlers
const handleGenerateSuggestions = async () => {
  if (!jobDescription.trim()) {
    showSystemMessage("Please enter a job description.");
    return;
  }
  
  setAiLoading(true);
  setAiSuggestions([]);
  
  try {
    // Send to n8n queue instead of direct API call
    const response = await fetch('/api/n8n/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_suggestions',
        data: { jobDescription },
        userId: getSessionId()
      })
    });
    
    const { queueId, status } = await response.json();
    
    if (status === 'queued') {
      // Poll for results
      await pollForResults(queueId);
    }
  } catch (error) {
    showSystemMessage(`Error: ${error.message}`);
  } finally {
    setAiLoading(false);
  }
};

const pollForResults = async (queueId) => {
  const maxAttempts = 30; // 30 seconds
  let attempts = 0;
  
  const poll = async () => {
    try {
      const response = await fetch(`/api/n8n/webhook?queueId=${queueId}`);
      const status = await response.json();
      
      if (status.status === 'completed') {
        setAiSuggestions(status.result.suggestions);
        return;
      } else if (status.status === 'failed') {
        throw new Error(status.error);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(poll, 1000);
      } else {
        throw new Error('Request timeout');
      }
    } catch (error) {
      showSystemMessage(`Error: ${error.message}`);
    }
  };
  
  poll();
};
```

## 🚀 Advanced Automation Features

### 1. **Scheduled Resume Optimization**
```javascript
// n8n workflow: Weekly resume optimization
const weeklyOptimization = {
  trigger: "cron", // Every Sunday at 2 AM
  nodes: [
    {
      name: "Get All Resumes",
      type: "mongodb",
      operation: "find_all_resumes"
    },
    {
      name: "Check for Updates",
      type: "ai",
      operation: "check_resume_freshness"
    },
    {
      name: "Generate Updates",
      type: "ai",
      operation: "suggest_updates"
    },
    {
      name: "Send Weekly Report",
      type: "email",
      operation: "send_weekly_report"
    }
  ]
};
```

### 2. **Job Board Integration**
```javascript
// n8n workflow: Auto-apply with optimized resume
const jobBoardIntegration = {
  trigger: "webhook",
  nodes: [
    {
      name: "Fetch Job Posting",
      type: "http",
      operation: "get_job_details"
    },
    {
      name: "Analyze Requirements",
      type: "ai",
      operation: "analyze_job_requirements"
    },
    {
      name: "Optimize Resume",
      type: "ai",
      operation: "tailor_resume_for_job"
    },
    {
      name: "Submit Application",
      type: "http",
      operation: "submit_application"
    }
  ]
};
```

### 3. **Performance Analytics**
```javascript
// n8n workflow: Generate analytics
const analyticsWorkflow = {
  trigger: "cron", // Daily at midnight
  nodes: [
    {
      name: "Collect Usage Data",
      type: "supabase",
      operation: "aggregate_usage"
    },
    {
      name: "Generate Insights",
      type: "ai",
      operation: "analyze_trends"
    },
    {
      name: "Create Report",
      type: "code",
      operation: "generate_report"
    },
    {
      name: "Send to Admin",
      type: "email",
      operation: "send_daily_report"
    }
  ]
};
```

## 📊 Monitoring and Analytics

### 1. **Queue Monitoring Dashboard**
```javascript
// n8n workflow: Monitor queue health
const queueMonitoring = {
  trigger: "cron", // Every 5 minutes
  nodes: [
    {
      name: "Check Queue Status",
      type: "supabase",
      operation: "get_queue_metrics"
    },
    {
      name: "Alert if Issues",
      type: "condition",
      operation: "check_thresholds"
    },
    {
      name: "Send Alert",
      type: "slack",
      operation: "send_alert"
    }
  ]
};
```

### 2. **Cost Tracking**
```javascript
// n8n workflow: Track AI costs
const costTracking = {
  trigger: "cron", // Daily
  nodes: [
    {
      name: "Calculate Usage",
      type: "code",
      operation: "calculate_ai_costs"
    },
    {
      name: "Update Budget",
      type: "supabase",
      operation: "update_cost_tracking"
    },
    {
      name: "Alert if Over Budget",
      type: "condition",
      operation: "check_budget"
    }
  ]
};
```

## 🔒 Security Considerations

### 1. **API Key Management**
- Store API keys in n8n environment variables
- Use webhook authentication
- Implement rate limiting

### 2. **Data Privacy**
- Encrypt sensitive data in transit and at rest
- Implement user consent for AI processing
- Regular data cleanup

### 3. **Access Control**
- Role-based access to n8n workflows
- Audit logging for all operations
- Secure webhook endpoints

## 📈 Performance Optimization

### 1. **Caching Strategy**
```javascript
// Implement response caching
const cacheStrategy = {
  // Cache AI responses for 24 hours
  ttl: 86400,
  // Use prompt hash as cache key
  key: "prompt_hash",
  // Store in Supabase cache table
  storage: "supabase"
};
```

### 2. **Batch Processing**
```javascript
// Process multiple requests together
const batchProcessing = {
  // Collect requests for 5 minutes
  batchWindow: 300,
  // Process up to 10 requests together
  maxBatchSize: 10,
  // Use bulk API calls
  optimization: "bulk_api"
};
```

## 🎯 Next Steps

1. **Set up n8n instance** with the provided configuration
2. **Import the workflow** from `n8n-workflow-config.json`
3. **Update your app** to use the new n8n endpoints
4. **Test the integration** with sample data
5. **Monitor performance** and adjust as needed
6. **Scale up** with additional automation features

This integration will significantly improve your app's performance, reduce costs, and provide a better user experience through automated AI processing! 