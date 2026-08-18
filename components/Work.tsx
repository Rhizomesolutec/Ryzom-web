"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, X, BarChart, Layers, Settings, Award } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  video?: string;
  color: string;
  challenge: string;
  process: string;
  solution: string;
  results: string;
  stats: { label: string; value: string }[];
}

const PROJECTS_DATA: Project[] = [
  {
    id: "brand-systems",
    title: "Brand Systems",
    category: "Branding & Design",
    image: "rgba(235, 87, 87, 0.2)",
    video: "/work/Work%201.mp4",
    color: "#EB5757",
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
    id: "product-platforms",
    title: "Product Platforms",
    category: "Development",
    image: "rgba(47, 128, 236, 0.2)",
    color: "#2F80EC",
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
    id: "growth-campaigns",
    title: "Growth Campaigns",
    category: "Digital Marketing",
    image: "rgba(33, 150, 82, 0.2)",
    color: "#219652",
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
    color: "#F2C94D",
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

/** Home section — horizontal Selected Work cards (Living Core anchors) */
export default function Work() {
  const scrollSectionRef = useRef<HTMLDivElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const pinContainer = pinContainerRef.current;
    const scrollSection = scrollSectionRef.current;
    if (!pinContainer || !scrollSection) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () =>
        -(scrollSection.scrollWidth - window.innerWidth + 16);

      gsap.set(scrollSection, { x: 0, force3D: true });

      gsap.to(scrollSection, {
        x: getScrollAmount,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: pinContainer,
          start: "top top",
          end: () =>
            `+=${Math.max(
              scrollSection.scrollWidth - window.innerWidth + 16,
              window.innerHeight * 0.6
            )}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });
    }, pinContainerRef);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        id="work"
        className="relative h-[100svh] bg-black overflow-hidden select-none"
      >
        <div ref={pinContainerRef} className="w-full h-full relative">
          <div className="absolute inset-0 flex flex-col justify-center overflow-hidden">
            <div className="shrink-0 px-5 sm:px-8 md:px-16 lg:px-24 mb-6 md:mb-10 max-w-full">
              <span className="text-[10px] sm:text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-2 block">
                Case Studies
              </span>
              <h2 className="text-[1.55rem] sm:text-3xl md:text-4xl lg:text-5xl font-bohuan uppercase tracking-wide md:tracking-wider text-white leading-tight">
                Selected Work
              </h2>
            </div>

            <div
              ref={scrollSectionRef}
              className="flex gap-4 sm:gap-6 md:gap-8 items-center will-change-transform pl-5 sm:pl-8 md:pl-16 lg:pl-24 pr-[18vw] sm:pr-[20vw]"
              style={{ width: "max-content" }}
            >
              {PROJECTS_DATA.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
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

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!project.video) return;
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const play = video.play();
          if (play && typeof play.catch === "function") play.catch(() => {});
        } else {
          video.pause();
        }
      },
      { root: null, rootMargin: "80px 0px", threshold: 0.2 }
    );

    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [project.video]);

  return (
    <motion.div
      id={`work-card-${index}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="work-card-home glass-panel w-[78vw] max-w-[300px] sm:w-[340px] sm:max-w-none md:w-[420px] lg:w-[450px] h-[300px] sm:h-[360px] md:h-[440px] lg:h-[480px] rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer glow-border border border-white/5 transition-colors duration-300 shrink-0"
    >
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
        {project.video ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover object-center"
              src={project.video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{
              background: `radial-gradient(circle at center, ${project.image} 0%, transparent 75%)`,
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/20 pointer-events-none rounded-[inherit] z-[1]" />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="text-[9px] sm:text-[10px] font-cascadia uppercase tracking-wider text-white/50 truncate">
          {project.category}
        </span>
        <span
          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
          style={{
            backgroundColor: project.color,
            boxShadow: `0 0 10px ${project.color}`,
          }}
        />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl md:text-4xl font-bohuan uppercase tracking-wide md:tracking-wider text-white mb-3 md:mb-4 leading-tight">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-cascadia text-white/40 group-hover:text-white transition-colors duration-300">
          <span>Read Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
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
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">{project.challenge}</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80 font-semibold mb-2">
              <Layers className="w-5 h-5" style={{ color: project.color }} />
              <span className="text-xs uppercase font-cascadia tracking-wider">The Process</span>
            </div>
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">{project.process}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80 font-semibold mb-2">
              <Award className="w-5 h-5" style={{ color: project.color }} />
              <span className="text-xs uppercase font-cascadia tracking-wider">The Solution</span>
            </div>
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">{project.solution}</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80 font-semibold mb-2">
              <BarChart className="w-5 h-5" style={{ color: project.color }} />
              <span className="text-xs uppercase font-cascadia tracking-wider">The Results</span>
            </div>
            <p className="text-sm font-cascadia text-white/60 leading-relaxed">{project.results}</p>
          </div>
        </div>

        <div className="flex justify-center border-t border-white/10 pt-16">
          <div ref={modalCtaRef as any}>
            <button
              onClick={onClose}
              className="relative inline-flex items-center justify-center px-12 py-4 rounded-full text-xs uppercase tracking-wider font-semibold bg-white text-black border border-white hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
            >
              Close Case Study
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
