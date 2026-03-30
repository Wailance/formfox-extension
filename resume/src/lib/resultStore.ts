import { randomUUID } from "crypto";

import { type FaceAnalysisResult } from "@/lib/types";

const results = new Map<string, FaceAnalysisResult>();

export function saveResult(partial: Omit<FaceAnalysisResult, "id" | "createdAt">) {
  const id = randomUUID();
  const result: FaceAnalysisResult = {
    ...partial,
    id,
    createdAt: new Date().toISOString()
  };
  results.set(id, result);
  return result;
}

export function getResult(id: string) {
  return results.get(id) ?? null;
}
