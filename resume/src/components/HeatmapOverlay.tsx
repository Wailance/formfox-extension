interface HeatmapOverlayProps {
  hint?: string;
}

export function HeatmapOverlay({ hint }: HeatmapOverlayProps) {
  return (
    <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">Heatmap insight</p>
      <p>{hint ?? "Focus around under-eye area and skin texture."}</p>
    </div>
  );
}
