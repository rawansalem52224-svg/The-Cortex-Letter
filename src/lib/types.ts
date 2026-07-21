import type { CategorySlug } from "@/lib/categories";

export type Role = "reader" | "writer" | "admin";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export type PostStatus = "draft" | "published";

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: CategorySlug;
  status: PostStatus;
  author_id: string;
  author_name: string;
  read_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WriterApplication = {
  id: string;
  applicant_id: string | null;
  full_name: string;
  email: string;
  background: string;
  pitch: string;
  sample_link: string | null;
  status: ApplicationStatus;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  created_at: string;
};

export type ReactionType = "like" | "favorite";

export type PostReaction = {
  id: string;
  post_id: string;
  user_id: string;
  type: ReactionType;
  created_at: string;
};

export type ReactionSummary = {
  likeCount: number;
  isLiked: boolean;
  isFavorited: boolean;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

export type PodcastEpisode = {
  id: string;
  slug: string;
  title: string;
  description: string;
  guest_name: string;
  guest_role: string;
  guest_bio: string | null;
  cover_image: string | null;
  audio_embed_url: string | null;
  spotify_url: string | null;
  apple_url: string | null;
  youtube_url: string | null;
  episode_number: number | null;
  duration_minutes: number | null;
  status: PostStatus;
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
