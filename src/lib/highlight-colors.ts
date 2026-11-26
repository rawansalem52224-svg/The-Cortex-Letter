/** Preset highlight swatches. Rendered as a translucent wash, so text stays readable in both themes. */
export const HIGHLIGHT_PRESETS = [
  { name: "Yellow", value: "#facc15" },
  { name: "Green", value: "#4ade80" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Pink", value: "#f472b6" },
  { name: "Orange", value: "#fb923c" },
  { name: "Purple", value: "#a78bfa" },
] as const;

export const DEFAULT_HIGHLIGHT_COLOR = HIGHLIGHT_PRESETS[0].value;

export const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Background for a highlight in any color: a 40% wash over the page background. */
export function highlightBackground(color: string) {
  return `color-mix(in srgb, ${color} 40%, transparent)`;
}
