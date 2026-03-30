"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
export default function PhotoCapture({ onCapture, onCancel }: { onCapture: (base64: string) => void; onCancel: () => void; }) {
  const [preview, setPreview] = useState<string | null>(null);
  const onFile = async (f: File) => {
    const reader = new FileReader();
    reader.onload = () => { const b64 = String(reader.result).split(",")[1] ?? ""; setPreview(String(reader.result)); onCapture(b64); };
    reader.readAsDataURL(f);
  };
  return <div className="fixed inset-0 z-50 bg-black/80 p-4"><div className="mx-auto max-w-md glass-card"><h3 className="mb-2 text-lg">Фото-задание</h3>{preview ? <img src={preview} className="mb-3 rounded-lg" alt="preview" /> : <label className="block min-h-12 rounded-lg border border-slate-600 p-3 text-center"><input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />📷 Сделать фото</label>}<button onClick={onCancel} className="min-h-12 w-full rounded-lg border border-slate-600">Закрыть</button></div></div>;
}
