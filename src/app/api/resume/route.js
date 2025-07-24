import { NextResponse } from 'next/server';
import { getAllResumes, createResume, updateResume, deleteResume } from '../../../db/resume';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const resumes = await getAllResumes(sessionId);
  return NextResponse.json(resumes);
}

export async function POST(request) {
  const { name, sessionId } = await request.json();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const resume = await createResume(name, sessionId);
  return NextResponse.json(resume, { status: 201 });
}

export async function PUT(request) {
  const { resume } = await request.json();
  if (!resume || !resume.id) return NextResponse.json({ error: 'Resume with id is required' }, { status: 400 });
  const updated = await updateResume(resume);
  return NextResponse.json(updated);
}

export async function DELETE(request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Resume id is required' }, { status: 400 });
  await deleteResume(id);
  return NextResponse.json({ success: true }); // 200 OK with JSON
} 