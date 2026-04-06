"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

function normalizeCredentials(formData) {
  return {
    email: String(formData.get("email") || "").trim().toLowerCase(),
    password: String(formData.get("password") || "").trim(),
    fullName: String(formData.get("full_name") || "").trim(),
    next: String(formData.get("next") || "/admin").trim() || "/admin",
  };
}

export async function login(formData) {
  const supabase = await createClient();
  const { email, password, next } = normalizeCredentials(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signup(formData) {
  const supabase = await createClient();
  const { email, password, fullName, next } = normalizeCredentials(formData);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.siteUrl}/auth/confirm?next=${encodeURIComponent(next)}`,
      data: {
        full_name: fullName || null,
      },
    },
  });

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(
    "/error?message=" +
      encodeURIComponent(
        "Pendaftaran berhasil. Silakan cek email untuk aktivasi akun sebelum login."
      )
  );
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
