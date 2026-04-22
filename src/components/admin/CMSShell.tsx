import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import PagePicker, { PageKey } from "@/components/admin/PagePicker";
import PreviewFrame from "@/components/admin/PreviewFrame";
import TeaserSection from "@/components/admin/sections/TeaserSection";
import AboutSection from "@/components/admin/sections/AboutSection";
import WorkSection from "@/components/admin/sections/WorkSection";
import ProjectsSection from "@/components/admin/sections/ProjectsSection";
import GlobalSection from "@/components/admin/sections/GlobalSection";
import ThemeSection from "@/components/admin/sections/ThemeSection";
import SaveBar from "@/components/admin/SaveBar";
import { cmsDirty } from "@/lib/cmsDirty";
import { cmsSession } from "@/lib/cmsSession";

type Props = { onLogout: () => void };

const CMSShell = ({ onLogout }: Props) => {
  const [active, setActive] = useState<PageKey>("teaser");
  const [route, setRoute] = useState<string>("/");

  const renderSection = () => {
    switch (active) {
      case "teaser": return <TeaserSection />;
      case "about": return <AboutSection />;
      case "work": return <WorkSection />;
      case "projects": return <ProjectsSection />;
      case "global": return <GlobalSection />;
      case "theme": return <ThemeSection />;
    }
  };

  const handlePageChange = (k: PageKey, r: string) => {
    if (cmsDirty.count() > 0) {
      const ok = window.confirm("You have unsaved changes. Discard them and switch?");
      if (!ok) return;
      cmsDirty.clear();
    }
    setActive(k);
    setRoute(r);
  };

  return (
    <div className="h-screen w-screen flex bg-white overflow-hidden">
      {/* Left: CMS panel */}
      <aside className="w-[380px] shrink-0 border-r border-gray-200 flex flex-col h-full">
        {/* Top bar with back-to-site */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to site
          </Link>
          <button
            onClick={() => {
              cmsSession.clear();
              onLogout();
            }}
            aria-label="Sign out"
            className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>

        {/* Page picker */}
        <div className="px-3 py-3 border-b border-gray-200">
          <PagePicker
            active={active}
            onChange={handlePageChange}
          />
        </div>

        {/* Section editor */}
        <div className="flex-1 overflow-y-auto px-4 py-4">{renderSection()}</div>

        {/* Save bar */}
        <SaveBar />

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 text-[10px] text-gray-400">
          Editing: <span className="font-mono">{route}</span>
        </div>
      </aside>

      {/* Right: live preview */}
      <PreviewFrame route={route} />
    </div>
  );
};

export default CMSShell;