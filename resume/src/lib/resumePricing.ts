export const RESUME_PRICING = {
  single: { key: "single", rub: 19, credits: 1 },
  pack5: { key: "pack5", rub: 85, credits: 5 },
  pack10: { key: "pack10", rub: 154, credits: 10 }
} as const;

export type ResumePackKey = keyof typeof RESUME_PRICING;

export const packList = Object.values(RESUME_PRICING);

