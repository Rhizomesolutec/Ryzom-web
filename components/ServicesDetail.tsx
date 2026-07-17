"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Palette, Code, Megaphone, Video, Compass, ChevronDown } from "lucide-react";
import Image from "next/image";

interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subservices: string[];
  color: string;
  themeClass: string;
  icon: any;
  image: string;
}

const SERVICES_DETAIL_DATA: ServiceDetail[] = [
  {
    id: "branding",
    title: "Branding & Design",
    subtitle: "ECOSYSTEM FOUNDATION",
    description: "We shape unique identities and interfaces that resonate, building a strong visual foundation for your company's growth. We translate complex philosophies into gorgeous, functional digital layouts that speak before your users read a single word.",
    subservices: ["Brand Strategy & Identity", "UI/UX Design", "Creative Direction", "Design Systems", "Web & Mobile Interfaces"],
    color: "#EB5757",
    themeClass: "red",
    icon: Palette,
    image: "/Images/services/branding_design_meaningful.png",
  },
  {
    id: "development",
    title: "Development",
    subtitle: "ENGINEERING GROWTH",
    description: "We engineer performant, responsive web and mobile solutions tailored to scale. Clean code meets intelligent architecture. Our engineering team builds resilient modern systems, custom software integrations, and blazing-fast web apps focused on conversions.",
    subservices: ["Web App Development", "Mobile Applications", "Payment Gateway Integration", "Custom API & Cloud Solutions", "Next.js & React Architectures"],
    color: "#2F80EC",
    themeClass: "blue",
    icon: Code,
    image: "/Images/services/development.png",
  },
  {
    id: "marketing",
    title: "Digital Marketing",
    subtitle: "AMPLIFYING REACH",
    description: "We amplify your digital reach, driving engagement and targeted visibility through calculated, growth-driven campaigns. By blending creative marketing tactics with strict search engine optimization standards, we route traffic directly to your core systems.",
    subservices: ["Digital Growth Campaigns", "SEO Optimization", "Social Media Strategy", "Content Marketing", "Performance Analytics"],
    color: "#219652",
    themeClass: "green",
    icon: Megaphone,
    image: "/Images/services/digital_marketing.png",
  },
  {
    id: "media",
    title: "Media Production",
    subtitle: "CINEMATIC NARRATIVES",
    description: "We capture and craft high-fidelity cinematic stories, videos, and motion assets that articulate your brand's philosophy. From studio photography to dynamic motion graphics, we establish visual authority through high-production content.",
    subservices: ["Commercial Videography", "Studio Photography", "Motion Graphics", "Post-Production Editing", "Cinematic Social Assets"],
    color: "#F2C94D",
    themeClass: "yellow",
    icon: Video,
    image: "/Images/services/media_production.png",
  },
  {
    id: "strategy",
    title: "Business Strategy",
    subtitle: "NAVIGATING EXPANSION",
    description: "We guide digital evolutions and market-entry initiatives, laying the strategic roots that secure balanced, long-term expansion. We analyze user demographics, technology stacks, and market opportunities to forge a bulletproof roadmap.",
    subservices: ["Business Consulting", "Digital Transformation", "Growth Infrastructure Strategy", "Market Entry & Expansion", "Tech Stack Consulting"],
    color: "#9A51E0",
    themeClass: "purple",
    icon: Compass,
    image: "/Images/services/business_strategy.png",
  },
];

export default function ServicesDetail() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-black overflow-hidden select-none">
      {/* Hero Intro */}
      <ServicesHero />

      {/* Detail Sections */}
      {SERVICES_DETAIL_DATA.map((service, idx) => (
        <ServiceSection key={service.id} service={service} index={idx} />
      ))}
    </div>
  );
}

/* ==========================================================
   SERVICES HERO
   ========================================================== */
function ServicesHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const points: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const count = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.5,
      });
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const scrollToContent = () => {
    const target = document.getElementById("service-section-0");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden z-10">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />

      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-4 block"
      >
        Ecosystem Framework
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl md:text-7xl font-bohuan uppercase tracking-widest text-white leading-none mb-6 max-w-4xl"
      >
        INTELLIGENT <br />
        <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red bg-clip-text text-transparent">
          DIGITAL ROOTS
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed mb-12 font-cascadia"
      >
        Delve deeper into our core divisions. We engineer, design, and strategize digital structures to empower long-term scaling and organic technological growth.
      </motion.p>

      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="group relative inline-flex flex-col items-center gap-2 text-white/50 hover:text-white cursor-pointer transition-colors"
      >
        <span className="text-[10px] uppercase tracking-widest font-cascadia">Explore Systems</span>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </motion.button>
    </section>
  );
}

/* ==========================================================
   INDIVIDUAL SERVICE SECTION
   ========================================================== */
interface SectionProps {
  service: ServiceDetail;
  index: number;
}

function ServiceSection({ service, index }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;

  return (
    <section
      id={`service-section-${index}`}
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden border-b border-white/5"
    >
      {/* Dynamic Animated Canvas Background */}
      <ServiceCanvasBackground theme={service.themeClass} color={service.color} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

        {/* TEXT CONTENT (lg:span-6 or 7) */}
        <div
          className={`flex flex-col lg:col-span-6 ${isLeft ? "lg:order-1 text-left" : "lg:order-2 text-left"
            }`}
        >
          {/* Section Subtitle Tag */}
          <div className="mb-4">
            <span
              className="text-[9px] md:text-xs font-cascadia tracking-widest px-3 py-1 rounded-full border"
              style={{
                borderColor: `${service.color}35`,
                color: service.color,
                backgroundColor: `${service.color}08`,
                boxShadow: `0 0 10px ${service.color}15`,
              }}
            >
              {service.subtitle}
            </span>
          </div>

          {/* Section Animated Title */}
          <SectionTitle title={service.title} color={service.color} theme={service.themeClass} />

          {/* Section Animated Description */}
          <SectionParagraph text={service.description} theme={service.themeClass} />

          {/* Core Focus Area for Development: Custom Software */}
          {service.id === "development" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-2 mb-6 p-4 rounded-xl border border-brand-blue/20 bg-brand-blue/5 backdrop-blur-sm max-w-xl"
              style={{
                boxShadow: "0 10px 30px -10px rgba(47, 128, 236, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                <span className="text-xs font-semibold font-cascadia text-brand-blue uppercase tracking-wider">
                  Core Specialization: Custom Software Development
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-white/70 font-cascadia leading-relaxed">
                We design and build bespoke, scalable software systems tailored explicitly to your operations. Rather than retrofitting off-the-shelf software, we craft proprietary digital assets that serve as the technological engine for your business growth.
              </p>
            </motion.div>
          )}

          {/* Animated Subservices Chips */}
          <div className="flex flex-wrap gap-2 pt-6">
            {service.subservices.map((sub, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-cascadia text-white/70 bg-white/[0.03] border border-white/5 hover:border-white/15 hover:text-white transition-all cursor-default"
                style={{
                  boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.01)",
                }}
              >
                ✦ {sub}
              </motion.span>
            ))}
          </div>
        </div>

        {/* IMAGE CONTAINER (lg:col-span-6) */}
        <div
          className={`lg:col-span-6 flex justify-center w-full ${isLeft ? "lg:order-2" : "lg:order-1"
            }`}
        >
          <SectionImage src={service.image} alt={service.title} color={service.color} />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   DYNAMIC BACKGROUND ANIMATION CANVAS
   ========================================================== */
interface CanvasBgProps {
  theme: string;
  color: string;
}

function ServiceCanvasBackground({ theme, color }: CanvasBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth || window.innerWidth;
        height = canvas.height = canvas.offsetHeight || window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Initialize animation variables based on theme
    let t = 0;

    // RED: Branding & Design (Fluid Blobs)
    const blobs = [
      { x: width * 0.3, y: height * 0.4, r: 180, vx: 0.25, vy: 0.2 },
      { x: width * 0.7, y: height * 0.6, r: 230, vx: -0.2, vy: 0.15 },
      { x: width * 0.5, y: height * 0.3, r: 140, vx: 0.15, vy: -0.2 },
    ];

    // BLUE: Development (Matrix Binary Code)
    const columns = Math.floor(width / 24);
    const drops: number[] = Array(columns).fill(0);
    const chars = "0101011001CODEJSREACTNEXTTSHTMLCSSROOTSYSTEM";

    // GREEN: Digital Marketing (Radar circles & flow particles)
    const pulseRings = [0, 150, 300, 450];
    const greenParticles: { x: number; y: number; r: number; speed: number; angle: number }[] = [];
    for (let i = 0; i < 40; i++) {
      greenParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.4 + 0.15,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // YELLOW: Media Production (Cinema flares / drifting bokeh)
    const bokehs: { x: number; y: number; r: number; alpha: number; speed: number; dy: number }[] = [];
    for (let i = 0; i < 25; i++) {
      bokehs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 15 + 5,
        alpha: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.2 + 0.05,
        dy: -(Math.random() * 0.3 + 0.1),
      });
    }

    // PURPLE: Strategy (Blueprint lattices)
    const strategyNodes: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 25; i++) {
      strategyNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      t += 0.005;

      switch (theme) {
        case "red": // Branding: Fluid morphing waves
          blobs.forEach((b) => {
            b.x += b.vx;
            b.y += b.vy;

            // Bounce bounds
            if (b.x - b.r < 0 || b.x + b.r > width) b.vx *= -1;
            if (b.y - b.r < 0 || b.y + b.r > height) b.vy *= -1;

            const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            grad.addColorStop(0, "rgba(235, 87, 87, 0.045)");
            grad.addColorStop(0.5, "rgba(235, 87, 87, 0.01)");
            grad.addColorStop(1, "transparent");

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          });
          break;

        case "blue": // Development: Code Rain
          ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = "rgba(47, 128, 236, 0.15)";
          ctx.font = "12px monospace";

          for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * 24;
            const y = drops[i] * 12;

            ctx.fillText(char, x, y);

            if (y > height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
          break;

        case "green": // Marketing: Radar scans and green flows
          // 1. Radar scanner rings
          ctx.strokeStyle = "rgba(33, 150, 82, 0.015)";
          ctx.lineWidth = 1;
          const centerX = width * 0.5;
          const centerY = height * 0.5;

          for (let i = 0; i < pulseRings.length; i++) {
            pulseRings[i] += 0.5;
            if (pulseRings[i] > 600) pulseRings[i] = 0;

            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRings[i], 0, Math.PI * 2);
            ctx.stroke();
          }

          // 2. Connected flying nodes
          ctx.fillStyle = "rgba(33, 150, 82, 0.25)";
          greenParticles.forEach((p, idx) => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            // Web-connecting lines
            for (let j = idx + 1; j < greenParticles.length; j++) {
              const other = greenParticles[j];
              const dist = Math.hypot(p.x - other.x, p.y - other.y);
              if (dist < 100) {
                ctx.strokeStyle = `rgba(33, 150, 82, ${0.05 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            }
          });
          break;

        case "yellow": // Media: Bokeh and lens viewport indicators
          // 1. Film viewport lines
          ctx.strokeStyle = "rgba(242, 201, 77, 0.02)";
          ctx.lineWidth = 1;
          const pad = 40;
          // Viewport bounding box
          ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

          // Focus indicator cross in center
          const cx = width / 2;
          const cy = height / 2;
          ctx.beginPath();
          ctx.moveTo(cx - 15, cy); ctx.lineTo(cx + 15, cy);
          ctx.moveTo(cx, cy - 15); ctx.lineTo(cx, cy + 15);
          ctx.stroke();

          // Camera corners
          const clen = 25;
          // Top Left
          ctx.beginPath(); ctx.moveTo(pad + clen, pad); ctx.lineTo(pad, pad); ctx.lineTo(pad, pad + clen); ctx.stroke();
          // Top Right
          ctx.beginPath(); ctx.moveTo(width - pad - clen, pad); ctx.lineTo(width - pad, pad); ctx.lineTo(width - pad, pad + clen); ctx.stroke();
          // Bottom Left
          ctx.beginPath(); ctx.moveTo(pad + clen, height - pad); ctx.lineTo(pad, height - pad); ctx.lineTo(pad, height - pad - clen); ctx.stroke();
          // Bottom Right
          ctx.beginPath(); ctx.moveTo(width - pad - clen, height - pad); ctx.lineTo(width - pad, height - pad); ctx.lineTo(width - pad, height - pad - clen); ctx.stroke();

          // 2. Slow floating golden light blobs
          bokehs.forEach((b) => {
            b.y += b.dy;
            if (b.y + b.r < 0) {
              b.y = height + b.r;
              b.x = Math.random() * width;
            }

            const radial = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            radial.addColorStop(0, `rgba(242, 201, 77, ${b.alpha})`);
            radial.addColorStop(0.5, `rgba(242, 201, 77, ${b.alpha * 0.3})`);
            radial.addColorStop(1, "transparent");

            ctx.fillStyle = radial;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          });
          break;

        case "purple": // Strategy: Architectural Grid Blueprint
          ctx.strokeStyle = "rgba(154, 81, 224, 0.02)";
          ctx.lineWidth = 0.5;

          // Draw blueprint rotating coordinate grid
          const angle = t * 0.5;
          ctx.save();
          ctx.translate(width * 0.5, height * 0.5);
          ctx.rotate(angle);

          const radarCount = 6;
          for (let i = 1; i <= radarCount; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, i * 80, 0, Math.PI * 2);
            ctx.stroke();
          }
          // Coordinate cross
          ctx.beginPath();
          ctx.moveTo(-500, 0); ctx.lineTo(500, 0);
          ctx.moveTo(0, -500); ctx.lineTo(0, 500);
          ctx.stroke();
          ctx.restore();

          // Connection nodes
          ctx.fillStyle = "rgba(154, 81, 224, 0.3)";
          strategyNodes.forEach((node, idx) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearest nodes
            for (let j = idx + 1; j < strategyNodes.length; j++) {
              const other = strategyNodes[j];
              const dist = Math.hypot(node.x - other.x, node.y - other.y);
              if (dist < 150) {
                ctx.strokeStyle = `rgba(154, 81, 224, ${0.06 * (1 - dist / 150)})`;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            }
          });
          break;
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [theme, color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 pointer-events-none" />;
}

/* ==========================================================
   CONTENT ANIMATIONS
   ========================================================== */

/* 1. Title reveals depending on category animations */
function SectionTitle({ title, color, theme }: { title: string; color: string; theme: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  // Springy word reveal for Branding (spelled together)
  if (theme === "red") {
    const words = title.split(" ");
    return (
      <h2 ref={ref} className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white mb-6">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 12,
              delay: i * 0.15,
            }}
            className="inline-block mr-3"
          >
            {word}
          </motion.span>
        ))}
      </h2>
    );
  }

  // Typewriter effect / Glitch for Development
  if (theme === "blue") {
    const letters = Array.from(title);
    return (
      <h2 ref={ref} className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white mb-6 font-mono flex flex-wrap">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.1,
              delay: i * 0.06,
            }}
            className="inline-block"
            style={{
              textShadow: isInView ? `0 0 8px ${color}60` : "none",
              marginRight: char === " " ? "0.3em" : "0.02em",
            }}
          >
            {char}
          </motion.span>
        ))}
        {isInView && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2.5 h-8 ml-1 bg-brand-blue inline-block self-end"
          />
        )}
      </h2>
    );
  }

  // Scatter assemble reveal for Digital Marketing
  if (theme === "green") {
    const words = title.split(" ");
    return (
      <h2 ref={ref} className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white mb-6">
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block mr-4">
            {Array.from(word).map((char, cIdx) => {
              // Deterministic pseudo-random generation based on indices, to avoid hydration mismatch
              const seed = (wIdx * 37 + cIdx * 17) % 100;
              const randX = ((seed % 10) / 10 - 0.5) * 80; // range: -40 to 40
              const randY = ((Math.floor(seed / 10) / 10) - 0.5) * 80; // range: -40 to 40
              const randRotate = (seed - 50) * 1.8; // range: -90 to 90
              return (
                <motion.span
                  key={cIdx}
                  initial={{ opacity: 0, x: randX, y: randY, rotate: randRotate }}
                  animate={isInView ? { opacity: 1, x: 0, y: 0, rotate: 0 } : {}}
                  transition={{ duration: 0.8, ease: "easeOut", delay: (wIdx * 3 + cIdx) * 0.05 }}
                  className="inline-block text-glow-green"
                  style={{
                    color: wIdx === 1 ? color : "white",
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h2>
    );
  }

  // Cinematic blur to focus reveal for Media
  if (theme === "yellow") {
    return (
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, filter: "blur(20px)", scale: 1.15 }}
        animate={isInView ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white mb-6"
        style={{
          textShadow: `0 0 15px rgba(242, 201, 77, 0.4)`,
        }}
      >
        {title}
      </motion.h2>
    );
  }

  // Structural assembly block-by-block for Business Strategy
  return (
    <div ref={ref} className="overflow-hidden mb-6">
      <motion.h2
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white"
        style={{
          color: color,
        }}
      >
        <span className="text-white">Business</span> Strategy
      </motion.h2>
    </div>
  );
}

/* 2. Paragraph reveals */
function SectionParagraph({ text, theme }: { text: string; theme: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  let pVariants = {};

  if (theme === "blue") {
    // Monospace slide character entry
    pVariants = {
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 },
    };
  } else {
    // Clean fade slide up
    pVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0 },
    };
  }

  return (
    <motion.p
      ref={ref}
      variants={pVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`text-white/50 text-xs md:text-sm leading-relaxed mb-6 font-cascadia max-w-xl ${theme === "blue" ? "border-l border-brand-blue/30 pl-4 py-1" : ""
        }`}
    >
      {text}
    </motion.p>
  );
}

/* 3. Image Hover & Scroll triggers with Life animations (Float & Ken Burns zoom) */
function SectionImage({ src, alt, color }: { src: string; alt: string; color: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={
        isInView
          ? {
            opacity: 1,
            scale: 1,
            y: [0, -10, 0], // Continuous bobbing float
          }
          : { opacity: 0, scale: 0.9, y: 40 }
      }
      transition={
        isInView
          ? {
            opacity: { duration: 1, ease: "easeOut" },
            scale: { duration: 1, ease: "easeOut" },
            y: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            },
          }
          : { duration: 1 }
      }
      className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden glass-panel glow-border group cursor-pointer"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Continuous slowly pulsing colored background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen z-10"
        animate={{
          scale: [0.9, 1.15, 0.9],
          opacity: [0.06, 0.18, 0.06],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
        }}
      />

      {/* Frame overlay */}
      <div className="absolute inset-0 border border-white/5 group-hover:border-white/15 transition-colors duration-500 rounded-2xl z-20 pointer-events-none" />

      {/* Image with continuous Ken Burns slow zoom */}
      <div className="w-full h-full relative overflow-hidden">
        <motion.div
          className="w-full h-full relative"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 16,
            ease: "easeInOut",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-w-768px) 100vw, 480px"
            priority
            className="object-cover opacity-80 group-hover:opacity-95 transition-opacity duration-500"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
