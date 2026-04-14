/** @type {import('next').NextConfig} */

const remotePatterns = [
  {
    protocol: "https",
    hostname: "drive.google.com",
  },
  {
    protocol: "https",
    hostname: "docs.google.com",
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl) {
  try {
    const supabaseHost = new URL(supabaseUrl).hostname;

    remotePatterns.push({
      protocol: "https",
      hostname: supabaseHost,
    });
  } catch {
    // abaikan jika env tidak valid
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
