// src/components/admin/laporan/LaporanUi.jsx
"use client";

export function Button({
    children,
    tone = "primary",
    size = "md",
    className = "",
    loading = false,
    loadingText = "Memproses…",
    ...props
}) {
    const tones = {
        primary: "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700",
        ghost: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
        danger: "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800",
        soft: "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900",
        warn: "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
    };

    return (
        <button
            {...props}
            disabled={props.disabled || loading}
            aria-disabled={props.disabled || loading}
            aria-busy={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone] || tones.primary} ${sizes[size] || sizes.md} ${className}`.trim()}
        >
            {loading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                    <span role="status">{loadingText}</span>
                </>
            ) : children}
        </button>
    );
}

export function Input({ label, hint, error, inputId, required, ...props }) {
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
        <label className="block space-y-1.5" htmlFor={inputId}>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {label}
                {required && <span className="ml-1 text-rose-500">*</span>}
            </span>
            <input
                {...props}
                id={inputId}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900 ${error
                    ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
                    : "border-slate-200 bg-white dark:border-slate-700"
                    } ${props.className || ""}`.trim()}
            />
            {hint && !error ? (
                <span id={hintId} className="block text-xs text-slate-500 dark:text-slate-400">
                    {hint}
                </span>
            ) : null}
            {error ? (
                <span id={errorId} className="block text-xs font-medium text-rose-600 dark:text-rose-400">
                    {error}
                </span>
            ) : null}
        </label>
    );
}

export function Textarea({ label, hint, error, inputId, required, ...props }) {
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
        <label className="block space-y-1.5" htmlFor={inputId}>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {label}
                {required && <span className="ml-1 text-rose-500">*</span>}
            </span>
            <textarea
                {...props}
                id={inputId}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={`min-h-24 w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900 ${error
                    ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
                    : "border-slate-200 bg-white dark:border-slate-700"
                    } ${props.className || ""}`.trim()}
            />
            {hint && !error ? (
                <span id={hintId} className="block text-xs text-slate-500 dark:text-slate-400">
                    {hint}
                </span>
            ) : null}
            {error ? (
                <span id={errorId} className="block text-xs font-medium text-rose-600 dark:text-rose-400">
                    {error}
                </span>
            ) : null}
        </label>
    );
}

export function Feedback({ type, message }) {
    if (!message) return null;

    const styles =
        type === "error"
            ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400"
            : "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400";

    const icon = type === "error" ? "✕" : "✓";

    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${styles}`}
        >
            <span aria-hidden="true" className="mt-0.5 shrink-0">{icon}</span>
            <span>{message}</span>
        </div>
    );
}

export function Badge({ children, tone = "default" }) {
    const tones = {
        default: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        warn: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
    };

    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone] || tones.default}`}>
            {children}
        </span>
    );
}

export function ConfirmDialog({ message, onConfirm, onCancel, loading = false }) {
    return (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950">
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">{message}</p>
            <div className="mt-3 flex gap-2">
                <Button
                    tone="danger"
                    size="sm"
                    onClick={onConfirm}
                    loading={loading}
                    loadingText="Menghapus…"
                >
                    Ya, Hapus
                </Button>
                <Button tone="ghost" size="sm" onClick={onCancel} disabled={loading}>
                    Batal
                </Button>
            </div>
        </div>
    );
}