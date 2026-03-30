import { verifyPhoto } from "@/lib/openai";
import { createServerSupabase } from "@/lib/supabase-server";
import { VerifyPhotoRequest } from "@/lib/types";
import { isFiniteNumber, nonEmptyString } from "@/lib/validation";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = (await req.json()) as Partial<VerifyPhotoRequest>;
  if (
    !nonEmptyString(body.quest_id) ||
    !isFiniteNumber(body.task_index) ||
    !nonEmptyString(body.photo_base64) ||
    !nonEmptyString(body.verification_prompt)
  ) {
    return NextResponse.json({ error: "Некорректный payload" }, { status: 400 });
  }
  const supabase = createServerSupabase(); const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: quest } = await supabase.from("quests").select("*").eq("id", body.quest_id).eq("user_id", auth.user.id).eq("status", "active").single();
  if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  const task = quest.tasks?.[body.task_index];
  const verdict = await verifyPhoto({ photoBase64: body.photo_base64, taskDescription: task?.description ?? "", verificationPrompt: body.verification_prompt });
  if (!verdict.verified) return NextResponse.json(verdict);
  const bytes = Buffer.from(body.photo_base64, "base64");
  const file = `${auth.user.id}/${body.quest_id}-${body.task_index}-${nanoid(6)}.jpg`;
  const up = await supabase.storage.from("task-photos").upload(file, bytes, { contentType: "image/jpeg", upsert: false });
  if (up.error) return NextResponse.json({ verified: false, comment: "Фото проверено, но не удалось загрузить." }, { status: 500 });
  const { data } = supabase.storage.from("task-photos").getPublicUrl(file);
  return NextResponse.json({ verified: true, comment: verdict.comment, photo_url: data.publicUrl });
}
