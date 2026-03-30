"use client";

import { Button } from "@/components/ui/button";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export function PaywallModal({ open, onClose }: PaywallModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <h3 className="text-xl font-semibold">Unlock full analysis</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Stripe payment is prepared and can be enabled in next step.
        </p>
        <div className="mt-6 flex gap-3">
          <Button className="flex-1">Buy full report</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}
