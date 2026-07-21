"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function update(next: string) {
    setValue(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("q", next);
    else params.delete("q");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="relative">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <label htmlFor="article-search" className="sr-only">
        Search articles
      </label>
      <input
        id="article-search"
        type="search"
        value={value}
        onChange={(e) => update(e.target.value)}
        placeholder="Search articles…"
        className="w-full rounded-full border border-border-strong bg-surface py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent sm:w-72"
      />
    </div>
  );
}
