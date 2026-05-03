import React, { useEffect, useMemo, useRef, useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import type { Project as DbProject, GalleryImage } from "@/data/projectsSeed";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Configure pdf.js worker (Vite-friendly URL import).
(pdfjsLib as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = pdfWorker;

/** Render the first page of a PDF onto a canvas as a thumbnail. */
function PdfThumb({ url }: { url: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);
        const base = page.getViewport({ scale: 1 });
        const targetW = 480;
        const scale = targetW / base.width;
        const v = page.getViewport({ scale });
        const canvas = ref.current;
        if (!canvas || cancelled) return;
        canvas.width = v.width;
        canvas.height = v.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport: v, canvas }).promise;
      } catch {
        /* swallow — thumbnail is best-effort */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);
  return (
    <canvas
      ref={ref}
      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff", display: "block" }}
    />
  );
}

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
  cover: string;
  hero: string;
  problem: string;
  process: string;
  overview: string;
  stats: { value: string; label: string }[];
  tags: string[];
  bgClass: string;
  mockType: "dark" | "light";
  heroBackground: string;
  gallery: GalleryImage[];
  heroFit: "cover" | "contain";
  galleryDefaultWidth: number;
  heroAutoSize: boolean;
};

const PLACEHOLDER = "/placeholder.svg";
const hasImage = (url: string) => !!url && url !== PLACEHOLDER;

const dbToCard = (p: DbProject): Project => ({
  key: p.slug,
  label: p.label || "",
  title: p.title,
  tagline: p.tagline || "",
  role: p.role,
  timeline: p.timeline,
  client: p.client || "",
  cover: p.cover || "",
  hero: p.hero || "",
  problem: p.problem || "",
  process: p.process || "",
  overview: p.overview || "",
  stats: Array.isArray(p.stats) ? p.stats : [],
  tags: Array.isArray(p.tags) ? p.tags : [],
  bgClass: p.bgClass || "bg-1",
  mockType: p.mockType === "dark" ? "dark" : "light",
  heroBackground: p.heroBackground || "linear-gradient(135deg, #FAFAF9 0%, #F0EDE8 100%)",
  gallery: Array.isArray(p.gallery) ? p.gallery : [],
  heroFit: p.heroFit === "contain" ? "contain" : "cover",
  galleryDefaultWidth:
    typeof p.galleryDefaultWidth === "number" ? p.galleryDefaultWidth : 100,
  heroAutoSize: p.heroAutoSize === true,
});

const VISIBLE_BEHIND = 3;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const isVideoUrl = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);
const isPdfUrl = (url: string) => /\.pdf(\?|$)/i.test(url);

export default function ProjectDeck() {
  const { projects } = useProjects();
  const PROJECTS: Project[] = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order).map(dbToCard),
    [projects],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const tickingRef = useRef(false);

  // Compute scroll progress and apply transforms
  useEffect(() => {
    if (PROJECTS.length === 0) return;
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
      return totalSteps > 0
        ? (scrolledIntoDeck / scrollableDistance) * totalSteps
        : 0;
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
  }, [hasInteracted, PROJECTS.length]);

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
      if (e.key === "Escape") {
        if (lightboxIdx !== null) setLightboxIdx(null);
        else if (openProject) setOpenProject(null);
      }
      if (lightboxIdx !== null && openProject) {
        const len = openProject.gallery.length;
        if (len > 0) {
          if (e.key === "ArrowRight") setLightboxIdx((i) => ((i ?? 0) + 1) % len);
          if (e.key === "ArrowLeft") setLightboxIdx((i) => ((i ?? 0) - 1 + len) % len);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openProject, lightboxIdx]);

  const handleCardClick = (project: Project, i: number) => {
    if (i !== activeIdx) return;
    setOpenProject(project);
    setLightboxIdx(null);
  };

  return (
    <>
      {/* Scoped styles for the deck. These mirror the standalone HTML.
          If your portfolio already defines fonts/colours globally, you can
          remove the :root vars here and rely on globals. */}
      <style>{`
        .pd-root { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; user-select: none; -webkit-user-select: none; color: #0A0A0A; }
        .pd-root * { box-sizing: border-box; }

        .pd-scroll { position: relative; width: 100%; height: 700vh; background: #FAFAF9; }
        .pd-pin { position: sticky; top: 0; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }

        .pd-glow { position: absolute; top: 50%; left: 50%; width: 800px; height: 800px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(43,91,255,0.04) 0%, rgba(123,91,255,0.02) 40%, transparent 70%); pointer-events: none; z-index: 0; }

        .pd-header { position: absolute; top: 40px; left: 48px; right: 48px; display: flex; justify-content: space-between; align-items: center; z-index: 2; }
        .pd-folder-name { font-family: 'SF Mono', ui-monospace, 'Menlo', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #86868B; font-weight: 500; display: flex; align-items: center; gap: 10px; }
        .pd-folder-name::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #2B5BFF 0%, #7B5BFF 50%, #B85BFF 100%); box-shadow: 0 0 0 3px rgba(43,91,255,0.1); }
        .pd-item-count { font-family: 'SF Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.1em; color: #B8B8BD; font-weight: 500; }

        .pd-stack { position: relative; width: min(560px, 92vw); height: min(720px, 78vh); display: flex; align-items: center; justify-content: center; z-index: 1; }
        .pd-card { position: absolute; width: min(460px, 84vw); height: min(620px, 72vh); border-radius: 24px; overflow: hidden; background: white; will-change: transform, opacity; cursor: pointer; transform-origin: center center; }
        .pd-card .pd-card-bg { width: 100%; height: 70%; position: relative; overflow: hidden; }
        .pd-card .pd-card-info { background: white; padding: 28px 30px; height: 30%; display: flex; flex-direction: column; justify-content: center; border-top: 0.5px solid rgba(0,0,0,0.06); position: relative; }
        .pd-card-label { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #86868B; font-weight: 600; margin-bottom: 10px; font-family: 'SF Mono', ui-monospace, monospace; display: flex; align-items: center; gap: 10px; }
        .pd-card-label-dot { width: 5px; height: 5px; border-radius: 50%; background: #0A0A0A; opacity: 0.4; }
        .pd-card-title { font-size: 24px; font-weight: 600; color: #0A0A0A; letter-spacing: -0.022em; line-height: 1.2; }
        .pd-card-sub { font-size: 15px; color: #86868B; margin-top: 6px; letter-spacing: -0.01em; }

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

        .pd-mock { position: absolute; inset: 32px; border-radius: 14px; display: flex; flex-direction: column; gap: 14px; padding: 26px; }
        .pd-mock-dark { background: rgba(255,255,255,0.06); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 0.5px solid rgba(255,255,255,0.1); }
        .pd-mock-light { background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 0.5px solid rgba(0,0,0,0.04); box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .pd-bar { height: 9px; border-radius: 4px; }
        .pd-mock-dark .pd-bar { background: rgba(255,255,255,0.2); }
        .pd-mock-light .pd-bar { background: rgba(0,0,0,0.1); }
        .pd-bar-short { width: 35%; } .pd-bar-med { width: 60%; } .pd-bar-full { width: 88%; }
        .pd-block { flex: 1; border-radius: 10px; margin-top: 8px; position: relative; overflow: hidden; }
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
        .pd-stat-value { font-size: clamp(28px, 3.6vw, 44px); font-weight: 600; letter-spacing: -0.03em; background: linear-gradient(135deg, #2B5BFF 0%, #7B5BFF 50%, #B85BFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; line-height: 1.05; margin-bottom: 8px; overflow-wrap: anywhere; word-break: break-word; hyphens: auto; }
        .pd-stat-label { font-family: 'SF Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #86868B; font-weight: 500; }

        .pd-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 48px; }
        .pd-tag { padding: 8px 14px; border-radius: 999px; border: 0.5px solid rgba(0,0,0,0.12); font-family: 'SF Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #1A1A1A; background: white; }

        /* Two-column detail layout */
        .pd-detail-wrap { max-width: 1320px; margin: 0 auto; padding: 80px 32px 120px; transform: translateY(20px); opacity: 0; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s; display: flex; flex-direction: column; gap: 56px; }
        .pd-overlay.open .pd-detail-wrap { transform: translateY(0); opacity: 1; }
        .pd-detail-grid { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); gap: 56px; align-items: start; }
        .pd-detail-left { min-width: 0; }
        .pd-detail-right { min-width: 0; }
        .pd-detail-left .pd-title { font-size: clamp(36px, 4.6vw, 60px); margin-bottom: 20px; }
        .pd-detail-left .pd-tagline { margin-bottom: 40px; }
        .pd-detail-left .pd-section { margin-bottom: 40px; }
        .pd-detail-left .pd-stats { margin: 40px 0; padding: 28px 0; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
        .pd-detail-left .pd-stat-value { font-size: clamp(22px, 2.6vw, 32px); }
        .pd-detail-left .pd-tags { margin-top: 28px; }

        /* Auto-scroll marquee */
        .pd-marquee { position: relative; width: 100%; overflow: hidden; mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%); -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%); }
        .pd-marquee:hover .pd-marquee-track { animation-play-state: paused; }
        .pd-marquee-track { display: flex; gap: 20px; width: max-content; animation: pd-marquee 50s linear infinite; will-change: transform; }
        @keyframes pd-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .pd-marquee-item { flex: 0 0 auto; height: var(--item-h, 320px); border-radius: 16px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08); background: #F0EDE8; cursor: zoom-in; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); align-self: center; }
        .pd-marquee-item:hover { transform: translateY(-4px); }
        .pd-marquee-item img,
        .pd-marquee-item video { display: block; height: 100%; width: auto; object-fit: cover; }
        .pd-marquee-empty { width: 100%; aspect-ratio: 4/5; border-radius: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08); }
        .pd-marquee-fullwidth { width: 100%; }

        /* Lightbox */
        .pd-lightbox { position: fixed; inset: 0; background: rgba(10,10,10,0.92); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 32px; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
        .pd-lightbox.open { opacity: 1; pointer-events: all; }
        .pd-lightbox img { max-width: 92vw; max-height: 88vh; border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,0.5); }
        .pd-lightbox video { max-width: 92vw; max-height: 88vh; border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,0.5); background: #000; }
        .pd-lb-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.12); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); transition: background 0.2s; }
        .pd-lb-btn:hover { background: rgba(255,255,255,0.22); }
        .pd-lb-prev { left: 24px; } .pd-lb-next { right: 24px; }
        .pd-lb-close { position: absolute; top: 24px; right: 24px; }

        @media (max-width: 768px) {
          .pd-stack { width: 92vw; height: 70vh; }
          .pd-card { width: 84vw; height: 64vh; border-radius: 20px; }
          .pd-card .pd-card-info { padding: 20px 22px; }
          .pd-card-title { font-size: 20px; }
          .pd-card-sub { font-size: 13px; }
          .pd-mock { inset: 20px; padding: 18px; gap: 10px; }
          .pd-bar { height: 7px; }
          .pd-header { left: 24px; right: 24px; top: 24px; }
          .pd-detail-content { padding: 64px 24px 80px; }
        }

        @media (max-width: 900px) {
          .pd-detail-grid { grid-template-columns: 1fr; gap: 40px; }
          .pd-detail-left { position: static; }
          .pd-detail-wrap { padding: 64px 20px 80px; }
          .pd-marquee-item { height: var(--item-h-mobile, 200px); }
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
                    {hasImage(project.cover) ? (
                      isVideoUrl(project.cover) ? (
                        <video
                          src={project.cover}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          autoPlay muted loop playsInline
                        />
                      ) : (
                        <img
                          src={project.cover}
                          alt={project.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          draggable={false}
                        />
                      )
                    ) : (
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
                    )}
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
            <div className="pd-detail-wrap">
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

              <div className="pd-detail-grid">
                {/* LEFT: project info */}
                <div className="pd-detail-left">
                  <div className="pd-meta">
                    <span>{openProject.label}</span>
                    <span>{openProject.client}</span>
                    <span>{openProject.timeline}</span>
                  </div>

                  <h1 className="pd-title">{openProject.title}</h1>
                  <p className="pd-tagline">{openProject.tagline}</p>

                  {openProject.problem && (
                    <div className="pd-section">
                      <div className="pd-section-label">The Problem</div>
                      <p>{openProject.problem}</p>
                    </div>
                  )}

                  {openProject.process && (
                    <div className="pd-section">
                      <div className="pd-section-label">The Solution</div>
                      <p>{openProject.process}</p>
                    </div>
                  )}

                  <div className="pd-section">
                    <div className="pd-section-label">Role</div>
                    <h2>{openProject.role}</h2>
                    <p>{openProject.overview}</p>
                  </div>

                  {openProject.stats.length > 0 && (
                    <div className="pd-stats">
                      {openProject.stats.map((s, i) => (
                        <div key={i}>
                          <div className="pd-stat-value">{s.value}</div>
                          <div className="pd-stat-label">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {openProject.tags.length > 0 && (
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
                  )}
                </div>

                <div className="pd-detail-right">
                  {(() => {
                    const fit = openProject.heroFit === "contain" ? "contain" : "cover";
                    const auto = openProject.heroAutoSize === true;
                    const heroSrc = hasImage(openProject.hero)
                      ? openProject.hero
                      : hasImage(openProject.cover)
                        ? openProject.cover
                        : "";
                    if (!heroSrc) {
                      return (
                        <div
                          className="pd-marquee-empty"
                          style={{ background: openProject.heroBackground }}
                        />
                      );
                    }
                    if (auto) {
                      // Auto-size: frame conforms to image's natural aspect ratio.
                      if (isVideoUrl(heroSrc)) {
                        return (
                          <video
                            src={heroSrc}
                            style={{ width: "100%", height: "auto", display: "block", borderRadius: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08)" }}
                            autoPlay muted loop playsInline
                          />
                        );
                      }
                      return (
                        <img
                          src={heroSrc}
                          alt={openProject.title}
                          style={{ width: "100%", height: "auto", display: "block", borderRadius: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08)" }}
                        />
                      );
                    }
                    const containerBg =
                      fit === "contain"
                        ? "linear-gradient(135deg, #F5F2ED 0%, #ECE7DF 100%)"
                        : "transparent";
                    if (isVideoUrl(heroSrc)) {
                      return (
                        <div className="pd-marquee-empty" style={{ background: containerBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <video
                            src={heroSrc}
                            style={{ objectFit: fit, width: "100%", height: "100%" }}
                            autoPlay muted loop playsInline
                          />
                        </div>
                      );
                    }
                    return (
                      <div
                        className="pd-marquee-empty"
                        style={{
                          backgroundColor: fit === "contain" ? "#F5F2ED" : undefined,
                          backgroundImage: `url(${heroSrc})`,
                          backgroundSize: fit,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Full-width auto-scrolling supporting gallery */}
              {openProject.gallery.length > 0 && (
                <div className="pd-marquee-fullwidth">
                  <div className="pd-marquee">
                    <div className="pd-marquee-track">
                      {[...openProject.gallery, ...openProject.gallery].map((img, i) => {
                        const projDefault = openProject.galleryDefaultWidth ?? 100;
                        const pctRaw = typeof img.widthPct === "number" ? img.widthPct : projDefault;
                        const pct = Math.max(25, Math.min(100, pctRaw));
                        const itemStyle: Record<string, string> = {
                          "--item-h": `${Math.round(320 * (pct / 100))}px`,
                          "--item-h-mobile": `${Math.round(200 * (pct / 100))}px`,
                        };
                        return (
                        <button
                          key={i}
                          type="button"
                          className="pd-marquee-item"
                          style={itemStyle as React.CSSProperties}
                          onClick={() =>
                            setLightboxIdx(i % openProject.gallery.length)
                          }
                          aria-label={img.alt || `Item ${(i % openProject.gallery.length) + 1}`}
                        >
                          {img.type === "video" || isVideoUrl(img.url) ? (
                            <video
                              src={img.url}
                              autoPlay muted loop playsInline
                              draggable={false}
                            />
                          ) : isPdfUrl(img.url) ? (
                            <div className="pd-pdf-thumb" style={{ height: "100%", width: "100%", aspectRatio: "1 / 1.414", background: "#fff", overflow: "hidden" }}>
                              <PdfThumb url={img.url} />
                            </div>
                          ) : (
                            <img
                              src={img.url}
                              alt={img.alt || ""}
                              loading="lazy"
                              draggable={false}
                            />
                          )}
                        </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {openProject && openProject.gallery.length > 0 && (
          <div
            className={`pd-lightbox ${lightboxIdx !== null ? "open" : ""}`}
            onClick={() => setLightboxIdx(null)}
          >
            {lightboxIdx !== null && (
              <>
                {openProject.gallery[lightboxIdx].type === "video" || isVideoUrl(openProject.gallery[lightboxIdx].url) ? (
                  <video
                    src={openProject.gallery[lightboxIdx].url}
                    controls
                    autoPlay
                    playsInline
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : isPdfUrl(openProject.gallery[lightboxIdx].url) ? (
                  <iframe
                    src={openProject.gallery[lightboxIdx].url}
                    title="PDF preview"
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: "92vw", height: "92vh", border: "none", borderRadius: 12, background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
                  />
                ) : (
                  <img
                    src={openProject.gallery[lightboxIdx].url}
                    alt={openProject.gallery[lightboxIdx].alt || ""}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {openProject.gallery.length > 1 && (
                  <>
                    <button
                      className="pd-lb-btn pd-lb-prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        const len = openProject.gallery.length;
                        setLightboxIdx((i) => ((i ?? 0) - 1 + len) % len);
                      }}
                      aria-label="Previous image"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3 L5 8 L10 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button
                      className="pd-lb-btn pd-lb-next"
                      onClick={(e) => {
                        e.stopPropagation();
                        const len = openProject.gallery.length;
                        setLightboxIdx((i) => ((i ?? 0) + 1) % len);
                      }}
                      aria-label="Next image"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3 L11 8 L6 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </>
                )}
                <button
                  className="pd-lb-btn pd-lb-close"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
                  aria-label="Close"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M3 3 L13 13 M13 3 L3 13" strokeLinecap="round" /></svg>
                </button>
              </>
            )}
          </div>
        )}

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
