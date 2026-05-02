import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/data/projectsSeed";
import ProjectEditor from "@/components/admin/ProjectEditor";

const blankProject = (order: number): Project => ({
  slug: `new-project-${Date.now()}`,
  title: "New project",
  role: "Role descriptor",
  timeline: "—",
  outcomeMetric: "—",
  cover: "/placeholder.svg",
  hero: "/placeholder.svg",
  problem: "",
  process: "",
  outcome: "",
  honest: "",
  quotes: [],
  order,
});

const ProjectsSection = () => {
  const { projects, save, add, remove, reorder, reset } = useProjects();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [reseeding, setReseeding] = useState(false);

  if (editingSlug) {
    const project = projects.find((p) => p.slug === editingSlug);
    if (!project) {
      setEditingSlug(null);
      return null;
    }
    return (
      <ProjectEditor
        project={project}
        onSave={(p) => {
          save(p);
          setEditingSlug(null);
        }}
        onCancel={() => setEditingSlug(null)}
        onDelete={() => {
          if (confirm(`Delete "${project.title}"?`)) {
            remove(project.slug);
            setEditingSlug(null);
          }
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Projects</h2>
          <p className="text-xs text-gray-500">{projects.length} total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              if (!confirm("Replace all projects in the database with the current code seed? This cannot be undone.")) return;
              setReseeding(true);
              try { await reset(); } finally { setReseeding(false); }
            }}
            disabled={reseeding}
            className="border border-gray-300 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {reseeding ? "Reseeding…" : "Reseed from code"}
          </button>
          <button
            onClick={() => {
              const p = blankProject(projects.length);
              add(p);
              setEditingSlug(p.slug);
            }}
            className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-800"
          >
            + Add
          </button>
        </div>
      </div>

      <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
        {projects.map((p, i) => (
          <li key={p.slug} className="flex items-center gap-2 p-2.5 hover:bg-gray-50">
            <div className="flex flex-col">
              <button onClick={() => reorder(p.slug, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 text-[10px] disabled:opacity-30" aria-label="Up">▲</button>
              <button onClick={() => reorder(p.slug, 1)} disabled={i === projects.length - 1} className="text-gray-400 hover:text-gray-700 text-[10px] disabled:opacity-30" aria-label="Down">▼</button>
            </div>
            <button onClick={() => setEditingSlug(p.slug)} className="flex-1 text-left min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{p.title}</p>
              <p className="text-[10px] text-gray-500 truncate">{p.role}</p>
            </button>
            <span className="text-[10px] text-gray-400 font-mono shrink-0">{p.outcomeMetric}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsSection;