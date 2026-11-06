"use client";

import { useState, type FormEvent } from "react";
import OmiBadge from "@/components/OmiBadge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Identifiants incorrects. Vérifiez votre email et votre mot de passe.");
      return;
    }
    router.push("/brains");
    router.refresh();
  }

  return (
    <main className="auth-page auth-page--login">
      <div className="auth-page__layout">
        <aside className="auth-page__aside" aria-label="Présentation d'Omi">
          <div className="auth-page__aside-mark">OMI <span>MEMORY SYSTEM</span></div>
          <div className="auth-page__art" aria-hidden="true">
            <span className="auth-page__art-orbit" />
            <span className="auth-page__art-core" />
            <span className="auth-page__art-node auth-page__art-node--one" />
            <span className="auth-page__art-node auth-page__art-node--two" />
            <span className="auth-page__art-node auth-page__art-node--three" />
            <span className="auth-page__art-node auth-page__art-node--four" />
          </div>
          <div className="auth-page__aside-copy">
            <p className="auth-page__eyebrow">SAVOIR-FAIRE · CONTINUITÉ</p>
            <h2>Le travail continue.<br />La connaissance reste.</h2>
            <p>Retrouvez le contexte et les méthodes de votre équipe, prêts à être repris.</p>
          </div>
        </aside>
        <section className="auth-page__content">
          <div className="mb-6 text-center">
          <Link href="/" className="auth-page__brand inline-flex items-center gap-2 font-semibold text-text-strong">
            <OmiBadge />
            Onboarding Mentor Intelligence
          </Link>
        </div>
        <div className="auth-page__card">
          <h1 className="text-base leading-relaxed text-text-strong">Connexion</h1>
          <p className="mt-1 text-sm text-muted">
            Accédez à vos Brains et à l&apos;agent Omi.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm text-foreground">
              Adresse email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 w-full rounded-md border border-line bg-background p-2.5 text-text-strong outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm text-foreground">
              Mot de passe
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1 w-full rounded-md border border-line bg-background p-2.5 text-text-strong outline-none focus:border-accent"
              />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-accent p-2.5 font-medium text-white hover:bg-accent-bright disabled:opacity-50"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-accent hover:text-accent-bright">
              Créer un compte
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Retour au site</Link>
        </p>
        </section>
      </div>
    </main>
  );
}
