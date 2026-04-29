import { useEffect, useRef, useState } from "react";

/**
 * ProjectDeck.tsx
 *
 * A scroll-driven card deck for the "Selected Work" portfolio section.
 *
 * How it works:
 *   - Outer container is 500vh tall (5 cards × viewport height).
 *   - Inner pinned element uses position: sticky to hold cards in view.
 *   - Scroll progress drives card transforms continuously (no animation timer).
 *   - Click on the front card opens a full-screen detail overlay.
 *
 * Tuning:
 *   - To make cards advance faster, reduce the 500vh height on .deck-scroll.
 *   - To change visible-behind cards, adjust VISIBLE_BEHIND.
 */

type Project = {
  key: string;
  label: string;
  title: string;
  tagline: string;
  role: string;
  timeline: string;
  client: string;
  overview: string;
  stats: { value: string; label: string }[];
  tags: string[];
  bgClass: string;
  mockType: "dark" | "light";
  heroBackground: string;
};

const PROJECTS: Project[] = [
  {
    key: "caber",
    label: "2025 · Strategy",
    title: "CABER AIQ Programme",
    tagline:
      "Standing up an AI transformation programme inside a 200-person engineering and design firm — from discovery to delivery.",
    role: "AI Programme Manager",
    timeline: "12 months · ongoing",
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
  },
  {
    key: "aiqroi",
    label: "2025 · AI + Product",
    title: "AIQ ROI Platform",
    tagline:
      "A purpose-built intelligence dashboard linking identified pain points to deployed AI solutions and tracked financial return.",
    role: "Product Lead · Designer · Builder",
    timeline: "6 months · v1 shipped",
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
  },
  {
    key: "ascenda",
    label: "2024 · Design",
    title: "Ascenda Health",
    tagline:
      "A 24-slide investor pitch deck for a digital health platform raising seed capital.",
    role: "Designer",
    timeline: "3 weeks",
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
  },
  {
    key: "painpoint",
    label: "2024 · Data",
    title: "Pain Point Discovery",
    tagline:
      "A board-ready audit quantifying $12.7M of annualised inefficiency across one engineering firm.",
    role: "Programme Lead",
    timeline: "4 months",
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
  },
  {
    key: "wollip",
    label: "2024 · Brand",
    title: "Wollip Signatures",
    tagline:
      "A SaaS platform that turns the most-seen brand surface in B2B — the email signature — into a controlled marketing channel.",
    role: "Co-founder · Designer · Product",
    timeline: "Ongoing",
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
  },
];

const VISIBLE_BEHIND = 3;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function ProjectDeck() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const tickingRef = useRef(false);

  // Compute scroll progress and apply transforms
  useEffect(() => {
    const computeProgress = () => {
      const el = scrollRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = el.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return 0;
      const scrolledIntoDeck = Math.max(
        0,
        Math.min(scrollableDistance, -rect.top)
      );
      const totalSteps = PROJECTS.length - 1;
      return (scrolledIntoDeck / scrollableDistance) * totalSteps;
    };

    const layoutDeck = (progress: number) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const rel = i - progress;

        let transform: string;
        let opacity: number;
        let zIndex: number;
        let shadow: string;
        let pointerEvents: string;

        if (rel <= -1) {
          transform = `translate(-700px, -40px) rotate(-18deg) scale(0.92)`;
          opacity = 0;
          zIndex = 0;
          shadow = "none";
          pointerEvents = "none";
        } else if (rel < 0) {
          const t = -rel;
          const eased = easeOut(t);
          transform = `translate(${-700 * eased}px, ${-40 * eased}px) rotate(${
            -18 * eased
          }deg) scale(${1 - 0.08 * eased})`;
          opacity = 1 - eased;
          zIndex = 100;
          shadow = `0 ${8 - 8 * eased}px ${24 - 24 * eased}px rgba(43,91,255,${
            0.1 - 0.1 * eased
          }), 0 ${32 - 32 * eased}px ${80 - 80 * eased}px rgba(0,0,0,${
            0.14 - 0.14 * eased
          })`;
          pointerEvents = "none";
        } else if (rel === 0) {
          transform = `translate(0px, 0px) rotate(0deg) scale(1)`;
          opacity = 1;
          zIndex = 100;
          shadow =
            "0 8px 24px rgba(43,91,255,0.10), 0 32px 80px rgba(0,0,0,0.14)";
          pointerEvents = "auto";
        } else if (rel <= VISIBLE_BEHIND) {
          const depth = rel;
          const scale = 1 - depth * 0.04;
          const yOffset = depth * 12;
          const xOffset = depth * 4;
          const rotate = depth * 0.5;
          transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotate}deg) scale(${scale})`;
          opacity = 1;
          zIndex = Math.round(100 - depth);
          shadow = `0 ${4 + depth * 4}px ${20 + depth * 10}px rgba(0,0,0,${
            0.06 + depth * 0.02
          })`;
          pointerEvents = depth < 0.5 ? "auto" : "none";
        } else {
          const depth = VISIBLE_BEHIND;
          const scale = 1 - depth * 0.04;
          const yOffset = depth * 12;
          const xOffset = depth * 4;
          const rotate = depth * 0.5;
          transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotate}deg) scale(${scale})`;
          const fadeT = Math.max(0, Math.min(1, 1 - (rel - VISIBLE_BEHIND)));
          opacity = fadeT;
          zIndex = Math.round(100 - depth - 1);
          shadow = "none";
          pointerEvents = "none";
        }

        card.style.transform = transform;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(zIndex);
        card.style.boxShadow = shadow;
        card.style.pointerEvents = pointerEvents;
      });

      const idx = Math.max(
        0,
        Math.min(PROJECTS.length - 1, Math.round(progress))
      );
      setActiveIdx(idx);

      if (!hasInteracted && progress > 0.05) setHasInteracted(true);
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          layoutDeck(computeProgress());
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    layoutDeck(computeProgress());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hasInteracted]);

  // Lock body scroll when detail open
  useEffect(() => {
    if (openProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openProject]);

  // Escape key closes detail
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openProject) setOpenProject(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openProject]);

  const handleCardClick = (project: Project, i: number) => {
    if (i !== activeIdx) return;
    setOpenProject(project);
  };

  return (
    <>
      {/* Scoped styles for the deck. These mirror the standalone HTML.
          If your portfolio already defines fonts/colours globally, you can
          remove the :root vars here and rely on globals. */}
      <style>{`
        .pd-root { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; user-select: none; -webkit-user-select: none; color: #0A0A0A; }
        .pd-root * { box-sizing: border-box; }

        .pd-scroll { position: relative; width: 100%; height: 500vh; background: #FAFAF9; }
        .pd-pin { position: sticky; top: 0; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }

        .pd-glow { position: absolute; top: 50%; left: 50%; width: 800px; height: 800px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(43,91,255,0.04) 0%, rgba(123,91,255,0.02) 40%, transparent 70%); pointer-events: none; z-index: 0; }

        .pd-header { position: absolute; top: 40px; left: 48px; right: 48px; display: flex; justify-content: space-between; align-items: center; z-index: 2; }
        .pd-folder-name { font-family: 'SF Mono', ui-monospace, 'Menlo', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #86868B; font-weight: 500; display: flex; align-items: center; gap: 10px; }
        .pd-folder-name::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #2B5BFF 0%, #7B5BFF 50%, #B85BFF 100%); box-shadow: 0 0 0 3px rgba(43,91,255,0.1); }
        .pd-item-count { font-family: 'SF Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.1em; color: #B8B8BD; font-weight: 500; }

        .pd-stack { position: relative; width: 380px; height: 480px; display: flex; align-items: center; justify-content: center; z-index: 1; }
        .pd-card { position: absolute; width: 300px; height: 400px; border-radius: 18px; overflow: hidden; background: white; will-change: transform, opacity; cursor: pointer; transform-origin: center center; }
        .pd-card .pd-card-bg { width: 100%; height: 70%; position: relative; overflow: hidden; }
        .pd-card .pd-card-info { background: white; padding: 20px 22px; height: 30%; display: flex; flex-direction: column; justify-content: center; border-top: 0.5px solid rgba(0,0,0,0.06); position: relative; }
        .pd-card-label { font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: #86868B; font-weight: 600; margin-bottom: 6px; font-family: 'SF Mono', ui-monospace, monospace; display: flex; align-items: center; gap: 8px; }
        .pd-card-label-dot { width: 4px; height: 4px; border-radius: 50%; background: #0A0A0A; opacity: 0.4; }
        .pd-card-title { font-size: 17px; font-weight: 600; color: #0A0A0A; letter-spacing: -0.022em; line-height: 1.2; }
        .pd-card-sub { font-size: 12px; color: #86868B; margin-top: 4px; letter-spacing: -0.01em; }

        .pd-bg-1 { background: #0A0A0A; position: relative; }
        .pd-bg-1::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 0%, rgba(43,91,255,0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(123,91,255,0.3) 0%, transparent 50%); opacity: 0.6; }
        .pd-bg-2 { background: #FAFAF9; position: relative; }
        .pd-bg-2::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(43,91,255,0.08) 0%, rgba(123,91,255,0.06) 50%, rgba(184,91,255,0.04) 100%); }
        .pd-bg-3 { background: white; position: relative; }
        .pd-bg-3::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.02) 50%), linear-gradient(0deg, transparent 50%, rgba(0,0,0,0.02) 50%); background-size: 24px 24px; }
        .pd-bg-4 { background: linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 100%); position: relative; }
        .pd-bg-4::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, rgba(123,91,255,0.25) 0%, transparent 60%); }
        .pd-bg-5 { background: white; position: relative; border: 0.5px solid rgba(0,0,0,0.06); }
        .pd-bg-5::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(43,91,255,0.04) 0%, transparent 100%); }

        .pd-mock { position: absolute; inset: 24px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; padding: 18px; }
        .pd-mock-dark { background: rgba(255,255,255,0.06); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 0.5px solid rgba(255,255,255,0.1); }
        .pd-mock-light { background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 0.5px solid rgba(0,0,0,0.04); box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .pd-bar { height: 6px; border-radius: 3px; }
        .pd-mock-dark .pd-bar { background: rgba(255,255,255,0.2); }
        .pd-mock-light .pd-bar { background: rgba(0,0,0,0.1); }
        .pd-bar-short { width: 35%; } .pd-bar-med { width: 60%; } .pd-bar-full { width: 88%; }
        .pd-block { flex: 1; border-radius: 6px; margin-top: 6px; position: relative; overflow: hidden; }
        .pd-mock-dark .pd-block { background: rgba(255,255,255,0.08); }
        .pd-mock-light .pd-block { background: rgba(0,0,0,0.04); }
        .pd-mock-dark .pd-block::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(43,91,255,0.3) 0%, transparent 60%); }
        .pd-mock-light .pd-block::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(43,91,255,0.06) 0%, transparent 60%); }

        .pd-tabs { position: absolute; bottom: 56px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; align-items: center; z-index: 2; }
        .pd-dot { width: 5px; height: 5px; border-radius: 50%; background: #B8B8BD; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .pd-dot.active { background: #0A0A0A; width: 20px; border-radius: 3px; }

        .pd-hint { position: absolute; bottom: 92px; left: 50%; transform: translateX(-50%); font-size: 11px; letter-spacing: 0.14em; color: #B8B8BD; text-transform: uppercase; font-family: 'SF Mono', ui-monospace, monospace; white-space: nowrap; opacity: 1; transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1); z-index: 2; display: flex; align-items: center; gap: 12px; }
        .pd-hint.hidden { opacity: 0; }
        .pd-bob { width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; animation: pd-bob 2s cubic-bezier(0.25,0.1,0.25,1) infinite; }
        @keyframes pd-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

        .pd-overlay { position: fixed; inset: 0; background: #FAFAF9; z-index: 100; opacity: 0; pointer-events: none; transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1); overflow-y: auto; }
        .pd-overlay.open { opacity: 1; pointer-events: all; }
        .pd-detail-content { max-width: 880px; margin: 0 auto; padding: 80px 32px 120px; transform: translateY(20px); opacity: 0; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s; }
        .pd-overlay.open .pd-detail-content { transform: translateY(0); opacity: 1; }

        .pd-close { position: fixed; top: 32px; right: 32px; width: 44px; height: 44px; border-radius: 50%; background: white; border: 0.5px solid rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 101; transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1); opacity: 0; pointer-events: none; box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06); }
        .pd-close.visible { opacity: 1; pointer-events: all; }
        .pd-close:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.12); }

        .pd-back { display: inline-flex; align-items: center; gap: 8px; font-family: 'SF Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #86868B; margin-bottom: 48px; cursor: pointer; transition: color 0.3s cubic-bezier(0.25,0.1,0.25,1); background: none; border: none; padding: 0; }
        .pd-back:hover { color: #0A0A0A; }

        .pd-meta { display: flex; gap: 24px; font-family: 'SF Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #86868B; margin-bottom: 24px; flex-wrap: wrap; }
        .pd-meta span { display: flex; align-items: center; gap: 8px; }
        .pd-meta span::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: #B8B8BD; }

        .pd-title { font-size: clamp(40px, 6vw, 72px); font-weight: 600; letter-spacing: -0.04em; line-height: 1.02; margin-bottom: 24px; background: linear-gradient(135deg, #2B5BFF 0%, #7B5BFF 50%, #B85BFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
        .pd-tagline { font-size: clamp(18px, 2.4vw, 24px); line-height: 1.45; letter-spacing: -0.015em; color: #1A1A1A; max-width: 640px; margin-bottom: 64px; font-weight: 400; }
        .pd-hero { width: 100%; aspect-ratio: 16/10; border-radius: 20px; margin-bottom: 80px; overflow: hidden; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.12); }

        .pd-section { margin-bottom: 64px; }
        .pd-section-label { font-family: 'SF Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #86868B; margin-bottom: 16px; font-weight: 600; }
        .pd-section h2 { font-size: clamp(24px, 3vw, 36px); font-weight: 600; letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 24px; color: #0A0A0A; }
        .pd-section p { font-size: 17px; line-height: 1.6; color: #1A1A1A; margin-bottom: 16px; max-width: 640px; letter-spacing: -0.01em; }

        .pd-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 32px; padding: 40px 0; border-top: 0.5px solid rgba(0,0,0,0.12); border-bottom: 0.5px solid rgba(0,0,0,0.12); margin: 64px 0; }
        .pd-stat-value { font-size: clamp(36px, 5vw, 56px); font-weight: 600; letter-spacing: -0.03em; background: linear-gradient(135deg, #2B5BFF 0%, #7B5BFF 50%, #B85BFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; line-height: 1; margin-bottom: 8px; }
        .pd-stat-label { font-family: 'SF Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #86868B; font-weight: 500; }

        .pd-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 48px; }
        .pd-tag { padding: 8px 14px; border-radius: 999px; border: 0.5px solid rgba(0,0,0,0.12); font-family: 'SF Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #1A1A1A; background: white; }

        @media (max-width: 768px) {
          .pd-stack { width: 320px; height: 420px; }
          .pd-card { width: 260px; height: 340px; }
          .pd-header { left: 24px; right: 24px; top: 24px; }
          .pd-detail-content { padding: 64px 24px 80px; }
        }
      `}</style>

      <div className="pd-root">
        <div className="pd-scroll" ref={scrollRef}>
          <div className="pd-pin">
            <div className="pd-glow" />

            <div className="pd-header">
              <span className="pd-folder-name">Projects · Selected Work</span>
              <span className="pd-item-count">{PROJECTS.length} items</span>
            </div>

            <div className="pd-stack">
              {PROJECTS.map((project, i) => (
                <div
                  key={project.key}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="pd-card"
                  onClick={() => handleCardClick(project, i)}
                >
                  <div className={`pd-card-bg pd-${project.bgClass}`}>
                    <div
                      className={`pd-mock ${
                        project.mockType === "dark"
                          ? "pd-mock-dark"
                          : "pd-mock-light"
                      }`}
                    >
                      <div className="pd-bar pd-bar-short" />
                      <div className="pd-bar pd-bar-med" />
                      <div className="pd-bar pd-bar-full" />
                      <div className="pd-block" />
                    </div>
                  </div>
                  <div className="pd-card-info">
                    <div className="pd-card-label">
                      <span className="pd-card-label-dot" />
                      {project.label}
                    </div>
                    <div className="pd-card-title">{project.title}</div>
                    <div className="pd-card-sub">{project.client}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`pd-hint ${hasInteracted ? "hidden" : ""}`}>
              <span>Scroll to browse · Click to open</span>
              <span className="pd-bob">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M7 2 L7 12 M3 8 L7 12 L11 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <div className="pd-tabs">
              {PROJECTS.map((_, i) => (
                <div
                  key={i}
                  className={`pd-dot ${i === activeIdx ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Detail overlay */}
        <div className={`pd-overlay ${openProject ? "open" : ""}`}>
          {openProject && (
            <div className="pd-detail-content">
              <button
                className="pd-back"
                onClick={() => setOpenProject(null)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M7.5 2.5 L3 6 L7.5 9.5" />
                </svg>
                Back to projects
              </button>

              <div className="pd-meta">
                <span>{openProject.label}</span>
                <span>{openProject.client}</span>
                <span>{openProject.timeline}</span>
              </div>

              <h1 className="pd-title">{openProject.title}</h1>
              <p className="pd-tagline">{openProject.tagline}</p>

              <div
                className="pd-hero"
                style={{ background: openProject.heroBackground }}
              />

              <div className="pd-section">
                <div className="pd-section-label">Role</div>
                <h2>{openProject.role}</h2>
                <p>{openProject.overview}</p>
              </div>

              <div className="pd-stats">
                {openProject.stats.map((s, i) => (
                  <div key={i}>
                    <div className="pd-stat-value">{s.value}</div>
                    <div className="pd-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="pd-section">
                <div className="pd-section-label">Capabilities</div>
                <div className="pd-tags">
                  {openProject.tags.map((t, i) => (
                    <span key={i} className="pd-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          className={`pd-close ${openProject ? "visible" : ""}`}
          aria-label="Close"
          onClick={() => setOpenProject(null)}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            width="16"
            height="16"
          >
            <path d="M3 3 L13 13 M13 3 L3 13" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  );
}
