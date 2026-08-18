"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Layers,
  TrendingUp,
  Link2,
  Maximize,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

interface Stage {
  id: string;
  label: string;
  icon: typeof Layers;
  color: string;
  title: string;
  description: string;
  extended: string;
  proof: string;
}

const STAGES: Stage[] = [
  {
    id: "root",
    label: "Root",
    icon: Layers,
    color: "#6B7280",
    title: "Deep Foundations",
    description:
      "Every strategy is built on strong roots: research, tech audits, and market insights.",
    extended:
      "We analyze target user behaviors, legacy technical debt, and branding opportunities to plant a stable root system that can support extreme growth.",
    proof: "Discovery sprints · Tech audits · Market maps",
  },
  {
    id: "growth",
    label: "Growth",
    icon: TrendingUp,
    color: "#2F80EC",
    title: "Bespoke Engineering",
    description:
      "Small code refinements and design patterns build scalable digital products.",
    extended:
      "Using Next.js, Framer Motion, and lightweight architectures, we build technical frameworks that render instantly and animate smoothly at 60fps.",
    proof: "Product builds · Design systems · Performance",
  },
  {
    id: "connection",
    label: "Connection",
    icon: Link2,
    color: "#EB5757",
    title: "Ecosystem Synthesis",
    description:
      "We connect high-fidelity design to performant code and marketing workflows.",
    extended:
      "Our designers and developers work in lockstep. Brand assets integrate seamlessly into layouts, ensuring a unified user experience at every digital touchpoint.",
    proof: "Brand × product · Unified UX · Shared language",
  },
  {
    id: "expansion",
    label: "Expansion",
    icon: Maximize,
    color: "#219652",
    title: "Market Amplification",
    description:
      "Through advanced SEO, content generation, and strategy, we expand your brand.",
    extended:
      "Once launched, we trigger performance channels. Your system spreads its branches, generating leads and capturing visual presence across search engines and platforms.",
    proof: "Campaigns · SEO · Distribution loops",
  },
  {
    id: "success",
    label: "Success",
    icon: CheckCircle,
    color: "#F2C94D",
    title: "Balanced Maturity",
    description:
      "Your business model thrives under a secure, high-yield, stable canopy.",
    extended:
      "The final result is a robust digital ecosystem. By implementing continuous telemetry and optimization updates, your operations remain balanced and profitable.",
    proof: "Telemetry · Optimization · Compounding returns",
  },
];

const N = STAGES.length;

export default function WhyRyzomDetail() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];
  const Icon = stage.icon;

  // Auto-advance every 3 seconds (resets after manual click)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % N);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active]);

  // Dial geometry — labels sit on a ring around the center
  const ring = useMemo(() => {
    const radius = 42; // % of dial box
    return STAGES.map((s, i) => {
      // Start at top (-90deg math), sweep clockwise
      const angle = -90 + (i / N) * 360;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + radius * Math.cos(rad);
      const y = 50 + radius * Math.sin(rad);
      return { ...s, i, x, y, angle };
    });
  }, []);

  const wedge = 360 / N;
  // CSS conic 0deg = top; stage i sits at i * wedge — light must match that seat
  const lightFrom = active * wedge - wedge / 2;
  const activeNode = ring[active];

  return (
    <div className="relative w-full min-h-screen bg-black text-white select-none overflow-hidden">
      {/* Ambient tied to active stage */}
      <div
        className="pointer-events-none fixed inset-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${stage.color}18 0%, transparent 45%)`,
        }}
        aria-hidden
      />

      {/* Header */}
      <header className="relative z-20 pt-10 md:pt-14 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <p className="text-[10px] font-cascadia uppercase tracking-[0.35em] text-brand-blue mb-3">
          Why RYZOM
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="font-bohuan uppercase text-[clamp(1.85rem,5vw,3.75rem)] tracking-wide md:tracking-wider leading-[1.05]">
            Growth
            <br />
            <span className="text-white/35">Methodology</span>
          </h1>
          <p className="font-cascadia text-[11px] sm:text-xs text-white/40 max-w-sm leading-relaxed">
            Turn the dial. Five stages. One living system — from root foundations to
            canopy success.
          </p>
        </div>
      </header>

      {/* ═══ Dial theater ═══ */}
      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-14">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-8 items-center min-h-[70vh]">
          {/* Dial */}
          <div className="xl:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[520px] aspect-square">
              {/* Outer ring */}
              <div className="absolute inset-[4%] rounded-full border border-white/10" />
              <div className="absolute inset-[10%] rounded-full border border-white/[0.06]" />

              {/* Light wedge — aligned to the active node (Root/Growth/…/Success) */}
              <div
                className="absolute inset-[10%] rounded-full transition-[background] duration-500 ease-out"
                style={{
                  background: `conic-gradient(from ${lightFrom}deg, ${stage.color}55 0deg, ${stage.color}18 ${wedge * 0.55}deg, transparent ${wedge}deg)`,
                }}
                aria-hidden
              />

              {/* Spotlight bloom under the active node */}
              <div
                className="absolute z-[5] w-[28%] h-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500"
                style={{
                  left: `${activeNode.x}%`,
                  top: `${activeNode.y}%`,
                  background: `radial-gradient(circle, ${stage.color}66 0%, transparent 70%)`,
                  filter: "blur(6px)",
                }}
                aria-hidden
              />

              {/* Tick marks */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" aria-hidden>
                {STAGES.map((_, i) => {
                  const a = (-90 + (i / N) * 360) * (Math.PI / 180);
                  const x1 = 50 + 46 * Math.cos(a);
                  const y1 = 50 + 46 * Math.sin(a);
                  const x2 = 50 + 49 * Math.cos(a);
                  const y2 = 50 + 49 * Math.sin(a);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={i === active ? STAGES[i].color : "rgba(255,255,255,0.2)"}
                      strokeWidth="0.4"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
              </svg>

              {/* Stage nodes on ring */}
              {ring.map((node) => {
                const on = node.i === active;
                const NodeIcon = node.icon;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActive(node.i)}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-pressed={on}
                  >
                    <span
                      className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 bg-black transition-all duration-300 ${
                        on ? "scale-110" : "scale-100 opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        borderColor: on ? node.color : "rgba(255,255,255,0.15)",
                        boxShadow: on ? `0 0 22px ${node.color}66` : "none",
                      }}
                    >
                      <NodeIcon
                        className="w-4 h-4"
                        style={{ color: on ? node.color : "rgba(255,255,255,0.45)" }}
                        strokeWidth={1.6}
                      />
                    </span>
                    <span
                      className={`text-[9px] md:text-[10px] font-cascadia uppercase tracking-[0.18em] ${
                        on ? "text-white" : "text-white/35"
                      }`}
                    >
                      {node.label}
                    </span>
                  </button>
                );
              })}

              {/* Center readout */}
              <div className="absolute inset-[28%] rounded-full border border-white/10 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.28 }}
                    className="flex flex-col items-center"
                  >
                    <span
                      className="font-bohuan text-4xl md:text-5xl tracking-wider mb-1"
                      style={{ color: `${stage.color}99` }}
                    >
                      0{active + 1}
                    </span>
                    <Icon className="w-5 h-5 mb-2" style={{ color: stage.color }} strokeWidth={1.5} />
                    <span className="font-bohuan uppercase text-sm md:text-base tracking-wider text-white leading-tight">
                      {stage.label}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Detail panel beside dial */}
          <div className="xl:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  className="text-[10px] font-cascadia uppercase tracking-[0.28em] mb-3"
                  style={{ color: stage.color }}
                >
                  Stage 0{active + 1} · {stage.label}
                </p>
                <h2 className="font-bohuan uppercase text-3xl md:text-4xl tracking-wide leading-[1.1] mb-5">
                  {stage.title}
                </h2>
                <p className="font-cascadia text-sm text-white/70 leading-relaxed mb-4">
                  {stage.description}
                </p>
                <p className="font-cascadia text-xs text-white/40 leading-relaxed mb-8">
                  {stage.extended}
                </p>

                <div
                  className="rounded-xl border px-4 py-3 mb-8"
                  style={{
                    borderColor: `${stage.color}33`,
                    backgroundColor: `${stage.color}0d`,
                  }}
                >
                  <p className="text-[9px] font-cascadia uppercase tracking-[0.2em] text-white/35 mb-1">
                    In practice
                  </p>
                  <p className="font-cascadia text-[11px] text-white/65">{stage.proof}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActive((i) => (i + 1) % N)}
                    className="px-5 py-3 rounded-full border border-white/15 text-[10px] font-cascadia uppercase tracking-[0.18em] text-white/55 hover:text-white hover:border-white/30 transition-colors cursor-pointer bg-transparent"
                  >
                    Next stage →
                  </button>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[10px] font-cascadia uppercase tracking-[0.18em] text-black"
                    style={{ backgroundColor: stage.color }}
                  >
                    Apply this method <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom sequence strip — linear readout, not chips like Services */}
        <div className="mt-12 md:mt-16 border-t border-white/[0.07] pt-8">
          <div className="flex items-stretch gap-0 overflow-x-auto">
            {STAGES.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="relative flex-1 min-w-[5.5rem] px-3 py-4 text-left border-r border-white/[0.06] last:border-r-0 cursor-pointer bg-transparent transition-colors hover:bg-white/[0.02]"
                >
                  <span
                    className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
                    style={{
                      backgroundColor: s.color,
                      opacity: on ? 1 : 0,
                    }}
                  />
                  <span className="block font-bohuan text-lg tracking-wider mb-1" style={{ color: on ? s.color : "rgba(255,255,255,0.2)" }}>
                    0{i + 1}
                  </span>
                  <span className={`block font-cascadia text-[10px] uppercase tracking-[0.16em] ${on ? "text-white" : "text-white/30"}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] py-8 px-5 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-cascadia text-[10px] uppercase tracking-[0.22em] text-white/30">
            Root · Growth · Connection · Expansion · Success
          </p>
          <Link
            href="/"
            className="font-cascadia text-[10px] uppercase tracking-[0.2em] text-white/45 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
