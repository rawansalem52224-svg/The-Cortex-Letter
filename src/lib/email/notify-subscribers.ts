import "server-only";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

type ContentKind = "post" | "episode";

type Notice = {
  kind: ContentKind;
  title: string;
  summary: string;
  url: string;
};

type Subscriber = { email: string; unsubscribe_token: string };

// Resend accepts at most 100 emails per batch call.
const BATCH_SIZE = 100;
// Resend's default rate limit is a few requests per second; stay comfortably under it.
const DELAY_BETWEEN_BATCHES_MS = 600;
const SUBSCRIBER_PAGE_SIZE = 1000;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://thecortexletter.org").replace(/\/+$/, "");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Emails every newsletter subscriber about a newly published article or episode.
 *
 * Runs at most once per item: it atomically claims the row by setting notified_at
 * (only if it is still null and the item is published), so double-clicks,
 * unpublish/republish, and concurrent requests never re-email anyone. If every
 * batch fails, the claim is released so the next publish can try again.
 *
 * Never throws — callers can fire it without risking the publish itself.
 */
export async function notifySubscribers(kind: ContentKind, id: string) {
  try {
    await sendNotifications(kind, id);
  } catch (error) {
    console.error(`[newsletter] Failed to notify subscribers about ${kind} ${id}:`, error);
  }
}

async function sendNotifications(kind: ContentKind, id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const supabase = createAdminClient();

  if (!apiKey || !from || !supabase) {
    console.warn(
      "[newsletter] Skipping notification: RESEND_API_KEY, EMAIL_FROM, or SUPABASE_SERVICE_ROLE_KEY is not set."
    );
    return;
  }

  const table = kind === "post" ? "posts" : "podcast_episodes";
  const summaryColumn = kind === "post" ? "excerpt" : "description";

  // Claim the row. Only one request can flip notified_at from null, so only one sends.
  const { data: claimed, error: claimError } = await supabase
    .from(table)
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "published")
    .is("notified_at", null)
    .select(`slug, title, ${summaryColumn}`)
    .maybeSingle();

  if (claimError) throw claimError;
  if (!claimed) return; // Already notified, or not actually published.

  const row = claimed as unknown as Record<string, string>;
  const notice: Notice = {
    kind,
    title: row.title,
    summary: row[summaryColumn] ?? "",
    url: `${SITE_URL}/${kind === "post" ? "articles" : "podcast"}/${row.slug}`,
  };

  const subscribers = await fetchAllSubscribers(supabase);
  if (subscribers.length === 0) return;

  const resend = new Resend(apiKey);
  let sentBatches = 0;
  let failedBatches = 0;

  for (let start = 0; start < subscribers.length; start += BATCH_SIZE) {
    if (start > 0) await sleep(DELAY_BETWEEN_BATCHES_MS);

    const batch = subscribers.slice(start, start + BATCH_SIZE).map((subscriber) =>
      buildEmail(from, notice, subscriber)
    );

    if (await sendBatch(resend, batch)) sentBatches++;
    else failedBatches++;
  }

  if (sentBatches === 0) {
    // Nobody received it — release the claim so a later publish can retry.
    await supabase.from(table).update({ notified_at: null }).eq("id", id);
    console.error(`[newsletter] All batches failed for ${kind} ${id}; notified_at reset.`);
  } else if (failedBatches > 0) {
    console.error(
      `[newsletter] ${failedBatches} of ${sentBatches + failedBatches} batches failed for ${kind} ${id}.`
    );
  }
}

async function fetchAllSubscribers(supabase: NonNullable<ReturnType<typeof createAdminClient>>) {
  const subscribers: Subscriber[] = [];

  for (let from = 0; ; from += SUBSCRIBER_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("email, unsubscribe_token")
      .order("created_at", { ascending: true })
      .range(from, from + SUBSCRIBER_PAGE_SIZE - 1);

    if (error) throw error;
    subscribers.push(...(data ?? []));
    if (!data || data.length < SUBSCRIBER_PAGE_SIZE) break;
  }

  return subscribers;
}

type Email = Parameters<Resend["batch"]["send"]>[0][number];

/** Sends one batch, retrying once on rate limiting or a transient failure. */
async function sendBatch(resend: Resend, batch: Email[]) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { error } = await resend.batch.send(batch);
      if (!error) return true;
      console.error("[newsletter] Resend batch error:", error);
    } catch (error) {
      console.error("[newsletter] Resend batch request failed:", error);
    }
    if (attempt === 0) await sleep(2000);
  }
  return false;
}

function buildEmail(from: string, notice: Notice, subscriber: Subscriber): Email {
  const token = encodeURIComponent(subscriber.unsubscribe_token);
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${token}`;
  const oneClickUrl = `${SITE_URL}/api/unsubscribe?token=${token}`;

  const label = notice.kind === "post" ? "New article" : "New podcast episode";
  const cta = notice.kind === "post" ? "Read the article" : "Listen to the episode";

  const title = escapeHtml(notice.title);
  const summary = escapeHtml(notice.summary);

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f5f1;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f1;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:32px;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
            <tr><td style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;">The Cortex Letter &middot; ${label}</td></tr>
            <tr><td style="padding-top:12px;font-size:26px;line-height:1.25;font-weight:bold;">${title}</td></tr>
            ${summary ? `<tr><td style="padding-top:12px;font-size:16px;line-height:1.6;color:#3a3a3a;">${summary}</td></tr>` : ""}
            <tr>
              <td style="padding-top:24px;">
                <a href="${notice.url}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;padding:12px 22px;border-radius:999px;">${cta}</a>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#8a8a8a;margin:16px auto 0;">
            You're receiving this because you subscribed to The Cortex Letter.
            <a href="${unsubscribeUrl}" style="color:#8a8a8a;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `${label} on The Cortex Letter`,
    "",
    notice.title,
    "",
    notice.summary,
    "",
    `${cta}: ${notice.url}`,
    "",
    "---",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return {
    from,
    to: [subscriber.email],
    subject: `${label}: ${notice.title}`,
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${oneClickUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
