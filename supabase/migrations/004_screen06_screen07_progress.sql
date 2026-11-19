-- Digital Detective World: Screen 06 (Cyber Café) & Screen 07 (Advice Centre) Progress Persistence
-- Notes how Screen 06 & Screen 07 states are stored inside public.students.tutorial_progress JSONB
-- (__screen06, __screen07) alongside completed_missions, unlocked_buildings, xp, stars, and last_position.

alter table public.students
  add column if not exists screen06_progress jsonb not null default '{}'::jsonb,
  add column if not exists screen07_progress jsonb not null default '{}'::jsonb;

comment on column public.students.screen06_progress is
  'Stores Screen 06 Cyber Café seat selection, 10-case classification log, Part C choice, Part D 3-message mini-challenge, and Byte''s Helper badge state.';

comment on column public.students.screen07_progress is
  'Stores Screen 07 Advice Centre learning card exploration, 3-task writing portfolio (asking/giving/responding), and 3-item self-check state.';
