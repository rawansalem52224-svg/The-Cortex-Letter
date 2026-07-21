const PLATFORMS = [
  { key: "spotify_url", label: "Spotify" },
  { key: "apple_url", label: "Apple Podcasts" },
  { key: "youtube_url", label: "YouTube" },
] as const;

export function ListenLinks({
  spotifyUrl,
  appleUrl,
  youtubeUrl,
}: {
  spotifyUrl: string | null;
  appleUrl: string | null;
  youtubeUrl: string | null;
}) {
  const links: Record<string, string | null> = {
    spotify_url: spotifyUrl,
    apple_url: appleUrl,
    youtube_url: youtubeUrl,
  };

  const available = PLATFORMS.filter((p) => links[p.key]);
  if (available.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {available.map((p) => (
        <a
          key={p.key}
          href={links[p.key]!}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border-strong px-5 py-2.5 font-data text-sm text-ink transition-colors hover:border-accent"
        >
          Listen on {p.label}
        </a>
      ))}
    </div>
  );
}
