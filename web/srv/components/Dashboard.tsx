import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../env';
import { supabase } from '../supabaseClient';

interface Resume {
  _id?: string;
  job_description: string;
  tailored_resume: string;
  timestamp: string;
}

export default function Dashboard({ onPreview }: { onPreview: (resume: Resume) => void }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const fetchResumes = async () => {
    setLoading(true);
    setError('');
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/resume/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setResumes(data);
      } else {
        setError(data.error || 'Failed to fetch resumes');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    setError('');
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    try {
      // Simulate AI resume generation (replace with actual AI call)
      const tailored_resume = `Tailored resume for: ${formData.job_description}\nSkills: ${formData.skills}`;
      const res = await fetch(`${API_BASE_URL}/api/resume/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_description: formData.job_description,
          tailored_resume,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchResumes();
        reset();
      } else {
        setError(data.error || 'Failed to save resume');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Your Resumes</h2>
      {loading && <div className="text-blue-600 mb-2">Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="mb-8">
        {resumes.map((resume) => (
          <li key={resume._id || resume.timestamp} className="border rounded p-4 mb-2 flex justify-between items-center">
            <div>
              <div className="font-semibold">{resume.job_description}</div>
              <div className="text-xs text-gray-500">{new Date(resume.timestamp).toLocaleString()}</div>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => onPreview(resume)}
            >
              Preview
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mb-2">New Resume</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Job Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            {...register('job_description', { required: 'Job description is required' })}
            rows={3}
            disabled={loading}
          />
          {errors.job_description && <div className="text-red-500 text-sm">{errors.job_description.message as string}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Skills</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register('skills', { required: 'Skills are required' })}
            disabled={loading}
          />
          {errors.skills && <div className="text-red-500 text-sm">{errors.skills.message as string}</div>}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Generate & Save Resume'}
        </button>
      </form>
    </div>
  );
} 