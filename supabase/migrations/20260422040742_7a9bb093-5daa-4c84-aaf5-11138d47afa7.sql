
-- Updated_at trigger helper
CREATE OR REPLACE FUNCTION public.cms_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- site_content: per-page editable values
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'default',
  key TEXT NOT NULL,
  value_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (page, section, key)
);
CREATE INDEX idx_site_content_page ON public.site_content (page);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE TRIGGER trg_site_content_updated
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.cms_set_updated_at();

-- theme: single-row global tokens
CREATE TABLE public.theme (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colors_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  fonts_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  headings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.theme ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read theme"
  ON public.theme FOR SELECT
  USING (true);

CREATE TRIGGER trg_theme_updated
  BEFORE UPDATE ON public.theme
  FOR EACH ROW EXECUTE FUNCTION public.cms_set_updated_at();

INSERT INTO public.theme (colors_json, fonts_json, headings_json)
VALUES ('{}'::jsonb, '{}'::jsonb, '{}'::jsonb);

-- media: tracks uploads
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('image', 'video')),
  url TEXT NOT NULL,
  storage_path TEXT,
  alt TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media"
  ON public.media FOR SELECT
  USING (true);

-- site-media storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read site-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');
