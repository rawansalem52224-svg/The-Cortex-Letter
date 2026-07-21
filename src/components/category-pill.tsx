import type { CategorySlug } from "@/lib/categories";
import { CATEGORIES } from "@/lib/categories";

export function CategoryPill({ category, size = "sm" }: { category: CategorySlug; size?: "sm" | "md" }) {
  const meta = CATEGORIES[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-data uppercase tracking-wide ${
        size === "sm" ? "text-[0.7rem]" : "text-xs"
      }`}
      style={{ color: meta.colorVar }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.colorVar }} />
      {meta.label}
    </span>
  );
}
