/**
 * Maps between DOM selections inside an article and plain-text character offsets.
 *
 * The "article text" is every text node's content in document order, with a "\n"
 * after each block element (paragraph, heading, list item, ...). That gives quotes
 * readable line breaks and stable offsets that don't depend on how the DOM is split.
 */

const BLOCK_TAGS = new Set(["P", "H1", "H2", "H3", "H4", "LI", "BLOCKQUOTE", "PRE", "UL", "OL", "HR", "DIV"]);
const LIST_TAGS = new Set(["UL", "OL"]);

export const CONTEXT_LENGTH = 32;

type Entry = { node: Text; start: number; end: number };
export type TextIndex = { text: string; entries: Entry[] };

export function buildTextIndex(root: HTMLElement): TextIndex {
  let text = "";
  const entries: Entry[] = [];

  const visit = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const data = (child as Text).data;
        entries.push({ node: child as Text, start: text.length, end: text.length + data.length });
        text += data;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (el.tagName === "BR") {
          text += "\n";
          continue;
        }
        visit(el);
        if (BLOCK_TAGS.has(el.tagName) && text.length > 0 && !text.endsWith("\n")) text += "\n";
      }
    }
  };

  visit(root);
  return { text, entries };
}

/** Character offset of a DOM boundary point (container + offset) within the article text. */
function pointToOffset(index: TextIndex, container: Node, offset: number): number {
  if (container.nodeType === Node.TEXT_NODE) {
    const entry = index.entries.find((e) => e.node === container);
    if (entry) return entry.start + offset;
  }
  // Element boundary: the offset is the start of the first text node at or after the point.
  const point = document.createRange();
  point.setStart(container, offset);
  for (const entry of index.entries) {
    if (point.comparePoint(entry.node, 0) >= 0) return entry.start;
  }
  return index.text.length;
}

export type TextSelection = {
  start: number;
  end: number;
  quote: string;
  prefix: string;
  suffix: string;
};

/** Converts a range inside `root` to trimmed offsets, or null if it holds no text. */
export function rangeToSelection(root: HTMLElement, range: Range): TextSelection | null {
  const index = buildTextIndex(root);
  let start = pointToOffset(index, range.startContainer, range.startOffset);
  let end = pointToOffset(index, range.endContainer, range.endOffset);

  while (start < end && /\s/.test(index.text[start])) start++;
  while (end > start && /\s/.test(index.text[end - 1])) end--;
  if (end <= start) return null;

  return {
    start,
    end,
    quote: index.text.slice(start, end),
    prefix: index.text.slice(Math.max(0, start - CONTEXT_LENGTH), start),
    suffix: index.text.slice(end, end + CONTEXT_LENGTH),
  };
}

type Anchor = { quote: string; start_offset: number; end_offset: number; prefix: string; suffix: string };

function sharedSuffixLength(a: string, b: string) {
  let n = 0;
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++;
  return n;
}

function sharedPrefixLength(a: string, b: string) {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/**
 * Finds where a saved highlight sits in the current article text. Uses the stored
 * offsets when the text there still matches; otherwise (the article was edited)
 * picks the occurrence of the quote whose surrounding text matches best.
 */
export function locate(text: string, anchor: Anchor): [number, number] | null {
  const { quote, start_offset, end_offset } = anchor;
  if (text.slice(start_offset, end_offset) === quote) return [start_offset, end_offset];

  let best: { at: number; score: number; distance: number } | null = null;
  for (let at = text.indexOf(quote); at !== -1; at = text.indexOf(quote, at + 1)) {
    const score =
      sharedSuffixLength(text.slice(Math.max(0, at - CONTEXT_LENGTH), at), anchor.prefix) +
      sharedPrefixLength(text.slice(at + quote.length, at + quote.length + CONTEXT_LENGTH), anchor.suffix);
    const distance = Math.abs(at - start_offset);
    if (!best || score > best.score || (score === best.score && distance < best.distance)) {
      best = { at, score, distance };
    }
  }
  return best ? [best.at, best.at + quote.length] : null;
}

/** Wraps the text between two offsets in <mark> elements (one per text node it spans). */
export function wrapOffsets(root: HTMLElement, start: number, end: number, makeMark: (first: boolean) => HTMLElement) {
  const index = buildTextIndex(root);
  let first = true;

  for (const entry of index.entries) {
    if (entry.end <= start || entry.start >= end) continue;

    const from = Math.max(start, entry.start) - entry.start;
    const to = Math.min(end, entry.end) - entry.start;
    const parent = entry.node.parentElement;
    const piece = entry.node.data.slice(from, to);
    // Skip formatting whitespace between list items; a <mark> can't live there.
    if (!piece.trim() && parent && LIST_TAGS.has(parent.tagName)) continue;

    let node = entry.node;
    if (from > 0) node = node.splitText(from);
    if (to - from < node.data.length) node.splitText(to - from);

    const mark = makeMark(first);
    first = false;
    node.parentNode!.insertBefore(mark, node);
    mark.appendChild(node);
  }
}

/** Removes every highlight <mark> and merges the text back together. */
export function clearMarks(root: HTMLElement, selector: string) {
  root.querySelectorAll(selector).forEach((mark) => mark.replaceWith(...Array.from(mark.childNodes)));
  root.normalize();
}

/** A link that scrolls to (and, in supporting browsers, highlights) the quote. */
export function textFragmentUrl(baseUrl: string, quote: string) {
  const encode = (s: string) => encodeURIComponent(s).replace(/-/g, "%2D");
  const lines = quote.split("\n").map((line) => line.trim().split(/\s+/)).filter((w) => w[0]);
  const words = lines.flat();
  // A single short phrase is matched exactly; anything long or spanning paragraphs
  // uses the textStart,textEnd form so it still matches across block boundaries.
  const directive =
    lines.length > 1 || words.length > 12
      ? `${encode(lines[0].slice(0, 5).join(" "))},${encode(lines[lines.length - 1].slice(-5).join(" "))}`
      : encode(words.join(" "));
  return `${baseUrl.split("#")[0]}#:~:text=${directive}`;
}
