export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="container text-sm text-muted-foreground">
        © {new Date().getFullYear()} FaceRate. AI-powered facial analysis.
      </div>
    </footer>
  );
}
