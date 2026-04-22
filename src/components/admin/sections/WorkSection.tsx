import TextField from "@/components/admin/fields/TextField";
import { useSiteContent } from "@/hooks/useSiteContent";

const WorkSection = () => {
  const { get } = useSiteContent("work");
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">Work (full portfolio)</h2>
      <p className="text-xs text-gray-500 mb-4">Hero copy and the four highlight tiles.</p>

      <Section title="Hero">
        <TextField label="Eyebrow" page="work" section="hero" fieldKey="eyebrow" fallback={get("hero", "eyebrow", "I bridge design and AI operations")} />
        <TextField label="Subhead" page="work" section="hero" fieldKey="subhead" fallback={get("hero", "subhead", "Eight projects. Real outcomes. Here's what I actually built — and what each one cost to make.")} multiline />
      </Section>

      <Section title="Highlight tiles">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="mb-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Tile {n}</p>
            <TextField label="Value" page="work" section="highlights" fieldKey={`v${n}`} fallback={get("highlights", `v${n}`, ["4,743%", "147 hrs/wk", "100+", "3d → 20m"][n - 1])} />
            <TextField label="Label" page="work" section="highlights" fieldKey={`l${n}`} fallback={get("highlights", `l${n}`, ["engagement lift", "process waste", "brand touchpoints", "tender drafting"][n - 1])} />
            <TextField label="Caveat" page="work" section="highlights" fieldKey={`c${n}`} fallback={get("highlights", `c${n}`, ["on one landing page I rebuilt", "identified in a workflow audit", "catalogued & systemised", "tool in build, supporting role"][n - 1])} />
          </div>
        ))}
      </Section>

      <p className="text-[11px] text-gray-500 italic">
        Per-project content (covers, hero images, problem/process/outcome) is edited under <strong>Projects</strong>.
      </p>
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