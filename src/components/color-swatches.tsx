"use client";

import { useEffect, useRef } from "react";
import { HIGHLIGHT_PRESETS } from "@/lib/highlight-colors";

/** Preset swatches plus a "custom" swatch that opens the native colour picker. */
export function ColorSwatches({
  selected,
  disabled,
  onPick,
}: {
  selected?: string;
  disabled?: boolean;
  onPick: (color: string) => void;
}) {
  const customRef = useRef<HTMLInputElement>(null);
  const onPickRef = useRef(onPick);
  useEffect(() => {
    onPickRef.current = onPick;
  });

  // React's onChange fires on every drag of the picker; the native "change" event
  // fires once, when the reader commits a colour.
  useEffect(() => {
    const input = customRef.current;
    if (!input) return;
    const onChange = () => onPickRef.current(input.value);
    input.addEventListener("change", onChange);
    return () => input.removeEventListener("change", onChange);
  }, []);

  const normalized = selected?.toLowerCase();
  const isCustom = Boolean(normalized && !HIGHLIGHT_PRESETS.some((p) => p.value === normalized));

  return (
    <div role="group" aria-label="Highlight colour" className="flex items-center gap-2">
      {HIGHLIGHT_PRESETS.map((preset) => (
        <button
          key={preset.value}
          type="button"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(preset.value)}
          aria-label={`Highlight ${preset.name.toLowerCase()}`}
          aria-pressed={normalized === preset.value}
          className="h-8 w-8 shrink-0 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-60"
          style={{
            backgroundColor: preset.value,
            borderColor: normalized === preset.value ? "var(--ink)" : "transparent",
          }}
        />
      ))}
      <label
        title="Custom colour"
        className="relative h-8 w-8 shrink-0 cursor-pointer rounded-full border-2 transition-transform hover:scale-110"
        style={{
          background: isCustom
            ? selected
            : "conic-gradient(#f87171, #facc15, #4ade80, #22d3ee, #818cf8, #e879f9, #f87171)",
          borderColor: isCustom ? "var(--ink)" : "transparent",
        }}
      >
        <span className="sr-only">Pick any colour</span>
        <input
          ref={customRef}
          type="color"
          disabled={disabled}
          defaultValue={isCustom ? selected : "#ff6b6b"}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}
