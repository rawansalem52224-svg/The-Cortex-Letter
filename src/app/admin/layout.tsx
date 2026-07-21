import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getCurrentProfile } from "@/lib/profile";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/posts", label: "All posts" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <p className="eyebrow">Admin</p>
      <h1 className="font-display mt-1 text-2xl font-semibold text-ink">Editorial dashboard</h1>

      <nav className="mt-8 flex gap-6 border-b border-border">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="font-data -mb-px border-b-2 border-transparent pb-3 text-sm text-muted hover:text-ink"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
