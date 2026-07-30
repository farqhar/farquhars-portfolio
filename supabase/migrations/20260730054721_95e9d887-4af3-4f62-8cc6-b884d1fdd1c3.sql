UPDATE public.projects
SET hero_background = 'linear-gradient(135deg, #2A2F2B 0%, #3E463F 55%, rgba(122,155,126,0.55) 100%)'
WHERE slug IN ('pain-point-discovery','measured-aesthetic');

UPDATE public.projects
SET hero_background = 'linear-gradient(135deg, #2A2F2B 0%, #3E463F 55%, #7A9B7E 100%)'
WHERE slug = 'brand-touchpoint-system';

INSERT INTO public.site_settings (key, value)
VALUES ('headshot_url', jsonb_build_object('url', 'https://zbdizakzfzhvmrldfsxd.supabase.co/storage/v1/object/public/site-media/headshot/headshot-cutout-v2.png'))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();