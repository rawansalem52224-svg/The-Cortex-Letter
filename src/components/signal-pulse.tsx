export function SignalPulse({ className = "" }: { className?: string }) {
  return (
    <div className={`signal-line ${className}`} aria-hidden="true">
      <span className="signal-dot" data-animated="true" />
    </div>
  );
}
