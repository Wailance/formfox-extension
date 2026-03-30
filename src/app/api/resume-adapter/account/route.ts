import { NextResponse } from "next/server";

import { requireUserIdFromRequest } from "@/lib/authServer";
import { supabaseAdmin } from "@/lib/supabase";
import { getCredits } from "@/lib/resumeCreditsDb";
import { packList } from "@/lib/resumePricing";

export async function GET(request: Request) {
  try {
    const userId = await requireUserIdFromRequest(request);

    const remaining = await getCredits(userId);

    const { data: payments, error } = await supabaseAdmin
      .from("resume_payments")
      .select("payment_id, pack_key, credits_added, amount_rub, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      remaining,
      pricing: packList,
      payments: payments ?? []
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

