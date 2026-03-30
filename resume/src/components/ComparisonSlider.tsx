interface ComparisonSliderProps {
  celebrity?: { name: string; similarity: number };
}

export function ComparisonSlider({ celebrity }: ComparisonSliderProps) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-sm text-muted-foreground">Celebrity comparison</p>
      <p className="text-lg font-semibold">
        {celebrity?.name ?? "No match yet"}{" "}
        <span className="text-sm text-muted-foreground">
          ({celebrity?.similarity ?? 0}%)
        </span>
      </p>
    </div>
  );
}
