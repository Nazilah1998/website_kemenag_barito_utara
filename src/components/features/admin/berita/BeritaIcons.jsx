import React from "react";

export function IconCheckCircle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 12.75 11.25 15 15.5 9.75" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function IconAlertCircle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function IconTrashWarning() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4.8a.8.8 0 0 1 .8-.8h4.4a.8.8 0 0 1 .8.8V7" />
      <path d="M7 7v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
      <path d="M12 9.2v.1" />
    </svg>
  );
}

export function IconNewsStat() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 7.5h8" />
      <path d="M6 11.5h8" />
      <path d="M6 15.5h5" />
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M15 4v16" />
    </svg>
  );
}

export function IconPublishedStat() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m8.5 12.5 2.2 2.2 4.8-5.4" />
      <path d="M12 3.5 5.5 6v5.7c0 4.2 2.6 7.8 6.5 8.8 3.9-1 6.5-4.6 6.5-8.8V6L12 3.5Z" />
    </svg>
  );
}

export function IconDraftStat() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 4.5h8l3 3V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" />
      <path d="M15 4.5V8h3" />
      <path d="M9 12h6" />
      <path d="M9 15h4" />
    </svg>
  );
}

export function IconViewsStat() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconPencil() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m4 20 4.1-.8L18 9.3 14.7 6 4.8 15.9 4 20Z" />
      <path d="m12.9 7.8 3.3 3.3" />
    </svg>
  );
}

export function IconTrash() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4.8a.8.8 0 0 1 .8-.8h4.4a.8.8 0 0 1 .8.8V7" />
      <path d="M7 7v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

export function IconGallery() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.3" fill="currentColor" />
      <path d="m6.5 17 3.5-3.5 2.7 2.7 2-2 2.8 2.8" />
    </svg>
  );
}

export function IconPlus() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconBold() {
  return <span className="text-sm font-black">B</span>;
}

export function IconItalic() {
  return <span className="text-sm font-semibold italic">I</span>;
}

export function IconUnderline() {
  return <span className="text-sm font-semibold underline">U</span>;
}

export function IconH2() {
  return <span className="text-[10px] font-bold">H2</span>;
}

export function IconH3() {
  return <span className="text-[10px] font-bold">H3</span>;
}

export function IconAlignLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h14" />
      <path d="M4 10h10" />
      <path d="M4 14h14" />
      <path d="M4 18h10" />
    </svg>
  );
}

export function IconAlignCenter() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 6h14" />
      <path d="M7 10h10" />
      <path d="M5 14h14" />
      <path d="M7 18h10" />
    </svg>
  );
}

export function IconAlignRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6h14" />
      <path d="M10 10h10" />
      <path d="M6 14h14" />
      <path d="M10 18h10" />
    </svg>
  );
}

export function IconJustify() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16" />
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function IconQuote() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M9.2 6C6.7 6.8 5 9 5 11.6V18h6v-6H8.1c.1-1.6 1.2-3 2.9-3.6L9.2 6Zm9 0C15.7 6.8 14 9 14 11.6V18h6v-6h-2.9c.1-1.6 1.2-3 2.9-3.6L18.2 6Z" />
    </svg>
  );
}

export function IconBullet() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="5" cy="7" r="1.5" fill="currentColor" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="5" cy="17" r="1.5" fill="currentColor" />
      <path d="M9 7h10" />
      <path d="M9 12h10" />
      <path d="M9 17h10" />
    </svg>
  );
}

export function IconNumber() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h1.5V4.5" />
      <path d="M4 4.5h2v5" />
      <path d="M4 14.5c0-1.1.9-2 2-2s2 .9 2 2c0 .7-.4 1.3-1 1.7L4 19.5h4" />
      <path d="M10 7h10" />
      <path d="M10 12h10" />
      <path d="M10 17h10" />
    </svg>
  );
}

export function IconLink() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
      <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" />
    </svg>
  );
}

export function IconClear() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 20h16" />
      <path d="M8 4h8l2 2-8 8-4-4 2-6Z" />
      <path d="M13 13l5 5" />
    </svg>
  );
}

export function IconImage() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
