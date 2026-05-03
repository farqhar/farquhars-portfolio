import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { Project, ProjectFile, ProjectStat, GalleryImage } from "@/data/projectsSeed";
import MediaField from "@/components/admin/fields/MediaField";
import SubProjectsField from "@/components/admin/fields/SubProjectsField";
import { uploadMedia } from "@/lib/cmsApi";

type Props = {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const labelCls = "block text-xs font-medium text-gray-700 mb-1";
const inputCls =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900";

const ProjectEditor = ({ project, onSave, onCancel, onDelete }: Props) => {
  const [draft, setDraft] = useState<Project>({
    ...project,
    files: project.files ?? [],
    stats: project.stats ?? [],
    tags: project.tags ?? [],
    gallery: project.gallery ?? [],
    heroFit: project.heroFit ?? "cover",
    galleryDefaultWidth:
      typeof project.galleryDefaultWidth === "number" ? project.galleryDefaultWidth : 100,
    heroAutoSize: project.heroAutoSize === true,
  });
  const [quotesText, setQuotesText] = useState(project.quotes.join("\n"));
  const [tagsText, setTagsText] = useState((project.tags ?? []).join(", "));
  const [statsText, setStatsText] = useState(
    (project.stats ?? []).map((s) => `${s.value} | ${s.label}`).join("\n"),
  );
  const [galleryUploading, setGalleryUploading] = useState(false);

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const gallery: GalleryImage[] = draft.gallery ?? [];

  const handleGalleryFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setGalleryUploading(true);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop() || "bin";
        const path = `projects/${draft.slug}/gallery/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const kind = file.type.startsWith("video/") ? "video" : "image";
        const url = await uploadMedia(file, path, kind);
        uploaded.push({ url, alt: "", type: kind });
      }
      set("gallery", [...gallery, ...uploaded]);
      toast.success(`Added ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`);
    } catch (ex) {
      toast.error("Upload failed", { description: (ex as Error).message });
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  };

  const updateGalleryAlt = (i: number, alt: string) => {
    const next = [...gallery];
    next[i] = { ...next[i], alt };
    set("gallery", next);
  };

  const updateGalleryWidth = (i: number, widthPct: number | undefined) => {
    const next = [...gallery];
    const item = { ...next[i] };
    if (widthPct === undefined) delete item.widthPct;
    else item.widthPct = Math.max(25, Math.min(100, Math.round(widthPct)));
    next[i] = item;
    set("gallery", next);
  };

  const removeGallery = (i: number) => {
    set("gallery", gallery.filter((_, idx) => idx !== i));
  };

  const moveGallery = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= gallery.length) return;
    const next = [...gallery];
    [next[i], next[j]] = [next[j], next[i]];
    set("gallery", next);
  };

  const handleSave = () => {
    const parsedStats: ProjectStat[] = statsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [value, ...rest] = line.split("|");
        return { value: (value || "").trim(), label: rest.join("|").trim() };
      })
      .filter((s) => s.value || s.label);

    const parsedTags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const cleaned: Project = {
      ...draft,
      quotes: quotesText.split("\n").map((q) => q.trim()).filter(Boolean),
      stats: parsedStats,
      tags: parsedTags,
    };
    onSave(cleaned);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onCancel} className="text-sm text-gray-600 hover:text-gray-900">
          ← Back
        </button>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit project</h1>

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Slug</label>
          <input className={inputCls} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Role descriptor</label>
          <input className={inputCls} value={draft.role} onChange={(e) => set("role", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Client</label>
          <input className={inputCls} value={draft.client ?? ""} onChange={(e) => set("client", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Card label (e.g. "2025 · Strategy")</label>
          <input className={inputCls} value={draft.label ?? ""} onChange={(e) => set("label", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Timeline</label>
            <input className={inputCls} value={draft.timeline} onChange={(e) => set("timeline", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Outcome metric</label>
            <input
              className={inputCls}
              value={draft.outcomeMetric}
              onChange={(e) => set("outcomeMetric", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MediaField
            label="Cover image / video"
            folder={`projects/${draft.slug}/cover`}
            kind="any"
            currentUrl={draft.cover}
            onSaved={(url) => set("cover", url)}
          />
          <MediaField
            label="Hero image / video"
            folder={`projects/${draft.slug}/hero`}
            kind="any"
            currentUrl={draft.hero}
            onSaved={(url) => set("hero", url)}
          />
        </div>

        <div>
          <label className={labelCls}>Hero display</label>
          <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => set("heroFit", "cover")}
              className={`text-xs px-3 py-1.5 ${
                (draft.heroFit ?? "cover") === "cover"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Fill (crop)
            </button>
            <button
              type="button"
              onClick={() => set("heroFit", "contain")}
              className={`text-xs px-3 py-1.5 border-l border-gray-300 ${
                draft.heroFit === "contain"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Fit (whole image)
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            <strong>Fill</strong> crops to fill the box (best for portrait).{" "}
            <strong>Fit</strong> shows the whole image with soft letterboxing (best for landscape/square).
          </p>
        </div>

        <div>
          <label className={labelCls}>Hero frame</label>
          <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => set("heroAutoSize", false)}
              className={`text-xs px-3 py-1.5 ${
                !draft.heroAutoSize
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Fixed frame
            </button>
            <button
              type="button"
              onClick={() => set("heroAutoSize", true)}
              className={`text-xs px-3 py-1.5 border-l border-gray-300 ${
                draft.heroAutoSize
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Auto-size to image
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            <strong>Auto-size</strong> removes the coloured bars by shaping the frame to the image's natural aspect ratio. Layout shifts between projects.
          </p>
        </div>

        <div>
          <label className={labelCls}>Tagline (folder card subhead)</label>
          <textarea
            className={inputCls}
            rows={2}
            value={draft.tagline ?? ""}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Overview (folder detail intro)</label>
          <textarea
            className={inputCls}
            rows={3}
            value={draft.overview ?? ""}
            onChange={(e) => set("overview", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Stats (one per line: value | label)</label>
          <textarea
            className={inputCls}
            rows={4}
            placeholder={"40+ | Staff interviewed\n124 | Pain points mapped"}
            value={statsText}
            onChange={(e) => setStatsText(e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input
            className={inputCls}
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls + " mb-0"}>Gallery images (auto-scroll on the project page)</label>
            <label className="inline-block bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer">
              {galleryUploading ? "Uploading…" : "Add images"}
              <input
                type="file"
                accept="image/*,video/*,application/pdf,.pdf"
                multiple
                className="hidden"
                onChange={handleGalleryFiles}
                disabled={galleryUploading}
              />
            </label>
          </div>
          <div className="mb-3 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-2">
            <label className="text-[11px] text-gray-700 shrink-0">Default size</label>
            <input
              type="range"
              min={25}
              max={100}
              step={5}
              value={draft.galleryDefaultWidth ?? 100}
              onChange={(e) => set("galleryDefaultWidth", parseInt(e.target.value, 10))}
              className="flex-1 accent-gray-900"
            />
            <span className="text-[11px] text-gray-600 w-10 text-right">{draft.galleryDefaultWidth ?? 100}%</span>
          </div>
          <p className="text-[11px] text-gray-500 italic mb-2">
            Lower % = smaller display in the carousel. Useful for tall/skinny images like email signatures. Each image can override below.
          </p>
          {gallery.length === 0 ? (
            <p className="text-[11px] text-gray-500 italic">
              No images yet. The right column will fall back to the hero gradient.
            </p>
          ) : (
            <ul className="space-y-2">
              {gallery.map((g, i) => (
                <li
                  key={`${g.url}-${i}`}
                  className="border border-gray-200 rounded-md p-2 bg-white"
                >
                 <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 shrink-0">
                    {g.type === "video" || /\.(mp4|webm|mov)(\?|$)/i.test(g.url) ? (
                      <video src={g.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={g.url} alt={g.alt || ""} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <input
                    className={inputCls + " flex-1"}
                    placeholder="Alt text (optional)"
                    value={g.alt ?? ""}
                    onChange={(e) => updateGalleryAlt(i, e.target.value)}
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveGallery(i, -1)}
                      disabled={i === 0}
                      className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGallery(i, 1)}
                      disabled={i === gallery.length - 1}
                      className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGallery(i)}
                      className="text-xs px-2 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                 </div>
                 <div className="mt-2 flex items-center gap-3 pl-[68px]">
                   <label className="text-[11px] text-gray-600 shrink-0">Size</label>
                   <input
                     type="range"
                     min={25}
                     max={100}
                     step={5}
                     value={g.widthPct ?? draft.galleryDefaultWidth ?? 100}
                     onChange={(e) => updateGalleryWidth(i, parseInt(e.target.value, 10))}
                     className="flex-1 accent-gray-900"
                   />
                   <span className="text-[11px] text-gray-600 w-10 text-right">
                     {g.widthPct ?? draft.galleryDefaultWidth ?? 100}%
                   </span>
                   {typeof g.widthPct === "number" && (
                     <button
                       type="button"
                       onClick={() => updateGalleryWidth(i, undefined)}
                       className="text-[10px] px-1.5 py-0.5 text-gray-600 border border-gray-200 rounded hover:bg-gray-50 shrink-0"
                     >
                       Use default
                     </button>
                   )}
                 </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className={labelCls}>Problem</label>
          <textarea
            className={inputCls}
            rows={3}
            value={draft.problem}
            onChange={(e) => set("problem", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Process</label>
          <textarea
            className={inputCls}
            rows={4}
            value={draft.process}
            onChange={(e) => set("process", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Honest moment</label>
          <textarea
            className={inputCls}
            rows={2}
            value={draft.honest}
            onChange={(e) => set("honest", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Outcome (narrative)</label>
          <textarea
            className={inputCls}
            rows={3}
            value={draft.outcome}
            onChange={(e) => set("outcome", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Quotes (one per line)</label>
          <textarea
            className={inputCls}
            rows={4}
            value={quotesText}
            onChange={(e) => setQuotesText(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <SubProjectsField
            slug={draft.slug}
            value={draft.files ?? []}
            onChange={(files: ProjectFile[]) => set("files", files)}
          />
        </div>

        <p className="text-[11px] text-gray-500 italic pt-2">
          Click <strong>Save</strong> at the top to persist your changes.
        </p>
      </div>
    </div>
  );
};

export default ProjectEditor;
