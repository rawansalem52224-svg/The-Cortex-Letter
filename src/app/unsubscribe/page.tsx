import Link from "next/link";
import type { Metadata } from "next";
import { unsubscribeFromNewsletter } from "@/lib/actions/newsletter";

export const metadata: Metadata = {
  title: "Unsubscribe — The Cortex Letter",
  robots: { index: false },
};

function Message({ heading, body }: { heading: string; body: string }) {
  return (
    <>
      <h1 className="font-display mt-3 text-3xl font-semibold text-ink">{heading}</h1>
      <p className="mt-2 text-sm text-muted">{body}</p>
      <p className="mt-6 text-sm text-muted">
        <Link href="/" className="text-accent-strong hover:underline">
          Back to The Cortex Letter
        </Link>
      </p>
    </>
  );
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token, status } = await searchParams;

  let content;
  if (status === "done") {
    content = (
      <Message
        heading="You're unsubscribed"
        body="You won't receive any more emails from The Cortex Letter. You can resubscribe anytime from the homepage."
      />
    );
  } else if (status === "error") {
    content = <Message heading="Something went wrong" body="We couldn't unsubscribe you. Try the link again in a moment." />;
  } else if (typeof token !== "string" || !token || status === "invalid") {
    content = (
      <Message
        heading="Invalid unsubscribe link"
        body="This link is missing or malformed. Use the unsubscribe link at the bottom of any newsletter email."
      />
    );
  } else {
    // A confirm button (rather than deleting on page load) stops email link scanners
    // from unsubscribing people just by prefetching the link.
    content = (
      <>
        <h1 className="font-display mt-3 text-3xl font-semibold text-ink">Unsubscribe?</h1>
        <p className="mt-2 text-sm text-muted">
          You&rsquo;ll stop receiving emails about new articles and podcast episodes.
        </p>
        <form action={unsubscribeFromNewsletter} className="mt-8">
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Unsubscribe
          </button>
        </form>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20 sm:px-0">
      <p className="eyebrow">Newsletter</p>
      {content}
    </div>
  );
}
