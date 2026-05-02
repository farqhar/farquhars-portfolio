ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS hero_fit text NOT NULL DEFAULT 'cover';