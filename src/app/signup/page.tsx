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
    if (data.session) {
      router.push("/brains");
      router.refresh();
    } else {
      setNeedsConfirmation(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-text-strong">
            <OmiBadge />
            Onboarding Mentor Intelligence
          </Link>
        </div>
        <div className="rounded-none border border-2 border-line bg-paper-raised shadow-[6px_6px_0_0_var(--line)] p-8">
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
                  className="mt-1 w-full rounded-md border border-line bg-background p-2.5 text-text-strong outline-none focus:border-accent"
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
                  className="mt-1 w-full rounded-md border border-line bg-background p-2.5 text-text-strong outline-none focus:border-accent"
                />
              </label>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-accent p-2.5 font-medium text-white hover:bg-accent-bright disabled:opacity-50"
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
      </div>
    </div>
  );
}
