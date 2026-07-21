"use client";

import { useEffect, useRef, useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleShareClick() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {
        // User dismissed the native share sheet — nothing to do.
      }
      return;
    }
    setOpen((v) => !v);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the menu stays open so they can copy manually.
    }
  }

  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleShareClick}
        aria-label="Share this article"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border-strong px-4 py-2.5 transition-colors hover:border-accent"
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted"
        >
          <path d="M12 15V3" />
          <path d="M7 8l5-5 5 5" />
          <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
        </svg>
        <span className="font-data text-sm text-ink">Share</span>
      </button>

      {open && (
        <div
          role="menu"
          className="card-shadow absolute left-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-surface py-1.5"
        >
          <button
            type="button"
            role="menuitem"
            onClick={copyLink}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-data text-sm text-ink transition-colors hover:bg-surface-hover"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            role="menuitem"
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 font-data text-sm text-ink transition-colors hover:bg-surface-hover"
          >
            Share on X
          </a>
          <a
            role="menuitem"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 font-data text-sm text-ink transition-colors hover:bg-surface-hover"
          >
            Share on Facebook
          </a>
          <a
            role="menuitem"
            href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
            className="flex items-center gap-2.5 px-4 py-2.5 font-data text-sm text-ink transition-colors hover:bg-surface-hover"
          >
            Share via email
          </a>
        </div>
      )}
    </div>
  );
}
