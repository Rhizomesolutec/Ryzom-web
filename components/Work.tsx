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
  color: string;
  challenge: string;
  process: string;
  solution: string;
  results: string;
  stats: { label: string; value: string }[];
}

const PROJECTS_DATA: Project[] = [
  {
    id: "aether",
    title: "Aether Protocol",
    category: "Branding & Web Development",
    image: "rgba(47, 128, 236, 0.2)", // Glowing Blue Visual
    color: "#2F80EC",
    challenge: "Translate a complex decentralized compute infrastructure into a high-end consumer-accessible brand, and design a lightning-fast dashboard that scales globally.",
    process: "We conducted visual strategy audits and designed a cohesive typography system using Cascadia Mono. Then, we built an optimized Next.js platform featuring real-time node statistics.",
    solution: "A premium mecha-inspired visual brand identity, custom vector assets, and an immersive dashboard layout with sub-millisecond data updates.",
    results: "Enabled a 200% increase in active network nodes and a successful public mainnet launch securing $12M in locked value.",
    stats: [
      { label: "Active Nodes", value: "+200%" },
      { label: "Value Secured", value: "$12M" },
    ],
  },
  {
    id: "kallisto",
    title: "Kallisto Home",
    category: "Branding & Mobile App",
    image: "rgba(235, 87, 87, 0.2)", // Glowing Red Visual
    color: "#EB5757",
    challenge: "Elevate a quiet-luxury interior design studio into the digital age. They required a minimalist design system and an iOS client management app.",
    process: "We crafted branding based on architectural grid layouts and developed a secure Swift client application for project tracking and interactive floorplans.",
    solution: "A refined black-and-white identity system with warm gray highlights, matched with a custom-built mobile application utilizing secure WebSockets.",
    results: "Featured on ArchDaily and named one of the App Store's 'Minimalist Designs We Love' with a 4.9 average user rating.",
    stats: [
      { label: "App Rating", value: "4.9/5" },
      { label: "Engagement", value: "+80%" },
    ],
  },
  {
    id: "vesper",
    title: "Vesper Logistics",
    category: "Business Strategy & AI Dashboard",
    image: "rgba(33, 150, 82, 0.2)", // Glowing Green Visual
    color: "#219652",
    challenge: "Architect a digital transformation strategy and UI layout for an international AI cargo-routing platform looking to decrease fuel overheads.",
    process: "We restructured their legacy data pipeline, mapped business workflows, and designed a custom React optimization dashboard using interactive vector paths.",
    solution: "A complete consulting roadmap coupled with a responsive, high-performance logistics dashboard featuring real-time map calculations.",
    results: "Reduced cargo routing inefficiencies by 18% and cut new client onboarding duration from three days to just fifteen minutes.",
    stats: [
      { label: "Fuel Saved", value: "18%" },
      { label: "Onboarding", value: "-95%" },
    ],
  },
  {
    id: "helios",
    title: "Helios Wearables",
    category: "Digital Marketing & Motion Graphics",
    image: "rgba(242, 201, 77, 0.2)", // Glowing Yellow Visual
    color: "#F2C94D",
    challenge: "Create a launching campaign and cinematic media assets for a smart athletic apparel brand that uses sound waves to stimulate muscle recovery.",
    process: "We produced high-speed motion graphic design sequences, directed high-fidelity studio lookbooks, and launched automated paid advertising flows.",
    solution: "A series of cinematic promo videos, influencer marketing funnels, and a high-converting web landing page optimized for mobile checkouts.",
    results: "Gained 4.5M organic social views in under 48 hours, resulting in the entire launch stock selling out during the pre-order window.",
    stats: [
      { label: "Video Views", value: "4.5M" },
      { label: "Sales Goal", value: "100%" },
    ],
  },
];

export default function Work() {
  const scrollSectionRef = useRef<HTMLDivElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const pinContainer = pinContainerRef.current;
    const scrollSection = scrollSectionRef.current;
    if (!pinContainer || !scrollSection) return;

    const ctx = gsap.context(() => {
      // Calculate translation amount (total width of inner content minus window width)
      const getScrollAmount = () => {
        const scrollWidth = scrollSection.scrollWidth;
        const windowWidth = window.innerWidth;
        return -(scrollWidth - windowWidth);
      };

      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainer,
          start: "top top",
          end: () => `+=${scrollSection.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      pinTimeline.to(scrollSection, {
        x: getScrollAmount,
        ease: "none",
      });
    }, pinContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="work"
        className="relative h-screen bg-black overflow-hidden select-none"
      >
        <div
          ref={pinContainerRef}
          className="w-full h-full relative"
        >
          {/* Horizontal Container */}
          <div className="absolute top-0 left-0 h-full flex flex-col justify-center px-12 md:px-24">
          <div className="mb-8 md:mb-12 max-w-xl">
            <span className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-2 block">
              Case Studies
            </span>
            <h2 className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white">
              Selected Work
            </h2>
          </div>

          <div
            ref={scrollSectionRef}
            className="flex gap-8 items-center pr-[20vw]"
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

      {/* Project Case Study Fullscreen Modal */}
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

interface CardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

function ProjectCard({ project, index, onClick }: CardProps) {
  const cardRef = useMagnetic(0.05);

  return (
    <motion.div
      id={`work-card-${index}`}
      ref={cardRef as any}
      onClick={onClick}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel w-[320px] md:w-[450px] h-[360px] md:h-[480px] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer glow-border border border-white/5 transition-all duration-300"
    >
      {/* Background Visual representation */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105"
        style={{
          background: `radial-gradient(circle at center, ${project.image} 0%, transparent 75%)`,
        }}
      />

      {/* Hover border glow trail */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/20 pointer-events-none rounded-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[10px] font-cascadia uppercase tracking-wider text-white/50">
          {project.category}
        </span>
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: project.color,
            boxShadow: `0 0 10px ${project.color}`,
          }}
        />
      </div>

      {/* Title & CTA */}
      <div className="relative z-10">
        <h3 className="text-2xl md:text-4xl font-bohuan uppercase tracking-wider text-white mb-4 leading-tight">
          {project.title}
        </h3>
        <div className="flex items-center gap-3 text-xs font-cascadia text-white/40 group-hover:text-white transition-colors duration-300">
          <span>Read Case Study</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

interface ModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ModalProps) {
  const modalCtaRef = useMagnetic(0.2);

  // Lock body scroll on modal open
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 right-0 text-white/60 hover:text-white p-2 rounded-full border border-white/10 bg-white/5 hover:border-white/30 transition-all z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero */}
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

          {/* Stats Bar */}
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

        {/* Challenge & Process GRID */}
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

        {/* Solution & Results */}
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

        {/* Modal CTA Footer */}
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
