"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  onFileSelect: (file: File) => void;
}

export function PhotoUploader({ onFileSelect }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <Upload className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
      <p className="mb-4 text-sm text-muted-foreground">
        Upload a clear selfie for AI analysis
      </p>
      <Button onClick={() => inputRef.current?.click()}>Choose photo</Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}
