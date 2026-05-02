import MediaField from "@/components/admin/fields/MediaField";
import TextField from "@/components/admin/fields/TextField";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import SectionHeader from "@/components/admin/sections/SectionHeader";

const GlobalSection = () => {
  const { get } = useSiteContent("global");
  const { value: hs } = useSiteSetting<{ url: string }>("headshot_url");
  return (
    <div>
      <SectionHeader title="Global / Identity" description="Applies site-wide." />

      <Section title="Identity">
        <MediaField
          label="Headshot"
          settingKey="headshot_url"
          currentUrl={hs?.url || ""}
          folder="headshot"
          kind="image"
        />
        <TextField label="Full name" page="global" section="identity" fieldKey="name" fallback={get("identity", "name", "Farquhar MacDougall")} />
        <TextField label="Tagline" page="global" section="identity" fieldKey="tagline" fallback={get("identity", "tagline", "I make things make sense.")} />
        <TextField label="LinkedIn URL" page="global" section="identity" fieldKey="linkedin" fallback={get("identity", "linkedin", "https://www.linkedin.com/in/farquharm/")} />
        <TextField label="Email" page="global" section="identity" fieldKey="email" fallback={get("identity", "email", "farqmac@me.com")} />
      </Section>

      <Section title="Theme (coming soon)">
        <p className="text-[11px] text-gray-500 italic">
          Colour, font, and heading-style controls are next on the roadmap. Tell me when you want to wire them up.
        </p>
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

export default GlobalSection;