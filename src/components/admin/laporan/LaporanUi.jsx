"use client";

export function Button({
    children,
    tone = "primary",
    className = "",
    loading = false,
    loadingText = "Memproses…",
    ...props
}) {
    const tones = {
        primary: "bg-emerald-700 text-white hover:bg-emerald-800",
        ghost: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        danger: "bg-rose-600 text-white hover:bg-rose-700",
        soft:
            "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    };

    const label =
        typeof children === "string"
            ? loading
                ? loadingText
                : children
            : undefined;

    return (
        <button
            {...props}
            disabled={props.disabled || loading}
            aria-disabled={props.disabled || loading}
            aria-busy={loading}
            aria-label={props["aria-label"] || label}
            className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone] || tones.primary} ${className}`.trim()}
        >
            {loading ? (
                <span className="inline-flex items-center gap-2">
                    <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                        aria-hidden="true"
                    />
                    <span role="status">{loadingText}</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
}

export function Input({ label, hint, error, inputId, ...props }) {
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
        <label className="block space-y-2" htmlFor={inputId}>
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <input
                {...props}
                id={inputId}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${error
                    ? "border-rose-300 bg-rose-50"
                    : "border-slate-200 bg-white"
                    } ${props.className || ""}`.trim()}
            />
            {hint ? (
                <span id={hintId} className="block text-xs text-slate-500">
                    {hint}
                </span>
            ) : null}
            {error ? (
                <span id={errorId} className="block text-xs font-medium text-rose-700">
                    {error}
                </span>
            ) : null}
        </label>
    );
}

export function Textarea({ label, hint, error, inputId, ...props }) {
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
        <label className="block space-y-2" htmlFor={inputId}>
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <textarea
                {...props}
                id={inputId}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={`min-h-24 w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${error
                    ? "border-rose-300 bg-rose-50"
                    : "border-slate-200 bg-white"
                    } ${props.className || ""}`.trim()}
            />
            {hint ? (
                <span id={hintId} className="block text-xs text-slate-500">
                    {hint}
                </span>
            ) : null}
            {error ? (
                <span id={errorId} className="block text-xs font-medium text-rose-700">
                    {error}
                </span>
            ) : null}
        </label>
    );
}

export function Feedback({ type, message }) {
    if (!message) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`rounded-2xl px-4 py-3 text-sm ${type === "error"
                ? "border border-rose-200 bg-rose-50 text-rose-700"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
        >
            {message}
        </div>
    );
}