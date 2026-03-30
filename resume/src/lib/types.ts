export interface FaceScoreBreakdown {
  symmetry: number;
  skinQuality: number;
  jawline: number;
  eyes: number;
  overall: number;
}

export interface FaceAnalysisResult {
  id: string;
  imageUrl: string;
  score: FaceScoreBreakdown;
  summary: string;
  recommendations: string[];
  heatmapHint?: string;
  celebrityMatch?: {
    name: string;
    similarity: number;
  };
  createdAt: string;
}
