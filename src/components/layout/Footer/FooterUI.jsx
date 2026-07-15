import React from "react";
import Link from "next/link";

export function FooterLink({ href, children }) {
  return (
    <Link href={href} className="theme-footer-link text-sm font-semibold transition hover:translate-x-0.5">
      {children}
    </Link>
  );
}

export function FooterInfoItem({ label, value, href, icon: Icon }) {
  const renderValue = Array.isArray(value) ? (
    <div className="mt-1 space-y-1">
      {value.map((item, index) => (
        <p key={`${label}-${index}`} className="theme-footer-muted text-sm leading-6">{item}</p>
      ))}
    </div>
  ) : (
    <p className="theme-footer-muted mt-1 text-sm leading-6">{value}</p>
  );

  const content = (
    <>
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-4 w-4" style={{ color: "var(--footer-fg)" }} />}
        <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--footer-fg)" }}>{label}</p>
      </div>
      {renderValue}
    </>
  );

  if (href) return <a href={href} className="block transition hover:opacity-90">{content}</a>;
  return <div>{content}</div>;
}

export function SocialIconLink({ label, href, icon: Icon }) {
  return (
    <a
      href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}
      className="theme-footer-panel inline-flex h-10 w-10 items-center justify-center rounded-full text-(--footer-muted) transition hover:-translate-y-0.5 hover:text-(--primary-strong)"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
