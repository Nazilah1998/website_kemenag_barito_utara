import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useForgotPassword() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1); // 1: request, 2: reset, 3: success, 4: email-sent
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Detect step from URL (e.g. after redirect from email)
  useEffect(() => {
    const s = searchParams.get("step");
    if (s === "2") {
      setStep(2);
    }
  }, [searchParams]);

  async function handleVerifyEmail(e) {
    if (e) e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-email",
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.message);

      setSuccess(data.message);
      setStep(4); // Show "Email Sent" state
    } catch (err) {
      setError(err?.message || "Gagal mengirim permintaan pemulihan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(e) {
    if (e) e.preventDefault();

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();
      
      // 1. Coba ambil sesi otomatis
      let { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // 2. Jika gagal, coba ambil manual dari URL (Hash Fragment)
      if (!session) {
        const hash = window.location.hash;
        if (hash && hash.includes("access_token=")) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          
          if (accessToken) {
            const { data, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });
            if (!setSessionError) session = data.session;
          }
        }
      }

      if (!session) {
        throw new Error("Sesi tidak terdeteksi. Silakan Refresh halaman ini satu kali (F5), lalu coba Simpan kembali.");
      }

      // Gunakan API Backend kita sendiri untuk bypass aturan MFA/AAL2 Supabase
      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password,
          accessToken: session.access_token
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memperbarui password.");
      }

      // Beri jeda sebentar sebelum logout
      await new Promise(resolve => setTimeout(resolve, 800));
      await supabase.auth.signOut();

      setSuccess("Password berhasil diperbarui.");
      setStep(3); // success step
    } catch (err) {
      setError(err?.message || "Gagal memperbarui password.");
    } finally {
      setSubmitting(false);
    }
  }

  // Fungsi untuk mengecek kekuatan password
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: "Lemah", color: "bg-rose-500" };
    if (score <= 4) return { score: 2, label: "Sedang", color: "bg-amber-500" };
    return { score: 3, label: "Sangat Kuat", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  return {
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    step, setStep,
    error, setError,
    success, setSuccess,
    submitting, setSubmitting,
    handleVerifyEmail,
    handleResetPassword,
    strength // Ekspos data kekuatan password
  };
}
