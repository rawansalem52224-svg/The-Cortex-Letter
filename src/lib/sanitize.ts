import sanitizeHtml from "sanitize-html";

/**
 * Allowlist matching what the Tiptap editor produces. Anything else — scripts,
 * styles, iframes, event handlers, classes, unknown tags — is stripped
 * (disallowed tags are removed but their text content is kept).
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h2", "h3", "strong", "em", "u", "s", "blockquote",
    "ul", "ol", "li", "a", "code", "pre", "hr",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesAppliedToAttributes: ["href"],
  allowProtocolRelative: false,
  // Script/style contents are dropped entirely rather than kept as text.
  nonTextTags: ["script", "style", "textarea", "option", "noscript"],
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}
