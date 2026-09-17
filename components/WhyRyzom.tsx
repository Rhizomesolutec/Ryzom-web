"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, TrendingUp, Link, Maximize, CheckCircle } from "lucide-react";

interface Stage {
  id: string;
  label: string;
  icon: any;
  color: string;
  title: string;
  description: string;
  extended: string;
}

const STAGES: Stage[] = [
  {
    id: "root",
    label: "Root",
    icon: Layers,
    color: "#333333",
    title: "Deep Foundations",
    description:
      "Every strategy is built on strong roots: research, tech audits, and market insights.",
    extended:
      "We analyze target user behaviors, legacy technical debt, and branding opportunities to plant a stable root system that can support extreme growth.",
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
  },
  {
    id: "connection",
    label: "Connection",
    icon: Link,
    color: "#EB5757",
    title: "Ecosystem Synthesis",
    description:
      "We connect high-fidelity design to performant code and marketing workflows.",
    extended:
      "Our designers and developers work in lockstep. Brand assets integrate seamlessly into layouts, ensuring a unified user experience at every digital touchpoint.",
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
  },
];

function StageNode({
  stage,
  idx,
  activeIdx,
  onSelect,
}: {
  stage: Stage;
  idx: number;
  activeIdx: number;
  onSelect: () => void;
}) {
  const Icon = stage.icon;
  const isActive = idx <= activeIdx;
  const isCurrent = idx === activeIdx;

  return (
    <button
      type="button"
      id={`why-ryzom-node-${idx}`}
      onClick={onSelect}
      className="flex flex-col items-center relative z-10 cursor-pointer group bg-transparent border-0 p-0 w-full"
      aria-pressed={isCurrent}
    >
      <div
        className={`w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-black shrink-0 ${
          isCurrent ? "scale-105 md:scale-110" : "scale-100 md:group-hover:scale-105"
        }`}
        style={{
          borderColor: isCurrent
            ? stage.color
            : isActive
              ? `${stage.color}aa`
              : "rgba(255, 255, 255, 0.1)",
          boxShadow: isCurrent ? `0 0 16px ${stage.color}` : "none",
        }}
      >
        <Icon
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors duration-500"
          style={{
            color: isCurrent || isActive ? stage.color : "rgba(255, 255, 255, 0.3)",
          }}
        />
      </div>

      <span
        className={`mt-1.5 md:mt-4 text-[8px] sm:text-[9px] md:text-xs font-cascadia tracking-wide md:tracking-wider uppercase transition-colors duration-500 text-center leading-tight max-w-full truncate w-full px-0.5 ${
          isCurrent ? "text-white font-bold" : "text-white/40 group-hover:text-white/70"
        }`}
      >
        {stage.label}
      </span>

      <span
        className="absolute -top-5 md:-top-6 text-[8px] md:text-[9px] font-cascadia"
        style={{ color: isCurrent ? stage.color : "rgba(255, 255, 255, 0.15)" }}
      >
        0{idx + 1}
      </span>
    </button>
  );
}

export default function WhyRyzom() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStage = STAGES[activeIdx];
  const progressPct = activeIdx / (STAGES.length - 1);

  // Auto-advance stages every 2s (works on mobile even when Core scroll-sync is active)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % STAGES.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [activeIdx]);

  return (
    <section
      id="why-ryzom"
      className="relative min-h-0 md:min-h-screen py-6 md:py-32 bg-black overflow-hidden select-none flex flex-col justify-center"
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[min(90vw,500px)] h-[min(90vw,500px)] rounded-full blur-3xl opacity-10 transition-colors duration-1000 pointer-events-none"
        style={{ backgroundColor: activeStage.color }}
      />

      <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-gradient-to-b from-brand-purple/15 via-white/5 to-[#2F80EC]/15 transform -translate-x-1/2 pointer-events-none z-0 hidden md:block" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 flex flex-col items-center">
        <div className="mb-8 md:mb-24 text-center px-2">
          <span className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-3 block">
            Why RYZOM
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bohuan uppercase tracking-wide md:tracking-wider text-white">
            Growth Methodology
          </h2>
        </div>

        {/* Equal-width step rail — stable size on all mobile widths */}
        <div className="relative w-full max-w-4xl grid grid-cols-5 items-start gap-0 mb-10 md:mb-24 pt-6">
          {/* Line through circle centers: pt-6 + half orb (9/11/14) */}
          <div className="absolute left-[10%] right-[10%] top-[calc(1.5rem+1.125rem)] sm:top-[calc(1.5rem+1.375rem)] md:top-[calc(1.5rem+1.75rem)] h-[2px] -translate-y-1/2 bg-white/5 z-0 pointer-events-none" />
          <div
            className="absolute left-[10%] top-[calc(1.5rem+1.125rem)] sm:top-[calc(1.5rem+1.375rem)] md:top-[calc(1.5rem+1.75rem)] h-[2px] -translate-y-1/2 z-0 transition-all duration-700 pointer-events-none origin-left"
            style={{
              width: `calc(80% * ${progressPct})`,
              backgroundColor: activeStage.color,
              boxShadow: `0 0 10px ${activeStage.color}`,
            }}
          />

          {STAGES.map((stage, idx) => (
            <StageNode
              key={stage.id}
              stage={stage}
              idx={idx}
              activeIdx={activeIdx}
              onSelect={() => setActiveIdx(idx)}
            />
          ))}
        </div>

        {/* Smaller mobile description card */}
        <div className="w-full max-w-2xl min-h-[160px] md:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-5 sm:p-6 md:p-10 rounded-xl md:rounded-2xl border border-white/5 shadow-2xl relative"
            >
              <div
                className="absolute top-0 left-5 md:left-8 w-12 md:w-16 h-[2px] transition-colors duration-500"
                style={{ backgroundColor: activeStage.color }}
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-6">
                <span
                  className="self-start text-[9px] md:text-[10px] font-semibold tracking-wider font-cascadia uppercase px-2.5 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${activeStage.color}40`,
                    color: activeStage.color,
                    backgroundColor: `${activeStage.color}0a`,
                  }}
                >
                  Stage 0{activeIdx + 1}
                </span>
                <h3 className="text-base sm:text-xl md:text-2xl font-bohuan uppercase tracking-wide md:tracking-wider text-white">
                  {activeStage.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm font-cascadia text-white/80 leading-relaxed mb-3 md:mb-4">
                {activeStage.description}
              </p>

              <p className="text-[11px] sm:text-xs font-cascadia text-white/40 leading-relaxed hidden sm:block">
                {activeStage.extended}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
