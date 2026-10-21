"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth";

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
