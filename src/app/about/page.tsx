import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About — The Cortex Letter" };

const PRINCIPLES = [
  {
    title: "Primary sources only",
    body: "Every claim traces back to a peer-reviewed paper, not a press release or a secondhand summary. We link the study so you can check our work.",
  },
  {
    title: "Limits, stated plainly",
    body: "A single study rarely settles a question. We say what a finding shows, what it doesn't, and how strong the evidence actually is.",
  },
  {
    title: "Written for the curious",
    body: "No prior neuroscience background required. We define terms once, clearly, and move on — the ideas carry the piece, not the jargon.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="eyebrow">About</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">
        Neuroscience, examined carefully.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        The Cortex Letter is an independent publication that translates peer-reviewed
        neuroscience into writing anyone curious about the brain can follow — without
        flattening the nuance that makes the research worth reading in the first place.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        We started this because most brain science coverage lands in one of two places: dense
        journal prose written for other specialists, or headlines that oversell a single small
        study. We wanted the middle: real findings, explained well.
      </p>

      <div className="mt-14 flex flex-col gap-8">
        {PRINCIPLES.map((p, i) => (
          <div key={p.title} className="flex gap-6 border-t border-border pt-8">
            <span className="font-data w-10 flex-none text-sm text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">{p.title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-xl font-semibold text-ink">Know the field well?</p>
        <p className="mt-2 text-muted">We&rsquo;re always reading new writer pitches.</p>
        <Link
          href="/write-for-us"
          className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg"
        >
          Apply to write
        </Link>
      </div>
    </div>
  );
}
