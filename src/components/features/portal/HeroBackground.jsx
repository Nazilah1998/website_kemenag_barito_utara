import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden w-full h-full">
      <Image
        src="/assets/images/kantor-kemenag.jpg"
        alt="Kemenag Barito Utara"
        fill
        sizes="100vw"
        className="object-cover scale-105 blur-[1px] opacity-40 grayscale-[10%] transition-transform duration-1000"
        priority
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/75 to-emerald-950/70" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-blue-950/20 animate-gradient-shift" />
    </div>
  );
}
