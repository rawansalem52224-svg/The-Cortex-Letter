import type { Post } from "@/lib/types";

/**
 * Placeholder posts shown when no Supabase project is connected yet (see README).
 * Replace by writing real posts through the writer dashboard once Supabase is wired up.
 */
export const SEED_POSTS: Post[] = [
  {
    id: "seed-1",
    slug: "hippocampus-replay-during-sleep",
    title: "While You Sleep, Your Hippocampus Reruns the Day",
    excerpt:
      "Placeholder article. Replace with a real piece on hippocampal replay — how sequences of neurons that fired during a day's experience reactivate, compressed, during sleep.",
    content: `> Placeholder content. Replace this article through the writer dashboard once Supabase is connected.

This is template text standing in for a full article on hippocampal replay: the phenomenon where neural firing sequences recorded during waking experience are rehearsed again, sped up, during subsequent sleep.

## What the placeholder would cover

A finished version of this piece would walk through the original rodent electrophysiology studies, what replay looks like in human intracranial recordings, and the leading theories on what replay is actually *for* — memory consolidation, planning, or both.

## Why it's here

Every article on this site follows the same structure: a clear finding, the evidence behind it, and its open questions. This placeholder exists so you can see that structure and styling before writing your own.`,
    cover_image: null,
    category: "sleep",
    status: "published",
    author_id: "seed-author-1",
    author_name: "The Editors",
    read_minutes: 6,
    published_at: "2026-06-02T09:00:00.000Z",
    created_at: "2026-06-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "seed-2",
    slug: "synaptic-pruning-adolescence",
    title: "The Teenage Brain Is Being Quietly Demolished (On Purpose)",
    excerpt:
      "Placeholder article. Replace with a real piece on adolescent synaptic pruning and why losing connections can be a sign of a healthy, maturing brain.",
    content: `> Placeholder content. Replace this article through the writer dashboard once Supabase is connected.

Template text standing in for an article on synaptic pruning: the process by which the adolescent brain eliminates a large share of its synapses, refining circuits rather than just growing them.

## What the placeholder would cover

The role of microglia in pruning, longitudinal MRI evidence of grey matter decline through the teenage years, and why this decline correlates with, rather than undermines, cognitive maturation.

## Why it's here

This is filler copy so the layout, category tag, and reading-time estimate all render correctly before your first real article goes live.`,
    cover_image: null,
    category: "neuroplasticity",
    status: "published",
    author_id: "seed-author-1",
    author_name: "The Editors",
    read_minutes: 7,
    published_at: "2026-05-26T09:00:00.000Z",
    created_at: "2026-05-25T09:00:00.000Z",
    updated_at: "2026-05-25T09:00:00.000Z",
  },
  {
    id: "seed-3",
    slug: "predictive-coding-perception",
    title: "Your Brain Doesn't See the World — It Predicts It",
    excerpt:
      "Placeholder article. Replace with a real piece on predictive coding: the theory that perception is built from top-down expectation as much as bottom-up sensory input.",
    content: `> Placeholder content. Replace this article through the writer dashboard once Supabase is connected.

Standing in for a piece on predictive coding, the framework in which the brain constantly generates predictions about incoming sensory data and updates them only when reality produces an error signal.

## What the placeholder would cover

Optical illusions as prediction errors, the free-energy principle in plain language, and what predictive coding implies about conditions like autism and schizophrenia.

## Why it's here

Swap this text out with your own reporting and citations — the surrounding design won't need to change.`,
    cover_image: null,
    category: "perception",
    status: "published",
    author_id: "seed-author-1",
    author_name: "The Editors",
    read_minutes: 8,
    published_at: "2026-05-19T09:00:00.000Z",
    created_at: "2026-05-18T09:00:00.000Z",
    updated_at: "2026-05-18T09:00:00.000Z",
  },
  {
    id: "seed-4",
    slug: "amygdala-fear-extinction",
    title: "Fear Doesn't Disappear. It Gets Overwritten.",
    excerpt:
      "Placeholder article. Replace with a real piece on fear extinction — how new, safe associations compete with old fearful ones rather than erasing them.",
    content: `> Placeholder content. Replace this article through the writer dashboard once Supabase is connected.

Standing in for an article on fear extinction learning: why exposure therapy works by building a new inhibitory memory in the prefrontal cortex, rather than deleting the amygdala's original fear association.

## What the placeholder would cover

The classic conditioning-extinction-renewal paradigm, why fear can return under stress, and what this means for how exposure-based therapies should be structured.

## Why it's here

This is intentionally short placeholder text so you can review layout and pacing before committing to a full draft.`,
    cover_image: null,
    category: "emotion",
    status: "published",
    author_id: "seed-author-1",
    author_name: "The Editors",
    read_minutes: 5,
    published_at: "2026-05-12T09:00:00.000Z",
    created_at: "2026-05-11T09:00:00.000Z",
    updated_at: "2026-05-11T09:00:00.000Z",
  },
  {
    id: "seed-5",
    slug: "working-memory-capacity-limits",
    title: "Why You Can Only Hold About Four Things in Mind",
    excerpt:
      "Placeholder article. Replace with a real piece on working memory capacity and the neural bottleneck behind the 'magic number four.'",
    content: `> Placeholder content. Replace this article through the writer dashboard once Supabase is connected.

Standing in for a piece on working memory capacity: the well-replicated finding that most people can hold roughly three to four discrete items in active working memory at once.

## What the placeholder would cover

Prefrontal-parietal network activity during memory maintenance, why capacity varies across individuals, and how it's measured.

## Why it's here

Template copy only — write and publish your own article from the writer dashboard to replace it.`,
    cover_image: null,
    category: "memory",
    status: "published",
    author_id: "seed-author-1",
    author_name: "The Editors",
    read_minutes: 6,
    published_at: "2026-05-05T09:00:00.000Z",
    created_at: "2026-05-04T09:00:00.000Z",
    updated_at: "2026-05-04T09:00:00.000Z",
  },
  {
    id: "seed-6",
    slug: "gut-brain-axis-mood",
    title: "The Nerve Running From Your Gut to Your Mood",
    excerpt:
      "Placeholder article. Replace with a real piece on the vagus nerve, gut microbiota, and the evidence (and hype) around the gut-brain axis.",
    content: `> Placeholder content. Replace this article through the writer dashboard once Supabase is connected.

Standing in for an article on the gut-brain axis: how vagal afferents, microbial metabolites, and immune signaling connect digestive health to mood and cognition.

## What the placeholder would cover

What's well-supported by controlled studies versus what remains correlational, and a clear-eyed look at probiotic marketing claims against the actual evidence.

## Why it's here

Placeholder only — this is where a fact-checked, cited article would go.`,
    cover_image: null,
    category: "clinical",
    status: "published",
    author_id: "seed-author-1",
    author_name: "The Editors",
    read_minutes: 7,
    published_at: "2026-04-28T09:00:00.000Z",
    created_at: "2026-04-27T09:00:00.000Z",
    updated_at: "2026-04-27T09:00:00.000Z",
  },
];
