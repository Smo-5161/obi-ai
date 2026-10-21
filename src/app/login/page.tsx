"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import ObiBrain from "@/components/ObiBrain";

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
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-text-strong">
            <span className="inline-flex"><ObiBrain size={26} /></span>
            Onboarding Intelligence
          </Link>
        </div>
        <div className="rounded-none border border-2 border-line bg-paper-raised shadow-[6px_6px_0_0_var(--line)] p-8">
          <h1 className="pixel-title text-base leading-relaxed text-text-strong">Connexion</h1>
          <p className="mt-1 text-sm text-muted">
            Accédez à vos Brains et à l&apos;agent Obi.
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
      </div>
    </div>
  );
}
