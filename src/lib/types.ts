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
