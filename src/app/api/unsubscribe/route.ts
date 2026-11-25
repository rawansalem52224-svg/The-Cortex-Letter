import { unsubscribeByToken } from "@/lib/email/unsubscribe";

/**
 * RFC 8058 one-click unsubscribe, referenced by the List-Unsubscribe header in
 * newsletter emails. Mail clients (Gmail, Apple Mail, …) POST here directly.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const result = await unsubscribeByToken(token);

  if (result === "error") return new Response("Something went wrong.", { status: 500 });
  if (result === "invalid") return new Response("Invalid unsubscribe link.", { status: 400 });
  return new Response("You've been unsubscribed.", { status: 200 });
}
