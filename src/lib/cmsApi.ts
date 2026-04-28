import { supabase } from "@/integrations/supabase/client";
import { cmsSession } from "@/lib/cmsSession";
import { cmsDirty, type DirtyEntry } from "@/lib/cmsDirty";

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

/** Save a theme column (colors_json | fonts_json | headings_json). */
export async function saveTheme(
  patch: { colors_json?: unknown; fonts_json?: unknown; headings_json?: unknown },
) {
  const password = cmsSession.get();
  const { data, error } = await supabase.functions.invoke("cms-save", {
    body: { password, table: "theme", value: patch },
  });
  if (error || !data?.ok) {
    throw new Error(data?.error || error?.message || "Save failed");
  }
  window.dispatchEvent(new Event("fm_cms_updated"));
}

/** Upsert a project row. */
export async function saveProject(project: unknown) {
  const password = cmsSession.get();
  const { data, error } = await supabase.functions.invoke("cms-save", {
    body: { password, table: "projects", op: "upsert", value: project },
  });
  if (error || !data?.ok) {
    throw new Error(data?.error || error?.message || "Save failed");
  }
  window.dispatchEvent(new Event("fm_cms_updated"));
}

/** Delete a project by slug. */
export async function deleteProject(slug: string) {
  const password = cmsSession.get();
  const { data, error } = await supabase.functions.invoke("cms-save", {
    body: { password, table: "projects", op: "delete", slug },
  });
  if (error || !data?.ok) {
    throw new Error(data?.error || error?.message || "Delete failed");
  }
  window.dispatchEvent(new Event("fm_cms_updated"));
}

/** Persist every dirty field tracked by cmsDirty in a batch. */
export async function saveAllDirty(): Promise<void> {
  const entries = cmsDirty.all();
  if (!entries.length) return;

  // Group theme entries into a single call.
  const themePatch: Record<string, unknown> = {};
  const others: DirtyEntry[] = [];
  for (const e of entries) {
    if (e.kind === "theme") themePatch[e.key] = e.value;
    else others.push(e);
  }

  const ops: Promise<unknown>[] = [];
  for (const e of others) {
    if (e.kind === "content") {
      ops.push(saveContent(e.page, e.section, e.key, e.value));
    } else if (e.kind === "setting") {
      ops.push(saveSetting(e.key, e.value));
    }
  }
  if (Object.keys(themePatch).length) {
    ops.push(saveTheme(themePatch));
  }
  await Promise.all(ops);
  cmsDirty.clear();
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