import { getAllResumes, createResume, updateResume, deleteResume } from '../db/resume';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get all resumes
    const resumes = await getAllResumes();
    return res.status(200).json(resumes);
  }
  if (req.method === 'POST') {
    // Create a new resume
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const resume = await createResume(name);
    return res.status(201).json(resume);
  }
  if (req.method === 'PUT') {
    // Update a resume
    const { resume } = req.body;
    if (!resume || !resume.id) return res.status(400).json({ error: 'Resume with id is required' });
    const updated = await updateResume(resume);
    return res.status(200).json(updated);
  }
  if (req.method === 'DELETE') {
    // Delete a resume
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Resume id is required' });
    await deleteResume(id);
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 