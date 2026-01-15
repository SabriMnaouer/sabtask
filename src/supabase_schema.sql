
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 0. CLEANUP
drop table if exists time_entries cascade; -- NEW
drop table if exists notifications cascade;
drop table if exists comments cascade;
drop table if exists subtasks cascade;
drop table if exists tasks cascade;
drop table if exists projects cascade;
drop table if exists users cascade;

drop type if exists task_status cascade;
drop type if exists priority cascade;
drop type if exists user_role cascade;

-- 1. ENUMS
create type task_status as enum ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');
create type priority as enum ('LOW', 'MEDIUM', 'HIGH');
create type user_role as enum ('ADMIN', 'MEMBER');

-- 2. TABLES

-- Users Table
create table users (
  id text primary key,
  name text not null,
  avatar text,
  role user_role default 'MEMBER',
  email text
);

-- Projects Table
create table projects (
  id text primary key,
  name text not null,
  description text,
  status text default 'ACTIVE',
  progress integer default 0,
  members text[] -- Array of user IDs
);

-- Tasks Table
create table tasks (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  title text not null,
  description text,
  status task_status default 'TODO',
  priority priority default 'MEDIUM',
  assignee_id text references users(id) on delete set null,
  due_date timestamptz,
  tags text[],
  created_at timestamptz default now()
);

-- Subtasks Table
create table subtasks (
  id text primary key,
  task_id text references tasks(id) on delete cascade,
  title text not null,
  completed boolean default false,
  assignee_id text references users(id) on delete set null
);

-- Comments Table
create table comments (
  id text primary key,
  task_id text references tasks(id) on delete cascade,
  user_id text references users(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

-- Notifications Table
create table notifications (
  id text primary key,
  user_id text references users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  read boolean default false,
  created_at timestamptz default now(),
  task_id text references tasks(id) on delete set null
);

-- Time Entries Table (NEW)
create table time_entries (
  id text primary key,
  task_id text references tasks(id) on delete cascade,
  user_id text references users(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz,
  duration_seconds integer default 0,
  note text,
  created_at timestamptz default now()
);

-- 3. RLS POLICIES
alter table users enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table subtasks enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;
alter table time_entries enable row level security;

create policy "Public access" on users for all using (true);
create policy "Public access" on projects for all using (true);
create policy "Public access" on tasks for all using (true);
create policy "Public access" on subtasks for all using (true);
create policy "Public access" on comments for all using (true);
create policy "Public access" on notifications for all using (true);
create policy "Public access" on time_entries for all using (true);

-- 4. SEED DATA

-- Users
insert into users (id, name, avatar, role, email) values
('u1', 'Sabri Mn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sabri', 'ADMIN', 'sabri@sabtask.com'),
('u2', 'Sarah Miller', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'MEMBER', 'sarah@sabtask.com'),
('u3', 'Mike Ross', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', 'MEMBER', 'mike@sabtask.com'),
('u4', 'Emily Wong', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', 'MEMBER', 'emily@sabtask.com');

-- Projects
insert into projects (id, name, description, status, progress, members) values
('p1', 'Nova FinTech App', 'Next-gen banking application with biometric security and crypto integration.', 'ACTIVE', 75, ARRAY['u1', 'u2', 'u4']),
('p2', 'AI Content Engine', 'SaaS platform using LLMs to generate marketing copy automatically.', 'ACTIVE', 45, ARRAY['u1', 'u3']),
('p3', 'Q4 Marketing Website', 'Refresh of the corporate website for the upcoming holiday season.', 'COMPLETED', 100, ARRAY['u2', 'u3']);

-- Tasks for Project 1
insert into tasks (id, project_id, title, description, status, priority, assignee_id, due_date, tags, created_at) values
('t1', 'p1', 'Biometric Authentication', 'Implement FaceID and TouchID login using React Native Biometrics.', 'DONE', 'HIGH', 'u1', now() - interval '2 days', ARRAY['Security', 'Mobile'], now() - interval '10 days'),
('t2', 'p1', 'Transaction History API', 'Optimize the SQL query for retrieving last 1000 transactions.', 'REVIEW', 'HIGH', 'u4', now() + interval '1 day', ARRAY['Backend', 'Performance'], now() - interval '5 days'),
('t3', 'p1', 'Dark Mode UI Polish', 'Fix contrast issues on the settings screen in dark mode.', 'TODO', 'LOW', 'u2', now() + interval '5 days', ARRAY['Design', 'UI'], now() - interval '1 day'),
('t4', 'p1', 'Crypto Wallet Integration', 'Connect to Coinbase API for real-time balance updates.', 'IN_PROGRESS', 'MEDIUM', 'u1', now() + interval '7 days', ARRAY['Web3', 'API'], now() - interval '3 days');

-- Subtasks for P1
insert into subtasks (id, task_id, title, completed, assignee_id) values
('st1', 't1', 'Setup native modules', true, 'u1'),
('st2', 't1', 'Handle fallback to PIN', true, 'u1'),
('st3', 't1', 'UI Feedback animations', true, 'u2'),
('st4', 't2', 'Add database indexing', true, 'u4'),
('st5', 't2', 'Implement Redis caching', false, 'u4'),
('st6', 't4', 'Generate API Keys', true, 'u1');

-- Tasks for Project 2
insert into tasks (id, project_id, title, description, status, priority, assignee_id, due_date, tags, created_at) values
('t5', 'p2', 'Vector Database Setup', 'Initialize Pinecone index and create embedding generation pipeline.', 'DONE', 'HIGH', 'u1', now() - interval '5 days', ARRAY['AI', 'Infrastructure'], now() - interval '14 days'),
('t6', 'p2', 'Prompt Engineering', 'Refine system prompts for blog post generation.', 'IN_PROGRESS', 'HIGH', 'u3', now() + interval '3 days', ARRAY['AI', 'Product'], now() - interval '4 days'),
('t7', 'p2', 'Stripe Subscription Flow', 'Implement tiered pricing (Free, Pro, Enterprise) checkout.', 'TODO', 'HIGH', 'u1', now() + interval '10 days', ARRAY['Payments', 'SaaS'], now());

-- Subtasks for P2
insert into subtasks (id, task_id, title, completed, assignee_id) values
('st8', 't6', 'Test temperature settings', true, 'u3'),
('st9', 't6', 'Create few-shot examples', false, 'u3'),
('st10', 't6', 'Validate output quality', false, 'u1');

-- Comments
insert into comments (id, task_id, user_id, text, created_at) values
('c1', 't2', 'u1', 'Good catch on the index, query time dropped to 200ms.', now() - interval '1 hour'),
('c2', 't6', 'u3', 'The model is still struggling with tone consistency.', now() - interval '4 hours');

-- Seed Time Entries
insert into time_entries (id, task_id, user_id, start_time, end_time, duration_seconds, note) values
('te1', 't1', 'u1', now() - interval '3 days', now() - interval '3 days' + interval '2 hours', 7200, 'Initial setup'),
('te2', 't1', 'u1', now() - interval '2 days', now() - interval '2 days' + interval '4 hours', 14400, 'Implementation'),
('te3', 't6', 'u3', now() - interval '1 day', now() - interval '1 day' + interval '1 hour', 3600, 'Testing prompts');
