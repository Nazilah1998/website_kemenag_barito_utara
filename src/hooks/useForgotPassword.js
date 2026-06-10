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
  const [otp, setOtp] = useState("");
  const [turnstileToken, setTurnstileToken] = useState(null);

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
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.message);

      setSuccess("Kode OTP telah dikirim ke email Anda.");
      setStep(4); // Show OTP Input state
    } catch (err) {
      setError(err?.message || "Gagal mengirim permintaan pemulihan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e) {
    if (e) e.preventDefault();

    if (!otp || otp.length < 6) {
      setError("Masukkan 6 digit kode OTP.");
      return;
    }

    // Untuk custom OTP bypass, kita memindahkan validasi OTP bersamaan 
    // dengan submit password baru agar lebih cepat dan ringkas.
    setSuccess("Format OTP diterima. Silakan buat sandi baru.");
    setStep(2);
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
      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp,
          password: password,
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui password.");
      }

      setSuccess("Sandi berhasil diubah! Mengarahkan ke halaman login...");
      setStep(3);
      
      const supabase = createClient();
      await new Promise(resolve => setTimeout(resolve, 800));
      await supabase.auth.signOut();
      
      window.location.href = "/login";
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
    handleVerifyOtp,
    handleResetPassword,
    strength, // Ekspos data kekuatan password
    turnstileToken, setTurnstileToken,
    otp, setOtp
  };
}
