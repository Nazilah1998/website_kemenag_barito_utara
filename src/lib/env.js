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

const r2KeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? "";
const r2SecretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "";
const r2Endpoint = process.env.CLOUDFLARE_R2_ENDPOINT ?? "";
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY ?? "";

if (!r2KeyId || !r2SecretKey || !r2Endpoint) {
  console.warn("[env] Cloudflare R2 credentials belum lengkap. Upload file tidak akan berfungsi.");
}

if (!turnstileSecret) {
  console.warn("[env] TURNSTILE_SECRET_KEY belum diatur. Verifikasi keamanan login tidak akan berfungsi.");
}

if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY && !process.env.MISTRAL_API_KEY && !process.env.OPENROUTER_API_KEY) {
  console.warn("[env] Tidak ada AI API key yang dikonfigurasi. Chat AI tidak akan berfungsi.");
}

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  supabaseUrl,
  supabasePublishableKey,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  turnstileSiteKey: readEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", ""),
  turnstileSecretKey: turnstileSecret,
  r2: {
    accessKeyId: r2KeyId,
    secretAccessKey: r2SecretKey,
    endpoint: r2Endpoint,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME ?? "",
  },
};

export function assertServiceRoleKey() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diatur. File ini dibutuhkan untuk operasi server/admin.",
    );
  }

  return env.supabaseServiceRoleKey;
}
