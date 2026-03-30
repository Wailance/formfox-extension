import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `uploads/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "facerate-photos";

  const { error } = await supabaseAdmin.storage.from(bucket).upload(key, buffer, {
    contentType: file.type
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(key);
  return NextResponse.json({ imageUrl: data.publicUrl });
}
