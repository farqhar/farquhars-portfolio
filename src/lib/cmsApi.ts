import { supabase } from "@/integrations/supabase/client";
import { cmsSession } from "@/lib/cmsSession";

/** Save a single site_content field (page/section/key → value). */
export async function saveContent(
  page: string,
  section: string,
  key: string,
  value: unknown,
) {
  const password = cmsSession.get();
  const { data, error } = await supabase.functions.invoke("cms-save", {
    body: { password, table: "site_content", page, section, key, value: { value } },
  });
  if (error || !data?.ok) {
    throw new Error(data?.error || error?.message || "Save failed");
  }
  window.dispatchEvent(new Event("fm_cms_updated"));
}

/** Save a site_settings row (key → value). */
export async function saveSetting(key: string, value: unknown) {
  const password = cmsSession.get();
  const { data, error } = await supabase.functions.invoke("cms-save", {
    body: { password, table: "site_settings", key, value },
  });
  if (error || !data?.ok) {
    throw new Error(data?.error || error?.message || "Save failed");
  }
  window.dispatchEvent(new Event("fm_cms_updated"));
}

/** Upload a file to site-media via the admin edge function. Returns public URL. */
export async function uploadMedia(file: File, path: string, kind: "image" | "video" | "any" = "image") {
  const password = cmsSession.get();
  if (!password) throw new Error("Not signed in");

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = `https://${projectId}.supabase.co/functions/v1/cms-upload`;

  const buf = await file.arrayBuffer();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-admin-password": password,
      "x-upload-path": path,
      "x-upload-kind": kind,
      "content-type": file.type || "application/octet-stream",
    },
    body: buf,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || `Upload failed (${res.status})`);
  }
  return json.url as string;
}