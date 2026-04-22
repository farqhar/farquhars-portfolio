import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { cmsDirty, makeContentId, useDirtyValue } from "@/lib/cmsDirty";

type Props<T> = {
  label: string;
  page: string;
  section: string;
  fieldKey: string;
  fallback: T[];
  newItem: () => T;
  renderItem: (item: T, update: (next: T) => void, index: number) => React.ReactNode;
};

function ListField<T>({ label, page, section, fieldKey, fallback, newItem, renderItem }: Props<T>) {
  const id = makeContentId(page, section, fieldKey);
  const dirty = useDirtyValue<T[] | null>(id, null);
  const [items, setItems] = useState<T[]>(dirty ?? fallback);

  useEffect(() => {
    if (!cmsDirty.get(id)) setItems(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fallback), page, section, fieldKey]);

  useEffect(() => {
    if (dirty) setItems(dirty);
  }, [dirty]);

  const commit = (next: T[]) => {
    setItems(next);
    cmsDirty.set({ kind: "content", page, section, key: fieldKey, value: next, original: fallback });
  };

  const updateAt = (i: number, v: T) => commit(items.map((it, j) => (j === i ? v : it)));
  const remove = (i: number) => commit(items.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };
  const add = () => commit([...items, newItem()]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-medium text-gray-700 uppercase tracking-wider">{label}</label>
        <button
          onClick={add}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 px-2 py-0.5 rounded hover:bg-indigo-50"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="border border-gray-200 rounded-md p-3 bg-gray-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 font-mono">#{i + 1}</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  onClick={() => remove(i)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            {renderItem(it, (v) => updateAt(i, v), i)}
          </div>
        ))}
        {!items.length && (
          <p className="text-[11px] text-gray-400 italic text-center py-4">No items yet — click Add</p>
        )}
      </div>
    </div>
  );
}

export default ListField;