import { useEffect, useRef, useState } from "react";

type Props = { route: string };

const PreviewFrame = ({ route }: Props) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [bust, setBust] = useState(0);

  useEffect(() => {
    const handler = () => setBust((b) => b + 1);
    window.addEventListener("fm_cms_updated", handler);
    return () => window.removeEventListener("fm_cms_updated", handler);
  }, []);

  const src = `${route}${route.includes("?") ? "&" : "?"}cms=1&v=${bust}`;

  return (
    <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
      <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
        <iframe
          ref={ref}
          key={route}
          src={src}
          title="Live preview"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default PreviewFrame;