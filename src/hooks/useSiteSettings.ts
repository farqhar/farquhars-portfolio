import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Fetches a single site_settings row by key. Returns the JSON value or null. */
export function useSiteSetting<T = Record<string, unknown>>(key: string) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (!cancelled) {
        setValue((data?.value as T) ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { value, loading };
}