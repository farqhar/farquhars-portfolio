import { useState, ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cmsSession } from "@/lib/cmsSession";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const HeadshotUploader = ({ onSaved }: { onSaved?: () => void }) => {
  const { value, loading: settingLoading } = useSiteSetting<{ url: string }>("headshot_url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUrl = value?.url || "";

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `headshot/headshot-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-media")
        .upload(path, file, { cacheControl: "3600", upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("site-media").getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const password = cmsSession.get();
      const { data, error: invErr } = await supabase.functions.invoke("cms-save", {
        body: {
          password,
          table: "site_settings",
          key: "headshot_url",
          value: { url: publicUrl },
        },
      });
      if (invErr || !data?.ok) throw new Error(data?.error || invErr?.message || "Save failed");

      onSaved?.();
      // Force a refresh of the iframe preview by bumping a query string
      window.dispatchEvent(new Event("fm_cms_updated"));
      // Re-fetch by remounting: simplest is to reload the setting via location reload of preview.
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          {currentUrl ? (
            <img src={currentUrl} alt="Current headshot" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
              {settingLoading ? "…" : "Default"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <label className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer">
            {uploading ? "Uploading…" : currentUrl ? "Replace headshot" : "Upload headshot"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          <p className="text-[11px] text-gray-500 mt-1.5">JPG or PNG. Square works best.</p>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default HeadshotUploader;