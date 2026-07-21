export type CategorySlug =
  | "memory"
  | "sleep"
  | "neuroplasticity"
  | "perception"
  | "emotion"
  | "clinical";

export const CATEGORIES: Record<
  CategorySlug,
  { label: string; description: string; colorVar: string }
> = {
  memory: {
    label: "Memory",
    description: "Encoding, storage, and the strange reliability of forgetting.",
    colorVar: "var(--cat-memory)",
  },
  sleep: {
    label: "Sleep",
    description: "The brain's nightly maintenance shift.",
    colorVar: "var(--cat-sleep)",
  },
  neuroplasticity: {
    label: "Neuroplasticity",
    description: "How experience physically reshapes neural circuitry.",
    colorVar: "var(--cat-plasticity)",
  },
  perception: {
    label: "Perception",
    description: "How raw signal becomes seeing, hearing, and feeling.",
    colorVar: "var(--cat-perception)",
  },
  emotion: {
    label: "Emotion",
    description: "The circuitry underneath mood, fear, and motivation.",
    colorVar: "var(--cat-emotion)",
  },
  clinical: {
    label: "Clinical",
    description: "Disorders, disease mechanisms, and treatment research.",
    colorVar: "var(--cat-clinical)",
  },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([slug, v]) => ({
  slug: slug as CategorySlug,
  ...v,
}));

export function isCategorySlug(value: string): value is CategorySlug {
  return value in CATEGORIES;
}
