import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function mapLoginError(error) {
  const rawMessage = String(error?.message || "").toLowerCase();
  if (rawMessage.includes("invalid login credentials")) {
    return "Password salah / akun tidak ada, silahkan coba lagi.";
  }
  return error?.message || "Terjadi kesalahan saat login admin.";
}

export function useAdminLogin(initialUnauthorized) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(
    initialUnauthorized
      ? "Sesi Anda tidak valid atau tidak memiliki akses admin."
      : "",
  );

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("admin_remember_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (e) {
      // ignore local storage errors
    }
  }, []);

  const [turnstileToken, setTurnstileToken] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function checkSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (controller.signal.aborted) return;
        if (!sessionError && data?.session) {
          const res = await fetch("/api/admin/session", {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          });
          if (controller.signal.aborted) return;
          if (res.ok) {
            const payload = await res.json();
            if (
              payload?.ok &&
              (payload?.permissions?.isAdmin || payload?.permissions?.isEditor)
            ) {
              router.replace("/admin");
              return;
            }
          }
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
      } finally {
        if (!controller.signal.aborted) setLoadingSession(false);
      }
    }
    checkSession();
    return () => controller.abort();
  }, [router, supabase]);

  const handlePasswordKeyState = (event) =>
    setCapsLock(Boolean(event.getModifierState?.("CapsLock")));

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setError("");

    if (!turnstileToken) {
      setError("Silakan lakukan verifikasi keamanan terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password,
          turnstileToken 
        }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.ok) {
        setError(mapLoginError(payload));
        return;
      }

      try {
        if (rememberMe) {
          localStorage.setItem("admin_remember_email", email.trim().toLowerCase());
        } else {
          localStorage.removeItem("admin_remember_email");
        }
      } catch (e) {
        // ignore
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan jaringan saat login.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loadingSession,
    submitting,
    showPassword,
    setShowPassword,
    capsLock,
    error,
    setError,
    turnstileToken,
    setTurnstileToken,
    rememberMe,
    setRememberMe,
    handlePasswordKeyState,
    handleSubmit,
  };
}
