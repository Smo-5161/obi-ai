import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "./actions";
import ObiBrain from "@/components/ObiBrain";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="rounded-none border-2 border-accent bg-paper-raised px-1.5 py-1 shadow-[3px_3px_0_0_var(--accent)]"><ObiBrain size={20} /></span>
            <span className="text-lg">Onboarding Intelligence</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/recorder" className="hover:text-white">Recorder</Link>
            <Link href="/brains" className="hover:text-white">Brains</Link>
            <Link href="/analytics" className="hover:text-white">Analytics</Link>
            {user ? (
              <form action={signOutAction}>
                <button type="submit" className="text-slate-300 hover:text-white">
                  {user.email} — Déconnexion
                </button>
              </form>
            ) : (
              <Link href="/login" className="rounded bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500">
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
