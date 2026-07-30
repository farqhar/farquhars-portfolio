import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ThemeColors = {
  background?: string;
  foreground?: string;
  primary?: string;
  accent?: string;
  muted?: string;
  border?: string;
};
export type ThemeFonts = { heading?: string; body?: string };
export type HeadingScale = {
  h1?: { size?: number; weight?: number; tracking?: number };
  h2?: { size?: number; weight?: number; tracking?: number };
  h3?: { size?: number; weight?: number; tracking?: number };
};

export type ThemeRow = {
  colors_json: ThemeColors;
  fonts_json: ThemeFonts;
  headings_json: HeadingScale;
};

export const DEFAULT_THEME: ThemeRow = {
  colors_json: {
    background: "#F5F5F3",
    foreground: "#0A0A0A",
    primary: "#7A9B7E",
    accent: "#7A9B7E",
    muted: "#EDEDEA",
    border: "#DCDCD8",
  },
  fonts_json: { heading: "Archivo", body: "Work Sans" },
  headings_json: {
    h1: { size: 64, weight: 800, tracking: -0.02 },
    h2: { size: 40, weight: 800, tracking: -0.015 },
    h3: { size: 28, weight: 700, tracking: -0.01 },
  },
};

/* ---------- color helpers ---------- */

function hexToHslTriple(hex: string): string | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/* ---------- font loader ---------- */

const loadedFonts = new Set<string>();
function loadGoogleFont(name?: string) {
  if (!name) return;
  // System default — skip
  if (/^(system-ui|sans-serif|serif|monospace)$/i.test(name)) return;
  const key = name.trim();
  if (loadedFonts.has(key)) return;
  loadedFonts.add(key);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(key).replace(/%20/g, "+")}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/* ---------- apply ---------- */

export function applyTheme(t: ThemeRow) {
  const root = document.documentElement;
  const colors = { ...DEFAULT_THEME.colors_json, ...t.colors_json };
  const fonts = { ...DEFAULT_THEME.fonts_json, ...t.fonts_json };
  const headings = { ...DEFAULT_THEME.headings_json, ...t.headings_json };

  // Map theme hexes onto existing HSL semantic tokens.
  const tokenMap: Record<string, string | undefined> = {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--primary": colors.primary,
    "--ring": colors.primary,
    "--accent": colors.accent,
    "--muted": colors.muted,
    "--border": colors.border,
    "--input": colors.border,
  };
  for (const [token, hex] of Object.entries(tokenMap)) {
    if (!hex) continue;
    const hsl = hexToHslTriple(hex);
    if (hsl) root.style.setProperty(token, hsl);
  }

  // Fonts
  loadGoogleFont(fonts.heading);
  loadGoogleFont(fonts.body);
  root.style.setProperty("--font-heading", `"${fonts.heading}", system-ui, sans-serif`);
  root.style.setProperty("--font-body", `"${fonts.body}", system-ui, sans-serif`);
  document.body.style.fontFamily = `var(--font-body)`;

  // Heading scale
  const setH = (k: "h1" | "h2" | "h3") => {
    const v = headings[k] || {};
    if (v.size != null) root.style.setProperty(`--${k}-size`, `${v.size}px`);
    if (v.weight != null) root.style.setProperty(`--${k}-weight`, `${v.weight}`);
    if (v.tracking != null) root.style.setProperty(`--${k}-tracking`, `${v.tracking}em`);
  };
  setH("h1");
  setH("h2");
  setH("h3");
}

/* ---------- hook ---------- */

let cached: ThemeRow | null = null;

async function fetchTheme(): Promise<ThemeRow> {
  const { data } = await supabase
    .from("theme")
    .select("colors_json,fonts_json,headings_json")
    .limit(1)
    .maybeSingle();
  const row: ThemeRow = {
    colors_json: { ...DEFAULT_THEME.colors_json, ...((data?.colors_json as object) ?? {}) },
    fonts_json: { ...DEFAULT_THEME.fonts_json, ...((data?.fonts_json as object) ?? {}) },
    headings_json: { ...DEFAULT_THEME.headings_json, ...((data?.headings_json as object) ?? {}) },
  };
  cached = row;
  return row;
}

export function useTheme() {
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const t = await fetchTheme();
      if (!cancelled) applyTheme(t);
    };
    load();
    const onUpdate = () => {
      cached = null;
      load();
    };
    window.addEventListener("fm_cms_updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("fm_cms_updated", onUpdate);
    };
  }, []);
  return cached;
}

/** Read-once helper for the editor (always fresh). */
export async function getTheme(): Promise<ThemeRow> {
  return fetchTheme();
}