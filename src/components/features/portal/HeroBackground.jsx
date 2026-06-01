import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/assets/images/kantor-kemenag.jpg"
        alt="Kantor Kemenag Barito Utara"
        fill
        sizes="100vw"
        className="object-cover scale-105 blur-[2px] opacity-40 grayscale-[20%] transition-transform duration-1000"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-emerald-950/75" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-blue-950/20 animate-gradient-shift" />
    </div>
  );
}
