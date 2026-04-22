import { useEffect, useState } from "react";
import { cmsDirty, makeThemeId, useDirtyValue } from "@/lib/cmsDirty";

type Props = {
  label: string;
  /** colors_json | fonts_json | headings_json */
  themeKey: "colors_json";
  /** key inside the JSON object, e.g. "background" */
  prop: string;
  /** Full current object from DB so we can patch a sub-key. */
  current: Record<string, string>;
};

const ColorField = ({ label, themeKey, prop, current }: Props) => {
  const id = makeThemeId(themeKey);
  const pending = useDirtyValue<Record<string, string> | null>(id, null);
  const obj = pending ?? current;
  const value = obj[prop] ?? "#000000";
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const commit = (v: string) => {
    setLocal(v);
    const next = { ...(pending ?? current), [prop]: v };
    cmsDirty.set({ kind: "theme", key: themeKey, value: next, original: current });
  };

  return (
    <div className="flex items-center gap-3 mb-2">
      <label className="text-xs text-gray-700 w-28 shrink-0">{label}</label>
      <input
        type="color"
        value={local}
        onChange={(e) => commit(e.target.value)}
        className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
      />
      <input
        type="text"
        value={local}
        onChange={(e) => commit(e.target.value)}
        className="flex-1 text-xs font-mono border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
};

export default ColorField;