"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PasswordInput } from "./login/UpdatePasswordUI";
import { createClient } from "@/lib/supabase/client";
import { createPortal } from "react-dom";

export default function PasswordUpdateModal({ open, onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  if (!mounted) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (password.length < 8) return setError("Password baru minimal 8 karakter.");
    if (password !== confirmPassword) return setError("Konfirmasi password tidak sama.");

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) throw updateError;
      
      setSuccess("Password berhasil diperbarui.");
      setPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err?.message || "Gagal memperbarui password.");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={!loading ? onClose : undefined}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border-4 border-white bg-emerald-50 text-emerald-700 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800 dark:text-emerald-500 dark:shadow-none">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ubah Password</h3>
              <p className="mt-2 px-6 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                Pastikan password baru Anda kuat dan mudah diingat.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <PasswordInput
                  label="Password baru" value={password} placeholder="Minimal 8 karakter"
                  onChange={(e) => setPassword(e.target.value)} show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  showStrength={true}
                />
                <PasswordInput
                  label="Konfirmasi password" value={confirmPassword} placeholder="Ulangi password baru"
                  onChange={(e) => setConfirmPassword(e.target.value)} show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-400 overflow-hidden"
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400 overflow-hidden"
                    >
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row-reverse">
                  <motion.button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 text-[12px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-[12px] font-black uppercase tracking-widest text-slate-600 transition-all hover:border-slate-900 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-white dark:hover:text-white sm:w-auto"
                  >
                    Batal
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
