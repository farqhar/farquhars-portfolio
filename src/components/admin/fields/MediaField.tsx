import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { uploadMedia, saveContent, saveSetting } from "@/lib/cmsApi";

type Props = {
  label: string;
  /** When set, value is saved to site_content. */
  page?: string;
  section?: string;
  fieldKey?: string;
  /** When set, value is saved to site_settings under this key as { url }. */
  settingKey?: string;
  currentUrl: string;
  kind?: "image" | "video" | "file" | "any";
  /** Storage subfolder, e.g. "teaser/hero" */
  folder: string;
  onSaved?: (url: string) => void;
};

const accept = (kind: Props["kind"]) =>
  kind === "video" ? "video/*" : kind === "file" ? "application/pdf,.pdf,image/*,video/*" : kind === "any" ? "image/*,video/*,application/pdf,.pdf" : "image/*";

const MediaField = ({
  label,
  page,
  section,
  fieldKey,
  settingKey,
  currentUrl,
  kind = "image",
  folder,
  onSaved,
}: Props) => {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState(currentUrl);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${folder}/${Date.now()}.${ext}`;
      const url = await uploadMedia(file, path, kind);
      if (settingKey) {
        await saveSetting(settingKey, { url });
      } else if (page && section && fieldKey) {
        await saveContent(page, section, fieldKey, url);
      }
      setPreview(url);
      onSaved?.(url);
      toast.success("Saved ✓", { description: file.name });
    } catch (ex) {
      const msg = (ex as Error).message;
      setErr(msg);
      toast.error("Upload failed", { description: msg });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const isVideo = preview && /\.(mp4|webm|mov)(\?|$)/i.test(preview);
  const isPdf = preview && /\.pdf(\?|$)/i.test(preview);

  return (
    <div className="mb-4">
      <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="flex items-start gap-3">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
          {preview ? (
            isVideo ? (
              <video src={preview} className="w-full h-full object-cover" muted />
            ) : isPdf ? (
              <a href={preview} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-gray-700 underline">PDF</a>
            ) : (
              <img src={preview} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <span className="text-[9px] text-gray-400">none</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <label className="inline-block bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer">
            {uploading ? "Uploading…" : preview ? "Replace" : "Upload"}
            <input
              type="file"
              accept={accept(kind)}
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          <p className="text-[10px] text-gray-500 mt-1 truncate">{preview ? preview.split("/").pop() : "No file"}</p>
        </div>
      </div>
      {err && <p className="text-[10px] text-red-600 mt-1">{err}</p>}
    </div>
  );
};

export default MediaField;