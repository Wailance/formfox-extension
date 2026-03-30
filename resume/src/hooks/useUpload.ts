"use client";

import { useState } from "react";

export function useUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const data = (await response.json()) as { imageUrl: string };
      return data.imageUrl;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadPhoto };
}
