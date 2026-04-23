import { redirect } from "next/navigation";

export const metadata = {
  title: "PTSP - Redirecting to Official PTSP Website",
};

export default function PTSPPage() {
  redirect("https://ptsp-kemenag-baritoutara.vercel.app/");
}
