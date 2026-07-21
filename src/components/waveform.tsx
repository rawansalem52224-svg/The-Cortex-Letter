const BAR_HEIGHTS = [0.4, 0.7, 1, 0.55, 0.85, 0.35, 0.65, 0.9, 0.5, 0.7, 0.4, 0.6];

/** A static waveform — the podcast's visual echo of the signal-pulse motif used elsewhere. */
export function Waveform({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="waveform-bar w-[3px] rounded-full bg-accent"
          style={{
            height: `${h * 100}%`,
            opacity: 0.55 + h * 0.45,
            animation: animated ? `waveform-bounce 1.2s ease-in-out ${i * 0.07}s infinite` : undefined,
          }}
        />
      ))}
    </div>
  );
}
