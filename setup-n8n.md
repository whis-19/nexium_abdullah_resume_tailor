# 🚀 n8n Setup Guide for Resume AI Automation

## Quick Start (5 minutes)

### 1. **Prerequisites**
- Docker and Docker Compose installed
- Your existing resume app running on port 3000
- Environment variables configured

### 2. **Start n8n Services**
```bash
# Clone or navigate to your project directory
cd nexium_abdullah_resume_tailor

# Start n8n with Docker Compose
docker-compose -f docker-compose.n8n.yml up -d

# Check if services are running
docker-compose -f docker-compose.n8n.yml ps
```

### 3. **Access n8n Dashboard**
- Open: http://localhost:5678
- Login: `admin` / `resume_ai_2024`

### 4. **Import Workflow**
- In n8n dashboard, click "Import from file"
- Select `n8n-workflow-config.json`
- Activate the workflow

### 5. **Test Integration**
- Your resume app will now use n8n for AI processing
- Check the webhook URL: http://localhost:5678/webhook/resume-ai

## 🔧 Detailed Setup

### Environment Variables
Create `.env` file in your project root:
```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MONGODB_URI=your_mongodb_uri

# n8n Security
N8N_ENCRYPTION_KEY=your-32-character-encryption-key-here
```

### Database Setup
Run these SQL commands in your Supabase dashboard:

```sql
-- AI Request Queue
CREATE TABLE ai_request_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  request_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
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

-- Indexes for performance
CREATE INDEX idx_ai_request_queue_status ON ai_request_queue(status);
CREATE INDEX idx_ai_request_queue_created_at ON ai_request_queue(created_at);
CREATE INDEX idx_ai_response_cache_prompt_hash ON ai_response_cache(prompt_hash);
CREATE INDEX idx_ai_response_cache_expires_at ON ai_response_cache(expires_at);
```

## 🔄 Workflow Automation Examples

### 1. **Basic AI Processing Workflow**
```javascript
// This workflow processes AI requests from the queue
{
  "name": "Process AI Requests",
  "trigger": "cron",
  "schedule": "*/5 * * * *", // Every 5 minutes
  "nodes": [
    {
      "name": "Get Pending Requests",
      "type": "supabase",
      "operation": "select",
      "table": "ai_request_queue",
      "where": "status = 'pending'"
    },
    {
      "name": "Process with Gemini",
      "type": "httpRequest",
      "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      "method": "POST"
    },
    {
      "name": "Update Status",
      "type": "supabase",
      "operation": "update",
      "table": "ai_request_queue"
    }
  ]
}
```

### 2. **Smart Resume Optimization**
```javascript
// This workflow automatically optimizes resumes
{
  "name": "Auto Resume Optimization",
  "trigger": "webhook",
  "nodes": [
    {
      "name": "Analyze Resume",
      "type": "ai",
      "operation": "analyze_strengths"
    },
    {
      "name": "Generate Improvements",
      "type": "ai",
      "operation": "suggest_improvements"
    },
    {
      "name": "Apply Changes",
      "type": "mongodb",
      "operation": "update_resume"
    }
  ]
}
```

### 3. **Job Description Analysis**
```javascript
// This workflow analyzes job descriptions and generates tailored suggestions
{
  "name": "Job Description Analysis",
  "trigger": "webhook",
  "nodes": [
    {
      "name": "Extract Keywords",
      "type": "ai",
      "operation": "extract_keywords"
    },
    {
      "name": "Generate Suggestions",
      "type": "ai",
      "operation": "generate_suggestions"
    },
    {
      "name": "Score Match",
      "type": "ai",
      "operation": "calculate_match_score"
    }
  ]
}
```

## 📊 Monitoring and Analytics

### Queue Monitoring
```bash
# Check queue status
curl http://localhost:3000/api/n8n/queue/stats

# Monitor n8n logs
docker-compose -f docker-compose.n8n.yml logs -f n8n
```

### Performance Metrics
- **Queue Processing Time**: Average time to process requests
- **Success Rate**: Percentage of successful AI operations
- **Cost Tracking**: AI API usage and costs
- **User Activity**: Most used features and peak times

## 🔒 Security Configuration

### 1. **Webhook Authentication**
```javascript
// Add authentication to webhook endpoints
const validateWebhook = (req, res, next) => {
  const token = req.headers['x-webhook-token'];
  if (token !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
```

### 2. **API Rate Limiting**
```javascript
// Implement rate limiting for AI requests
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many AI requests, please try again later.'
});
```

### 3. **Data Encryption**
```javascript
// Encrypt sensitive data
const crypto = require('crypto');

const encryptData = (data) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
```

## 🚀 Advanced Features

### 1. **Batch Processing**
```javascript
// Process multiple requests together to reduce API costs
const batchProcess = async (requests) => {
  const batchSize = 10;
  const batches = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    batches.push(requests.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    await processBatch(batch);
  }
};
```

### 2. **Smart Caching**
```javascript
// Cache AI responses to avoid duplicate API calls
const getCachedResponse = async (promptHash) => {
  const cached = await supabase
    .from('ai_response_cache')
    .select('*')
    .eq('prompt_hash', promptHash)
    .gt('expires_at', new Date().toISOString())
    .single();
    
  return cached?.response || null;
};
```

### 3. **Automatic Resume Updates**
```javascript
// Schedule weekly resume optimization
const weeklyOptimization = {
  trigger: "cron",
  schedule: "0 2 * * 0", // Every Sunday at 2 AM
  nodes: [
    {
      name: "Get All Resumes",
      type: "mongodb",
      operation: "find_all"
    },
    {
      name: "Check for Updates",
      type: "ai",
      operation: "check_freshness"
    },
    {
      name: "Generate Updates",
      type: "ai",
      operation: "suggest_updates"
    }
  ]
};
```

## 🔧 Troubleshooting

### Common Issues

1. **n8n not starting**
```bash
# Check logs
docker-compose -f docker-compose.n8n.yml logs n8n

# Restart services
docker-compose -f docker-compose.n8n.yml restart
```

2. **Database connection issues**
```bash
# Check PostgreSQL
docker-compose -f docker-compose.n8n.yml exec postgres psql -U n8n -d n8n

# Check Redis
docker-compose -f docker-compose.n8n.yml exec redis redis-cli ping
```

3. **Webhook not receiving requests**
```bash
# Test webhook
curl -X POST http://localhost:5678/webhook/resume-ai \
  -H "Content-Type: application/json" \
  -d '{"action":"generate_suggestions","data":{"jobDescription":"test"}}'
```

### Performance Optimization

1. **Scale workers**
```bash
# Add more worker containers
docker-compose -f docker-compose.n8n.yml up -d --scale n8n-worker=3
```

2. **Optimize database**
```sql
-- Add indexes for better performance
CREATE INDEX CONCURRENTLY idx_ai_request_queue_user_status 
ON ai_request_queue(user_id, status);

CREATE INDEX CONCURRENTLY idx_ai_response_cache_model_expires 
ON ai_response_cache(model, expires_at);
```

3. **Monitor resources**
```bash
# Check resource usage
docker stats resume-n8n resume-postgres resume-redis
```

## 📈 Scaling Strategy

### 1. **Horizontal Scaling**
- Add more n8n worker containers
- Use load balancer for webhook distribution
- Implement database read replicas

### 2. **Vertical Scaling**
- Increase container memory and CPU limits
- Optimize database queries
- Use connection pooling

### 3. **Cost Optimization**
- Implement intelligent caching
- Batch API requests
- Use cheaper AI models for simple tasks

## 🎯 Next Steps

1. **Deploy to Production**
   - Set up SSL certificates
   - Configure production database
   - Implement monitoring and alerting

2. **Add Advanced Features**
   - Multi-language support
   - Advanced AI models
   - Integration with job boards

3. **Analytics and Insights**
   - User behavior analysis
   - AI performance metrics
   - Cost optimization reports

This setup will give you a robust, scalable AI automation system for your resume application! 