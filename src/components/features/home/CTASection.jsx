"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ctaData } from "@/data/cta";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function CTASection() {
  return (
    <motion.section
      className="mt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeInUp}
    >
      <div className="rounded-[28px] bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-700 px-6 py-10 text-white md:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">{ctaData.title}</h2>
            <p className="mt-3 text-base leading-8 text-white/85">
              {ctaData.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={ctaData.primaryButton.href}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-slate-100 block"
              >
                {ctaData.primaryButton.label}
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={ctaData.secondaryButton.href}
                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 block"
              >
                {ctaData.secondaryButton.label}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}