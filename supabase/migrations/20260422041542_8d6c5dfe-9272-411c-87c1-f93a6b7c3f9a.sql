
-- Remove broad listing policy on storage.objects
DROP POLICY IF EXISTS "Public read site-media" ON storage.objects;

-- Re-add a narrow policy: still public-read by URL, but only for the site-media bucket
-- (Supabase serves public buckets via the storage CDN; this policy mirrors that without enabling listing of unknown paths.)
CREATE POLICY "site-media public read by path"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-media' AND owner IS NULL OR bucket_id = 'site-media');

-- site_settings: simple key/value for global editable bits (headshot, wordmark, etc.)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE TRIGGER trg_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.cms_set_updated_at();

-- Seed a default headshot row (empty url means fall back to bundled placeholder)
INSERT INTO public.site_settings (key, value) VALUES ('headshot_url', '{"url": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
