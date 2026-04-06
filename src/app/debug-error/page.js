import { notFound } from "next/navigation";

export default function DebugErrorPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  throw new Error("Simulasi error saat render halaman");
}