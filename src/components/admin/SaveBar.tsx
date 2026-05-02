import { useState } from "react";
import { toast } from "sonner";
import { Check, Save } from "lucide-react";
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

  const hasChanges = count > 0;

  return (
    <div
      className={`px-4 py-3 border-t-2 flex items-center justify-between gap-2 transition-colors shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.08)] ${
        hasChanges ? "bg-amber-50 border-amber-300" : "bg-white border-gray-200"
      }`}
    >
      <p className="text-xs text-gray-700">
        {hasChanges ? (
          <>
            <span className="font-semibold text-amber-700">{count}</span>{" "}
            unsaved {count === 1 ? "change" : "changes"}
          </>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <Check className="w-3 h-3" /> All changes saved
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDiscard}
          disabled={!hasChanges}
          className="text-xs px-2.5 py-1.5 rounded-md text-gray-700 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
            hasChanges
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
          } disabled:opacity-100`}
        >
          {hasChanges ? (
            <>
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : `Save (${count})`}
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              Saved
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SaveBar;