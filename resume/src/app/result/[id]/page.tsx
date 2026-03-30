import { notFound } from "next/navigation";

import { ComparisonSlider } from "@/components/ComparisonSlider";
import { HeatmapOverlay } from "@/components/HeatmapOverlay";
import { ResultCard } from "@/components/ResultCard";
import { ShareButtons } from "@/components/ShareButtons";
import { type FaceAnalysisResult } from "@/lib/types";

interface ResultPageProps {
  params: { id: string };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const response = await fetch(`${appUrl}/api/result/${params.id}`, {
    cache: "no-store"
  });

  if (!response.ok) notFound();

  const result = (await response.json()) as FaceAnalysisResult;
  const shareUrl = `${appUrl}/result/${params.id}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ResultCard result={result} />
      <HeatmapOverlay hint={result.heatmapHint} />
      <ComparisonSlider celebrity={result.celebrityMatch} />
      <ShareButtons url={shareUrl} />
    </div>
  );
}
