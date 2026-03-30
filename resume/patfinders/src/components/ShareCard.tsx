"use client";
/* eslint-disable @next/next/no-img-element */
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { Quest } from "@/lib/types";
export default function ShareCard({ quest }: { quest: Quest }) {
  const ref = useRef<HTMLDivElement>(null); const [qr, setQr] = useState("");
  useEffect(() => { QRCode.toDataURL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").then(setQr); }, []);
  return <div ref={ref} className="pointer-events-none fixed -left-[9999px] top-0 h-[1920px] w-[1080px] bg-[#0F172A] p-16 text-white"><h1 className="text-6xl font-black">PATHFINDERS</h1><h2 className="mt-10 text-5xl">{quest.title}</h2><p className="mt-6 text-3xl">⚡ {quest.total_xp} XP · ✅ {quest.total_tasks}/{quest.total_tasks}</p>{qr && <img src={qr} className="mt-12 h-64 w-64" alt="qr" />}<p className="mt-8 text-2xl">Попробуй сам → pathfinders.app</p></div>;
}
export async function generateShareImage(element: HTMLElement): Promise<Blob> { const canvas = await html2canvas(element, { backgroundColor: "#0F172A", scale: 2 }); return await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/png")); }
