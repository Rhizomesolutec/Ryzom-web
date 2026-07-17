"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, TrendingUp, Link, Maximize, CheckCircle } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

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
    color: "#333333", // Dark gray base
    title: "Deep Foundations",
    description: "Every strategy is built on strong roots: research, tech audits, and market insights.",
    extended: "We analyze target user behaviors, legacy technical debt, and branding opportunities to plant a stable root system that can support extreme growth.",
  },
  {
    id: "growth",
    label: "Growth",
    icon: TrendingUp,
    color: "#2F80EC", // Blue
    title: "Bespoke Engineering",
    description: "Small code refinements and design patterns build scalable digital products.",
    extended: "Using Next.js, Framer Motion, and lightweight architectures, we build technical frameworks that render instantly and animate smoothly at 60fps.",
  },
  {
    id: "connection",
    label: "Connection",
    icon: Link,
    color: "#EB5757", // Red
    title: "Ecosystem Synthesis",
    description: "We connect high-fidelity design to performant code and marketing workflows.",
    extended: "Our designers and developers work in lockstep. Brand assets integrate seamlessly into layouts, ensuring a unified user experience at every digital touchpoint.",
  },
  {
    id: "expansion",
    label: "Expansion",
    icon: Maximize,
    color: "#219652", // Green
    title: "Market Amplification",
    description: "Through advanced SEO, content generation, and strategy, we expand your brand.",
    extended: "Once launched, we trigger performance channels. Your system spreads its branches, generating leads and capturing visual presence across search engines and platforms.",
  },
  {
    id: "success",
    label: "Success",
    icon: CheckCircle,
    color: "#F2C94D", // Yellow
    title: "Balanced Maturity",
    description: "Your business model thrives under a secure, high-yield, stable canopy.",
    extended: "The final result is a robust digital ecosystem. By implementing continuous telemetry and optimization updates, your operations remain balanced and profitable.",
  },
];

export default function WhyRyzom() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStage = STAGES[activeIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STAGES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeIdx]);

  const magneticRefs = [
    useMagnetic(0.2),
    useMagnetic(0.2),
    useMagnetic(0.2),
    useMagnetic(0.2),
    useMagnetic(0.2),
  ];

  return (
    <section
      id="why-ryzom"
      className="relative min-h-screen py-32 bg-black overflow-hidden select-none"
    >
      {/* Background soft glow linked to active node */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 transition-colors duration-1000 pointer-events-none"
        style={{ backgroundColor: activeStage.color }}
      />

      {/* Seamless Vertical Spinal Root Connection (Hero -> Services) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-gradient-to-b from-brand-purple/15 via-white/5 to-[#2F80EC]/15 transform -translate-x-1/2 pointer-events-none z-0 hidden md:block" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        {/* Title */}
        <div className="mb-24 text-center">
          <span className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-3 block">
            Why RYZOM
          </span>
          <h2 className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white">
            Growth Methodology
          </h2>
        </div>

        {/* Interactive Chain Diagram */}
        <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 mb-24">

          {/* Connector Line overlay (Desktop only) */}
          <div className="absolute left-[8%] right-[8%] top-1/2 h-[2px] bg-white/5 transform -translate-y-1/2 hidden md:block z-0" />

          {/* Active growing connector line overlay (Desktop only) */}
          <div
            className="absolute left-[8%] top-1/2 h-[2px] transform -translate-y-1/2 hidden md:block z-0 transition-all duration-700"
            style={{
              width: `${activeIdx * 21}%`,
              backgroundColor: activeStage.color,
              boxShadow: `0 0 10px ${activeStage.color}`,
            }}
          />

          {/* Vertical Connector Line overlay (Mobile only) */}
          <div className="absolute top-[28px] bottom-[28px] left-1/2 w-[2px] bg-white/5 transform -translate-x-1/2 md:hidden z-0" />

          {/* Active growing vertical connector line overlay (Mobile only) */}
          <div
            className="absolute top-[28px] left-1/2 w-[2px] transform -translate-x-1/2 md:hidden z-0 transition-all duration-700"
            style={{
              height: `${activeIdx * 25}%`,
              backgroundColor: activeStage.color,
              boxShadow: `0 0 10px ${activeStage.color}`,
            }}
          />

          {/* Node buttons */}
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = idx <= activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div
                key={stage.id}
                id={`why-ryzom-node-${idx}`}
                ref={magneticRefs[idx] as any}
                onClick={() => setActiveIdx(idx)}
                className="flex flex-col items-center relative z-10 cursor-pointer group"
              >
                {/* Node Orb */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-black ${isCurrent
                      ? "scale-110"
                      : "scale-100 hover:scale-105"
                    }`}
                  style={{
                    borderColor: isCurrent
                      ? stage.color
                      : isActive
                        ? `${stage.color}aa`
                        : "rgba(255, 255, 255, 0.1)",
                    boxShadow: isCurrent
                      ? `0 0 20px ${stage.color}`
                      : "none",
                  }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors duration-500"
                    style={{
                      color: isCurrent || isActive ? stage.color : "rgba(255, 255, 255, 0.3)",
                    }}
                  />
                </div>

                {/* Node Label */}
                <span
                  className={`mt-4 text-xs font-cascadia tracking-wider uppercase transition-colors duration-500 ${isCurrent ? "text-white font-bold" : "text-white/40 group-hover:text-white/70"
                    }`}
                >
                  {stage.label}
                </span>

                {/* Index marker */}
                <span
                  className="absolute -top-6 text-[9px] font-cascadia"
                  style={{ color: isCurrent ? stage.color : "rgba(255, 255, 255, 0.15)" }}
                >
                  0{idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detailed Stage Description Card */}
        <div className="w-full max-w-2xl min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative"
            >
              {/* Highlight corner notch */}
              <div
                className="absolute top-0 left-8 w-16 h-[2px] transition-colors duration-500"
                style={{ backgroundColor: activeStage.color }}
              />

              <div className="flex items-center gap-4 mb-6">
                <span
                  className="text-[10px] font-semibold tracking-wider font-cascadia uppercase px-3 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${activeStage.color}40`,
                    color: activeStage.color,
                    backgroundColor: `${activeStage.color}0a`,
                  }}
                >
                  Stage 0{activeIdx + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-bohuan uppercase tracking-wider text-white">
                  {activeStage.title}
                </h3>
              </div>

              <p className="text-sm font-cascadia text-white/80 leading-relaxed mb-4">
                {activeStage.description}
              </p>

              <p className="text-xs font-cascadia text-white/40 leading-relaxed">
                {activeStage.extended}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
