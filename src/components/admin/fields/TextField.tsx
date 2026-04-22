import { useEffect, useState } from "react";
import { saveContent } from "@/lib/cmsApi";

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
  const [val, setVal] = useState(fallback);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setVal(fallback);
  }, [fallback, page, section, fieldKey]);

  const handleSave = async () => {
    setSaving(true);
    setErr(null);
    try {
      await saveContent(page, section, fieldKey, val);
      setDirty(false);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onChange = (v: string) => {
    setVal(v);
    setDirty(v !== fallback);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-gray-700 uppercase tracking-wider">{label}</label>
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-[10px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded disabled:opacity-50"
          >
            {saving ? "…" : "Save"}
          </button>
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
      {err && <p className="text-[10px] text-red-600 mt-1">{err}</p>}
    </div>
  );
};

export default TextField;