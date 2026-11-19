-- Screen 04 (Red Flag Centre) & Screen 05 (Aina's House) Progress Extension
-- Stores structured investigation progress, knowledge checks, reading comprehension attempts, and writing responses.

alter table public.students
  add column if not exists screen04_progress jsonb not null default '{}'::jsonb,
  add column if not exists screen05_progress jsonb not null default '{}'::jsonb;

-- Existing RLS policies allow authenticated teachers to inspect students in their assigned classes
-- and verified parents to read only their linked child's progress.
