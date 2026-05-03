import { ProjectFile } from "@/data/projectsSeed";
import MediaField from "./MediaField";

type Props = {
  slug: string;
  value: ProjectFile[];
  onChange: (next: ProjectFile[]) => void;
};

const inputCls =
  "w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900";

const SubProjectsField = ({ slug, value, onChange }: Props) => {
  const files = value || [];

  const update = (i: number, patch: Partial<ProjectFile>) => {
    const next = files.map((f, idx) => (idx === i ? { ...f, ...patch } : f));
    onChange(next);
  };

  const remove = (i: number) => onChange(files.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const next = [...files];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const add = () =>
    onChange([
      ...files,
      { title: "New file", caption: "", image: "/placeholder.svg", href: "" },
    ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-gray-700">
          Sub-projects (files inside this folder)
        </label>
        <button
          type="button"
          onClick={add}
          className="bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-md hover:bg-gray-800"
        >
          + Add file
        </button>
      </div>

      {files.length === 0 && (
        <p className="text-[11px] text-gray-500 italic mb-2">
          No sub-projects yet. Add files to make this folder expandable on the Work page.
        </p>
      )}

      <div className="space-y-3">
        {files.map((f, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-gray-500">#{i + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-700 text-xs disabled:opacity-30 px-1"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === files.length - 1}
                  className="text-gray-400 hover:text-gray-700 text-xs disabled:opacity-30 px-1"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-600 hover:text-red-700 text-[11px] px-1"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <input
                className={inputCls}
                placeholder="Title"
                value={f.title}
                onChange={(e) => update(i, { title: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="Link (optional)"
                value={f.href}
                onChange={(e) => update(i, { href: e.target.value })}
              />
            </div>
            <input
              className={`${inputCls} mb-2`}
              placeholder="Caption"
              value={f.caption}
              onChange={(e) => update(i, { caption: e.target.value })}
            />

            <MediaField
              label="Image or PDF"
              kind="file"
              folder={`projects/${slug}/files`}
              currentUrl={f.image}
              onSaved={(url) => update(i, { image: url })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubProjectsField;
