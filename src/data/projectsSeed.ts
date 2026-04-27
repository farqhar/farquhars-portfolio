export type Project = {
  slug: string;
  title: string;
  role: string;
  timeline: string;
  outcomeMetric: string;
  cover: string;
  hero: string;
  problem: string;
  process: string;
  outcome: string;
  honest: string;
  quotes: string[];
  order: number;
};

const placeholder = "/placeholder.svg";

export const projectsSeed: Project[] = [
  {
    slug: "cjc-digital-construction-landing-page",
    title: "CJC Digital Construction Landing Page",
    role: "Creative Direction · Web Design · Stakeholder Management",
    timeline: "6 weeks",
    outcomeMetric: "4,743% engagement",
    cover: placeholder,
    hero: placeholder,
    problem:
      "CJC's digital arm had no way to communicate what it actually did. The existing page collapsed three offerings into one paragraph, and bounce rates told the story.",
    process:
      "Mapped the service offering with three department leads, prototyped a narrative-led page in two passes, and pushed for fewer words and more proof. Worked through five rounds of stakeholder feedback without losing the structural spine.",
    outcome:
      "Engagement jumped 4,743% in the first quarter post-launch. The page became the default link in business development conversations.",
    honest:
      "I underestimated how much internal alignment the page would force. Half the work happened in stakeholder rooms, not in Figma.",
    quotes: [
      "It finally explains what we do without an apology. — Department Lead",
    ],
    order: 0,
  },
  {
    slug: "ai-workflow-survey-system",
    title: "AI Workflow Survey System & Pain Point Analysis",
    role: "Operations Design · Research · AI Tooling",
    timeline: "10 weeks",
     outcomeMetric: "147 hrs/wk identified",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Leadership knew AI could help but had no shared evidence of where time was actually being lost. Anecdotes were driving tooling decisions.",
    process:
      "Designed a structured intake survey, ran it across departments, then built a tagging framework that grouped pain points by frequency, severity, and automatability.",
    outcome:
      "Surfaced 147 weekly hours of reclaimable work and a prioritised tooling roadmap leadership now uses to greenlight pilots.",
    honest:
      "The hardest part wasn't the analysis — it was getting busy people to answer honestly. I rewrote the intake three times.",
    quotes: [
      "First time we've had data instead of opinions on this. — Head of Operations",
    ],
    order: 1,
  },
  {
    slug: "cjc-air-and-ports-motion-video",
    title: "CJC Air & Ports Motion Video",
    role: "Creative Direction · Motion Design · Script",
    timeline: "4 weeks",
     outcomeMetric: "Multiple million dollar projects won",
    cover: placeholder,
    hero: placeholder,
    problem:
      "The Air & Ports division needed a sales-room asset that explained scale and capability in under 90 seconds, without leaning on stock footage.",
    process:
      "Wrote the script around three customer truths, storyboarded a motion treatment, and directed the build with a motion designer. Two rounds, no stock.",
    outcome:
      "The video became the opening asset in every Air & Ports pitch deck and is now embedded in the division's homepage.",
    honest:
      "I cut the runtime in half on the last revision and the video got better. I should've started shorter.",
    quotes: [
      "It actually sounds like us. — Division Director",
    ],
    order: 2,
  },
  {
    slug: "brand-touchpoint-audit-ownership-framework",
    title: "Brand Touchpoint Audit & Ownership Framework",
    role: "Brand Strategy · Systems · Stakeholder Management",
    timeline: "8 weeks",
     outcomeMetric: "100+ touchpoints tracked",
    cover: placeholder,
    hero: placeholder,
    problem:
      "No one could say who owned what across the brand. Templates drifted, signage was inconsistent, and the same fix kept being made in three different places.",
    process:
      "Audited every customer-facing surface, built a single ownership matrix, and walked it through with each owner until they agreed it was theirs.",
    outcome:
      "Over 100 touchpoints now have a named owner, a review cadence, and a single source of truth.",
    honest:
      "Half the work was diplomacy. Naming an owner is easy. Getting them to accept it is the project.",
    quotes: [
      "I finally know what I'm responsible for. — Marketing Manager",
    ],
    order: 3,
  },
  {
    slug: "animated-email-signature-suite-case-happy-holidays",
    title: "Animated Email Signature Suite — CaSE Happy Holidays",
    role: "Design · Motion · Email Engineering",
    timeline: "2 weeks",
     outcomeMetric: "120+ staff deployed",
    cover: placeholder,
    hero: placeholder,
    problem:
      "The annual holiday signature was a 4MB JPEG no one updated. It looked tired, broke on Outlook, and gave nothing back to the brand.",
    process:
      "Designed a lightweight animated signature that degraded gracefully on Outlook, then built a one-click install path so 320+ staff could deploy it themselves.",
    outcome:
      "Deployed across the org in under a week. Held up across Outlook, Gmail, and Apple Mail without a single helpdesk ticket.",
    honest:
      "Email is hostile design territory. Half the time I spent on this was pretending it was 2009.",
    quotes: [
      "First holiday signature that didn't make me wince. — Internal Comms Lead",
    ],
    order: 4,
  },
  {
    slug: "aiq-control-centre-internal-comms-automation",
    title: "AIQ Control Centre & Internal Comms Automation",
    role: "Product Design · AI Workflow · Comms Strategy",
    timeline: "12 weeks",
    outcomeMetric: "80% comms automated",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Internal comms were stitched together by hand every week — pulling metrics, writing summaries, formatting emails. The work was invisible until it broke.",
    process:
      "Designed a control centre that pulls from source systems, drafts the comms with an AI layer, and routes them to a human approver before sending.",
    outcome:
      "Around 80% of weekly internal comms now ship through the control centre. Human time shifted from assembly to editorial.",
    honest:
      "Automating comms doesn't remove the editorial judgment — it concentrates it. That part surprised me.",
    quotes: [
      "I get my Fridays back. — Internal Comms Lead",
    ],
    order: 5,
  },
  {
    slug: "wollip-email-signature-saas",
    title: "Wollip — Email Signature SaaS",
    role: "Founder · Product Design · Brand",
    timeline: "Ongoing",
    outcomeMetric: "In private beta",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Every company I worked with had the same email signature problem and no SaaS that solved it without enterprise pricing or an IT project.",
    process:
      "Designed the product around a single insight: signatures should be deployed centrally and edited locally. Built the brand, the marketing site, and the onboarding flow in parallel.",
    outcome:
      "Currently in private beta with three paying companies. Validated the central-deploy / local-edit model.",
    honest:
      "I keep wanting to add features. The product gets better when I delete them.",
    quotes: [
      "This is the thing we've been building badly in-house for years. — Beta Customer",
    ],
    order: 6,
  },
  {
    slug: "cv-generation-tool-engineering-tender-automation",
    title: "CV Generation Tool — Engineering Tender Automation",
    role: "Product Design · AI Workflow · Internal Tooling",
    timeline: "9 weeks",
    outcomeMetric: "From 3 days to 20 mins",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Every engineering tender required tailored CVs for 8–20 staff, hand-assembled in Word. The process took three days and blocked bid teams.",
    process:
      "Designed a structured CV database, a tender-brief intake, and an AI layer that drafts the tailored CV. Bid leads review and ship.",
    outcome:
      "Tailored-CV turnaround dropped from three days to twenty minutes. Bid teams now spend that time on the win themes.",
    honest:
      "The AI was the easy part. The hard part was convincing engineers their CV deserved a database row.",
    quotes: [
      "I'd never go back to the old process. — Bid Manager",
    ],
    order: 7,
  },
];