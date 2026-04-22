import { useEffect, useState } from "react";
import ColorField from "@/components/admin/fields/ColorField";
import FontField from "@/components/admin/fields/FontField";
import NumberField from "@/components/admin/fields/NumberField";
import { DEFAULT_THEME, getTheme, type ThemeRow } from "@/lib/theme";
import { cmsDirty, makeThemeId, useDirtyValue } from "@/lib/cmsDirty";

type HeadKey = "h1" | "h2" | "h3";

const ThemeSection = () => {
  const [theme, setTheme] = useState<ThemeRow | null>(null);

  useEffect(() => {
    getTheme().then(setTheme);
    const onUpdate = () => getTheme().then(setTheme);
    window.addEventListener("fm_cms_updated", onUpdate);
    return () => window.removeEventListener("fm_cms_updated", onUpdate);
  }, []);

  const headingsId = makeThemeId("headings_json");
  const pendingHeadings = useDirtyValue<Record<string, { size?: number; weight?: number; tracking?: number }> | null>(
    headingsId,
    null,
  );

  if (!theme) return <p className="text-xs text-gray-400">Loading theme…</p>;

  const headings = pendingHeadings ?? theme.headings_json;

  const updateHeading = (k: HeadKey, prop: "size" | "weight" | "tracking", v: number) => {
    const next = { ...headings, [k]: { ...(headings[k] || {}), [prop]: v } };
    cmsDirty.set({ kind: "theme", key: "headings_json", value: next, original: theme.headings_json });
  };

  const resetAll = () => {
    cmsDirty.set({ kind: "theme", key: "colors_json", value: DEFAULT_THEME.colors_json, original: theme.colors_json });
    cmsDirty.set({ kind: "theme", key: "fonts_json", value: DEFAULT_THEME.fonts_json, original: theme.fonts_json });
    cmsDirty.set({ kind: "theme", key: "headings_json", value: DEFAULT_THEME.headings_json, original: theme.headings_json });
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">Theme</h2>
      <p className="text-xs text-gray-500 mb-4">Colors, typography, and heading scale apply site-wide.</p>

      <Section title="Colors">
        <ColorField label="Background" themeKey="colors_json" prop="background" current={theme.colors_json as Record<string, string>} />
        <ColorField label="Foreground" themeKey="colors_json" prop="foreground" current={theme.colors_json as Record<string, string>} />
        <ColorField label="Primary" themeKey="colors_json" prop="primary" current={theme.colors_json as Record<string, string>} />
        <ColorField label="Accent" themeKey="colors_json" prop="accent" current={theme.colors_json as Record<string, string>} />
        <ColorField label="Muted" themeKey="colors_json" prop="muted" current={theme.colors_json as Record<string, string>} />
        <ColorField label="Border" themeKey="colors_json" prop="border" current={theme.colors_json as Record<string, string>} />
      </Section>

      <Section title="Typography">
        <FontField label="Heading font" prop="heading" current={theme.fonts_json as Record<string, string>} />
        <FontField label="Body font" prop="body" current={theme.fonts_json as Record<string, string>} />
      </Section>

      <Section title="Heading scale">
        {(["h1", "h2", "h3"] as HeadKey[]).map((k) => (
          <div key={k} className="mb-4 pb-3 border-b border-gray-100 last:border-0">
            <p className="text-[11px] font-semibold text-gray-700 uppercase mb-2">{k.toUpperCase()}</p>
            <NumberField label="Size" value={headings[k]?.size ?? 0} onChange={(v) => updateHeading(k, "size", v)} min={12} max={120} suffix="px" />
            <NumberField label="Weight" value={headings[k]?.weight ?? 400} onChange={(v) => updateHeading(k, "weight", v)} min={100} max={900} step={100} />
            <NumberField label="Track" value={headings[k]?.tracking ?? 0} onChange={(v) => updateHeading(k, "tracking", v)} min={-0.1} max={0.1} step={0.005} suffix="em" />
          </div>
        ))}
      </Section>

      <button
        onClick={resetAll}
        className="w-full text-xs text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md py-2"
      >
        Reset to defaults
      </button>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6 pb-6 border-b border-gray-200">
    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
    {children}
  </div>
);

export default ThemeSection;