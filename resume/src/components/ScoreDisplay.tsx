interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-4 border-primary">
      <div className="text-center">
        <p className="text-4xl font-bold">{score}</p>
        <p className="text-xs text-muted-foreground">/ 100</p>
      </div>
    </div>
  );
}
