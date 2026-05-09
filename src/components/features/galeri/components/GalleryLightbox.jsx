import Image from "next/image";

export function GalleryLightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/92 backdrop-blur-md" onClick={onClose}>
      <div className="relative flex min-h-screen items-center justify-center p-3 sm:p-6">
        <div className="relative flex h-[94vh] w-full max-w-7xl items-center justify-center" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
          <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:left-6 sm:top-6">
            {index + 1} / {total}
          </div>

          <div className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6">
            <LightboxButton onClick={onClose} label="Tutup">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </LightboxButton>
          </div>

          {total > 1 && (
            <>
              {/* Tombol navigasi samping (Desktop) */}
              <div className="hidden sm:block absolute left-6 top-1/2 z-20 -translate-y-1/2">
                <LightboxButton onClick={onPrev} label="Sebelumnya">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </LightboxButton>
              </div>
              <div className="hidden sm:block absolute right-6 top-1/2 z-20 -translate-y-1/2">
                <LightboxButton onClick={onNext} label="Berikutnya">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </LightboxButton>
              </div>

              {/* Tombol navigasi bawah (Mobile) */}
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-6 sm:hidden">
                <LightboxButton onClick={onPrev} label="Sebelumnya">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </LightboxButton>
                <LightboxButton onClick={onNext} label="Berikutnya">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </LightboxButton>
              </div>
            </>
          )}

          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={item.imageUrl}
              alt="Preview"
              fill
              priority
              className="object-contain shadow-2xl transition-all duration-300"
              sizes="100vw"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LightboxButton({ onClick, label, children }) {
  return (
    <button
      type="button" onClick={onClick} aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-md transition hover:bg-white/20"
    >
      {children}
    </button>
  );
}
