import { useState } from "react";
import { useGAEvent } from "@/hooks/useGAEvent";

const INITIAL = {
  nama: "",
  whatsapp: "",
  subjek: "Pertanyaan",
  pesan: "",
  website: "", // honeypot
};

export function useKontakForm() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState([]);
  const { trackContact, trackEvent } = useGAEvent();

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setFieldErrors([]);

    try {
      const res = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFieldErrors(data.errors || []);
        setResult({
          ok: false,
          message:
            data.message ||
            "Pesan gagal dikirim. Silakan coba lagi beberapa saat lagi.",
        });

        // ✅ GA4 event — form submit gagal
        trackEvent("form_error", {
          event_category: "kontak",
          form_name: "kontak_publik",
          error_message: data.message || "validation_error",
        });
        return;
      }

      setResult({
        ok: true,
        message:
          data.message ||
          "Pesan berhasil dikirim. Tim kami akan menindaklanjuti pada jam layanan.",
      });
      setForm(INITIAL);

      // ✅ GA4 event — kontak berhasil dikirim (konversi utama)
      trackContact(form.subjek);
    } catch {
      setResult({
        ok: false,
        message: "Terjadi kesalahan jaringan. Silakan coba kembali.",
      });

      // ✅ GA4 event — network error
      trackEvent("form_error", {
        event_category: "kontak",
        form_name: "kontak_publik",
        error_message: "network_error",
      });
    } finally {
      setLoading(false);
    }
  }

  function getFieldError(field) {
    if (!fieldErrors) return null;
    const match = fieldErrors.find((e) => e.field === field);
    return match ? match.message : null;
  }

  return {
    form,
    loading,
    result,
    fieldErrors,
    onChange,
    onSubmit,
    getFieldError,
  };
}
