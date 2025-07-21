import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ResumePreview from './components/ResumePreview';
import { supabase } from './supabaseClient';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'preview'>('landing');
  const [resume, setResume] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setView(data.session ? 'dashboard' : 'landing');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setView(session ? 'dashboard' : 'landing');
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (view === 'landing') {
    return <LandingPage onLogin={() => setView('dashboard')} />;
  }
  if (view === 'dashboard') {
    return <Dashboard onPreview={r => { setResume(r); setView('preview'); }} />;
  }
  if (view === 'preview' && resume) {
    return <ResumePreview resume={resume} onBack={() => setView('dashboard')} />;
  }
  return null;
} 