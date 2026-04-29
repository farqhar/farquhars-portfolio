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
};

const placeholder = "/placeholder.svg";

export const projectsSeed: Project[] = [
  {
    slug: "caber-aiq-programme",
    title: "CABER AIQ Programme",
    role: "AI Programme Manager",
    timeline: "12 months · ongoing",
    outcomeMetric: "$12.7M inefficiency identified",
    cover: placeholder,
    hero: placeholder,
    problem:
      "A 200-person engineering and design firm wanted AI capability but had no operating model, no pipeline, and no shared evidence of where AI would actually pay off.",
    process:
      "Stood up the programme from a single discovery sprint: ran 40+ stakeholder interviews, built the request pipeline, designed the sprint cadence, and put a stakeholder communications layer around it.",
    outcome:
      "AIQ now runs on a structured operating model with 124 documented pain points and a board-credible inefficiency number to prioritise against.",
    honest:
      "The programme design mattered more than any single tool. People needed a way to ask, not another dashboard to check.",
    quotes: [],
    order: 0,
    tagline:
      "Standing up an AI transformation programme inside a 200-person engineering and design firm — from discovery to delivery.",
    client: "CABER Group",
    overview:
      "Built CABER's internal AI capability from a single discovery sprint into a structured operating model. Designed the request pipeline, sprint cadence, and stakeholder communications layer that AIQ runs on today.",
    stats: [
      { value: "40+", label: "Staff interviewed" },
      { value: "124", label: "Pain points mapped" },
      { value: "$12.7M", label: "Inefficiency identified" },
    ],
    tags: ["Programme Design", "Stakeholder Mgmt", "AI Strategy", "Operating Model"],
    bgClass: "bg-1",
    mockType: "dark",
    heroBackground:
      "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #2B5BFF 100%)",
    label: "2025 · Strategy",
  },
  {
    slug: "aiq-roi-platform",
    title: "AIQ ROI Platform",
    role: "Product Lead · Designer · Builder",
    timeline: "6 months · v1 shipped",
    outcomeMetric: "4 live modules",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Every AI programme dies on the same question — what's the actual ROI? Without a system to link pain points to deployed solutions to dollars, every pilot becomes a debate.",
    process:
      "Designed and built the platform end-to-end on Lovable + Supabase, with the Claude API powering the analysis layer. Four live modules covering intake, prioritisation, deployment, and ROI tracking.",
    outcome:
      "Live across the AIQ programme, tracking 12 deployed solutions. Phased commercialisation as v2.",
    honest:
      "It's tempting to over-build the dashboard. The hard part was getting the input data clean enough to mean anything.",
    quotes: [],
    order: 1,
    tagline:
      "A purpose-built intelligence dashboard linking identified pain points to deployed AI solutions and tracked financial return.",
    client: "CABER · Internal",
    overview:
      "Built in Lovable + Supabase with the Claude API powering the analysis layer. Solves the problem of every AI programme: proving the ROI is real, not theoretical.",
    stats: [
      { value: "4", label: "Live modules" },
      { value: "12", label: "Solutions tracked" },
      { value: "v2", label: "Phased commercialisation" },
    ],
    tags: ["Lovable", "Supabase", "Claude API", "Product Design"],
    bgClass: "bg-2",
    mockType: "light",
    heroBackground:
      "linear-gradient(135deg, #FAFAF9 0%, rgba(43,91,255,0.15) 50%, rgba(123,91,255,0.1) 100%)",
    label: "2025 · AI + Product",
  },
  {
    slug: "ascenda-health",
    title: "Ascenda Health",
    role: "Designer",
    timeline: "3 weeks",
    outcomeMetric: "24 slides delivered",
    cover: placeholder,
    hero: placeholder,
    problem:
      "A clinical digital-health product was raising seed capital and needed a deck investors could move on inside one read.",
    process:
      "Worked with the founding team to translate the clinical model into a narrative arc, then built a visual system designed to be reused across follow-up materials.",
    outcome:
      "Deck delivered in three weeks, with a system that survived into investor follow-ups and product collateral.",
    honest:
      "The trap on pitch decks is over-designing the slide and under-designing the story. I cut three slides on the last pass.",
    quotes: [],
    order: 2,
    tagline:
      "A 24-slide investor pitch deck for a digital health platform raising seed capital.",
    client: "Ascenda Health",
    overview:
      "Worked closely with the founding team to translate a complex clinical product into a narrative investors could move on. Visual system designed for repeated reuse across follow-up materials.",
    stats: [
      { value: "24", label: "Slides delivered" },
      { value: "1", label: "Visual system" },
      { value: "∞", label: "Reusable assets" },
    ],
    tags: ["Pitch Deck", "Brand System", "Investor Comms"],
    bgClass: "bg-3",
    mockType: "light",
    heroBackground: "linear-gradient(135deg, #FAFAF9 0%, #F0EDE8 100%)",
    label: "2024 · Design",
  },
  {
    slug: "pain-point-discovery",
    title: "Pain Point Discovery",
    role: "Programme Lead",
    timeline: "4 months",
    outcomeMetric: "$12.7M annualised cost",
    cover: placeholder,
    hero: placeholder,
    problem:
      "Leadership knew there was waste in the system but couldn't put a number on it. Without quantification, AI stayed a cost line, not a capital project.",
    process:
      "Designed the interview methodology, ran 40+ stakeholder sessions, extracted 124 unique pain points, and built the model that turned them into an annualised cost.",
    outcome:
      "A board presentation that reframed AI from cost line to capital project, with $12.7M of annualised inefficiency on the table.",
    honest:
      "Quantification is half methodology, half courage. People will give you the number — you have to be willing to write it down.",
    quotes: [],
    order: 3,
    tagline:
      "A board-ready audit quantifying $12.7M of annualised inefficiency across one engineering firm.",
    client: "CABER Group",
    overview:
      "Designed the interview methodology, ran 40+ stakeholder sessions, extracted 124 unique pain points, and quantified annualised cost. Output: a board presentation that reframed AI from cost line to capital project.",
    stats: [
      { value: "40+", label: "Interviews" },
      { value: "124", label: "Unique pain points" },
      { value: "$12.7M", label: "Annualised cost" },
    ],
    tags: ["Discovery", "Quantification", "Stakeholder Research", "Board Reporting"],
    bgClass: "bg-4",
    mockType: "dark",
    heroBackground:
      "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 60%, rgba(123,91,255,0.4) 100%)",
    label: "2024 · Data",
  },
  {
    slug: "wollip-signatures",
    title: "Wollip Signatures",
    role: "Co-founder · Designer · Product",
    timeline: "Ongoing",
    outcomeMetric: "1 source of truth",
    cover: placeholder,
    hero: placeholder,
    problem:
      "The most-seen brand surface in B2B is the email signature, and it's also the most ungoverned. Every company I worked with had the same drift problem.",
    process:
      "Productised the service into a self-serve platform: animated HTML signatures with GIF fallbacks, brand-controlled rollout, and click tracking. Built on Lovable + Supabase with a Puppeteer render worker for GIFs.",
    outcome:
      "Live with paying customers in private beta, with a central-deploy / local-edit model that holds across Outlook, Gmail, and Apple Mail.",
    honest:
      "I keep wanting to add features. The product gets better when I delete them.",
    quotes: [],
    order: 4,
    tagline:
      "A SaaS platform that turns the most-seen brand surface in B2B — the email signature — into a controlled marketing channel.",
    client: "Wollip Digital & Design",
    overview:
      "Started as a service offering, productised into a self-serve platform. Animated HTML signatures with GIF fallbacks, brand-controlled rollout, click tracking. Built on Lovable + Supabase with a Puppeteer render worker for GIF generation.",
    stats: [
      { value: "100%", label: "On-brand rollout" },
      { value: "~80", label: "Emails/day per user" },
      { value: "1", label: "Source of truth" },
    ],
    tags: ["SaaS", "B2B", "Brand Tooling", "Founder"],
    bgClass: "bg-5",
    mockType: "light",
    heroBackground:
      "linear-gradient(135deg, #FAFAF9 0%, rgba(43,91,255,0.08) 100%)",
    label: "2024 · Brand",
  },
];