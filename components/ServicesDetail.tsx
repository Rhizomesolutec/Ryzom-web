"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Palette,
  Code,
  Megaphone,
  Video,
  Compass,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

interface ServiceDetail {
  id: string;
  title: string;
  role: string;
  subtitle: string;
  description: string;
  subservices: string[];
  color: string;
  icon: typeof Palette;
  image: string;
}

const SERVICES_DETAIL_DATA: ServiceDetail[] = [
  {
    id: "branding",
    title: "Branding & Design",
    role: "Identity",
    subtitle: "Ecosystem Foundation",
    description:
      "We shape unique identities and interfaces that resonate, building a strong visual foundation for your company's growth. We translate complex philosophies into gorgeous, functional digital layouts that speak before your users read a single word.",
    subservices: [
      "Brand Strategy & Identity",
      "UI/UX Design",
      "Creative Direction",
      "Design Systems",
      "Web & Mobile Interfaces",
    ],
    color: "#EB5757",
    icon: Palette,
    image: "/Images/services/branding_design_meaningful.png",
  },
  {
    id: "development",
    title: "Development",
    role: "Product",
    subtitle: "Engineering Growth",
    description:
      "We engineer performant, responsive web and mobile solutions tailored to scale. Clean code meets intelligent architecture. Our engineering team builds resilient modern systems, custom software integrations, and blazing-fast web apps focused on conversions.",
    subservices: [
      "Web App Development",
      "Mobile Applications",
      "Payment Gateway Integration",
      "Custom API & Cloud Solutions",
      "Next.js & React Architectures",
    ],
    color: "#2F80EC",
    icon: Code,
    image: "/Images/services/development.png",
  },
  {
    id: "marketing",
    title: "Digital Marketing",
    role: "Growth",
    subtitle: "Amplifying Reach",
    description:
      "We amplify your digital reach, driving engagement and targeted visibility through calculated, growth-driven campaigns. By blending creative marketing tactics with strict search engine optimization standards, we route traffic directly to your core systems.",
    subservices: [
      "Digital Growth Campaigns",
      "SEO Optimization",
      "Social Media Strategy",
      "Content Marketing",
      "Performance Analytics",
    ],
    color: "#219652",
    icon: Megaphone,
    image: "/Images/services/digital_marketing.png",
  },
  {
    id: "media",
    title: "Media Production",
    role: "Story",
    subtitle: "Cinematic Narratives",
    description:
      "We capture and craft high-fidelity cinematic stories, videos, and motion assets that articulate your brand's philosophy. From studio photography to dynamic motion graphics, we establish visual authority through high-production content.",
    subservices: [
      "Commercial Videography",
      "Studio Photography",
      "Motion Graphics",
      "Post-Production Editing",
      "Cinematic Social Assets",
    ],
    color: "#F2C94D",
    icon: Video,
    image: "/Images/services/media_production.png",
  },
  {
    id: "strategy",
    title: "Business Strategy",
    role: "Direction",
    subtitle: "Navigating Expansion",
    description:
      "We guide digital evolutions and market-entry initiatives, laying the strategic roots that secure balanced, long-term expansion. We analyze user demographics, technology stacks, and market opportunities to forge a bulletproof roadmap.",
    subservices: [
      "Business Consulting",
      "Digital Transformation",
      "Growth Infrastructure Strategy",
      "Market Entry & Expansion",
      "Tech Stack Consulting",
    ],
    color: "#9A51E0",
    icon: Compass,
    image: "/Images/services/business_strategy.png",
  },
];

export default function ServicesDetail() {
  const [active, setActive] = useState(0);
  const activeService = SERVICES_DETAIL_DATA[active];

  // Auto-advance 01 → 02 → 03… (slightly slower for readability)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % SERVICES_DETAIL_DATA.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActive((i) => Math.min(SERVICES_DETAIL_DATA.length - 1, i + 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black text-white select-none">
      <div
        className="pointer-events-none fixed inset-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 70% 40%, ${activeService.color}14 0%, transparent 60%)`,
        }}
        aria-hidden
      />

      <header className="relative z-20 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[10px] sm:text-xs font-cascadia uppercase tracking-[0.28em] text-brand-blue mb-3">
              Services Atlas
            </p>
            <h1 className="font-bohuan uppercase text-[clamp(1.8rem,5vw,3.5rem)] tracking-wide md:tracking-wider leading-[1.05]">
              The Operating
              <br />
              <span className="text-white/40">System</span>
            </h1>
          </div>
          <p className="max-w-sm font-cascadia text-xs sm:text-sm text-white/40 leading-relaxed">
            Five disciplines. One connected practice. Browse the atlas — each module
            feeds the next.
          </p>
        </div>

        <nav
          className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pb-4 flex gap-2 overflow-x-auto"
          aria-label="Service modules"
        >
          {SERVICES_DETAIL_DATA.map((s, i) => {
            const isOn = i === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                className={`shrink-0 relative px-4 py-2.5 rounded-full border text-[10px] sm:text-[11px] font-cascadia uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer ${
                  isOn
                    ? "text-black border-transparent"
                    : "text-white/45 border-white/10 hover:text-white hover:border-white/25 bg-transparent"
                }`}
                style={isOn ? { backgroundColor: s.color } : undefined}
              >
                <span className="opacity-60 mr-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.role}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 min-h-[70vh]">
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-1 border-r border-white/[0.06] pr-6">
            {SERVICES_DETAIL_DATA.map((s, i) => {
              const Icon = s.icon;
              const isOn = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group flex items-center gap-3 text-left px-3 py-3.5 rounded-xl transition-all duration-300 cursor-pointer border ${
                    isOn
                      ? "bg-white/[0.04] border-white/15"
                      : "border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <span
                    className="font-bohuan text-lg tracking-wider w-8"
                    style={{ color: isOn ? s.color : "rgba(255,255,255,0.2)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isOn ? s.color : "rgba(255,255,255,0.25)" }}
                    strokeWidth={1.6}
                  />
                  <span
                    className={`font-cascadia text-xs uppercase tracking-wider truncate ${
                      isOn ? "text-white" : "text-white/35 group-hover:text-white/60"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}

            <div className="mt-auto pt-10">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-[10px] font-cascadia uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
              >
                Start a project <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch"
              >
                <div className="relative order-1 md:order-2">
                  <div
                    className="relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]"
                    style={{
                      boxShadow: `0 28px 80px rgba(0,0,0,0.55), 0 0 50px ${activeService.color}22`,
                    }}
                  >
                    <Image
                      src={activeService.image}
                      alt={activeService.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 45vw"
                      priority
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 45%), linear-gradient(135deg, ${activeService.color}22 0%, transparent 40%)`,
                      }}
                    />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <span className="font-bohuan text-4xl tracking-wider text-white/30">
                        {String(active + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[10px] font-cascadia uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border"
                        style={{
                          color: activeService.color,
                          borderColor: `${activeService.color}55`,
                          backgroundColor: `${activeService.color}14`,
                        }}
                      >
                        {activeService.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-2 md:order-1 flex flex-col justify-center py-2">
                  <p
                    className="text-[10px] font-cascadia uppercase tracking-[0.24em] mb-3"
                    style={{ color: activeService.color }}
                  >
                    {activeService.subtitle}
                  </p>
                  <h2 className="font-bohuan uppercase text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-wide leading-[1.08] mb-5">
                    {activeService.title}
                  </h2>
                  <p className="font-cascadia text-xs sm:text-sm text-white/50 leading-relaxed mb-8 max-w-md">
                    {activeService.description}
                  </p>

                  <ul className="space-y-0 mb-10 border-t border-white/[0.07]">
                    {activeService.subservices.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 py-3 border-b border-white/[0.07] font-cascadia text-[11px] sm:text-xs text-white/65"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: activeService.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] sm:text-[11px] font-cascadia uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: activeService.color }}
                    >
                      Discuss this module <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setActive((i) => (i + 1) % SERVICES_DETAIL_DATA.length)
                      }
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-[10px] sm:text-[11px] font-cascadia uppercase tracking-[0.18em] text-white/55 hover:text-white hover:border-white/30 transition-colors cursor-pointer bg-transparent"
                    >
                      Next module
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 md:mt-14 flex items-center gap-2">
              {SERVICES_DETAIL_DATA.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to ${s.title}`}
                  onClick={() => setActive(i)}
                  className="h-1 flex-1 rounded-full transition-all duration-300 cursor-pointer border-0 p-0"
                  style={{
                    backgroundColor:
                      i === active ? s.color : "rgba(255,255,255,0.1)",
                    opacity: i === active ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07] py-8 px-5 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-cascadia text-[10px] uppercase tracking-[0.2em] text-white/30">
            Identity → Product → Growth → Story → Direction
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
