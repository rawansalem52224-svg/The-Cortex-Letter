# The Cortex Letter

An independent neuroscience publication built with Next.js, Tailwind CSS, and Supabase —
including a full writer-application and publishing workflow: readers can apply to write,
admins approve them, and approved writers get a dashboard to draft and publish articles.

The site works out of the box with placeholder articles and no backend. Connecting Supabase
(free tier) unlocks accounts, writer applications, publishing, and the newsletter form.

## Running it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Supabase connected, you'll see
the site fully designed with placeholder articles, and a note wherever a feature needs
Supabase (sign in, applications, newsletter).

## Connecting Supabase (accounts, publishing, newsletter)

1. **Create a project.** Go to [supabase.com](https://supabase.com), sign up, and create a new
   project (the free tier is enough to run this site).
2. **Run the schema.** In your project's dashboard, open the **SQL Editor**, paste the contents
   of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `profiles`,
   `posts`, `writer_applications`, and `newsletter_subscribers` tables along with the security
   policies that keep drafts private and let readers only publish through the approved workflow.
3. **Copy your API keys.** In **Project Settings -> API**, copy the **Project URL** and the
   **anon public** key.
4. **Set your environment variables.** Copy `.env.local.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. **Restart the dev server** (`npm run dev`) so the new environment variables load.
6. **Create your account.** Go to `/signup` on the running site and sign up with your own email.
   By default, Supabase requires email confirmation — check your inbox, or turn confirmation off
   for local testing in **Authentication -> Providers -> Email** in the Supabase dashboard.
7. **Make yourself an admin.** Back in the SQL Editor, run:
   ```sql
   update public.profiles set role = 'admin' where id =
     (select id from auth.users where email = 'you@example.com');
   ```
   Refresh the site — you'll now see an **Admin** link, where you can review writer applications
   and manage every post.

## How the writer workflow works

- Anyone can create a reader account and apply from **Write for us**.
- Applications land in **Admin -> Applications**. Approving one flips that person's role to
  `writer` — no separate account creation step needed.
- Writers get a **Dashboard** to create, edit, publish, and unpublish their own posts. Admins can
  do the same for every post from **Admin -> All posts**.
- Posts are written in Markdown (headings, **bold**, *italics*, `>` blockquotes, links, lists).

## Managing the podcast

Podcast episodes are admin-only (not part of the writer application workflow) — you add them
from **Admin -> Podcast -> New episode**. Each episode has:

- Title, description (Markdown supported), guest name/role/bio
- An optional **audio embed URL** — for Spotify, open the episode, click **Share -> Embed
  episode**, and copy the `src="..."` URL from the generated code
- Optional direct links to Spotify, Apple Podcasts, and YouTube (shown as buttons even without an
  embed)
- Episode number and duration, shown as `Episode 3 · 42 min`

Like posts, episodes save as a draft first — publish when ready from the same edit screen or the
episode list.

## Replacing the placeholder articles

The six placeholder articles in [`src/lib/seed-data.ts`](src/lib/seed-data.ts) are shown until
Supabase is connected, purely so the site doesn't look empty out of the box. Once Supabase is
connected, real published posts take over automatically — the seed data is never shown again.
You're free to delete `seed-data.ts` entirely once you have real content.

## Design system

- **Type**: Fraunces (display headlines), IBM Plex Sans (body), IBM Plex Mono (labels, bylines,
  data).
- **Color**: an ink-navy / paper palette with a teal + violet accent pair, plus six
  categorical topic colors (`src/lib/categories.ts`).
- **Signature motif**: the "signal pulse" — a dot traveling along a line like an action
  potential, used once in the header on load and again as the reading-progress indicator on
  article pages (`src/components/signal-pulse.tsx`, `src/components/reading-progress.tsx`). The
  podcast section echoes this with a waveform bar motif (`src/components/waveform.tsx`) — sound
  wave as neural signal.

All design tokens live in [`src/app/globals.css`](src/app/globals.css) — change the CSS custom
properties there to retheme the whole site.

## Deploying

1. Push this project to a GitHub repository.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables in the Vercel project settings.
4. Deploy. Vercel builds and hosts the site on every push.

## Tech stack

Next.js 16 (App Router, Server Actions) · React 19 · Tailwind CSS v4 · Supabase (auth + Postgres)
· next-themes (dark mode) · react-markdown
