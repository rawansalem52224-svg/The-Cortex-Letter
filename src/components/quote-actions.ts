import { textFragmentUrl } from "@/lib/text-anchor";

/**
 * Copy / share handlers for a quote. The link uses a text fragment (#:~:text=…),
 * so recipients land on the passage itself — nothing about the reader's own
 * highlights or notes is shared.
 */
export function quoteActions({
  quote,
  title,
  authorName,
  articlePath,
  onStatus,
}: {
  quote: string;
  title: string;
  authorName: string;
  /** Defaults to the current page. */
  articlePath?: string;
  onStatus: (message: string) => void;
}) {
  const link = () =>
    textFragmentUrl(articlePath ? `${window.location.origin}${articlePath}` : window.location.href, quote);
  const formatted = () => `“${quote.replace(/\n+/g, " ")}”\n— ${authorName}, “${title}”, The Cortex Letter\n${link()}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(formatted());
      onStatus("Quote copied");
    } catch {
      onStatus("Couldn't copy — your browser blocked the clipboard.");
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `“${quote.replace(/\n+/g, " ")}” — ${authorName}`, url: link() });
      } catch {
        // Share sheet dismissed.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(link());
      onStatus("Link to this passage copied");
    } catch {
      onStatus("Couldn't copy — your browser blocked the clipboard.");
    }
  }

  return { copy, share };
}
