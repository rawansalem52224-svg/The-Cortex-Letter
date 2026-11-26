"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { deleteHighlight, updateHighlight } from "@/lib/actions/highlights";
import { highlightBackground } from "@/lib/highlight-colors";
import { ColorSwatches } from "@/components/color-swatches";
import { quoteActions } from "@/components/quote-actions";
import type { Highlight } from "@/lib/types";

export function NoteCard({
  highlight,
  slug,
  title,
  authorName,
}: {
  highlight: Highlight;
  slug: string;
  title: string;
  authorName: string;
}) {
  const [h, setH] = useState(highlight);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(highlight.note ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  const actions = quoteActions({ quote: h.quote, title, authorName, articlePath: `/articles/${slug}`, onStatus: setStatus });

  async function save(changes: { color?: string; note?: string | null }) {
    setBusy(true);
    const result = await updateHighlight(h.id, changes);
    setBusy(false);
    if (!result.ok) {
      setStatus(result.error);
      return false;
    }
    setH(result.data);
    return true;
  }

  async function remove() {
    if (!window.confirm("Remove this highlight and its note?")) return;
    setBusy(true);
    const result = await deleteHighlight(h.id);
    setBusy(false);
    if (result.ok) setRemoved(true);
    else setStatus(result.error);
  }

  if (removed) return null;

  return (
    <article className="rounded-2xl border border-border bg-surface p-5" style={{ borderLeft: `4px solid ${h.color}` }}>
      <blockquote className="font-display whitespace-pre-line text-lg leading-relaxed text-ink">
        <span className="rounded-[3px] px-0.5 [box-decoration-break:clone]" style={{ backgroundColor: highlightBackground(h.color) }}>
          {h.quote}
        </span>
      </blockquote>

      {editing ? (
        <div className="mt-4">
          <label htmlFor={`note-${h.id}`} className="sr-only">
            Note
          </label>
          <textarea
            id={`note-${h.id}`}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Why this stood out…"
            className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <ColorSwatches selected={h.color} disabled={busy} onPick={(color) => save({ color })} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(h.note ?? "");
                  setEditing(false);
                }}
                className="font-data rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  if (await save({ note: draft })) setEditing(false);
                }}
                className="font-data rounded-full bg-ink px-3.5 py-1.5 text-sm text-bg disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        h.note && <p className="mt-4 whitespace-pre-wrap text-ink">{h.note}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-data text-sm">
        <span className="text-muted">{format(new Date(h.created_at), "MMM d, yyyy")}</span>
        <Link href={`/articles/${slug}#hl-${h.id}`} className="text-accent-strong hover:underline">
          Open in article
        </Link>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="text-muted hover:text-ink">
            {h.note ? "Edit" : "Add note"}
          </button>
        )}
        <button type="button" onClick={actions.copy} className="text-muted hover:text-ink">
          Copy quote
        </button>
        <button type="button" onClick={actions.share} className="text-muted hover:text-ink">
          Share
        </button>
        <button type="button" disabled={busy} onClick={remove} className="text-muted hover:text-[color:var(--cat-emotion)]">
          Remove
        </button>
        <span aria-live="polite" className="text-muted">
          {status}
        </span>
      </div>
    </article>
  );
}
