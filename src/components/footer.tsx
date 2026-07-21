import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="font-display text-lg font-semibold text-ink">The Cortex Letter</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Dispatches from the frontier of the mind — peer-reviewed neuroscience, translated
              for the curious.
            </p>
          </div>

          <div>
            <div className="eyebrow mb-3">Topics</div>
            <ul className="flex flex-col gap-2">
              {CATEGORY_LIST.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/articles?topic=${c.slug}`}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3">The publication</div>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/about" className="text-sm text-muted transition-colors hover:text-ink">
                  About
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="text-sm text-muted transition-colors hover:text-ink">
                  Podcast
                </Link>
              </li>
              <li>
                <Link href="/write-for-us" className="text-sm text-muted transition-colors hover:text-ink">
                  Write for us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted transition-colors hover:text-ink">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-data text-xs text-muted">
            &#169; {new Date().getFullYear()} The Cortex Letter. For education, not diagnosis.
          </p>
          <div className="signal-line w-32">
            <span className="signal-dot" style={{ left: "50%", opacity: 1 }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
