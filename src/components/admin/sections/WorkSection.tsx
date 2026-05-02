import TextField from "@/components/admin/fields/TextField";
import { useSiteContent } from "@/hooks/useSiteContent";
import SectionHeader from "@/components/admin/sections/SectionHeader";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Check } from "lucide-react";
import { useDirtyCount } from "@/lib/cmsDirty";
import { saveAllDirty } from "@/lib/cmsApi";

const WorkSection = () => {
  const { get } = useSiteContent("work");
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
    <div>
      <SectionHeader title="Work (full portfolio)" description="Hero copy and the four highlight tiles." />

      <Section title="Hero">
        <TextField label="Eyebrow" page="work" section="hero" fieldKey="eyebrow" fallback={get("hero", "eyebrow", "I bridge design and AI operations")} />
        <TextField label="Subhead" page="work" section="hero" fieldKey="subhead" fallback={get("hero", "subhead", "Eight projects. Real outcomes. Here's what I actually built — and what each one cost to make.")} multiline />
      </Section>

      <Section title="Highlight tiles">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="mb-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Tile {n}</p>
            <TextField label="Value" page="work" section="highlights" fieldKey={`v${n}`} fallback={get("highlights", `v${n}`, ["$12.7M", "124", "40+", "v2"][n - 1])} />
            <TextField label="Label" page="work" section="highlights" fieldKey={`l${n}`} fallback={get("highlights", `l${n}`, ["inefficiency identified", "pain points mapped", "stakeholders interviewed", "AIQ ROI Platform"][n - 1])} />
            <TextField label="Caveat" page="work" section="highlights" fieldKey={`c${n}`} fallback={get("highlights", `c${n}`, ["across one engineering firm", "quantified and prioritised", "across departments", "phased commercialisation"][n - 1])} />
          </div>
        ))}
      </Section>

      <p className="text-[11px] text-gray-500 italic">
        Per-project content (covers, hero images, problem/process/outcome) is edited under <strong>Projects</strong>.
      </p>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          style={hasChanges ? { backgroundColor: "hsl(239 84% 67%)", color: "#ffffff" } : undefined}
          className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-md transition-all shadow-sm ${
            hasChanges
              ? "hover:brightness-110"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
          } disabled:cursor-not-allowed`}
        >
          {hasChanges ? (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : `Save Work page changes (${count})`}
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              All Work page changes saved
            </>
          )}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          Same as the Save bar at the bottom — saves every unsaved field across the CMS.
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6 pb-6 border-b border-gray-200 last:border-0">
    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
    {children}
  </div>
);

export default WorkSection;