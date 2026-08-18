"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code, Palette, Megaphone, Video, Compass, ArrowUpRight } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

interface ServiceItem {
  id: string;
  step: string;
  title: string;
  role: string;
  icon: typeof Palette;
  color: string;
  subservices: string[];
  description: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "branding",
    step: "01",
    title: "Branding & Design",
    role: "Identity",
    icon: Palette,
    color: "#EB5757",
    subservices: ["Brand Identity", "UI/UX Design", "Creative Design"],
    description:
      "We shape distinctive identities and interfaces that people remember — the visual foundation every strong brand grows from.",
  },
  {
    id: "development",
    step: "02",
    title: "Development",
    role: "Product",
    icon: Code,
    color: "#2F80EC",
    subservices: ["Web Development", "Mobile Apps", "Payments", "Custom Software"],
    description:
      "We engineer fast, scalable web and mobile products. Clean architecture, thoughtful UX, and code built to last.",
  },
  {
    id: "marketing",
    step: "03",
    title: "Digital Marketing",
    role: "Growth",
    icon: Megaphone,
    color: "#219652",
    subservices: ["Campaigns", "SEO", "Social Media"],
    description:
      "We amplify your presence with focused campaigns that turn attention into engagement and measurable growth.",
  },
  {
    id: "media",
    step: "04",
    title: "Media Production",
    role: "Story",
    icon: Video,
    color: "#F2C94D",
    subservices: ["Photography", "Videography", "Motion Graphics"],
    description:
      "We craft cinematic visuals and motion that express your brand’s philosophy with clarity and polish.",
  },
  {
    id: "strategy",
    step: "05",
    title: "Business Strategy",
    role: "Direction",
    icon: Compass,
    color: "#9A51E0",
    subservices: ["Consulting", "Digital Transformation", "Growth Strategy"],
    description:
      "We align technology, brand, and market moves so every investment compounds into long-term expansion.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const;

/** Home section — premium system card grid (Living Core anchors) */
export default function Services() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="services"
      className="relative py-24 md:py-32 bg-black overflow-hidden select-none"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(47,128,236,0.08) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 80% 60%, rgba(154,81,224,0.05) 0%, transparent 50%)",
        }}
      />

      <div
        id="services-trunk-top"
        className="absolute top-8 left-1/2 -translate-x-1/2 w-1 h-1 pointer-events-none opacity-0"
      />
      <div
        id="services-trunk-bottom"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1 h-1 pointer-events-none opacity-0"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-20 max-w-2xl"
        >
          <p className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-4">
            Our System
          </p>
          <h2 className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white leading-tight mb-5">
            Five disciplines.
            <br />
            <span className="text-white/45">One connected practice.</span>
          </h2>
          <p className="font-cascadia text-white/45 text-xs md:text-sm leading-relaxed max-w-lg">
            From identity to product, growth, story, and direction — each capability
            feeds the next so your digital ecosystem stays coherent and easy to scale.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-[10px] md:text-[11px] font-cascadia uppercase tracking-[0.16em] text-white/35">
            {["Identity", "Product", "Growth", "Story", "Direction"].map((label, i) => (
              <span key={label} className="inline-flex items-center gap-2">
                <span className="text-white/70">{label}</span>
                {i < 4 && (
                  <span className="text-white/20" aria-hidden>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          {SERVICES_DATA.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              featured={idx === 0}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  featured,
}: {
  service: ServiceItem;
  index: number;
  featured?: boolean;
}) {
  const magneticRef = useMagnetic(0.06);
  const Icon = service.icon;
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      id={`services-card-${index}`}
      variants={prefersReducedMotion ? undefined : cardVariants}
      className={`services-card ${featured ? "md:col-span-2" : ""}`}
      style={
        {
          ["--active-glow-color" as string]: hexToRgb(service.color),
        } as React.CSSProperties
      }
    >
      <div
        ref={magneticRef as React.RefObject<HTMLDivElement>}
        className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-6 md:p-8 cursor-default transition-colors duration-500 hover:border-white/20 h-full ${
          featured ? "md:grid md:grid-cols-2 md:gap-10 md:items-center" : ""
        }`}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 0% 0%, ${service.color}18 0%, transparent 55%)`,
          }}
          aria-hidden
        />
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-60"
          style={{
            background: `linear-gradient(90deg, ${service.color}, transparent 70%)`,
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span
                className="font-bohuan text-2xl md:text-3xl text-white/20 leading-none tracking-wider"
                aria-hidden
              >
                {service.step}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-black/40 group-hover:scale-105 transition-transform duration-400"
                style={{ boxShadow: `0 0 20px ${service.color}22` }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color: service.color }} strokeWidth={1.6} />
              </div>
            </div>
            <span
              className="font-cascadia text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border"
              style={{
                color: service.color,
                borderColor: `${service.color}40`,
                backgroundColor: `${service.color}12`,
              }}
            >
              {service.role}
            </span>
          </div>

          <h3 className="font-bohuan uppercase tracking-wider text-lg md:text-xl text-white mb-3 group-hover:translate-x-0.5 transition-transform duration-400">
            {service.title}
          </h3>
          <p className="font-cascadia text-white/45 text-[12px] md:text-[13px] leading-relaxed mb-6 max-w-md">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {service.subservices.map((sub) => (
              <span
                key={sub}
                className="font-cascadia text-[10px] md:text-[11px] tracking-wide text-white/55 px-2.5 py-1 rounded-md border border-white/[0.07] bg-white/[0.02] group-hover:border-white/15 transition-colors duration-300"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        {featured && (
          <div className="relative z-10 hidden md:flex flex-col justify-between h-full min-h-[180px] border-l border-white/[0.06] pl-10">
            <p className="font-cascadia text-sm text-white/50 leading-relaxed">
              “Start with identity. Build the product. Grow the audience. Tell the story.
              Steer the business.”
            </p>
            <div className="flex items-center gap-2 text-white/40 font-cascadia text-[11px] uppercase tracking-[0.18em] group-hover:text-white/70 transition-colors">
              <span>Connected system</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `${r}, ${g}, ${b}`;
}
