function readEnv(key, fallback = undefined) {
  const value = process.env[key] ?? fallback;
  return value;
}

const supabaseUrl = readEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabasePublishableKey =
  readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
  readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!supabaseUrl) {
  throw new Error(
    "Environment variable NEXT_PUBLIC_SUPABASE_URL belum diatur.",
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    "Environment variable NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur.",
  );
}

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  supabaseUrl,
  supabasePublishableKey,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  recaptchaSiteKey: readEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", ""),
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY ?? "",
};

export function assertServiceRoleKey() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diatur. File ini dibutuhkan untuk operasi server/admin.",
    );
  }

  return env.supabaseServiceRoleKey;
}
