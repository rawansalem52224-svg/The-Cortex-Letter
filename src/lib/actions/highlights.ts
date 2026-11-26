"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/profile";
import { HEX_COLOR } from "@/lib/highlight-colors";
import type { Highlight } from "@/lib/types";

const MAX_QUOTE = 2000;
const MAX_NOTE = 2000;
const MAX_CONTEXT = 64;

const COLUMNS = "id, post_id, quote, start_offset, end_offset, prefix, suffix, color, note, created_at";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export type NewHighlight = {
  postId: string;
  quote: string;
  startOffset: number;
  endOffset: number;
  prefix: string;
  suffix: string;
  color: string;
  note?: string | null;
};

function cleanNote(note: string | null | undefined) {
  const trimmed = (note ?? "").trim();
  return trimmed ? trimmed.slice(0, MAX_NOTE) : null;
}

async function signedInClient() {
  if (!isSupabaseConfigured) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  return { supabase: supabase!, user };
}

export async function createHighlight(input: NewHighlight): Promise<Result<Highlight>> {
  const ctx = await signedInClient();
  if (!ctx) return { ok: false, error: "Sign in to save highlights." };

  const quote = String(input.quote ?? "");
  const start = Math.floor(Number(input.startOffset));
  const end = Math.floor(Number(input.endOffset));

  if (!quote.trim() || quote.length > MAX_QUOTE) {
    return { ok: false, error: `Highlights can be up to ${MAX_QUOTE} characters.` };
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
    return { ok: false, error: "Couldn't work out where that selection is." };
  }
  if (!HEX_COLOR.test(input.color)) return { ok: false, error: "Pick a valid color." };

  const { data, error } = await ctx.supabase
    .from("post_highlights")
    .insert({
      user_id: ctx.user.id,
      post_id: input.postId,
      quote,
      start_offset: start,
      end_offset: end,
      prefix: String(input.prefix ?? "").slice(-MAX_CONTEXT),
      suffix: String(input.suffix ?? "").slice(0, MAX_CONTEXT),
      color: input.color.toLowerCase(),
      note: cleanNote(input.note),
    })
    .select(COLUMNS)
    .single();

  if (error || !data) return { ok: false, error: "Couldn't save that highlight. Try again." };

  revalidatePath("/notes");
  return { ok: true, data: data as Highlight };
}

export async function updateHighlight(
  id: string,
  changes: { color?: string; note?: string | null }
): Promise<Result<Highlight>> {
  const ctx = await signedInClient();
  if (!ctx) return { ok: false, error: "Sign in to edit highlights." };

  const patch: { color?: string; note?: string | null } = {};
  if (changes.color !== undefined) {
    if (!HEX_COLOR.test(changes.color)) return { ok: false, error: "Pick a valid color." };
    patch.color = changes.color.toLowerCase();
  }
  if (changes.note !== undefined) patch.note = cleanNote(changes.note);

  const { data, error } = await ctx.supabase
    .from("post_highlights")
    .update(patch)
    .eq("id", id)
    .eq("user_id", ctx.user.id)
    .select(COLUMNS)
    .single();

  if (error || !data) return { ok: false, error: "Couldn't update that highlight. Try again." };

  revalidatePath("/notes");
  return { ok: true, data: data as Highlight };
}

export async function deleteHighlight(id: string): Promise<Result<null>> {
  const ctx = await signedInClient();
  if (!ctx) return { ok: false, error: "Sign in to edit highlights." };

  const { error } = await ctx.supabase
    .from("post_highlights")
    .delete()
    .eq("id", id)
    .eq("user_id", ctx.user.id);

  if (error) return { ok: false, error: "Couldn't delete that highlight. Try again." };

  revalidatePath("/notes");
  return { ok: true, data: null };
}
