const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { password, table, key, value } = body as {
      password?: string;
      table?: string;
      key?: string;
      value?: unknown;
    };

    const expected = Deno.env.get("ADMIN_PASSWORD");
    if (!expected || password !== expected) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allowedTables = new Set(["site_settings", "site_content", "theme"]);
    if (!table || !allowedTables.has(table)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid table" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    if (table === "site_settings") {
      if (typeof key !== "string" || !key) {
        return new Response(JSON.stringify({ ok: false, error: "key required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await admin
        .from("site_settings")
        .upsert({ key, value: value ?? {} }, { onConflict: "key" });
      if (error) throw error;
    }

    if (table === "site_content") {
      const { page, section } = body as { page?: string; section?: string };
      if (typeof page !== "string" || !page) {
        return new Response(JSON.stringify({ ok: false, error: "page required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (typeof key !== "string" || !key) {
        return new Response(JSON.stringify({ ok: false, error: "key required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const sec = section || "default";
      // Manual upsert keyed on (page, section, key) since there is no unique constraint.
      const { data: existing, error: selErr } = await admin
        .from("site_content")
        .select("id")
        .eq("page", page)
        .eq("section", sec)
        .eq("key", key)
        .maybeSingle();
      if (selErr) throw selErr;
      if (existing?.id) {
        const { error } = await admin
          .from("site_content")
          .update({ value_json: value ?? {}, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await admin
          .from("site_content")
          .insert({ page, section: sec, key, value_json: value ?? {} });
        if (error) throw error;
      }
    }

    if (table === "theme") {
      // value is a partial { colors_json?, fonts_json?, headings_json? }
      const patch = (value ?? {}) as Record<string, unknown>;
      const allowedCols = new Set(["colors_json", "fonts_json", "headings_json"]);
      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const k of Object.keys(patch)) {
        if (allowedCols.has(k)) update[k] = patch[k];
      }
      // Singleton row
      const { data: existing, error: selErr } = await admin
        .from("theme")
        .select("id")
        .limit(1)
        .maybeSingle();
      if (selErr) throw selErr;
      if (existing?.id) {
        const { error } = await admin.from("theme").update(update).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await admin.from("theme").insert(update);
        if (error) throw error;
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});