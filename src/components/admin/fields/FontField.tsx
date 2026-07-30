import { cmsDirty, makeThemeId, useDirtyValue } from "@/lib/cmsDirty";

export const CURATED_FONTS = [
  "Archivo",
  "Work Sans",
  "Inter",
  "Instrument Serif",
  "Playfair Display",
  "Space Grotesk",
  "Geist",
  "DM Sans",
  "JetBrains Mono",
] as const;

type Props = {
  label: string;
  prop: "heading" | "body";
  current: Record<string, string>;
};

const FontField = ({ label, prop, current }: Props) => {
  const id = makeThemeId("fonts_json");
  const pending = useDirtyValue<Record<string, string> | null>(id, null);
  const obj = pending ?? current;
  const value = obj[prop] ?? "Inter";

  const onChange = (v: string) => {
    const next = { ...(pending ?? current), [prop]: v };
    cmsDirty.set({ kind: "theme", key: "fonts_json", value: next, original: current });
  };

  return (
    <div className="flex items-center gap-3 mb-2">
      <label className="text-xs text-gray-700 w-28 shrink-0">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
      >
        {CURATED_FONTS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontField;