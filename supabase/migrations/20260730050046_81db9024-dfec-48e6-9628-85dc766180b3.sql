ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS experience_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS experience_label text NOT NULL DEFAULT '';

GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

UPDATE public.theme SET
  colors_json = jsonb_build_object(
    'background', '#F5F5F3',
    'foreground', '#0A0A0A',
    'primary', '#7A9B7E',
    'accent', '#7A9B7E',
    'muted', '#EDEDEA',
    'border', '#DCDCD8'
  ),
  fonts_json = jsonb_build_object('heading', 'Archivo', 'body', 'Work Sans'),
  updated_at = now();