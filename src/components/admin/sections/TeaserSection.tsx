import TextField from "@/components/admin/fields/TextField";
import MediaField from "@/components/admin/fields/MediaField";
import { useSiteContent } from "@/hooks/useSiteContent";
import SectionHeader from "@/components/admin/sections/SectionHeader";

const TeaserSection = () => {
  const { get } = useSiteContent("teaser");
  return (
    <div>
      <SectionHeader title="Teaser (Home)" description="Edits appear in the live preview on the right." />

      <Section title="Hero">
        <TextField label="Phase 1 — Name line" page="teaser" section="hero" fieldKey="phase0" fallback={get("hero", "phase0", "My name is Farquhar.")} />
        <TextField label="Phase 2 — Pronunciation top" page="teaser" section="hero" fieldKey="phase1_a" fallback={get("hero", "phase1_a", "It's pronounced like Parker,")} />
        <TextField label="Phase 2 — Pronunciation bottom" page="teaser" section="hero" fieldKey="phase1_b" fallback={get("hero", "phase1_b", "with an F.")} />
        <TextField label="Phase 3 — Eyebrow" page="teaser" section="hero" fieldKey="eyebrow" fallback={get("hero", "eyebrow", "FARQUHAR MACDOUGALL")} />
        <TextField label="Phase 3 — Headline" page="teaser" section="hero" fieldKey="headline" fallback={get("hero", "headline", "Some people make things look good.")} />
        <TextField label="Phase 3 — Subhead" page="teaser" section="hero" fieldKey="subhead" fallback={get("hero", "subhead", "I make things make sense.")} />
      </Section>

      <Section title="CTA section (bottom of page)">
        <TextField label="Heading line 1" page="teaser" section="cta" fieldKey="line1" fallback={get("cta", "line1", "If something here made you think —")} />
        <TextField label="Heading line 2" page="teaser" section="cta" fieldKey="line2" fallback={get("cta", "line2", "let's talk.")} />
        <TextField label="Email" page="teaser" section="cta" fieldKey="email" fallback={get("cta", "email", "farqmac@me.com")} />
        <TextField label="Primary button label" page="teaser" section="cta" fieldKey="primaryLabel" fallback={get("cta", "primaryLabel", "See full portfolio →")} />
        <TextField label="Footer line" page="teaser" section="cta" fieldKey="footer" fallback={get("cta", "footer", "Sydney, Australia · Available for opportunities")} />
      </Section>

      <Section title="Project cards (selected work)">
        <p className="text-[11px] text-gray-500 mb-3">
          Replace the cover image for each of the three teaser project cards.
        </p>
        <MediaField label="Boondi cover" page="teaser" section="cells" fieldKey="boondi_cover" currentUrl={get("cells", "boondi_cover", "")} folder="teaser/cells" kind="image" />
        <MediaField label="Chippy cover" page="teaser" section="cells" fieldKey="chippy_cover" currentUrl={get("cells", "chippy_cover", "")} folder="teaser/cells" kind="image" />
        <MediaField label="Measured Aesthetic cover" page="teaser" section="cells" fieldKey="analogue_cover" currentUrl={get("cells", "analogue_cover", "")} folder="teaser/cells" kind="image" />
      </Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6 pb-6 border-b border-gray-200 last:border-0">
    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
    {children}
  </div>
);

export default TeaserSection;