"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AnalysisLoader } from "@/components/AnalysisLoader";
import { CameraCapture } from "@/components/CameraCapture";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Card } from "@/components/ui/card";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useUpload } from "@/hooks/useUpload";

export default function HomePage() {
  const router = useRouter();
  const { uploading, uploadPhoto } = useUpload();
  const { loading, analyze } = useAnalysis();
  const [error, setError] = useState<string | null>(null);

  const isLoading = useMemo(() => uploading || loading, [uploading, loading]);

  const onFile = async (file: File) => {
    try {
      setError(null);
      const imageUrl = await uploadPhoto(file);
      const result = await analyze(imageUrl);
      router.push(`/result/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Rate your look with{" "}
        <span className="bg-gradient-brand bg-clip-text text-transparent">
          FaceRate AI
        </span>
      </h1>
      <Card className="space-y-4">
        <PhotoUploader onFileSelect={onFile} />
        <CameraCapture />
        {isLoading && <AnalysisLoader />}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </Card>
    </div>
  );
}
