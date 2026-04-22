import { useEffect, useState } from "react";
import { cmsDirty, makeContentId, useDirtyValue } from "@/lib/cmsDirty";

type Props = {
  label: string;
  page: string;
  section: string;
  fieldKey: string;
  fallback: string;
  multiline?: boolean;
  rows?: number;
};

const TextField = ({ label, page, section, fieldKey, fallback, multiline, rows = 3 }: Props) => {
  const id = makeContentId(page, section, fieldKey);
  // initial val: pending dirty value if any, otherwise fallback
  const dirtyVal = useDirtyValue<string>(id, fallback);
  const [val, setVal] = useState<string>(dirtyVal ?? fallback);
  const dirty = val !== fallback;

  useEffect(() => {
    // When the source-of-truth fallback changes (e.g. switched page) and
    // there's no pending edit, snap the input to it.
    if (!cmsDirty.get(id)) setVal(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallback, page, section, fieldKey]);

  const onChange = (v: string) => {
    setVal(v);
    cmsDirty.set({ kind: "content", page, section, key: fieldKey, value: v, original: fallback });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-gray-700 uppercase tracking-wider">{label}</label>
        {dirty && (
          <span className="text-[9px] font-semibold text-amber-600 uppercase tracking-wider">Unsaved</span>
        )}
      </div>
      {multiline ? (
        <textarea
          value={val}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full text-sm border border-gray-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <input
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm border border-gray-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );
};

export default TextField;