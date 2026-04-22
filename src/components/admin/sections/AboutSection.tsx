import TextField from "@/components/admin/fields/TextField";
import MediaField from "@/components/admin/fields/MediaField";
import ListField from "@/components/admin/fields/ListField";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSiteSetting } from "@/hooks/useSiteSettings";

type Testimonial = { quote: string; name: string; role: string; avatar?: string };

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { quote: "Brought clarity to a process we'd been stuck on for months. The tooling he designed is now part of how we operate.", name: "[Stakeholder]", role: "Operations lead" },
  { quote: "Treats design and ops as the same problem. Rare combination — and exactly what we needed.", name: "[Director]", role: "Strategy & Brand" },
  { quote: "He'll tell you the honest version, not the polished one. That's why the work actually ships.", name: "[Engineering manager]", role: "Product team" },
];

const AboutSection = () => {
  const { get } = useSiteContent("about");
  const { value: hs } = useSiteSetting<{ url: string }>("headshot_url");
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">About page</h2>
      <p className="text-xs text-gray-500 mb-4">Edits appear in the live preview on the right.</p>

      <Section title="Headshot">
        <MediaField
          label="Headshot photo"
          settingKey="headshot_url"
          currentUrl={hs?.url || ""}
          folder="headshot"
          kind="image"
        />
      </Section>

      <Section title="Hero">
        <TextField label="Status pill" page="about" section="hero" fieldKey="status" fallback={get("hero", "status", "Currently · Building AI operations at [Company]")} />
        <TextField label="Headline (line 1)" page="about" section="hero" fieldKey="headline1" fallback={get("hero", "headline1", "I started in graphic design.")} />
        <TextField label="Headline (line 2)" page="about" section="hero" fieldKey="headline2" fallback={get("hero", "headline2", "Now I build AI optimised workflows.")} />
        <TextField label="Intro paragraph" page="about" section="hero" fieldKey="intro" fallback={get("hero", "intro", "The throughline is the same — act as a bridge between technical and non-technical departments, and make complicated things make sense. I'm Farquhar — I work where craft meets operations, most useful when the answer sits between a Figma file and a workflow.")} multiline rows={5} />
      </Section>

      <Section title="Then / Now">
        <TextField label="Then — title" page="about" section="thennow" fieldKey="then_title" fallback={get("thennow", "then_title", "Graphic Designer")} />
        <TextField label="Then — body" page="about" section="thennow" fieldKey="then_body" fallback={get("thennow", "then_body", "Brand systems, identity, type, motion. Working out what something is and how it should feel.")} multiline />
        <TextField label="Now — title" page="about" section="thennow" fieldKey="now_title" fallback={get("thennow", "now_title", "AI Operations PM")} />
        <TextField label="Now — body" page="about" section="thennow" fieldKey="now_body" fallback={get("thennow", "now_body", "Designing AI workflows, internal tools, and the operating system around them. Same problem, different surface.")} multiline />
      </Section>

      <Section title="How I work">
        <TextField label="Block 1 heading" page="about" section="howiwork" fieldKey="b1_heading" fallback={get("howiwork", "b1_heading", "Discover & Design")} />
        <TextField label="Block 1 intro" page="about" section="howiwork" fieldKey="b1_intro" fallback={get("howiwork", "b1_intro", "Understand the problem before reaching for the tool. Map the workflow before designing the screen.")} multiline />
        <TextField label="Block 2 heading" page="about" section="howiwork" fieldKey="b2_heading" fallback={get("howiwork", "b2_heading", "Rapid Iteration")} />
        <TextField label="Block 2 intro" page="about" section="howiwork" fieldKey="b2_intro" fallback={get("howiwork", "b2_intro", "Ship the smallest useful version, learn fast, and cut what isn't working.")} multiline />
      </Section>

      <Section title="Contact card">
        <TextField label="Heading" page="about" section="contact" fieldKey="heading" fallback={get("contact", "heading", "Let's talk.")} />
        <TextField label="Sub line" page="about" section="contact" fieldKey="sub" fallback={get("contact", "sub", "farqmac@me.com · Sydney, Australia")} />
      </Section>

      <Section title="Testimonials">
        <ListField<Testimonial>
          label="Quotes"
          page="about"
          section="testimonials"
          fieldKey="items"
          fallback={get<Testimonial[]>("testimonials", "items", DEFAULT_TESTIMONIALS)}
          newItem={() => ({ quote: "", name: "", role: "", avatar: "" })}
          renderItem={(item, update) => (
            <div className="space-y-2">
              <textarea
                value={item.quote}
                onChange={(e) => update({ ...item, quote: e.target.value })}
                placeholder="Quote"
                rows={3}
                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={item.name}
                  onChange={(e) => update({ ...item, name: e.target.value })}
                  placeholder="Name"
                  className="text-sm border border-gray-300 rounded-md px-2 py-1.5"
                />
                <input
                  value={item.role}
                  onChange={(e) => update({ ...item, role: e.target.value })}
                  placeholder="Role"
                  className="text-sm border border-gray-300 rounded-md px-2 py-1.5"
                />
              </div>
              <input
                value={item.avatar || ""}
                onChange={(e) => update({ ...item, avatar: e.target.value })}
                placeholder="Avatar URL (optional)"
                className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5"
              />
            </div>
          )}
        />
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

export default AboutSection;