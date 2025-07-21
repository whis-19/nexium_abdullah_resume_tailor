import React, { useState } from 'react';
import jsPDF from 'jspdf';

interface Resume {
  _id?: string;
  job_description: string;
  tailored_resume: string;
  timestamp: string;
}

export default function ResumePreview({ resume, onBack }: { resume: Resume; onBack: () => void }) {
  const [editText, setEditText] = useState(resume.tailored_resume);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const doc = new jsPDF();
    doc.text(editText, 10, 10);
    doc.save('resume.pdf');
    setDownloading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button className="mb-4 text-blue-600 hover:underline" onClick={onBack}>&larr; Back to Dashboard</button>
      <h2 className="text-xl font-bold mb-4">Resume Preview</h2>
      <textarea
        className="w-full border rounded px-3 py-2 mb-4 min-h-[200px]"
        value={editText}
        onChange={e => setEditText(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
} 