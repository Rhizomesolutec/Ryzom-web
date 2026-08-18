"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CHAPTERS = [
  {
    num: "I",
    title: "Insight",
    eyebrow: "The Seeds",
    color: "#2F80EC",
    lead: "Strong roots begin with thorough discovery.",
    body: "Before laying lines of code or designing logos, we dissect your market space. We gather the core insights that dictate which directions your strategy must branch — audience truth, technical reality, and brand opportunity in one map.",
  },
  {
    num: "II",
    title: "Innovation",
    eyebrow: "Sprouting",
    color: "#EB5757",
    lead: "Bridging engineering and creative execution.",
    body: "With insights as our soil, we write custom codebases and design interfaces. The digital solution sprouts with bespoke functionality and beautiful, fast execution — craft and systems moving as one.",
  },
  {
    num: "III",
    title: "Balance",
    eyebrow: "Branching",
    color: "#219652",
    lead: "Synthesizing marketing and strategic reach.",
    body: "A digital application needs exposure. We branch into SEO and performance marketing so the product is seen, used, and measured — a balanced ecosystem where code and growth reinforce each other.",
  },
  {
    num: "IV",
    title: "Impact",
    eyebrow: "Canopy",
    color: "#F2C94D",
    lead: "Achieving stable, long-term expansion.",
    body: "Through business strategy we secure continuous growth. Like a canopy capturing light, we optimize operations so every investment compounds into durable returns — not one-off spikes.",
  },
];

export default function AboutDetail() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <div className="relative w-full bg-black text-white select-none">
      {/* ═══ Opening manifesto viewport ═══ */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden border-b border-white/[0.06]"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(47,128,236,0.1) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(235,87,87,0.06) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        {/* Vertical rule */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent -translate-x-1/2 pointer-events-none" aria-hidden />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center will-change-transform"
        >
          <p className="text-[10px] font-cascadia uppercase tracking-[0.4em] text-white/35 mb-8 md:mb-10">
            Manifesto
          </p>
          <h1 className="font-bohuan uppercase text-[clamp(2rem,7vw,5.5rem)] tracking-[0.04em] md:tracking-[0.06em] leading-[1.02] mb-8 md:mb-10">
            Small changes
            <br />
            build{" "}
            <span className="text-brand-red">strength</span>
            <br />
            and{" "}
            <span className="text-brand-green">stability</span>
          </h1>
          <p className="font-cascadia text-xs md:text-sm text-white/40 leading-relaxed max-w-lg mx-auto mb-12">
            RYZOM grows brands the way living systems grow — from root insight to canopy impact.
          </p>
          <div className="flex flex-col items-center gap-2 text-white/25">
            <span className="text-[9px] font-cascadia uppercase tracking-[0.35em]">Scroll the essay</span>
            <span className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ═══ Opening statement — editorial column ═══ */}
      <section className="relative border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-cascadia text-[11px] uppercase tracking-[0.28em] text-brand-blue mb-8">
            Why we exist
          </p>
          <div className="space-y-6 font-cascadia text-sm md:text-base text-white/55 leading-[1.85]">
            <p>
              RYZOM stands for creative ideas that branch out and connect brands to people in
              powerful, organic ways. We do not ship isolated assets. We cultivate systems —
              identity, product, growth, story, and direction — so every move feeds the next.
            </p>
            <p>
              Every successful brand grows from strong roots: insight, innovation, balance, and
              impact. That sequence is not a slogan. It is how we design, build, and expand with
              clients who want durable presence — not temporary noise.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Essay chapters — full-width bands (no carousel) ═══ */}
      {CHAPTERS.map((ch, i) => {
        const reverse = i % 2 === 1;
        return (
          <section
            key={ch.num}
            className="relative border-b border-white/[0.06] overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-80"
              style={{
                background: reverse
                  ? `linear-gradient(105deg, transparent 40%, ${ch.color}0d 100%)`
                  : `linear-gradient(255deg, transparent 40%, ${ch.color}0d 100%)`,
              }}
              aria-hidden
            />

            <div
              className={`max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${
                reverse ? "lg:[direction:rtl]" : ""
              }`}
            >
              {/* Giant roman numeral */}
              <div className={`lg:col-span-4 lg:[direction:ltr] ${reverse ? "lg:text-right" : ""}`}>
                <span
                  className="block font-bohuan text-[clamp(5rem,14vw,9rem)] leading-none tracking-wider select-none"
                  style={{ color: `${ch.color}28` }}
                >
                  {ch.num}
                </span>
                <p
                  className="mt-2 text-[10px] font-cascadia uppercase tracking-[0.3em]"
                  style={{ color: ch.color }}
                >
                  {ch.eyebrow}
                </p>
              </div>

              {/* Essay body */}
              <div className="lg:col-span-8 lg:[direction:ltr]">
                <h2 className="font-bohuan uppercase text-3xl md:text-5xl tracking-wide md:tracking-wider text-white mb-6">
                  {ch.title}
                </h2>
                <p className="font-cascadia text-base md:text-lg text-white/80 leading-relaxed mb-6 max-w-xl italic">
                  {ch.lead}
                </p>
                <p className="font-cascadia text-xs md:text-sm text-white/40 leading-[1.9] max-w-xl">
                  {ch.body}
                </p>
                <div
                  className="mt-10 h-px w-24"
                  style={{ backgroundColor: `${ch.color}66` }}
                  aria-hidden
                />
              </div>
            </div>
          </section>
        );
      })}

      {/* ═══ Root system — static process line (not a tab UI) ═══ */}
      <section className="relative border-b border-white/[0.06] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-cascadia uppercase tracking-[0.28em] text-brand-blue mb-4 text-center">
            The root system
          </p>
          <h2 className="font-bohuan uppercase text-2xl md:text-4xl tracking-wide text-center mb-14 md:mb-20">
            How growth compounds
          </h2>

          <div className="relative">
            {/* Continuous line */}
            <div className="hidden md:block absolute top-5 left-[8%] right-[8%] h-px bg-white/10" aria-hidden />

            <ol className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {CHAPTERS.map((ch, i) => (
                <li key={ch.num} className="relative flex flex-col items-center text-center px-2">
                  <span
                    className="relative z-10 w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center font-cascadia text-[10px] mb-5"
                    style={{ borderColor: ch.color, color: ch.color }}
                  >
                    0{i + 1}
                  </span>
                  <span className="font-bohuan uppercase tracking-wider text-sm text-white mb-2">
                    {ch.title}
                  </span>
                  <span className="font-cascadia text-[10px] text-white/35 leading-relaxed max-w-[11rem]">
                    {ch.eyebrow}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ═══ Closing vow ═══ */}
      <section className="relative min-h-[70svh] flex items-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(33,150,82,0.08) 0%, transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-24 text-center">
          <p className="font-cascadia text-[10px] uppercase tracking-[0.35em] text-white/30 mb-8">
            Our vow
          </p>
          <h2 className="font-bohuan uppercase text-[clamp(1.6rem,4.5vw,3.25rem)] tracking-wide leading-[1.1] mb-8">
            Grow with intention.
            <br />
            <span className="text-white/40">Connect every branch.</span>
          </h2>
          <p className="font-cascadia text-xs md:text-sm text-white/40 leading-relaxed max-w-md mx-auto mb-12">
            Whether you need identity, product, growth, or direction — we connect the system so
            every investment compounds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black text-[10px] sm:text-[11px] font-cascadia uppercase tracking-[0.2em] hover:bg-white/90 transition-colors"
            >
              Begin the conversation <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/15 text-[10px] sm:text-[11px] font-cascadia uppercase tracking-[0.2em] text-white/45 hover:text-white hover:border-white/30 transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
