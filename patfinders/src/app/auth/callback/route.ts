import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/", req.url));
  const supabase = createServerSupabase();
  await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL("/", req.url));
}
