"use client";

import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CameraCapture() {
  return (
    <Button variant="outline" className="w-full">
      <Camera className="mr-2 h-4 w-4" />
      Capture with camera
    </Button>
  );
}
