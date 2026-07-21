import Link from "next/link";
import { getCurrentProfile } from "@/lib/profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { SignalPulse } from "@/components/signal-pulse";

const NAV_LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/write-for-us", label: "Write for us" },
];

export async function Header() {
  const profile = await getCurrentProfile();

  const dashboardHref =
    profile?.role === "admin" ? "/admin" : profile?.role === "writer" ? "/dashboard" : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            The Cortex Letter
          </span>
          <span className="eyebrow hidden sm:inline">N&#176; 001</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-data text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {profile ? (
            <Link
              href={dashboardHref ?? "/account"}
              className="font-data text-sm text-muted transition-colors hover:text-ink"
            >
              {dashboardHref ? "Dashboard" : profile.full_name || "Account"}
            </Link>
          ) : (
            <Link href="/login" className="font-data text-sm text-muted transition-colors hover:text-ink">
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>

        <MobileNav
          links={NAV_LINKS}
          isSignedIn={Boolean(profile)}
          dashboardHref={dashboardHref}
        />
      </div>
      <SignalPulse />
    </header>
  );
}
