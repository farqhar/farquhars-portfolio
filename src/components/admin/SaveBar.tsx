import { useState } from "react";
import { toast } from "sonner";
import { cmsDirty, useDirtyCount } from "@/lib/cmsDirty";
import { saveAllDirty } from "@/lib/cmsApi";

const SaveBar = () => {
  const count = useDirtyCount();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!count || saving) return;
    setSaving(true);
    try {
      await saveAllDirty();
      toast.success(`Saved ${count} change${count === 1 ? "" : "s"} ✓`);
    } catch (e) {
      toast.error("Save failed", { description: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!count) return;
    cmsDirty.clear();
    // Re-render fields by signalling content changed (no DB hit).
    window.dispatchEvent(new Event("fm_cms_updated"));
    toast("Discarded unsaved changes");
  };

  const disabled = count === 0;

  return (
    <div
      className={`px-4 py-3 border-t flex items-center justify-between gap-2 transition-colors ${
        disabled ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-200"
      }`}
    >
      <p className="text-xs text-gray-700">
        {disabled ? (
          <span className="text-gray-400">No unsaved changes</span>
        ) : (
          <>
            <span className="font-semibold text-amber-700">{count}</span>{" "}
            unsaved {count === 1 ? "change" : "changes"}
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDiscard}
          disabled={disabled}
          className="text-xs px-2.5 py-1.5 rounded-md text-gray-700 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={disabled || saving}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SaveBar;