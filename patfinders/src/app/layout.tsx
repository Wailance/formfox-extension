import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
const inter = Inter({ subsets: ["latin", "cyrillic"] });
export const metadata: Metadata = {
  title: "Pathfinders — Превращаем прогулки в приключения",
  description: "Городская RPG: квесты, артефакты, стрики. Исследуй свой район!",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: { images: ["/api/og"] },
  twitter: { card: "summary_large_image" }
};

export const viewport: Viewport = {
  themeColor: "#0F172A"
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body className={`${inter.className} min-h-screen bg-[#0F172A] text-white`}><Toaster theme="dark" richColors />{children}<Analytics /></body></html>;
}
