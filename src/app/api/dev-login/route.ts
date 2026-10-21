import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth";

export async function POST() {
  const email = process.env.DEV_ADMIN_EMAIL;
  const password = process.env.DEV_ADMIN_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Accès admin non configuré (DEV_ADMIN_EMAIL/DEV_ADMIN_PASSWORD absents)" },
      { status: 404 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json(
      { error: "Connexion admin impossible : " + error.message },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
