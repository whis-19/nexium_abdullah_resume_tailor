import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const dbName = 'resume_builder';
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return { client: cachedClient, db: cachedDb };
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export async function getAllResumes(sessionId) {
  const { db } = await connectToDatabase();
  const filter = sessionId ? { sessionId } : {};
  const resumes = await db.collection('resumes').find(filter).toArray();
  return resumes.map(r => ({ ...r, id: r._id.toString() }));
}

export async function createResume(name, sessionId) {
  const { db } = await connectToDatabase();
  const newResume = {
    name,
    createdAt: new Date().toISOString(),
    content: {
      personalInfo: { name: '', email: '', phone: '', linkedin: '' },
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      summary: ''
    },
    template: 'Modern',
    sessionId
  };
  const result = await db.collection('resumes').insertOne(newResume);
  return { ...newResume, id: result.insertedId.toString() };
}

export async function updateResume(resume) {
  const { db } = await connectToDatabase();
  const { id, ...rest } = resume;
  // Remove _id if present
  if ('_id' in rest) {
    delete rest._id;
  }
  await db.collection('resumes').updateOne(
    { _id: new ObjectId(id) },
    { $set: rest }
  );
  return resume;
}

export async function deleteResume(resumeId) {
  try {
    console.log('Attempting to delete resume with id:', resumeId);
    if (!resumeId || typeof resumeId !== 'string' || resumeId.length !== 24) {
      throw new Error('Invalid resume id');
    }
    const { db } = await connectToDatabase();
    const result = await db.collection('resumes').deleteOne({ _id: new ObjectId(resumeId) });
    if (result.deletedCount === 0) throw new Error('No document found');
    return true;
  } catch (err) {
    console.error('Failed to delete resume:', err);
    throw new Error('Failed to delete resume');
  }
} 