import { useCallback, useEffect, useState } from "react";
import { Project, projectsSeed } from "@/data/projectsSeed";

const STORAGE_KEY = "fm_projects_v1";

function load(): Project[] {
  if (typeof window === "undefined") return projectsSeed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return projectsSeed;
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed) || parsed.length === 0) return projectsSeed;
    return parsed.sort((a, b) => a.order - b.order);
  } catch {
    return projectsSeed;
  }
}

function persist(projects: Project[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event("fm_projects_updated"));
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => load());

  useEffect(() => {
    const sync = () => setProjects(load());
    window.addEventListener("fm_projects_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fm_projects_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((updated: Project) => {
    const next = load().map((p) => (p.slug === updated.slug ? updated : p));
    persist(next);
    setProjects(next);
  }, []);

  const add = useCallback((project: Project) => {
    const current = load();
    const next = [...current, { ...project, order: current.length }];
    persist(next);
    setProjects(next);
  }, []);

  const remove = useCallback((slug: string) => {
    const next = load().filter((p) => p.slug !== slug).map((p, i) => ({ ...p, order: i }));
    persist(next);
    setProjects(next);
  }, []);

  const reorder = useCallback((slug: string, direction: -1 | 1) => {
    const list = load();
    const idx = list.findIndex((p) => p.slug === slug);
    const target = idx + direction;
    if (idx < 0 || target < 0 || target >= list.length) return;
    const next = [...list];
    [next[idx], next[target]] = [next[target], next[idx]];
    next.forEach((p, i) => (p.order = i));
    persist(next);
    setProjects(next);
  }, []);

  const reset = useCallback(() => {
    persist(projectsSeed);
    setProjects(projectsSeed);
  }, []);

  const getBySlug = useCallback(
    (slug: string) => projects.find((p) => p.slug === slug),
    [projects],
  );

  return { projects, getBySlug, save, add, remove, reorder, reset };
}