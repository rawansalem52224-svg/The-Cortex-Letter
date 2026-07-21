"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleReaction } from "@/lib/actions/reactions";

export function FavoriteButton({
  postId,
  slug,
  signedIn,
  initialFavorited,
}: {
  postId: string;
  slug: string;
  signedIn: boolean;
  initialFavorited: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [favorited, setFavorited] = useState(initialFavorited);

  function handleClick() {
    if (!signedIn) {
      router.push("/login");
      return;
    }

    const next = !favorited;
    setFavorited(next);

    startTransition(async () => {
      await toggleReaction(postId, slug, "favorite");
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      className="group flex items-center gap-2 rounded-full border border-border-strong px-4 py-2.5 transition-colors hover:border-accent"
    >
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill={favorited ? "var(--accent)" : "none"}
        stroke={favorited ? "var(--accent)" : "currentColor"}
        strokeWidth="2"
        className="text-muted transition-colors"
      >
        <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5v18l-6-4-6 4v-18z" />
      </svg>
      <span className="font-data text-sm text-ink">{favorited ? "Saved" : "Save"}</span>
    </button>
  );
}
