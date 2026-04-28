import { useState } from "react";
import { Project, ProjectFile } from "@/data/projectsSeed";
import MediaField from "@/components/admin/fields/MediaField";
import SubProjectsField from "@/components/admin/fields/SubProjectsField";

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
  });
  const [quotesText, setQuotesText] = useState(project.quotes.join("\n"));

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = () => {
    const cleaned: Project = {
      ...draft,
      quotes: quotesText.split("\n").map((q) => q.trim()).filter(Boolean),
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
            label="Cover image"
            folder={`projects/${draft.slug}/cover`}
            currentUrl={draft.cover}
            onSaved={(url) => set("cover", url)}
          />
          <MediaField
            label="Hero image"
            folder={`projects/${draft.slug}/hero`}
            currentUrl={draft.hero}
            onSaved={(url) => set("hero", url)}
          />
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
