-- Supabase schema for Resume Tailor

-- Users table (managed by Supabase Auth)
-- Supabase automatically manages the 'users' table for authentication.

-- Profiles table
create table if not exists profiles (
  user_id uuid references auth.users not null primary key,
  skills text,
  experience text
);

-- Enable Row-Level Security (RLS)
alter table profiles enable row level security;

-- RLS Policy: Allow users to access only their own profile
create policy "Users can access their own profile" on profiles
  for all
  using (auth.uid() = user_id); 