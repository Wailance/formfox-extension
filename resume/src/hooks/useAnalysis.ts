"use client";

import { useState } from "react";

import { type FaceAnalysisResult } from "@/lib/types";

export function useAnalysis() {
  const [loading, setLoading] = useState(false);

  const analyze = async (imageUrl: string): Promise<FaceAnalysisResult> => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl })
      });
      if (!response.ok) throw new Error("Analysis failed");
      return (await response.json()) as FaceAnalysisResult;
    } finally {
      setLoading(false);
    }
  };

  return { loading, analyze };
}
