# 📝 AI-Powered Resume Builder

A modern, AI-assisted resume builder built with **React**, **Next.js**, **MongoDB**, **Supabase**, and **Gemini AI**. Easily create, customize, and export professional resumes with intelligent suggestions and sleek design templates.

## ✨ Features

- 🤖 **AI Suggestions** – Generate job-specific experience bullet points from your job description using Gemini AI
- ✍️ **Grammar Correction** – Fix grammar and improve clarity of resume text
- 🎨 **Live Template Preview** – Choose from multiple stylish, responsive resume templates
- 🖨️ **PDF Export** – One-click export to high-quality PDF via html2canvas + jsPDF
- ☁️ **Cloud Storage** – Save and retrieve resumes in real-time with MongoDB
- 📊 **Prompt Logging** – All AI prompts and responses are saved to Supabase for analytics
- 🌙 **Dark/Light Mode** – Toggle between light and dark themes (shadcn/ui)
- 🧩 **Modular Codebase** – AI logic, DB logic, and UI are cleanly separated for easy maintenance

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Supabase](https://supabase.com/)
- [Gemini AI API](https://ai.google.dev/)
- [shadcn/ui](https://ui.shadcn.com/) (for theme toggle and UI components)
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF)

## 🗂️ Project Structure

- `src/app/ai/` – All AI generation logic (Gemini API calls)
- `src/db/` – Database logic for MongoDB and Supabase
- `src/app/dashboard/` – Main dashboard UI and logic
- `src/components/` – Reusable UI components (ThemeToggle, etc.)

## ⚙️ Environment Setup

1. Copy `.env.example` to `.env.local` in the `web/` directory and fill in your credentials:
   ```
   NEXT_PUBLIC_MONGODB_URI=your-mongodb-uri
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 AI Features
- **Job Description Suggestions:** Paste a job description and get tailored resume bullet points.
- **Text Correction:** Paste any text for grammar and style correction.
- **Prompt Logging:** All prompts and AI responses are saved to Supabase for analytics.

## 📝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](LICENSE)
