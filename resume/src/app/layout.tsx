import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FaceRate — AI Face Analysis",
  description: "Upload a photo and get AI-powered face analysis and score.",
  openGraph: {
    title: "FaceRate",
    description: "AI face analysis app with GPT-4o Vision.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="container flex-1 py-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
