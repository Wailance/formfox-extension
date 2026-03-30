"use client";

import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
}

export function ShareButtons({ url }: ShareButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
            "_blank"
          )
        }
      >
        Share on X
      </Button>
      <Button variant="outline" onClick={() => navigator.clipboard.writeText(url)}>
        Copy link
      </Button>
    </div>
  );
}
