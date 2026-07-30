import { useCallback, useEffect, useState } from "react";
import { Project, projectsSeed } from "@/data/projectsSeed";
import { supabase } from "@/integrations/supabase/client";
import { saveProject as apiSaveProject, deleteProject as apiDeleteProject } from "@/lib/cmsApi";

type Row = {
  slug: string;
  title: string;
  role: string;
  timeline: string;
  outcome_metric: string;
  cover: string;
  hero: string;
  problem: string;
  process: string;
  outcome: string;
  honest: string;
  quotes: unknown;
  files: unknown;
  order: number;
  tagline?: string;
  client?: string;
  overview?: string;
  stats?: unknown;
  tags?: unknown;
  bg_class?: string;
  mock_type?: string;
  hero_background?: string;
  label?: string;
  gallery?: unknown;
  hero_fit?: string;
  gallery_default_width?: number;
  hero_auto_size?: boolean;
  experience_url?: string;
  experience_label?: string;
};

const rowToProject = (r: Row): Project => ({
  slug: r.slug,
  title: r.title,
  role: r.role,
  timeline: r.timeline,
  outcomeMetric: r.outcome_metric,
  cover: r.cover,
  hero: r.hero,
  problem: r.problem,
  process: r.process,
  outcome: r.outcome,
  honest: r.honest,
  quotes: Array.isArray(r.quotes) ? (r.quotes as string[]) : [],
  files: Array.isArray(r.files) ? (r.files as Project["files"]) : [],
  order: r.order ?? 0,
  tagline: r.tagline ?? "",
  client: r.client ?? "",
  overview: r.overview ?? "",
  stats: Array.isArray(r.stats) ? (r.stats as Project["stats"]) : [],
  tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
  bgClass: r.bg_class ?? "bg-1",
  mockType: (r.mock_type === "dark" ? "dark" : "light"),
  heroBackground: r.hero_background ?? "",
  label: r.label ?? "",
  gallery: Array.isArray(r.gallery) ? (r.gallery as Project["gallery"]) : [],
  heroFit: r.hero_fit === "contain" ? "contain" : "cover",
  galleryDefaultWidth:
    typeof r.gallery_default_width === "number" ? r.gallery_default_width : 100,
  heroAutoSize: r.hero_auto_size === true,
  experienceUrl: r.experience_url ?? "",
  experienceLabel: r.experience_label ?? "",
});

async function fetchAll(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });
  if (error || !data) return projectsSeed;
  if (data.length === 0) return projectsSeed;
  return (data as unknown as Row[]).map(rowToProject);
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(projectsSeed);

  const refresh = useCallback(async () => {
    const list = await fetchAll();
    setProjects(list);
  }, []);

  useEffect(() => {
    refresh();
    const sync = () => refresh();
    window.addEventListener("fm_cms_updated", sync);

    const channel = supabase
      .channel("projects-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => refresh(),
      )
      .subscribe();

    return () => {
      window.removeEventListener("fm_cms_updated", sync);
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const save = useCallback(async (updated: Project) => {
    await apiSaveProject(updated);
    await refresh();
  }, [refresh]);

  const add = useCallback(async (project: Project) => {
    const next = { ...project, order: projects.length };
    await apiSaveProject(next);
    await refresh();
  }, [projects.length, refresh]);

  const remove = useCallback(async (slug: string) => {
    await apiDeleteProject(slug);
    await refresh();
  }, [refresh]);

  const reorder = useCallback(async (slug: string, direction: -1 | 1) => {
    const idx = projects.findIndex((p) => p.slug === slug);
    const target = idx + direction;
    if (idx < 0 || target < 0 || target >= projects.length) return;
    const a = projects[idx];
    const b = projects[target];
    await Promise.all([
      apiSaveProject({ ...a, order: target }),
      apiSaveProject({ ...b, order: idx }),
    ]);
    await refresh();
  }, [projects, refresh]);

  const reset = useCallback(async () => {
    await Promise.all(projectsSeed.map((p) => apiSaveProject(p)));
    await refresh();
  }, [refresh]);

  const getBySlug = useCallback(
    (slug: string) => projects.find((p) => p.slug === slug),
    [projects],
  );

  return { projects, getBySlug, save, add, remove, reorder, reset };
}
