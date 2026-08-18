"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";

interface Milestone {
  phase: string;
  title: string;
  concept: string;
  description: string;
  color: string;
}

const MILESTONES: Milestone[] = [
  {
    phase: "Phase 01",
    title: "The Seeds (Insight)",
    concept: "Strong roots begin with thorough discovery.",
    description: "Before laying lines of code or designing logos, we dissect your market space. We gather the core insights that dictate which directions your strategy must branch.",
    color: "#2F80EC", // Blue
  },
  {
    phase: "Phase 02",
    title: "Sprouting (Innovation)",
    concept: "Bridging engineering and creative execution.",
    description: "With insights as our soil, we write custom codebases and design interfaces. The digital solution sprouts with pure bespoke functionality and beautiful, fast execution.",
    color: "#EB5757", // Red
  },
  {
    phase: "Phase 03",
    title: "Branching (Balance)",
    concept: "Synthesizing marketing and strategic reach.",
    description: "A digital application needs exposure. We branch out into SEO and targeted performance marketing, establishing a balanced ecosystem where the code is seen and utilized.",
    color: "#219652", // Green
  },
  {
    phase: "Phase 04",
    title: "Canopy (Impact)",
    concept: "Achieving stable, long-term expansion.",
    description: "Through business strategies, we secure continuous growth. Like a canopy capturing solar energy, we optimize operational structures to drive long-term business returns.",
    color: "#9A51E0", // Purple
  },
];

export default function About() {
  const quoteRef = useMagnetic(0.04);

  return (
    <section
      id="about"
      className="relative min-h-screen py-32 bg-black overflow-hidden select-none"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        {/* Core foundation — same stylized Y as Living Core / navbar logo */}
        <div id="about-core-foundation" className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] mb-16 flex items-center justify-center relative">
          <div
            className="absolute inset-0 rounded-full animate-pulse-slow"
            style={{
              background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.08) 0%, transparent 65%)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              boxShadow:
                "0 0 24px rgba(47,128,236,0.2), inset 0 0 20px rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="absolute rounded-full opacity-40"
            style={{
              inset: "18%",
              background: "conic-gradient(from 0deg, #2F80EC44, #EB575744, #21965244, #F2C94D44, #9A51E044, #2F80EC44)",
              filter: "blur(8px)",
            }}
            aria-hidden
          />
          {/* Navbar logo Y — same geometry as Living Core */}
          <svg
            viewBox="0 0 24 28"
            className="relative z-10 w-10 h-12 md:w-12 md:h-14"
            fill="none"
            aria-hidden
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55))" }}
          >
            <line
              x1="12"
              y1="1.5"
              x2="12"
              y2="9.5"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M4.5 25.5 L12 12.5 L19.5 25.5"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className="absolute rounded-full border border-white/10 opacity-40 animate-pulse"
            style={{ inset: "-6px" }}
            aria-hidden
          />
        </div>

        {/* Storytelling & Philosophy */}
        <div className="text-center max-w-3xl mb-32 flex flex-col items-center">
          <span className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-4 block">
            Brand Philosophy
          </span>

          <h2
            ref={quoteRef as any}
            className="text-2xl md:text-5xl font-bohuan uppercase tracking-wider text-white leading-tight mb-8 cursor-pointer transition-all duration-300"
          >
            "Small changes build <span className="text-brand-red glow-text-red">strength</span> and <span className="text-brand-green glow-text-green">stability</span>."
          </h2>

          <p className="text-white/50 text-xs md:text-sm font-cascadia leading-relaxed max-w-2xl">
            RYZOM stands for creative ideas that branch out and connect brands to people in powerful, organic ways. Every successful brand grows from strong roots: insight, innovation, balance, and impact, helping your system expand naturally in every direction.
          </p>
        </div>

        {/* Timeline */}
        <div className="w-full relative pl-6 md:pl-0 flex flex-col items-start md:items-center">
          {/* Vertical central timeline line */}
          <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 transform md:-translate-x-1/2" />

          {/* Timeline Nodes */}
          <div className="flex flex-col gap-16 w-full relative">
            {MILESTONES.map((milestone, idx) => (
              <div
                key={milestone.phase}
                id={`about-card-${idx}`}
                className={`flex flex-col md:flex-row w-full items-start md:items-center relative transition-shadow duration-500 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Visual Connector Dot — Living Core lands here per stage */}
                <div
                  id={`about-node-${idx}`}
                  className="absolute left-[-1px] md:left-1/2 w-4 h-4 bg-black border-2 border-white rounded-full transform -translate-x-[7.5px] md:-translate-x-2 z-10"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full absolute top-[3px] left-[3px]"
                    style={{
                      backgroundColor: milestone.color,
                      boxShadow: `0 0 6px ${milestone.color}`,
                    }}
                  />
                </div>

                {/* Left/Right Text Column */}
                <div
                  className={`w-full md:w-[45%] flex flex-col ${
                    idx % 2 === 0 ? "md:items-start" : "md:items-end text-left md:text-right"
                  } pl-10 md:pl-0`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="about-milestone-panel glass-panel p-8 rounded-2xl border border-white/5 w-full md:max-w-md shadow-lg transition-[box-shadow,border-color] duration-500"
                  >
                    <span
                      className="text-[10px] font-cascadia font-semibold tracking-wider px-2.5 py-0.5 rounded-full border mb-4 inline-block"
                      style={{
                        borderColor: `${milestone.color}40`,
                        color: milestone.color,
                        backgroundColor: `${milestone.color}0a`,
                      }}
                    >
                      {milestone.phase}
                    </span>
                    <h3 className="text-lg md:text-xl font-bohuan uppercase tracking-wider text-white mb-2">
                      {milestone.title}
                    </h3>
                    <h4 className="text-xs font-cascadia text-white/50 mb-4 italic">
                      {milestone.concept}
                    </h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>

                {/* Spacer Column */}
                <div className="hidden md:block w-[10%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
