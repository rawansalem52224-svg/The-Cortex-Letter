"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribeNever = () => () => {};

/** True only after the client has hydrated — avoids a server/client theme mismatch. */
function useMounted() {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-11 w-14" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="group flex h-11 w-14 flex-none items-center justify-center"
    >
      <span className="relative flex h-8 w-14 items-center rounded-full border border-border-strong bg-surface-hover px-1 transition-colors group-hover:border-accent">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-surface card-shadow transition-transform duration-300 ease-out"
          style={{ transform: isDark ? "translateX(22px)" : "translateX(0)" }}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" className="text-violet" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" className="text-accent" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" className="text-accent" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
