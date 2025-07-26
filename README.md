# 📝 AI-Powered Resume Builder

A modern, AI-assisted resume builder built with **React**, **Next.js**, **MongoDB**, **Supabase**, **Gemini AI**, and **n8n** for automated workflow processing. Easily create, customize, and export professional resumes with intelligent suggestions and sleek design templates.

## ✨ Features

- 🤖 **AI Suggestions** – Generate job-specific experience bullet points from your job description using Gemini AI
- ⚡ **Smart n8n Integration** – Automated AI processing with intelligent fallback to direct API calls when n8n is unavailable
- ✍️ **Grammar Correction** – Fix grammar and improve clarity of resume text
- 🎨 **Live Template Preview** – Choose from multiple stylish, responsive resume templates
- 🖨️ **PDF Export** – One-click export to high-quality PDF via html2canvas + jsPDF
- ☁️ **Cloud Storage** – Save and retrieve resumes in real-time with MongoDB
- 📊 **Prompt Logging** – All AI prompts and responses are saved to Supabase for analytics
- 🌙 **Dark/Light Mode** – Toggle between light and dark themes (shadcn/ui)
- 🧩 **Modular Codebase** – AI logic, DB logic, and UI are cleanly separated for easy maintenance
- 📈 **Queue Monitoring** – Real-time monitoring of AI request processing with floating n8n button
- 🔄 **Resilient Architecture** – Works seamlessly with or without n8n automation server

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Supabase](https://supabase.com/)
- [Gemini AI API](https://ai.google.dev/)
- [n8n](https://n8n.io/) - Workflow automation platform (optional)
- [shadcn/ui](https://ui.shadcn.com/) (for theme toggle and UI components)
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF)

## 🗂️ Project Structure

- `src/app/ai/` – All AI generation logic (Gemini API calls)
- `src/db/` – Database logic for MongoDB and Supabase
- `src/app/dashboard/` – Main dashboard UI and logic
- `src/components/` – Reusable UI components (ThemeToggle, QueueMonitor, etc.)
- `src/app/api/n8n/` – n8n integration endpoints with fallback logic
- `docker-compose.n8n.yml` – n8n infrastructure setup

## ⚙️ Environment Setup

1. Copy `env.example` to `.env.local` in the project directory and fill in your credentials:
   ```
   NEXT_PUBLIC_MONGODB_URI=your-mongodb-uri
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
   NEXT_PUBLIC_N8N_ENCRYPTION_KEY=your-32-character-encryption-key-here
   NEXT_PUBLIC_N8N_BASIC_AUTH_USER=admin
   NEXT_PUBLIC_N8N_BASIC_AUTH_PASSWORD=resume_ai_2024
   NEXT_PUBLIC_RESUME_APP_URL=http://localhost:3000
   NEXT_PUBLIC_RESUME_WEBHOOK_URL=http://localhost:3000/api/n8n/webhook
   NEXT_PUBLIC_WEBHOOK_SECRET=your-webhook-secret-key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Optional**: Set up n8n infrastructure for enhanced automation:
   ```bash
   # Start n8n services (PostgreSQL, Redis, n8n)
   docker-compose -f docker-compose.n8n.yml up -d
   
   # Access n8n dashboard at http://localhost:5678
   # Username: admin, Password: resume_ai_2024
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 AI Features with Smart Fallback

### **Intelligent Processing System**
- **n8n Available**: Full automation with queue management, caching, and background processing
- **n8n Unavailable**: Automatic fallback to direct Gemini API calls for immediate results
- **Seamless Experience**: Users don't need to do anything different - the app adapts automatically

### **Job Description Suggestions**
- Paste a job description and get tailored resume bullet points
- **With n8n**: Queued processing with real-time status updates
- **Without n8n**: Direct API calls for immediate results
- Smart caching to avoid duplicate requests

### **Text Correction**
- Grammar and style correction with automated processing
- **With n8n**: Background processing with queue monitoring
- **Without n8n**: Instant correction with direct API calls
- Real-time feedback regardless of processing method

### **Prompt Logging**
- All prompts and AI responses are saved to Supabase for analytics
- Works with both n8n automation and direct API calls
- Performance tracking and cost optimization

## 🔧 n8n Integration (Optional)

### **Enhanced Features with n8n**
- **Queue Management**: AI requests are queued and processed asynchronously
- **Smart Caching**: Avoid duplicate API calls with intelligent response caching
- **Background Processing**: Users can continue working while AI processes requests
- **Real-time Monitoring**: Live queue statistics and processing status
- **Batch Processing**: Process multiple requests efficiently
- **Error Handling**: Automatic retry and error logging
- **Cost Optimization**: Smart caching and rate limiting

### **Quick Start with n8n**
```bash
# Start n8n services
docker-compose -f docker-compose.n8n.yml up -d

# View n8n logs
docker-compose -f docker-compose.n8n.yml logs -f

# Stop n8n services
docker-compose -f docker-compose.n8n.yml down
```

### **Database Tables**
The n8n integration requires these Supabase tables:
- `ai_request_queue` - Queue management
- `ai_response_cache` - Response caching
- `resume_optimization_history` - Optimization tracking

## 🎨 User Interface

### **Modern Dashboard**
- **Clean Sidebar**: Resume management with create, edit, and delete functionality
- **Main Editor**: Comprehensive resume editing with real-time preview
- **AI Tools**: Job suggestions and text correction in dedicated cards
- **Template Selection**: Multiple professional resume templates
- **PDF Export**: One-click high-quality PDF generation

### **Queue Monitoring**
- **Floating n8n Button**: Bottom-left corner for easy access
- **Modal Interface**: Clean popup with queue statistics
- **Real-time Updates**: Live status monitoring
- **Easy Close**: Gray rounded button at the bottom

### **Responsive Design**
- **Dark/Light Mode**: Toggle between themes
- **Mobile Friendly**: Responsive layout for all devices
- **Accessible**: Proper contrast and keyboard navigation

## 📊 Monitoring & Analytics

### **Queue Monitor Features**
- Real-time queue statistics
- Processing status tracking
- Performance metrics
- Error monitoring
- n8n availability status

### **Cost Tracking**
- AI API usage monitoring
- Cost optimization insights
- Usage analytics
- Performance metrics

## 🚀 Deployment

### **Production Setup**
1. Set up production environment variables
2. **Optional**: Deploy n8n infrastructure:
   ```bash
   docker-compose -f docker-compose.n8n.yml up -d
   ```
3. Import n8n workflows from `n8n-workflow-config.json`
4. Configure monitoring and alerting

### **Scaling**
- **With n8n**: Horizontal scaling with multiple n8n workers
- **Without n8n**: Direct API calls scale automatically
- Database optimization for high traffic
- Load balancing for webhook endpoints

## 🔄 Fallback System

### **How It Works**
1. **Health Check**: App checks if n8n is available
2. **Smart Routing**: Routes requests to appropriate processing method
3. **Seamless Experience**: Users get results regardless of n8n status
4. **Automatic Recovery**: When n8n comes back online, automatically switches back

### **Benefits**
- **No Downtime**: AI features work even when n8n is down
- **Cost Effective**: Direct API calls when automation isn't needed
- **User Friendly**: No manual intervention required
- **Production Ready**: Resilient architecture for any environment

## 📝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](LICENSE)
