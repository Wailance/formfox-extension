import { NextResponse } from "next/server";

import { requireUserIdFromRequest } from "@/lib/authServer";
import { getCredits } from "@/lib/resumeCreditsDb";
import { packList } from "@/lib/resumePricing";

export async function GET(request: Request) {
  try {
    const userId = await requireUserIdFromRequest(request);

    return NextResponse.json({
      remaining: await getCredits(userId),
      pricing: packList
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

