import { useState } from "react";

export function useForgotPassword() {
  const [step, setStep] = useState(1); // 1: verify-email, 2: set-new-password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      setStep(2);
    } catch (err) {
      setError(err?.message || "Gagal memverifikasi email.");
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
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.message);

      setSuccess(data.message);
      setStep(3); // success step
    } catch (err) {
      setError(err?.message || "Gagal memperbarui password.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    step,
    setStep,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    submitting,
    error,
    success,
    handleVerifyEmail,
    handleResetPassword,
  };
}
