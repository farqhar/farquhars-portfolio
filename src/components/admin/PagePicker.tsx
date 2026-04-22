type PageKey = "teaser" | "about" | "work" | "projects" | "global" | "theme";

const items: { key: PageKey; label: string; route: string }[] = [
  { key: "teaser", label: "Teaser", route: "/" },
  { key: "about", label: "About", route: "/about" },
  { key: "work", label: "Work (portfolio)", route: "/work" },
  { key: "projects", label: "Projects", route: "/work" },
  { key: "global", label: "Global / Identity", route: "/about" },
  { key: "theme", label: "Theme (colors & fonts)", route: "/" },
];

type Props = {
  active: PageKey;
  onChange: (key: PageKey, route: string) => void;
};

const PagePicker = ({ active, onChange }: Props) => (
  <nav className="space-y-0.5">
    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2 px-2">Pages</p>
    {items.map((item) => {
      const isActive = item.key === active;
      return (
        <button
          key={item.key}
          onClick={() => onChange(item.key, item.route)}
          className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
            isActive
              ? "bg-indigo-50 text-indigo-700 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          {item.label}
        </button>
      );
    })}
  </nav>
);

export type { PageKey };
export default PagePicker;