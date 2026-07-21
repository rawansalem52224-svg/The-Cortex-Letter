import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getCurrentProfile } from "@/lib/profile";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "writer" && profile.role !== "admin")) {
    redirect("/write-for-us");
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="eyebrow">Writer dashboard</p>
          <p className="font-display mt-1 text-2xl font-semibold text-ink">{profile.full_name}</p>
        </div>
        {profile.role === "admin" && (
          <Link href="/admin" className="font-data text-sm text-accent-strong hover:underline">
            Admin dashboard &rarr;
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
