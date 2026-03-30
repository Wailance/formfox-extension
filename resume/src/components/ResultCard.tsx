import { Card } from "@/components/ui/card";
import { type FaceAnalysisResult } from "@/lib/types";

import { ScoreDisplay } from "./ScoreDisplay";

interface ResultCardProps {
  result: FaceAnalysisResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="space-y-4">
      <ScoreDisplay score={result.score.overall} />
      <p className="text-sm text-muted-foreground">{result.summary}</p>
      <ul className="list-disc space-y-1 pl-4 text-sm">
        {result.recommendations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
