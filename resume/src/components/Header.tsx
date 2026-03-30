import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          <span className="bg-gradient-brand bg-clip-text text-transparent">
            FaceRate
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/resume-adapter">Resume Adapter</Link>
          <Link href="/account">Account</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </header>
  );
}
