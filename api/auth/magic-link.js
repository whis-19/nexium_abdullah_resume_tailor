import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ message: 'Magic link sent to email' });
} 