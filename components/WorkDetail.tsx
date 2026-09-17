"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, X, BarChart, Layers, Settings, Award } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  video?: string;
  color: string;
  summary: string;
  challenge: string;
  process: string;
  solution: string;
  results: string;
  stats: { label: string; value: string }[];
}

const PROJECTS_DATA: Project[] = [
  {
    id: "product-platforms",
    title: "Product Platforms",
    category: "Development",
    image: "rgba(47, 128, 236, 0.2)",
    video: "/work/Work%201.mp4",
    color: "#2F80EC",
    summary: "Fast, durable products engineered for real growth.",
    challenge:
      "Engineer fast, scalable web and mobile products with clean architecture, thoughtful UX, and code built to last.",
    process:
      "We mapped product flows, chose the right stack, and shipped iterative releases — from MVP to production — with performance and payments in mind.",
    solution:
      "Custom web apps, mobile experiences, and backend systems that feel as polished as the brand behind them.",
    results:
      "Shorter time-to-market, stable releases, and products that convert attention into real usage.",
    stats: [
      { label: "Load Time", value: "-40%" },
      { label: "Ship Cycle", value: "2×" },
    ],
  },
  {
    id: "brand-systems",
    title: "Brand Systems",
    category: "Branding & Design",
    image: "rgba(235, 87, 87, 0.2)",
    video: "/work/work%202.mp4",
    color: "#EB5757",
    summary: "Identity systems that scale across every product surface.",
    challenge:
      "Build a distinctive brand foundation — identity, UI language, and creative direction — that feels premium and scales across every touchpoint.",
    process:
      "We defined visual strategy, typography, and design systems, then translated them into interfaces and assets the product and marketing teams can grow from.",
    solution:
      "A cohesive brand system: logo architecture, color & type rules, UI kits, and creative templates that keep every surface unmistakably on-brand.",
    results:
      "Faster creative output, clearer brand recognition, and a visual language teams can ship with without reinventing the look each time.",
    stats: [
      { label: "Brand Consistency", value: "+92%" },
      { label: "Design Velocity", value: "3×" },
    ],
  },
  {
    id: "growth-campaigns",
    title: "Growth Campaigns",
    category: "Digital Marketing",
    image: "rgba(33, 150, 82, 0.2)",
    video: "/work/work%203.mp4",
    color: "#219652",
    summary: "Campaign systems that turn attention into measurable lift.",
    challenge:
      "Turn brand presence into measurable growth with focused campaigns across SEO, social, and paid channels.",
    process:
      "We audited channels, built creative + copy systems, and ran always-on funnels that feed learning back into the next sprint.",
    solution:
      "Integrated campaign systems — content, ads, and landing paths — tuned for attention, engagement, and conversion.",
    results:
      "Higher qualified traffic, stronger engagement loops, and growth you can attribute — not guess.",
    stats: [
      { label: "Qualified Leads", value: "+180%" },
      { label: "ROAS", value: "4.2×" },
    ],
  },
  {
    id: "motion-stories",
    title: "Motion Stories",
    category: "Media Production",
    image: "rgba(242, 201, 77, 0.2)",
    video: "/work/work%204.mp4",
    color: "#F2C94D",
    summary: "Cinematic media that carries brand philosophy in motion.",
    challenge:
      "Express the brand in motion — photography, videography, and graphics that feel cinematic and clear.",
    process:
      "We directed shoots, edited narrative cuts, and built motion systems that plug into launches, social, and product storytelling.",
    solution:
      "A library of premium media: hero films, product motion, and social-ready cuts that carry the brand’s philosophy.",
    results:
      "Higher watch-through, sharper launch moments, and media assets that keep working long after day one.",
    stats: [
      { label: "Watch Time", value: "+65%" },
      { label: "Campaign Lift", value: "2.8×" },
    ],
  },
];

export default function WorkDetail() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <section
        id="work"
        className="relative bg-black select-none overflow-hidden"
      >
        {/* Intro band */}
        <div className="relative z-20 px-5 sm:px-8 md:px-16 lg:px-24 pt-20 md:pt-28 pb-10 md:pb-14 border-b border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <span className="text-[10px] sm:text-xs font-cascadia uppercase tracking-[0.28em] text-brand-blue mb-3 block">
              Case Studies
            </span>
            <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] font-bohuan uppercase tracking-wide md:tracking-wider text-white leading-[1.05]">
              Selected Work
            </h2>
            <p className="mt-4 max-w-xl text-xs sm:text-sm font-cascadia text-white/40 leading-relaxed">
              Four disciplines. Four proof points. Scroll the reel — each stage is a living case.
            </p>
          </motion.div>
        </div>

        {/* Cinematic vertical reel */}
        <div className="relative">
          {PROJECTS_DATA.map((project, idx) => (
            <WorkPanel
              key={project.id}
              project={project}
              index={idx}
              onOpen={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function WorkPanel({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const panelRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ctaRef = useMagnetic(0.12);
  const flip = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const titleX = useTransform(scrollYProgress, [0, 0.45, 1], [flip ? 40 : -40, 0, flip ? -20 : 20]);

  useEffect(() => {
    if (!project.video) return;
    const video = videoRef.current;
    const panel = panelRef.current;
    if (!video || !panel) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
          const play = video.play();
          if (play && typeof play.catch === "function") play.catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.6] }
    );

    io.observe(panel);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [project.video]);

  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={panelRef}
      id={`work-card-${index}`}
      className="work-panel relative min-h-[100svh] md:min-h-screen border-b border-white/[0.06] group bg-black"
    >
      {/* Soft ambient field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `
              radial-gradient(ellipse 55% 50% at ${flip ? "75%" : "25%"} 45%, ${project.image} 0%, transparent 70%),
              radial-gradient(circle at ${flip ? "15%" : "85%"} 85%, ${project.color}18 0%, transparent 40%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* Split showcase: copy + media card */}
      <div
        className={`relative z-10 min-h-[100svh] md:min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center px-5 sm:px-8 md:px-16 lg:px-24 py-16 md:py-20 ${
          flip ? "md:[direction:rtl]" : ""
        }`}
      >
        {/* Copy */}
        <motion.div
          style={{ x: titleX }}
          className={`w-full max-w-xl will-change-transform md:[direction:ltr] ${
            flip ? "md:justify-self-end" : ""
          }`}
        >
          <div className="flex items-center gap-4 mb-5 md:mb-7">
            <span
              className="font-bohuan text-5xl md:text-7xl leading-none tracking-wider tabular-nums"
              style={{ color: `${project.color}99` }}
            >
              {indexLabel}
            </span>
            <span className="h-px flex-1 max-w-[4rem] md:max-w-[6rem]" style={{ backgroundColor: `${project.color}66` }} />
            <span className="text-[10px] md:text-xs font-cascadia uppercase tracking-[0.22em] text-white/45">
              {project.category}
            </span>
          </div>

          <h3 className="font-bohuan uppercase text-[clamp(1.85rem,4.5vw,3.5rem)] tracking-wide md:tracking-wider text-white leading-[1.05] mb-4">
            {project.title}
          </h3>

          <p className="font-cascadia text-xs md:text-sm text-white/50 leading-relaxed max-w-md mb-8">
            {project.summary}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            {project.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="font-bohuan text-xl md:text-2xl text-white tracking-wide">
                  {stat.value}
                </span>
                <span className="text-[9px] font-cascadia uppercase tracking-[0.18em] text-white/35">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div ref={ctaRef as any}>
            <button
              type="button"
              onClick={onOpen}
              className="group/btn relative inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white hover:text-black text-white text-[10px] md:text-[11px] font-cascadia uppercase tracking-[0.2em] transition-colors duration-300 cursor-pointer"
            >
              <span>View Case Study</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `0 0 28px ${project.color}55` }}
                aria-hidden
              />
            </button>
          </div>
        </motion.div>

        {/* Media card — video/gradient fills the card frame cleanly */}
        <motion.div
          style={{ y: mediaY }}
          className="relative w-full md:[direction:ltr] will-change-transform"
        >
          <div
            className="relative w-full aspect-[4/5] sm:aspect-[16/11] md:aspect-[4/5] lg:aspect-[16/12] max-h-[min(72svh,560px)] mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            style={{ boxShadow: `0 24px 80px rgba(0,0,0,0.55), 0 0 40px ${project.color}18` }}
          >
            {project.video ? (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center scale-[1.2] origin-center will-change-transform"
                  src={project.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none"
                  aria-hidden
                />
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 50% 40%, ${project.image} 0%, transparent 65%),
                    linear-gradient(160deg, #0a0a0a 0%, #050505 100%)
                  `,
                }}
              />
            )}

            {/* Card edge highlight */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" aria-hidden />
            <div
              className="absolute top-0 left-6 right-6 h-px opacity-70"
              style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
              aria-hidden
            />
          </div>
        </motion.div>
      </div>

      {/* Accent corner mark */}
      <div
        className="absolute top-6 right-6 md:top-10 md:right-10 w-8 h-8 md:w-10 md:h-10 pointer-events-none opacity-40"
        aria-hidden
      >
        <span className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: project.color }} />
        <span className="absolute top-0 right-0 h-full w-px" style={{ backgroundColor: project.color }} />
      </div>
    </article>
  );
}

interface ModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ModalProps) {
  const modalCtaRef = useMagnetic(0.2);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const lenis = (window as any).lenis;
    if (lenis) lenis.stop();

    return () => {
      document.body.style.overflow = "";
      const lenis = (window as any).lenis;
      if (lenis) lenis.start();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl overflow-y-auto px-6 py-12 md:py-24"
    >
      <div className="max-w-5xl mx-auto relative">
        <button
          onClick={onClose}
          className="absolute -top-4 right-0 text-white/60 hover:text-white p-2 rounded-full border border-white/10 bg-white/5 hover:border-white/30 transition-all z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-white/10 pb-12 mb-16 relative">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[300px] -z-10 blur-3xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${project.color} 0%, transparent 70%)`,
            }}
          />
          <span className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-4 block">
            {project.category}
          </span>
          <h2 className="text-4xl md:text-7xl font-bohuan uppercase tracking-wider text-white mb-8">
            {project.title}
          </h2>

          <div className="flex gap-12">
            {project.stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-2xl md:text-4xl font-bohuan text-white font-bold">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase font-cascadia text-white/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80 font-semibold mb-2">
              <Settings className="w-5 h-5" style={{ color: project.color }} />
              <span className="text-xs uppercase font-cascadia tracking-wider">The Challenge</span>
            </div>
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80 font-semibold mb-2">
              <Layers className="w-5 h-5" style={{ color: project.color }} />
              <span className="text-xs uppercase font-cascadia tracking-wider">The Process</span>
            </div>
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">
              {project.process}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80 font-semibold mb-2">
              <Award className="w-5 h-5" style={{ color: project.color }} />
              <span className="text-xs uppercase font-cascadia tracking-wider">The Solution</span>
            </div>
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">
              {project.solution}
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80 font-semibold mb-2">
              <BarChart className="w-5 h-5" style={{ color: project.color }} />
              <span className="text-xs uppercase font-cascadia tracking-wider">The Results</span>
            </div>
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">
              {project.results}
            </p>
          </div>
        </div>

        <div className="flex justify-center border-t border-white/10 pt-16">
          <div ref={modalCtaRef as any}>
            <button
              onClick={onClose}
              className="relative inline-flex items-center justify-center px-12 py-4 rounded-full text-xs uppercase tracking-wider font-semibold bg-white text-black border border-white hover:bg-black hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              Close Case Study
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
