"use client";

import { motion } from "framer-motion";

export function AnalysisLoader() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <motion.div
        className="h-16 w-16 rounded-full bg-gradient-brand"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <p className="text-sm text-muted-foreground">Analyzing your face...</p>
    </div>
  );
}
