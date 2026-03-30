import { supabaseAdmin } from "@/lib/supabase";

export async function requireUserIdFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) throw new Error("UNAUTHORIZED");

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    throw new Error("UNAUTHORIZED");
  }

  return data.user.id;
}

