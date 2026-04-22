const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-admin-password, x-upload-path, x-upload-kind",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const password = req.headers.get("x-admin-password") ?? "";
    const expected = Deno.env.get("ADMIN_PASSWORD");
    if (!expected || password !== expected) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const path = req.headers.get("x-upload-path");
    const kind = req.headers.get("x-upload-kind") ?? "image";
    if (!path) {
      return new Response(JSON.stringify({ ok: false, error: "x-upload-path header required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentType = req.headers.get("content-type") ?? "application/octet-stream";
    const body = new Uint8Array(await req.arrayBuffer());
    if (body.byteLength === 0) {
      return new Response(JSON.stringify({ ok: false, error: "empty body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { error: upErr } = await admin.storage
      .from("site-media")
      .upload(path, body, { contentType, upsert: true, cacheControl: "3600" });
    if (upErr) throw upErr;

    const { data: pub } = admin.storage.from("site-media").getPublicUrl(path);
    const url = pub.publicUrl;

    // Best-effort media library record
    await admin.from("media").insert({ kind, url, storage_path: path }).then(() => {}, () => {});

    return new Response(JSON.stringify({ ok: true, url, path }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});