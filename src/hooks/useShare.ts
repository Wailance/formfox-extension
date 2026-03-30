"use client";

export function useShare() {
  const share = async (url: string) => {
    if (navigator.share) {
      await navigator.share({ title: "My FaceRate result", url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  return { share };
}
