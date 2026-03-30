import { NextResponse } from "next/server";

import { openai } from "@/lib/openai";
import { FACE_ANALYSIS_PROMPT } from "@/lib/prompts";
import { saveResult } from "@/lib/resultStore";
import { type FaceAnalysisResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { imageUrl } = (await request.json()) as { imageUrl?: string };

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: FACE_ANALYSIS_PROMPT },
            {
              type: "input_image",
              image_url: imageUrl
            }
          ]
        }
      ]
    });

    const text = response.output_text?.trim() ?? "{}";
    const parsed = JSON.parse(text) as Omit<FaceAnalysisResult, "id" | "createdAt" | "imageUrl">;

    const result = saveResult({
      imageUrl,
      score: parsed.score,
      summary: parsed.summary,
      recommendations: parsed.recommendations ?? [],
      heatmapHint: parsed.heatmapHint,
      celebrityMatch: parsed.celebrityMatch
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Failed to analyze image"
      },
      { status: 500 }
    );
  }
}
