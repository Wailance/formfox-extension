import { NextResponse } from "next/server";

import { getResult } from "@/lib/resultStore";

interface RouteContext {
  params: { id: string };
}

export async function GET(_: Request, { params }: RouteContext) {
  const result = getResult(params.id);
  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}
