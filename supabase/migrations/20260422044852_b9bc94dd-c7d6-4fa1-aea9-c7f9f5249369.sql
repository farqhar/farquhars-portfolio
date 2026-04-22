-- Seed a single theme row if none exists
INSERT INTO public.theme (colors_json, fonts_json, headings_json)
SELECT
  '{"background":"#ffffff","foreground":"#0a0a1a","primary":"#6366f1","accent":"#818cf8","muted":"#f1f5f9","border":"#e2e8f0"}'::jsonb,
  '{"heading":"Inter","body":"Inter"}'::jsonb,
  '{"h1":{"size":64,"weight":700,"tracking":-0.02},"h2":{"size":40,"weight":600,"tracking":-0.01},"h3":{"size":28,"weight":600,"tracking":0}}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.theme);

-- Singleton constraint: only one theme row allowed
CREATE UNIQUE INDEX IF NOT EXISTS theme_singleton_idx ON public.theme ((true));
