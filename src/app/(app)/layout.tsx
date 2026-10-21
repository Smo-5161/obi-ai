import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "./actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b-2 border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="rounded-none border-2 border-ink bg-accent px-2 py-1 text-sm font-bold text-background shadow-[2px_2px_0_0_var(--ink)]">Obi</span>
            <span className="text-lg">Onboarding Intelligence</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted">
            <Link href="/recorder" className="hover:text-accent-bright">Recorder</Link>
            <Link href="/brains" className="hover:text-accent-bright">Brains</Link>
            <Link href="/analytics" className="hover:text-accent-bright">Analytics</Link>
            {user ? (
              <form action={signOutAction}>
                <button type="submit" className="text-muted hover:text-accent-bright">
                  {user.email} — Déconnexion
                </button>
              </form>
            ) : (
              <Link href="/login" className="rounded-none border-2 border-accent bg-accent px-3 py-1.5 text-background hover:bg-accent-bright">
                Connexion
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
