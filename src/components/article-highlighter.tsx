"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { createHighlight, deleteHighlight, updateHighlight } from "@/lib/actions/highlights";
import { DEFAULT_HIGHLIGHT_COLOR, highlightBackground } from "@/lib/highlight-colors";
import { clearMarks, buildTextIndex, locate, rangeToSelection, wrapOffsets, type TextSelection } from "@/lib/text-anchor";
import { ColorSwatches } from "@/components/color-swatches";
import { quoteActions } from "@/components/quote-actions";
import type { Highlight } from "@/lib/types";

const MARK_SELECTOR = "mark[data-hl]";
const POPOVER_WIDTH = 296;

type Popover =
  | { mode: "new"; selection: TextSelection; top: number; left: number; below: boolean }
  | { mode: "existing"; id: string; top: number; left: number; below: boolean; editingNote: boolean };

/** The article HTML. Memoised so popover state changes never re-render (and wipe) the marks. */
const ArticleHtml = memo(function ArticleHtml({
  html,
  containerRef,
}: {
  html: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return <div ref={containerRef} className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />;
});

export function ArticleHighlighter({
  html,
  postId,
  title,
  authorName,
  signedIn,
  initialHighlights,
}: {
  html: string;
  postId: string;
  title: string;
  authorName: string;
  signedIn: boolean;
  initialHighlights: Highlight[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const pointerDown = useRef(false);
  // True while the reader is using the popover, which can clear the text selection
  // (e.g. opening the colour picker) — that mustn't close it.
  const inPopover = useRef(false);
  const scrolledToHash = useRef(false);

  const [highlights, setHighlights] = useState(initialHighlights);
  const [popover, setPopover] = useState<Popover | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ── Paint marks whenever the highlight list changes ──────────────────────
  useLayoutEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    clearMarks(root, MARK_SELECTOR);

    const { text } = buildTextIndex(root);
    for (const h of highlights) {
      const at = locate(text, h);
      if (!at) continue; // The article changed and the quote is gone; it still lives on /notes.
      wrapOffsets(root, at[0], at[1], (first) => {
        const mark = document.createElement("mark");
        mark.dataset.hl = h.id;
        mark.style.backgroundColor = highlightBackground(h.color);
        if (first) {
          mark.id = `hl-${h.id}`;
          mark.tabIndex = 0;
          mark.setAttribute("role", "button");
          mark.setAttribute("aria-label", h.note ? `Your highlight, with note: ${h.note}` : "Your highlight");
        }
        if (h.note) mark.dataset.hasNote = "true";
        return mark;
      });
    }
  }, [highlights]);

  // ── Jump to #hl-<id> when arriving from the notes page ───────────────────
  useEffect(() => {
    if (scrolledToHash.current) return;
    const hash = window.location.hash;
    if (!hash.startsWith("#hl-")) return;
    scrolledToHash.current = true;
    const mark = document.getElementById(hash.slice(1));
    if (!mark) return;
    mark.scrollIntoView({ block: "center", behavior: "smooth" });
    mark.classList.add("hl-flash");
    setTimeout(() => mark.classList.remove("hl-flash"), 1800);
  }, [highlights]);

  const placePopover = useCallback((rect: DOMRect) => {
    const wrapper = wrapperRef.current!.getBoundingClientRect();
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Phones show their own selection menu above the text, so go below there.
    const below = coarse || rect.top < 140;
    const centre = rect.left + rect.width / 2 - wrapper.left;
    const left = Math.max(0, Math.min(centre - POPOVER_WIDTH / 2, wrapper.width - POPOVER_WIDTH));
    const top = (below ? rect.bottom : rect.top) - wrapper.top;
    return { top, left, below };
  }, []);

  // ── Detect a new text selection inside the article ───────────────────────
  const checkSelection = useCallback(() => {
    const root = articleRef.current;
    const selection = window.getSelection();
    if (!root || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (inPopover.current) return;
      setPopover((p) => (p?.mode === "new" ? null : p));
      return;
    }
    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return;

    const sel = rangeToSelection(root, range);
    if (!sel) return;
    setStatus(null);
    setPopover({ mode: "new", selection: sel, ...placePopover(range.getBoundingClientRect()) });
  }, [placePopover]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onSelectionChange = () => {
      clearTimeout(timer);
      if (pointerDown.current) return;
      timer = setTimeout(checkSelection, 250);
    };
    const onPointerDown = (e: PointerEvent) => {
      inPopover.current = Boolean(popoverRef.current?.contains(e.target as Node));
      if (inPopover.current) return;
      pointerDown.current = true;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDown.current) return;
      pointerDown.current = false;
      if (popoverRef.current?.contains(e.target as Node)) return;
      setTimeout(checkSelection, 0);
    };
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [checkSelection]);

  // ── Open an existing highlight on click / Enter ──────────────────────────
  const openExisting = useCallback(
    (mark: HTMLElement) => {
      const id = mark.dataset.hl!;
      const h = highlights.find((x) => x.id === id);
      if (!h) return;
      const first = articleRef.current?.querySelector<HTMLElement>(`#hl-${CSS.escape(id)}`) ?? mark;
      setNoteDraft(h.note ?? "");
      setStatus(null);
      setPopover({ mode: "existing", id, editingNote: false, ...placePopover(first.getBoundingClientRect()) });
    },
    [highlights, placePopover]
  );

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      if (!window.getSelection()?.isCollapsed) return;
      const mark = (e.target as HTMLElement).closest<HTMLElement>(MARK_SELECTOR);
      if (mark) openExisting(mark);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const mark = (e.target as HTMLElement).closest<HTMLElement>(MARK_SELECTOR);
      if (!mark) return;
      e.preventDefault();
      openExisting(mark);
    };
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [openExisting]);

  // ── Close on Escape or a click elsewhere ─────────────────────────────────
  useEffect(() => {
    if (!popover) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopover(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (popoverRef.current?.contains(target) || target.closest(MARK_SELECTOR)) return;
      if (popover.mode === "existing") setPopover(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [popover]);

  // ── Actions ──────────────────────────────────────────────────────────────
  async function create(color: string, openNote: boolean) {
    if (popover?.mode !== "new" || busy) return;
    const { selection, top, left, below } = popover;
    setBusy(true);
    const result = await createHighlight({
      postId,
      quote: selection.quote,
      startOffset: selection.start,
      endOffset: selection.end,
      prefix: selection.prefix,
      suffix: selection.suffix,
      color,
    });
    setBusy(false);
    if (!result.ok) {
      setStatus(result.error);
      return;
    }
    window.getSelection()?.removeAllRanges();
    setHighlights((list) => [...list, result.data].sort((a, b) => a.start_offset - b.start_offset));
    setNoteDraft("");
    setPopover({ mode: "existing", id: result.data.id, top, left, below, editingNote: openNote });
  }

  async function update(id: string, changes: { color?: string; note?: string | null }) {
    const previous = highlights;
    setHighlights((list) => list.map((h) => (h.id === id ? { ...h, ...changes } : h)));
    const result = await updateHighlight(id, changes);
    if (!result.ok) {
      setHighlights(previous);
      setStatus(result.error);
      return false;
    }
    setHighlights((list) => list.map((h) => (h.id === id ? result.data : h)));
    return true;
  }

  async function remove(id: string) {
    const previous = highlights;
    setHighlights((list) => list.filter((h) => h.id !== id));
    setPopover(null);
    const result = await deleteHighlight(id);
    if (!result.ok) {
      setHighlights(previous);
      setStatus(result.error);
    }
  }

  async function saveNote(id: string) {
    setBusy(true);
    const ok = await update(id, { note: noteDraft });
    setBusy(false);
    if (ok) {
      setStatus("Note saved");
      setPopover((p) => (p?.mode === "existing" ? { ...p, editingNote: false } : p));
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  const active = popover?.mode === "existing" ? highlights.find((h) => h.id === popover.id) : undefined;
  const quote = popover?.mode === "new" ? popover.selection.quote : active?.quote ?? "";
  const actions = quoteActions({ quote, title, authorName, onStatus: setStatus });

  return (
    <div ref={wrapperRef} className="relative">
      <ArticleHtml html={html} containerRef={articleRef} />

      {popover && (popover.mode === "new" || active) && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={popover.mode === "new" ? "Highlight selection" : "Edit highlight"}
          className="card-shadow absolute z-30 rounded-xl border border-border bg-surface p-3"
          style={{
            width: POPOVER_WIDTH,
            maxWidth: "100%",
            left: popover.left,
            top: popover.top,
            transform: popover.below ? "translateY(10px)" : "translateY(calc(-100% - 10px))",
          }}
        >
          {signedIn ? (
            <ColorSwatches
              selected={active?.color}
              disabled={busy}
              onPick={(color) =>
                popover.mode === "new" ? create(color, false) : update(popover.id, { color })
              }
            />
          ) : (
            <p className="font-data text-sm text-muted">
              <Link href="/login" className="text-accent-strong hover:underline">
                Sign in
              </Link>{" "}
              to highlight and keep notes.
            </p>
          )}

          {popover.mode === "existing" && active && popover.editingNote && (
            <div className="mt-3">
              <label htmlFor="hl-note" className="sr-only">
                Note
              </label>
              <textarea
                id="hl-note"
                autoFocus
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="Why this stood out…"
                className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPopover({ ...popover, editingNote: false })}
                  className="font-data rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveNote(active.id)}
                  className="font-data rounded-full bg-ink px-3.5 py-1.5 text-sm text-bg disabled:opacity-60"
                >
                  Save note
                </button>
              </div>
            </div>
          )}

          {popover.mode === "existing" && active?.note && !popover.editingNote && (
            <p className="mt-3 whitespace-pre-wrap border-l-2 pl-2.5 text-sm text-ink" style={{ borderColor: active.color }}>
              {active.note}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
            {signedIn && !(popover.mode === "existing" && popover.editingNote) && (
              <PopoverButton
                disabled={busy}
                onClick={() =>
                  popover.mode === "new"
                    ? create(DEFAULT_HIGHLIGHT_COLOR, true)
                    : setPopover({ ...popover, editingNote: true })
                }
              >
                {active?.note ? "Edit note" : "Add note"}
              </PopoverButton>
            )}
            <PopoverButton onClick={actions.copy}>Copy quote</PopoverButton>
            <PopoverButton onClick={actions.share}>Share</PopoverButton>
            {popover.mode === "existing" && active && (
              <PopoverButton onClick={() => remove(active.id)} danger>
                Remove
              </PopoverButton>
            )}
          </div>

          <p aria-live="polite" className="font-data mt-2 min-h-0 text-xs text-muted empty:hidden">
            {status}
          </p>
        </div>
      )}
    </div>
  );
}

function PopoverButton({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep the text selection visible
      onClick={onClick}
      disabled={disabled}
      className={`font-data rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-surface-hover disabled:opacity-60 ${
        danger ? "text-[color:var(--cat-emotion)]" : "text-ink"
      }`}
    >
      {children}
    </button>
  );
}
