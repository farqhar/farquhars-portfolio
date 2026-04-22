import { useEffect, useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/data/projectsSeed";
import AdminLogin from "@/components/admin/AdminLogin";
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

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const { projects, save, add, remove, reorder } = useProjects();

  useEffect(() => {
    setAuthed(sessionStorage.getItem("fm_admin_session") === "true");
  }, []);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  if (editingSlug) {
    const project = projects.find((p) => p.slug === editingSlug);
    if (!project) {
      setEditingSlug(null);
      return null;
    }
    return (
      <div className="min-h-screen bg-white">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500">{projects.length} total</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const p = blankProject(projects.length);
                add(p);
                setEditingSlug(p.slug);
              }}
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-800"
            >
              + Add project
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("fm_admin_session");
                setAuthed(false);
              }}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              Logout
            </button>
          </div>
        </div>

        <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {projects.map((p, i) => (
            <li key={p.slug} className="flex items-center gap-3 p-4 hover:bg-gray-50">
              <div className="flex flex-col">
                <button
                  onClick={() => reorder(p.slug, -1)}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-700 text-xs disabled:opacity-30"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => reorder(p.slug, 1)}
                  disabled={i === projects.length - 1}
                  className="text-gray-400 hover:text-gray-700 text-xs disabled:opacity-30"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
              <button
                onClick={() => setEditingSlug(p.slug)}
                className="flex-1 text-left"
              >
                <p className="text-sm font-medium text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500">{p.role}</p>
              </button>
              <span className="text-xs text-gray-400 font-mono">{p.outcomeMetric}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;