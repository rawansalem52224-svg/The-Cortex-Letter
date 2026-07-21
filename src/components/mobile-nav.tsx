"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav({
  links,
  isSignedIn,
  dashboardHref,
}: {
  links: { href: string; label: string }[];
  isSignedIn: boolean;
  dashboardHref: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="-mr-2.5 flex h-11 w-11 flex-col items-center justify-center gap-1.5"
      >
        <span
          className="block h-px w-5 bg-ink transition-transform"
          style={{ transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }}
        />
        <span
          className="block h-px w-5 bg-ink transition-transform"
          style={{ transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-bg px-5 pb-6 pt-2 shadow-lg">
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-data border-b border-border py-3.5 text-base text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={isSignedIn ? dashboardHref ?? "/account" : "/login"}
              onClick={() => setOpen(false)}
              className="font-data border-b border-border py-3.5 text-base text-ink"
            >
              {isSignedIn ? "Dashboard" : "Sign in"}
            </Link>
            <div className="pt-4">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
