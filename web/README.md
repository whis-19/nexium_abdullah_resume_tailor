# Resume Tailor Web App

## Structure

- `/srv/` — Main UI code (Landing Page, Dashboard, Resume Preview)
- `/src/app/page.tsx` — Entry point, renders UI from `/srv/page.tsx`
- `/srv/components/` — Modular React components

## Setup

1. Install dependencies:
   ```sh
   npm install
   npm install --prefix web
   ```
2. Add environment variables to `/web/.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```
3. Run the development server:
   ```sh
   npm run dev --prefix web
   ```

## Features
- Magic link login (Supabase)
- Dashboard with resume CRUD
- AI-tailored resume preview, edit, and PDF download
- Tailwind CSS 3.3.5 styling
- Input validation and loading/error states

## Customization
- UI code is in `/web/srv/` for easy extension
- Add new components to `/web/srv/components/`
