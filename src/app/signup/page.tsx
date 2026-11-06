"use client";

import { useState, type FormEvent } from "react";
import OmiBadge from "@/components/OmiBadge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [poste, setPoste] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsConfirmation(false);
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "User already registered"
        ? "Un compte existe déjà avec cet email. Connectez-vous."
        : error.message);
      return;
    }
    if (data.session && poste.trim()) {
      // Créer ou rejoindre le Brain du poste
      await fetch("/api/brains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: poste.trim(), scope: "job", joinOrCreate: true }),
      });
      router.push("/brains");
      router.refresh();
    } else if (data.session) {
      router.push("/brains");
      router.refresh();
    } else {
      setNeedsConfirmation(true);
    }
  }

  return (
    <main className="auth-page auth-page--signup">
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
            <p>Préservez les méthodes et le contexte qui font avancer votre équipe.</p>
          </div>
        </aside>
        <section className="auth-page__content">
          <div className="mb-6 text-center">
          <Link href="/" className="auth-page__brand inline-flex items-center gap-2 font-semibold text-text-strong">
            <OmiBadge className="auth-page__badge" />
            Onboarding Mentor Intelligence
          </Link>
        </div>
        <div className="auth-page__card">
          <p className="auth-page__card-eyebrow">CRÉATION DE VOTRE ESPACE</p>
          <h1 className="text-base leading-relaxed text-text-strong">Créer un compte</h1>
          <p className="mt-1 text-sm text-muted">
            Commencez gratuitement. Aucune carte bancaire requise.
          </p>
          {needsConfirmation ? (
            <div className="mt-6 rounded-md border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-200">
              Compte créé. Un email de confirmation vous a été envoyé : cliquez sur le lien
              qu&apos;il contient pour activer votre accès, puis connectez-vous.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm text-foreground">
                Adresse email professionnelle
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  
                />
              </label>
              <label className="block text-sm text-foreground">
                Mot de passe (8 caractères minimum)
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  
                />
              </label>
              {error && <p className="text-sm text-red-400">{error}</p>}
                            <label className="block text-sm text-foreground">
                Votre poste
                <input
                  type="text"
                  required
                  value={poste}
                  onChange={(e) => setPoste(e.target.value)}
                  autoComplete="organization-title"
                  
                  placeholder="Ex: Assistant Marketing"
                />
              </label>
<button
                type="submit"
                disabled={loading}
                className="auth-page__submit"
              >
                {loading ? "Création…" : "Créer mon compte"}
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-xs text-muted">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/legal/cgu" className="underline hover:text-foreground">CGU</Link> et notre{" "}
            <Link href="/legal/privacy" className="underline hover:text-foreground">
              politique de confidentialité
            </Link>
            .
          </p>
          <p className="mt-4 text-center text-sm text-muted">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-accent hover:text-accent-bright">
              Se connecter
            </Link>
          </p>
        </div>
        </section>
      </div>
    </main>
  );
}
