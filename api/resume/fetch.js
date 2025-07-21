import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getUserIdFromToken(token) {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No auth token' });
  }
  const user_id = await getUserIdFromToken(token);
  if (!user_id) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const resumes = db.collection('resumes');
    const userResumes = await resumes.find({ user_id }).sort({ timestamp: -1 }).toArray();
    res.status(200).json(userResumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
} 