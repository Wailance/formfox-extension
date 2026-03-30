import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";
import { nonEmptyString } from "@/lib/validation";

interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as RegisterPayload;
  const username = body.username?.trim().toLowerCase() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!nonEmptyString(username) || username.length < 3) {
    return NextResponse.json({ error: "Username должен быть не короче 3 символов" }, { status: 400 });
  }
  if (!nonEmptyString(email) || !email.includes("@")) {
    return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Пароль должен быть не короче 6 символов" }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  const exists = await supabase.from("profiles").select("id").eq("username", username).maybeSingle();
  if (exists.data) {
    return NextResponse.json({ error: "Username уже занят" }, { status: 409 });
  }

  const created = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username }
  });
  if (created.error || !created.data.user) {
    return NextResponse.json({ error: created.error?.message ?? "Не удалось создать пользователя" }, { status: 400 });
  }

  const userId = created.data.user.id;
  const profileInsert = await supabase
    .from("profiles")
    .upsert({ id: userId, username }, { onConflict: "id" });

  if (profileInsert.error) {
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileInsert.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
