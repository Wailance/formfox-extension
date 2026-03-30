import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./supabase-types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const safeUrl = url && /^https?:\/\//.test(url) ? url : "https://example.supabase.co";
  const safeAnon = anon && !anon.includes("your_") ? anon : "public-anon-key-placeholder";
  if (!client) {
    client = createBrowserClient<Database>(safeUrl, safeAnon);
  }
  return client;
}
