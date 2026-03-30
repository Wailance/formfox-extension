import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabase-types";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const safeUrl = url && /^https?:\/\//.test(url) ? url : "https://example.supabase.co";
  return {
    url: safeUrl,
    anon: anon && !anon.includes("your_") ? anon : "public-anon-key-placeholder",
    service: service && !service.includes("your_") ? service : "service-role-key-placeholder"
  };
}

export function createServerSupabase() {
  const cookieStore = cookies();
  const cfg = getSupabaseConfig();
  return createServerClient<Database>(
    cfg.url,
    cfg.anon,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: { [key: string]: unknown }) { cookieStore.set(name, value, options); },
        remove(name: string, options: { [key: string]: unknown }) { cookieStore.set(name, "", options); }
      }
    }
  );
}

export function createServiceSupabase() {
  const cfg = getSupabaseConfig();
  return createSupabaseClient<Database>(
    cfg.url,
    cfg.service
  );
}
