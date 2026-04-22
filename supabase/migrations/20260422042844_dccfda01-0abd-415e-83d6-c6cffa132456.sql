-- Lock down site-media bucket: public read, no public write.
-- Service role (used by edge functions) bypasses RLS automatically.

-- Drop any prior write policies on site-media (idempotent best-effort)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT polname FROM pg_policy
    WHERE polrelid = 'storage.objects'::regclass
      AND polname IN (
        'site-media public insert',
        'site-media public update',
        'site-media public delete',
        'site-media anon write'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.polname);
  END LOOP;
END$$;

-- Ensure public read policy exists (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polrelid = 'storage.objects'::regclass
      AND polname = 'site-media public read'
  ) THEN
    CREATE POLICY "site-media public read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'site-media');
  END IF;
END$$;

-- No INSERT/UPDATE/DELETE policies for anon/authenticated → only service role can write.
