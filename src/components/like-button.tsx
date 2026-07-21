"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleReaction } from "@/lib/actions/reactions";

export function LikeButton({
  postId,
  slug,
  signedIn,
  initialLiked,
  initialCount,
}: {
  postId: string;
  slug: string;
  signedIn: boolean;
  initialLiked: boolean;
  initialCount: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [firing, setFiring] = useState(false);

  function handleClick() {
    if (!signedIn) {
      router.push("/login");
      return;
    }

    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    if (next) setFiring(true);

    startTransition(async () => {
      await toggleReaction(postId, slug, "like");
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this article" : "Like this article"}
      className="group flex items-center gap-2.5 rounded-full border border-border-strong px-4 py-2.5 transition-colors hover:border-accent"
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        {firing && (
          <span
            className="orb-ring"
            data-firing="true"
            onAnimationEnd={() => setFiring(false)}
          />
        )}
        <span
          className="relative h-2.5 w-2.5 rounded-full transition-colors duration-200"
          style={
            liked
              ? {
                  background: "var(--accent)",
                  boxShadow: "0 0 0 4px var(--accent-soft), 0 0 10px 1px var(--accent)",
                }
              : { background: "transparent", border: "1px solid var(--border-strong)" }
          }
        />
      </span>
      <span className="font-data text-sm text-ink">{count}</span>
      <span className="font-data text-xs text-muted">{count === 1 ? "like" : "likes"}</span>
    </button>
  );
}
