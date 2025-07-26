#!/usr/bin/env node

// Test script for n8n integration with NEXT_PUBLIC_ environment variables

const fetch = require('node-fetch');

// Test configuration
const config = {
  webhookUrl: 'http://localhost:3000/api/n8n/webhook',
  queueStatsUrl: 'http://localhost:3000/api/n8n/queue/stats',
  testJobDescription: 'Software Engineer position requiring React, Node.js, and MongoDB experience. Looking for someone with 3+ years of experience in full-stack development.',
  testText: 'This is a test text that needs to be corrected for grammar and spelling errors.'
};

async function testWebhookEndpoint() {
  console.log('🧪 Testing n8n Webhook Integration...\n');
  
  try {
    // Test 1: Generate AI suggestions
    console.log('1️⃣ Testing AI Suggestions Generation...');
    const suggestionsResponse = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_suggestions',
        data: { jobDescription: config.testJobDescription },
        userId: 'test-user-123'
      })
    });
    
    if (suggestionsResponse.ok) {
      const suggestionsResult = await suggestionsResponse.json();
      console.log('✅ AI Suggestions Request:', suggestionsResult);
      
      if (suggestionsResult.queueId) {
        console.log('⏳ Polling for results...');
        await pollForResults(suggestionsResult.queueId, 'suggestions');
      }
    } else {
      console.log('❌ AI Suggestions Request Failed:', await suggestionsResponse.text());
    }
    
    console.log('\n2️⃣ Testing Text Correction...');
    const correctionResponse = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'correct_text',
        data: { text: config.testText },
        userId: 'test-user-123'
      })
    });
    
    if (correctionResponse.ok) {
      const correctionResult = await correctionResponse.json();
      console.log('✅ Text Correction Request:', correctionResult);
      
      if (correctionResult.queueId) {
        console.log('⏳ Polling for results...');
        await pollForResults(correctionResult.queueId, 'correction');
      }
    } else {
      console.log('❌ Text Correction Request Failed:', await correctionResponse.text());
    }
    
    console.log('\n3️⃣ Testing Queue Statistics...');
    const statsResponse = await fetch(config.queueStatsUrl);
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Queue Statistics:', stats);
    } else {
      console.log('❌ Queue Statistics Failed:', await statsResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function pollForResults(queueId, type) {
  const maxAttempts = 10;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${config.webhookUrl}?queueId=${queueId}`);
      if (response.ok) {
        const status = await response.json();
        
        if (status.status === 'completed') {
          console.log(`✅ ${type} completed:`, status.result);
          return;
        } else if (status.status === 'failed') {
          console.log(`❌ ${type} failed:`, status.error);
          return;
        } else {
          console.log(`⏳ ${type} status: ${status.status}`);
        }
      }
    } catch (error) {
      console.log(`⚠️ Poll attempt ${attempts + 1} failed:`, error.message);
    }
    
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  }
  
  console.log(`⏰ ${type} polling timeout after ${maxAttempts} attempts`);
}

async function testEnvironmentVariables() {
  console.log('🔍 Checking Environment Variables...\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_GEMINI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_MONGODB_URI'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: ${process.env[varName].substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.log(`\n⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    console.log('Please set these variables in your .env.local file');
    return false;
  }
  
  console.log('\n✅ All required environment variables are set!');
  return true;
}

async function main() {
  console.log('🚀 n8n Integration Test Suite\n');
  console.log('=' .repeat(50));
  
  // Check environment variables first
  const envOk = await testEnvironmentVariables();
  
  if (!envOk) {
    console.log('\n❌ Environment check failed. Please fix missing variables.');
    process.exit(1);
  }
  
  console.log('\n' + '=' .repeat(50));
  
  // Test webhook endpoints
  await testWebhookEndpoint();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Test suite completed!');
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWebhookEndpoint, testEnvironmentVariables }; 