"use client";

import { useState, type FormEvent } from "react";
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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-slate-100">
            <span className="rounded bg-indigo-600 px-2 py-1 text-sm text-white">Obi</span>
            Onboarding Intelligence
          </Link>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-xl font-semibold text-slate-100">Connexion</h1>
          <p className="mt-1 text-sm text-slate-400">
            Accédez à vos Brains et à l&apos;agent Obi.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Adresse email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Mot de passe
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 p-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
              Créer un compte
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300">Retour au site</Link>
        </p>
      </div>
    </div>
  );
}
