import { useState } from "react";

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
        return;
      }

      setResult({
        ok: true,
        message:
          data.message ||
          "Pesan berhasil dikirim. Tim kami akan menindaklanjuti pada jam layanan.",
      });
      setForm(INITIAL);
    } catch {
      setResult({
        ok: false,
        message: "Terjadi kesalahan jaringan. Silakan coba kembali.",
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
