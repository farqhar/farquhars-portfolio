export type ProjectFile = {
  title: string;
  caption: string;
  image: string;
  href: string;
};

export type ProjectStat = {
  value: string;
  label: string;
};

export type GalleryImage = {
  url: string;
  alt?: string;
  type?: "image" | "video";
  /** Per-image size override as percentage (25–100). Inherits project default when omitted. */
  widthPct?: number;
};

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
  files?: ProjectFile[];
  order: number;
  // Folder-card content (used by ProjectDeck)
  tagline?: string;
  client?: string;
  overview?: string;
  stats?: ProjectStat[];
  tags?: string[];
  bgClass?: string;
  mockType?: "dark" | "light";
  heroBackground?: string;
  label?: string;
  gallery?: GalleryImage[];
  heroFit?: "cover" | "contain";
  /** Default carousel display size as percentage (25–100). */
  galleryDefaultWidth?: number;
  /** When true, hero frame shrinks/grows to the image's natural aspect ratio. */
  heroAutoSize?: boolean;
};

const placeholder = "/placeholder.svg";

export const projectsSeed: Project[] = [
  {
    slug: "pain-point-discovery",
    title: "Pain Point Discovery",
    role: "Programme Lead",
    timeline: "4 Months",
    outcomeMetric: "$12.7M Annualised Cost",
    cover: placeholder,
    hero: placeholder,
    problem:
      "There was no structured view of where time and money were being lost across the firm. Anecdotes were driving AI strategy.",
    process:
      "Designed the interview methodology, ran 40+ stakeholder sessions, extracted 124 unique pain points, and quantified annualised cost. Output: a board presentation that reframed AI from cost line to capital project. The discovery became the foundation for the entire AIQ programme.",
    outcome:
      "A board-ready audit quantifying $12.7M of annualised inefficiency across one engineering firm. 40+ interviews. 124 unique pain points identified.",
    honest:
      "The methodology was only half the work. Getting senior stakeholders to speak candidly about inefficiency in their own teams was the harder problem.",
    quotes: [],
    order: 0,
    label: "2024 · Data",
    tagline:
      "A board-ready audit quantifying $12.7M of annualised inefficiency across one engineering firm.",
    client: "Global Engineering Firm",
    overview:
      "Designed the interview methodology, ran 40+ stakeholder sessions, extracted 124 unique pain points, and quantified annualised cost. Output: a board presentation that reframed AI from cost line to capital project. The discovery became the foundation for the entire AIQ programme.",
    stats: [
      { value: "40+", label: "Interviews" },
      { value: "124", label: "Unique Pain Points" },
      { value: "$12.7M", label: "Annualised Cost" },
    ],
    tags: ["Discovery", "Quantification", "Stakeholder Research", "Board Reporting"],
    bgClass: "bg-4",
    mockType: "dark",
    heroBackground:
      "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 60%, rgba(123,91,255,0.4) 100%)",
  },
  {
    slug: "aiq-roi-platform",
    title: "AIQ ROI Platform",
    role: "Product Lead · Designer · Builder",
    timeline: "6 Months",
    outcomeMetric: "4 Live Modules · 12 Solutions Tracked",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Every AI programme faces the same problem: leadership wants to know if it's working, and there's no single place to see it.",
    process:
      "Built in Lovable + Supabase with the Claude API as the analysis layer and AI agents handling data processing across modules. Designed to function as a lead generation tool — allowing businesses outside the organisation to see exactly how AI integration could map to their own operations and where the financial return sits.",
    outcome:
      "4 live modules tracking 12 solutions. V2 scoped for commercialisation. Solves the core problem of every AI programme: proving the ROI is real, not theoretical.",
    honest:
      "Building the dashboard was straightforward. Convincing people to trust the numbers it showed was the real work.",
    quotes: [],
    order: 1,
    label: "2025 · AI + Product",
    tagline:
      "A purpose-built intelligence dashboard linking identified pain points to deployed AI solutions — built to prove ROI and position AI adoption as a commercial decision, not a cost.",
    client: "Internal",
    overview:
      "Built in Lovable + Supabase with the Claude API as the analysis layer and AI agents handling data processing across modules. Solves the core problem of every AI programme: proving the ROI is real, not theoretical. Designed to function as a lead generation tool — allowing businesses outside the organisation to see exactly how AI integration could map to their own operations and where the financial return sits. V2 scoped for commercialisation.",
    stats: [
      { value: "4", label: "Live Modules" },
      { value: "12", label: "Solutions Tracked" },
      { value: "v2", label: "Phased Commercialisation" },
    ],
    tags: ["Lovable", "Supabase", "Claude API", "AI Agents", "Product Design"],
    bgClass: "bg-2",
    mockType: "light",
    heroBackground:
      "linear-gradient(135deg, #FAFAF9 0%, rgba(43,91,255,0.15) 50%, rgba(123,91,255,0.1) 100%)",
  },
  {
    slug: "cv-generation-tool",
    title: "CV Generation Tool",
    role: "Contributor · Template Designer",
    timeline: "Ongoing",
    outcomeMetric: "60+ Hrs Saved Weekly",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Engineering firms bidding on major infrastructure projects were spending 60+ hours a week manually assembling tailored CVs for tender submissions.",
    process:
      "Contributed to the build of an AI-powered CV generation tool for a 200-person engineering firm. Responsible for designing the output templates — ensuring the automated tool produced client-ready, on-brand documents suitable for major infrastructure tender submissions. Tool built by the AIQ technical lead.",
    outcome:
      "60+ hours saved weekly across a 200-person firm. V1 shipped and in active use on multi-million dollar tender submissions.",
    honest:
      "Template design sounds simple. Getting output that holds up under scrutiny from engineering directors on high-value tenders is a different problem.",
    quotes: [],
    order: 2,
    label: "2025 · AI + Automation",
    tagline:
      "Contributed to reducing a 60+ hour manual process to minutes for engineering firms bidding on major infrastructure.",
    client: "Global Engineering Firm",
    overview:
      "Contributed to the build of an AI-powered CV generation tool for a 200-person engineering firm. Responsible for designing the output templates — ensuring the automated tool produced client-ready, on-brand documents suitable for major infrastructure tender submissions. Tool built by the AIQ technical lead.",
    stats: [
      { value: "60+", label: "Hrs Saved Weekly" },
      { value: "Multi-million", label: "Dollar Tenders" },
      { value: "V1", label: "Shipped" },
    ],
    tags: ["Template Design", "Workflow Mapping", "Process Design"],
    bgClass: "bg-3",
    mockType: "light",
    heroBackground: "linear-gradient(135deg, #FAFAF9 0%, #F0EDE8 100%)",
  },
  {
    slug: "digital-construction-page",
    title: "Digital Construction Page",
    role: "Creative Director · Strategist",
    timeline: "3 Months",
    outcomeMetric: "4,743% Engagement Increase",
    cover: placeholder,
    hero: placeholder,
    problem:
      "The Digital Construction practice had no way to communicate what it actually did. The existing page collapsed three service lines into one paragraph.",
    process:
      "Led creative direction for a Digital Construction landing page — translated dense technical capability into clear, client-facing visual storytelling. Measured a 4,743% increase in average engagement time across two three-month comparison periods.",
    outcome:
      "Average session time increased from 27 seconds to 23 minutes. Became the most visited services page on the site, accounting for 64.8% of site traffic — directly supporting sales and tender positioning.",
    honest:
      "The hardest part was internal. Getting five stakeholders to agree on what the firm actually did, in plain language, took longer than building the page.",
    quotes: [],
    order: 3,
    label: "2024 · Design + Data",
    tagline:
      "Translating complex engineering capability into a page that people actually read.",
    client: "Global Engineering Firm",
    overview:
      "Led creative direction for a Digital Construction landing page — translated dense technical capability into clear, client-facing visual storytelling. Measured a 4,743% increase in average engagement time across two three-month comparison periods. Became the most visited services page on the site, directly supporting sales and tender positioning.",
    stats: [
      { value: "4,743%", label: "Engagement Increase" },
      { value: "27s → 23min", label: "Session Time" },
      { value: "64.8%", label: "of Site Traffic" },
    ],
    tags: ["Visual Storytelling", "Stakeholder Management", "Web Design", "Analytics"],
    bgClass: "bg-5",
    mockType: "light",
    heroBackground:
      "linear-gradient(135deg, #FAFAF9 0%, rgba(43,91,255,0.08) 100%)",
  },
  {
    slug: "brand-touchpoint-system",
    title: "Brand Touchpoint System",
    role: "Systems Designer · Strategist",
    timeline: "Ongoing",
    outcomeMetric: "10+ Brands Audited",
    cover: placeholder,
    hero: placeholder,
    problem:
      "No one could say who owned what across a 10+ brand engineering group. Outdated or misaligned assets created compliance risk and missed commercial opportunities.",
    process:
      "Initiated and delivered a comprehensive audit of internal and external brand touchpoints across a multi-brand engineering group. Designed an ownership framework assigning accountability to specific roles with defined update cadence.",
    outcome:
      "Full portfolio coverage across 10+ brands. Evolved into a cross-sell enabler by improving visibility of capabilities across brands, making it easier for clients to see the full breadth of the firm's offer.",
    honest:
      "Naming an owner is easy. Getting them to accept accountability for it — and maintain it — is the actual project.",
    quotes: [],
    order: 4,
    label: "2023 · Systems",
    tagline:
      "A governance framework that turned a scattered asset library into a cross-sell engine — built for consistency, compliance, and commercial positioning across 10+ brands.",
    client: "Global Engineering Firm",
    overview:
      "Initiated and delivered a comprehensive audit of internal and external brand touchpoints across a multi-brand engineering group. The problem wasn't just visual inconsistency — outdated or misaligned assets created compliance risk and missed commercial opportunities. Designed an ownership framework assigning accountability to specific roles with defined update cadence. Evolved into a cross-sell enabler by improving visibility of capabilities across brands, making it easier for clients to see the full breadth of the firm's offer.",
    stats: [
      { value: "10+", label: "Brands Audited" },
      { value: "Full", label: "Portfolio Coverage" },
      { value: "Cross-sell", label: "Enabled" },
    ],
    tags: ["Systems Design", "Brand Governance", "Asset Management", "Stakeholder Mapping"],
    bgClass: "bg-1",
    mockType: "dark",
    heroBackground:
      "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #2B5BFF 100%)",
  },
  {
    slug: "wollip-signatures",
    title: "Wollip Signatures",
    role: "Co-founder · Designer · Product",
    timeline: "Ongoing",
    outcomeMetric: "100% On-brand Rollout",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Managing email signature consistency across 10+ brands manually wasn't scalable — and no SaaS solved it without enterprise pricing or an IT project.",
    process:
      "Started as a service offering, productised into a self-serve platform. Animated HTML signatures with GIF fallbacks, brand-controlled rollout, click tracking. Built on Lovable + Supabase with a Puppeteer render worker for GIF generation.",
    outcome:
      "100% on-brand rollout with a single source of truth. ~80 emails per day per user running through a controlled brand channel. Wollip is the productised answer to a problem found in the field.",
    honest:
      "The origin was a client need. The hardest part was productising something that had always been a bespoke service — and resisting the urge to over-engineer it.",
    quotes: [],
    order: 5,
    label: "2024 · Brand + Product",
    tagline:
      "A SaaS platform that turns the most-seen brand surface in B2B — the email signature — into a controlled marketing channel.",
    client: "Wollip",
    overview:
      "Started as a service offering, productised into a self-serve platform. Animated HTML signatures with GIF fallbacks, brand-controlled rollout, click tracking. Built on Lovable + Supabase with a Puppeteer render worker for GIF generation. The origin was a client need — managing signature consistency across 10+ brands manually wasn't scalable. Wollip is the productised answer.",
    stats: [
      { value: "100%", label: "On-brand Rollout" },
      { value: "~80", label: "Emails/Day Per User" },
      { value: "1", label: "Source of Truth" },
    ],
    tags: ["Lovable", "Supabase", "Product Design", "Brand Systems"],
    bgClass: "bg-2",
    mockType: "light",
    heroBackground:
      "linear-gradient(135deg, #FAFAF9 0%, rgba(43,91,255,0.08) 100%)",
  },
  {
    slug: "analogue-to-algorithm",
    title: "Analogue to Algorithm",
    role: "Designer · Systems Thinker · Author",
    timeline: "6 Months",
    outcomeMetric: "100 Photographs · 1 Data Pipeline",
    cover: placeholder,
    hero: placeholder,
    problem:
      "The project started as a question: what happens when you remove human intuition from layout decisions and replace it with structured data extracted from the work itself?",
    process:
      "Built a pipeline that extracted brightness values from 100 film photographs and used that structured data to determine layout, spacing, and sequencing across a printed book and digital experience.",
    outcome:
      "A printed book and digital experience where every layout decision is driven by data — not intuition. The same algorithmic logic that underpins workflow design and AI implementation work.",
    honest:
      "The most surprising outcome was how much the process revealed about the photographs themselves. Data as a lens changes what you see.",
    quotes: [],
    order: 6,
    label: "2023 · Systems + Editorial",
    tagline:
      "A system that processes 100 film photographs through a brightness data pipeline and uses the output to drive every layout decision in a printed book.",
    client: "University",
    overview:
      "Built a pipeline that extracted brightness values from 100 film photographs and used that structured data to determine layout, spacing, and sequencing across a printed book and digital experience. The project is less about photography and more about what happens when you apply algorithmic logic to analogue material — the same thinking that underpins workflow design and AI implementation work.",
    stats: [
      { value: "100", label: "Photographs" },
      { value: "1", label: "Data Pipeline" },
      { value: "Book + Digital", label: "Experience" },
    ],
    tags: ["Systems Design", "Editorial", "Data-driven Design", "Photography"],
    bgClass: "bg-4",
    mockType: "dark",
    heroBackground:
      "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 60%, rgba(123,91,255,0.4) 100%)",
  },
];