import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { page: string; section: string; key: string; value_json: unknown };

const cache = new Map<string, Row[]>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function fetchPage(page: string) {
  const { data } = await supabase
    .from("site_content")
    .select("page,section,key,value_json")
    .eq("page", page);
  cache.set(page, (data ?? []) as Row[]);
  notify();
}

if (typeof window !== "undefined") {
  window.addEventListener("fm_cms_updated", () => {
    // Invalidate everything and refetch active pages
    const pages = Array.from(cache.keys());
    pages.forEach((p) => fetchPage(p));
  });
}

/**
 * Read CMS-managed copy/media for a page. Returns a `get(section, key, fallback)` helper
 * so components can replace hard-coded strings with a one-liner that always falls back.
 */
export function useSiteContent(page: string) {
  const [, force] = useState(0);

  useEffect(() => {
    if (!cache.has(page)) fetchPage(page);
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, [page]);

  const get = useCallback(
    <T = string,>(section: string, key: string, fallback: T): T => {
      const rows = cache.get(page) ?? [];
      const row = rows.find((r) => r.section === section && r.key === key);
      const v = row?.value_json as { value?: T } | T | undefined;
      if (v == null) return fallback;
      // Stored shape: { value: ... } for primitives; raw for objects/arrays
      if (typeof v === "object" && v !== null && "value" in (v as Record<string, unknown>)) {
        const inner = (v as { value?: T }).value;
        return (inner ?? fallback) as T;
      }
      return (v as T) ?? fallback;
    },
    [page],
  );

  return { get };
}