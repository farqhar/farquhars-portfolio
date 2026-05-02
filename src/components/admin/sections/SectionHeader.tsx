import { useState } from "react";
import { toast } from "sonner";
import { Check, Save } from "lucide-react";
import { useDirtyCount } from "@/lib/cmsDirty";
import { saveAllDirty } from "@/lib/cmsApi";

type Props = {
  title: string;
  description?: string;
};

/**
 * Standard header used at the top of every CMS section.
 * Always renders a visible Save button so the user never has to scroll
 * to find one. Mirrors the global SaveBar behaviour.
 */
const SectionHeader = ({ title, description }: Props) => {
  const count = useDirtyCount();
  const [saving, setSaving] = useState(false);
  const hasChanges = count > 0;

  const handleSave = async () => {
    if (!hasChanges || saving) return;
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

  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
          hasChanges
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
        } disabled:opacity-100`}
        aria-label={hasChanges ? `Save ${count} changes` : "All changes saved"}
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
  );
};

export default SectionHeader;