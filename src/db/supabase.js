import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function savePromptAndResponse(prompt, response) {
  const { error } = await supabase
    .from('prompts')
    .insert([
      {
        prompt,
        response: Array.isArray(response) ? JSON.stringify(response) : response,
        created_at: new Date().toISOString(),
      },
    ]);
  if (error) throw error;
  return true;
} 