import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — The Cortex Letter" };

const CHANNELS = [
  {
    label: "Editorial & corrections",
    detail: "Spotted an error, or citing us? We correct mistakes publicly and quickly.",
    email: "editors@thecortexletter.example",
  },
  {
    label: "Pitches & contributions",
    detail: "Have a finding worth covering? See the Write for us page for the full process.",
    email: "pitches@thecortexletter.example",
  },
  {
    label: "Everything else",
    detail: "Partnerships, syndication, or general questions.",
    email: "hello@thecortexletter.example",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="eyebrow">Contact</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">Get in touch</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        Replace the placeholder addresses below with your own once you&rsquo;ve set up email — these
        are shown as an example of how the page reads with real contact channels.
      </p>

      <div className="mt-12 flex flex-col divide-y divide-border">
        {CHANNELS.map((c) => (
          <div key={c.label} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">{c.label}</h2>
              <p className="mt-1 max-w-md text-sm text-muted">{c.detail}</p>
            </div>
            <a href={`mailto:${c.email}`} className="font-data text-sm text-accent-strong hover:underline">
              {c.email}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
