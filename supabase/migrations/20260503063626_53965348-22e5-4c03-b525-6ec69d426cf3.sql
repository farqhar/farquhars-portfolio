ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS gallery_default_width integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS hero_auto_size boolean NOT NULL DEFAULT false;