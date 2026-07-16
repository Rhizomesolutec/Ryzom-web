"use client";

import { useEffect, useRef } from "react";
import Logo from "./Logo";
import { useMagnetic } from "@/hooks/useMagnetic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code,
  Smartphone,
  Cpu,
  Cloud,
  Brain,
  Palette,
  Sparkles,
  Megaphone,
  Compass,
  Video,
  BarChart3,
  CreditCard
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TECH_NODES = [
  { id: "web", label: "Web Development", x: 100, y: 400, icon: Code, color: "#2F80EC" },
  { id: "mobile", label: "Mobile Apps", x: 180, y: 360, icon: Smartphone, color: "#EB5757" },
  { id: "apis", label: "APIs", x: 900, y: 400, icon: Cpu, color: "#219652" },
  { id: "cloud", label: "Cloud", x: 820, y: 360, icon: Cloud, color: "#2F80EC" },
  { id: "ai", label: "AI", x: 130, y: 240, icon: Brain, color: "#9A51E0" },
  { id: "uiux", label: "UI/UX Design", x: 220, y: 180, icon: Palette, color: "#F2C94D" },
  { id: "branding", label: "Branding & Design", x: 870, y: 240, icon: Sparkles, color: "#EB5757" },
  { id: "marketing", label: "Digital Marketing", x: 780, y: 180, icon: Megaphone, color: "#219652" },
  { id: "strategy", label: "Business Strategy", x: 250, y: 160, icon: Compass, color: "#9A51E0" },
  { id: "media", label: "Media Production", x: 750, y: 160, icon: Video, color: "#F2C94D" },
  { id: "analytics", label: "Analytics", x: 450, y: 180, icon: BarChart3, color: "#F3994B" },
  { id: "payments", label: "Payment Systems", x: 550, y: 180, icon: CreditCard, color: "#F3994B" }
];

function NodeComponent({ node }: { node: typeof TECH_NODES[0] }) {
  const Icon = node.icon;
  const isRightSide = node.x >= 500;

  return (
    <div className="group relative w-[100px] h-[100px] flex items-center justify-center pointer-events-auto">
      {/* Small Glowing Node Center */}
      <div
        className="w-2.5 h-2.5 rounded-full absolute transition-all duration-300 group-hover:scale-125"
        style={{
          backgroundColor: node.color,
          boxShadow: `0 0 10px ${node.color}, 0 0 20px ${node.color}`
        }}
      />

      {/* Icon Wrapper Circle */}
      <div
        className="w-8 h-8 rounded-full border border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 z-10"
        style={{
          boxShadow: `0 0 15px ${node.color}40`,
          borderColor: `${node.color}30`
        }}
      >
        <Icon className="w-4 h-4" style={{ color: node.color }} />
      </div>

      {/* Label Chip */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md border border-white/10 text-[9px] text-white/90 font-cascadia uppercase tracking-widest px-2.5 py-1.5 rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-20 ${isRightSide ? "right-12" : "left-12"
          }`}
        style={{
          borderColor: `${node.color}20`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 10px ${node.color}15`
        }}
      >
        {node.label}
      </div>
    </div>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootPathRef = useRef<SVGPathElement | null>(null);
  const rootTrailRef = useRef<SVGPathElement | null>(null);
  const treeContainerRef = useRef<HTMLDivElement | null>(null);

  // Element refs for scroll parallax
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const line1Ref = useRef<HTMLDivElement | null>(null);
  const line2Ref = useRef<HTMLDivElement | null>(null);
  const line3Ref = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const ctaWrapperRef = useRef<HTMLDivElement | null>(null);

  const ctaPrimaryRef = useMagnetic(0.2);
  const ctaSecondaryRef = useMagnetic(0.2);

  useEffect(() => {
    // --- 1. Canvas Background Setup ---
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctxCanvas = canvas.getContext("2d");
    if (!ctxCanvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse positions for parallax
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initial grid elements
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const nodeCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    // Volumetric glows using brand colors
    const glows = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.25, vx: 0.08, vy: 0.06, color: "rgba(47, 128, 236, 0.06)", r: 240 }, // Brand Blue
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.35, vx: -0.06, vy: 0.08, color: "rgba(235, 87, 87, 0.06)", r: 260 }, // Brand Red
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.75, vx: 0.05, vy: -0.07, color: "rgba(33, 150, 82, 0.06)", r: 280 },  // Brand Green
      { x: window.innerWidth * 0.7, y: window.innerHeight * 0.85, vx: -0.07, vy: -0.05, color: "rgba(154, 81, 224, 0.06)", r: 220 }, // Brand Purple
    ];

    let gridOffset = 0;
    const scrollObj = { progress: 0 };

    // GSAP context to wrap all ScrollTriggers and timelines
    const gsapCtx = gsap.context(() => {
      // Update canvas settings based on Hero scroll progress
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollObj.progress = self.progress;
        },
        onLeave: () => {
          canvas.style.display = "none";
        },
        onEnterBack: () => {
          canvas.style.display = "block";
        }
      });

      // --- 2. Scroll Parallax of Text Elements ---
      const logoWrapper = logoWrapperRef.current;
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const line3 = line3Ref.current;
      const description = descriptionRef.current;
      const ctaWrapper = ctaWrapperRef.current;

      const textTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      textTimeline
        .to(logoWrapper, { y: -50, scale: 0.85, opacity: 0.1, ease: "none" }, 0)
        // Set initial state for lines 2 & 3 in the center at scroll 0, keeping their opacity at 1.0
        .set(line2, { opacity: 1.0, x: 0, y: 0 }, 0)
        .set(line3, { opacity: 1.0, x: 0, y: 0 }, 0)

        // Step 1: Scroll 0 to 30% -> Line 1 slides left and top
        .to(line1, { x: -150, y: -40, opacity: 1, ease: "power1.out" }, 0)

        // Step 2: Scroll 30% to 65% -> Line 2 slides right
        .to(line2, { x: 150, y: 0, opacity: 1, ease: "power1.out" }, 0.3)

        // Step 3: Scroll 65% to 90% -> Line 3 slides left and bottom
        .to(line3, { x: -110, y: 40, opacity: 1, ease: "power1.out" }, 0.65)

        // Step 4: Scroll 90% to 100% -> Fade out all text as it leaves the screen
        .to([line1, line2, line3], { opacity: 0, y: (i) => i === 0 ? -120 : i === 1 ? -60 : 80, ease: "none" }, 0.9)

        // Paragraph description lights up like lightning (bright white with neon blue glow) on scroll
        .to(description, {
          color: "#ffffff",
          textShadow: "0 0 12px rgba(47, 128, 236, 0.9), 0 0 24px rgba(47, 128, 236, 0.5)",
          ease: "power1.out"
        }, 0)

        // Paragraph translates and fades on further scroll
        .to(description, { y: -80, opacity: 0, ease: "none" }, 0.45)
        .to(ctaWrapper, { y: -100, opacity: 0, ease: "none" }, 0);

      // --- 3. Scroll-Linked Growing Root & Tree Animations ---
      const rootPath = rootPathRef.current;
      const rootTrail = rootTrailRef.current;

      // swayGroups sway animation
      const swayGroups = [
        { selector: ".sway-group-1", origin: "500px 600px", range: 1.2 },
        { selector: ".sway-group-2", origin: "500px 600px", range: -1.2 },
        { selector: ".sway-group-3", origin: "500px 480px", range: 1.5 },
        { selector: ".sway-group-4", origin: "500px 480px", range: -1.5 },
        { selector: ".sway-group-5", origin: "500px 480px", range: 1.8 },
        { selector: ".sway-group-6", origin: "500px 480px", range: -1.8 },
        { selector: ".sway-group-7", origin: "500px 480px", range: 1.0 },
      ];

      swayGroups.forEach((g) => {
        gsap.to(g.selector, {
          rotate: g.range,
          duration: gsap.utils.random(5, 8),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: g.origin,
          delay: gsap.utils.random(0, 3),
        });
      });

      // Animate the branch trails (energy flow)
      const branchTrails = document.querySelectorAll(".hero-branch-trail");
      branchTrails.forEach((trail) => {
        const pathEl = trail as SVGPathElement;
        const len = pathEl.getTotalLength();
        // Set strokeDasharray to a small 30px dash followed by a gap equal to the path length
        gsap.set(pathEl, { strokeDasharray: `30 ${len}`, strokeDashoffset: len });

        gsap.fromTo(
          pathEl,
          { strokeDashoffset: len },
          {
            strokeDashoffset: -30,
            duration: gsap.utils.random(2.5, 4.0),
            repeat: -1,
            ease: "none",
            delay: gsap.utils.random(0, 2),
          }
        );
      });

      if (rootPath && rootTrail) {
        const rootLen = rootPath.getTotalLength();
        // Hide the scroll-linked colorful overlay initially
        gsap.set(rootPath, { strokeDasharray: rootLen, strokeDashoffset: rootLen });
        // Set trunk trail to a small 50px dash followed by a gap equal to the path length
        gsap.set(rootTrail, { strokeDasharray: `50 ${rootLen}`, strokeDashoffset: rootLen });

        // Draw the colorful overlay path downward on scroll
        gsap.to(rootPath, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });

        // Continuous energy pulse traveling down the trunk
        gsap.fromTo(
          rootTrail,
          { strokeDashoffset: rootLen },
          {
            strokeDashoffset: -50,
            duration: 3.5,
            repeat: -1,
            ease: "none",
          }
        );
      }
    });

    let animationId: number;
    const render = () => {
      ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

      const progress = scrollObj.progress;
      const speedMultiplier = 1 + progress * 3.5;
      const gridOpacity = 0.015 * (1 - progress);

      // Smooth mouse coordinate lerping
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      if (treeContainerRef.current) {
        gsap.set(treeContainerRef.current, {
          x: mouseX * 15,
          y: mouseY * 15,
        });
      }

      ctxCanvas.save();
      // Translate the context to produce subtle 3D parallax depth
      ctxCanvas.translate(mouseX * 30, mouseY * 30);

      // 1. Render volumetric glows
      glows.forEach((g) => {
        g.x += g.vx * speedMultiplier;
        g.y += g.vy * speedMultiplier;

        // Bounce off bounds
        if (g.x - g.r < 0 || g.x + g.r > canvas.width) g.vx *= -1;
        if (g.y - g.r < 0 || g.y + g.r > canvas.height) g.vy *= -1;

        const gradient = ctxCanvas.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        gradient.addColorStop(0, g.color);
        gradient.addColorStop(1, "transparent");

        ctxCanvas.fillStyle = gradient;
        ctxCanvas.fillRect(-100, -100, canvas.width + 200, canvas.height + 200);
      });

      // 2. Render digital overlay grid
      ctxCanvas.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
      ctxCanvas.lineWidth = 0.7;
      gridOffset = (gridOffset + 0.15 * speedMultiplier) % 60;

      for (let x = gridOffset; x < canvas.width; x += 60) {
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(x, 0);
        ctxCanvas.lineTo(x, canvas.height);
        ctxCanvas.stroke();
      }
      for (let y = gridOffset; y < canvas.height; y += 60) {
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(0, y);
        ctxCanvas.lineTo(canvas.width, y);
        ctxCanvas.stroke();
      }

      // 3. Render drifting grid nodes
      nodes.forEach((n, i) => {
        n.x += n.vx * speedMultiplier;
        n.y += n.vy * speedMultiplier;

        if (n.x < 0) n.x = canvas.width;
        if (n.x > canvas.width) n.x = 0;
        if (n.y < 0) n.y = canvas.height;
        if (n.y > canvas.height) n.y = 0;

        ctxCanvas.beginPath();
        ctxCanvas.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctxCanvas.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctxCanvas.fill();

        // Connect near nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.hypot(n.x - other.x, n.y - other.y);
          if (dist < 100) {
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(n.x, n.y);
            ctxCanvas.lineTo(other.x, other.y);
            ctxCanvas.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / 100) * (1 - progress)})`;
            ctxCanvas.lineWidth = 0.4;
            ctxCanvas.stroke();
          }
        }
      });

      ctxCanvas.restore();
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
      gsapCtx.revert();
    };
  }, []);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(targetElement, { offset: -80, duration: 1.5 });
      } else {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const line1 = "Ideas that Grow.";
  const line2 = "Technology that Connects.";
  const line3 = "Brands that Evolve.";

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  } as const;

  const wordVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  } as const;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-start justify-start pt-32 md:pt-40 pb-28 px-8 md:px-24 overflow-x-hidden select-none"
    >
      {/* Local Background Canvas for Grid, Nodes, and Volumetric Light Trails */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
        style={{ background: "#000000" }}
      />

      <div className="max-w-2xl w-full text-left flex flex-col items-start z-10 gap-6">
        {/* Animated Central Logo Wrapper */}
        <div ref={logoWrapperRef as any} className="mb-2">
          <Logo className="w-44 md:w-52 h-auto" animateOnLoad={true} interactive={true} permanentGlow={true} />
        </div>

        {/* Elegant Smaller Headline composed together */}
        <motion.h1
          ref={headlineRef as any}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-lg md:text-[32px] font-bohuan tracking-wide leading-relaxed text-white mb-2 uppercase flex flex-col gap-1.5"
        >
          <div ref={line1Ref} className="block">
            {line1.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-2.5">
                {word}
              </motion.span>
            ))}
          </div>
          <div ref={line2Ref} className="block">
            {line2.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-2.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(47,128,236,0.35)]"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div ref={line3Ref} className="block">
            {line3.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-2.5">
                {word}
              </motion.span>
            ))}
          </div>
        </motion.h1>

        {/* Description Sitting Closer */}
        <motion.p
          ref={descriptionRef as any}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          className="max-w-lg text-white/50 text-xs md:text-[13px] font-cascadia leading-relaxed mb-6"
        >
          We build intelligent digital experiences through Development, Branding, Marketing and Business Strategy.
        </motion.p>
      </div>

      {/* CTA Buttons Sitting Closer (Centered on screen so vertical root line passes exactly through the gap) */}
      <motion.div
        ref={ctaWrapperRef as any}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
        className="flex flex-col sm:flex-row gap-5 justify-center w-full z-10"
      >
        <div ref={ctaPrimaryRef as any}>
          <a
            href="#contact"
            onClick={(e) => handleCtaClick(e, "contact")}
            className="relative inline-flex items-center justify-center px-8 py-3 rounded-full text-[11px] uppercase tracking-wider font-semibold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red text-white border border-transparent hover:brightness-110 transition-all duration-300 w-40 hover:shadow-[0_0_20px_rgba(47,128,236,0.5)] cursor-pointer"
          >
            Start a Project
          </a>
        </div>
        <div ref={ctaSecondaryRef as any}>
          <a
            href="#work"
            onClick={(e) => handleCtaClick(e, "work")}
            className="relative inline-flex items-center justify-center px-8 py-3 rounded-full text-[11px] uppercase tracking-wider font-semibold text-white border border-white/20 hover:border-white transition-all duration-300 w-40 hover:bg-white/5 cursor-pointer"
          >
            Explore Our Work
          </a>
        </div>
      </motion.div>

      {/* Premium Digital Technology Tree (Swaying Cybernetic Network) */}
      <div
        ref={treeContainerRef as any}
        className="absolute bottom-[-280px] left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-[1200px] pointer-events-none z-0 overflow-visible"
      >
        {/* Living Core Anchors linked directly to the tree coordinate system */}
        <div id="hero-core-start" className="absolute left-[62%] top-[40%] w-2 h-2 pointer-events-none opacity-0" />
        <div id="hero-core-trunk-top" className="absolute left-1/2 -translate-x-1/2 top-[40%] w-2 h-2 pointer-events-none opacity-0" />
        <div id="hero-core-trunk-bottom" className="absolute left-1/2 -translate-x-1/2 top-[100%] w-2 h-2 pointer-events-none opacity-0" />

        <svg
          viewBox="0 0 1000 1200"
          className="w-full h-full overflow-visible"
          fill="none"
        >
          <defs>
            {/* Trunk Scroll Gradient */}
            <linearGradient id="hero-scroll-root-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9A51E0" />
              <stop offset="25%" stopColor="#2F80EC" />
              <stop offset="50%" stopColor="#219652" />
              <stop offset="75%" stopColor="#F2C94D" />
              <stop offset="100%" stopColor="#EB5757" />
            </linearGradient>

            {/* Trail Gradient */}
            <linearGradient id="hero-trail-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* 1. Base Trunk Guide (Subtle transparent colorful gradient) */}
          <path
            d="M 500 480 L 500 640 C 550 760, 450 840, 500 920 C 505 1000, 495 1100, 500 1200"
            stroke="url(#hero-scroll-root-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.25"
          />

          {/* 2. Scroll-Linked Trunk Overlay (Drawn on scroll) */}
          <path
            ref={rootPathRef}
            id="hero-root-path"
            d="M 500 480 L 500 640 C 550 760, 450 840, 500 920 C 505 1000, 495 1100, 500 1200"
            stroke="url(#hero-scroll-root-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 3. Trunk Energy Flow Trail */}
          <path
            ref={rootTrailRef}
            id="hero-root-trail"
            d="M 500 480 L 500 640 C 550 760, 450 840, 500 920 C 505 1000, 495 1100, 500 1200"
            stroke="url(#hero-trail-gradient)"
            strokeWidth="2.0"
            strokeLinecap="round"
            opacity="0.6"
            style={{ filter: "drop-shadow(0 0 3px #2F80EC)" }}
          />

          {/* 4. Swaying Branch Groups */}
          {/* sway-group-1: Left Outer (Web Development & Mobile Apps) */}
          <g className="sway-group-1">
            <path
              d="M 100 400 L 220 400 L 320 500 L 500 600"
              stroke="#2F80EC"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 100 400 L 220 400 L 320 500 L 500 600"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #2F80EC)" }}
            />
            <path
              d="M 180 360 L 220 360 L 220 400"
              stroke="#EB5757"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 180 360 L 220 360 L 220 400"
              stroke="#FFFFFF"
              strokeWidth="1.0"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: "drop-shadow(0 0 1.5px #EB5757)" }}
            />
            {/* Junction Nodes */}
            <circle cx="220" cy="400" r="3" className="animate-node-blink" style={{ "--node-color": "#2F80EC" } as any} />
            <circle cx="320" cy="500" r="3" className="animate-node-blink" style={{ "--node-color": "#2F80EC", animationDelay: "0.5s" } as any} />

            <foreignObject x={50} y={350} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[0]} />
            </foreignObject>
            <foreignObject x={130} y={310} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[1]} />
            </foreignObject>
          </g>

          {/* sway-group-2: Right Outer (APIs & Cloud) */}
          <g className="sway-group-2">
            <path
              d="M 900 400 L 780 400 L 680 500 L 500 600"
              stroke="#219652"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 900 400 L 780 400 L 680 500 L 500 600"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #219652)" }}
            />
            <path
              d="M 820 360 L 780 360 L 780 400"
              stroke="#2F80EC"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 820 360 L 780 360 L 780 400"
              stroke="#FFFFFF"
              strokeWidth="1.0"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: "drop-shadow(0 0 1.5px #2F80EC)" }}
            />
            {/* Junction Nodes */}
            <circle cx="780" cy="400" r="3" className="animate-node-blink" style={{ "--node-color": "#219652" } as any} />
            <circle cx="680" cy="500" r="3" className="animate-node-blink" style={{ "--node-color": "#219652", animationDelay: "0.5s" } as any} />

            <foreignObject x={850} y={350} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[2]} />
            </foreignObject>
            <foreignObject x={770} y={310} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[3]} />
            </foreignObject>
          </g>

          {/* sway-group-3: Left Mid (AI & UI/UX) */}
          <g className="sway-group-3">
            <path
              d="M 130 240 L 250 240 L 350 340 L 500 480"
              stroke="#9A51E0"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 130 240 L 250 240 L 350 340 L 500 480"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #9A51E0)" }}
            />
            <path
              d="M 220 180 L 250 180 L 250 240"
              stroke="#F2C94D"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 220 180 L 250 180 L 250 240"
              stroke="#FFFFFF"
              strokeWidth="1.0"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: "drop-shadow(0 0 1.5px #F2C94D)" }}
            />
            {/* Junction Nodes */}
            <circle cx="250" cy="240" r="3" className="animate-node-blink" style={{ "--node-color": "#9A51E0" } as any} />
            <circle cx="350" cy="340" r="3" className="animate-node-blink" style={{ "--node-color": "#9A51E0", animationDelay: "0.8s" } as any} />

            <foreignObject x={80} y={190} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[4]} />
            </foreignObject>
            <foreignObject x={170} y={130} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[5]} />
            </foreignObject>
          </g>

          {/* sway-group-4: Right Mid (Branding & Digital Marketing) */}
          <g className="sway-group-4">
            <path
              d="M 870 240 L 750 240 L 650 340 L 500 480"
              stroke="#EB5757"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 870 240 L 750 240 L 650 340 L 500 480"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #EB5757)" }}
            />
            <path
              d="M 780 180 L 750 180 L 750 240"
              stroke="#219652"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 780 180 L 750 180 L 750 240"
              stroke="#FFFFFF"
              strokeWidth="1.0"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: "drop-shadow(0 0 1.5px #219652)" }}
            />
            {/* Junction Nodes */}
            <circle cx="750" cy="240" r="3" className="animate-node-blink" style={{ "--node-color": "#EB5757" } as any} />
            <circle cx="650" cy="340" r="3" className="animate-node-blink" style={{ "--node-color": "#EB5757", animationDelay: "0.8s" } as any} />

            <foreignObject x={820} y={190} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[6]} />
            </foreignObject>
            <foreignObject x={730} y={130} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[7]} />
            </foreignObject>
          </g>

          {/* sway-group-5: Left Inner (Business Strategy) */}
          <g className="sway-group-5">
            <path
              d="M 250 160 L 350 160 L 420 230 L 500 480"
              stroke="#9A51E0"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 250 160 L 350 160 L 420 230 L 500 480"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #9A51E0)" }}
            />
            {/* Junction Nodes */}
            <circle cx="350" cy="160" r="3" className="animate-node-blink" style={{ "--node-color": "#9A51E0" } as any} />
            <circle cx="420" cy="230" r="3" className="animate-node-blink" style={{ "--node-color": "#9A51E0", animationDelay: "1.2s" } as any} />

            <foreignObject x={200} y={110} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[8]} />
            </foreignObject>
          </g>

          {/* sway-group-6: Right Inner (Media Production) */}
          <g className="sway-group-6">
            <path
              d="M 750 160 L 650 160 L 580 230 L 500 480"
              stroke="#F2C94D"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 750 160 L 650 160 L 580 230 L 500 480"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #F2C94D)" }}
            />
            {/* Junction Nodes */}
            <circle cx="650" cy="160" r="3" className="animate-node-blink" style={{ "--node-color": "#F2C94D" } as any} />
            <circle cx="580" cy="230" r="3" className="animate-node-blink" style={{ "--node-color": "#F2C94D", animationDelay: "1.2s" } as any} />

            <foreignObject x={700} y={110} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[9]} />
            </foreignObject>
          </g>

          {/* sway-group-7: Center (Analytics & Payment Systems) */}
          <g className="sway-group-7">
            <path
              d="M 450 180 L 450 280 L 500 330 L 500 480"
              stroke="#F3994B"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 450 180 L 450 280 L 500 330 L 500 480"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #F3994B)" }}
            />
            <path
              d="M 550 180 L 550 280 L 500 330"
              stroke="#F3994B"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.15"
            />
            <path
              className="hero-branch-trail"
              d="M 550 180 L 550 280 L 500 330"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
              style={{ filter: "drop-shadow(0 0 2px #F3994B)" }}
            />
            {/* Junction Nodes */}
            <circle cx="450" cy="280" r="3" className="animate-node-blink" style={{ "--node-color": "#F3994B" } as any} />
            <circle cx="550" cy="280" r="3" className="animate-node-blink" style={{ "--node-color": "#F3994B", animationDelay: "0.3s" } as any} />
            <circle cx="500" cy="330" r="3" className="animate-node-blink" style={{ "--node-color": "#F3994B", animationDelay: "0.6s" } as any} />

            <foreignObject x={400} y={130} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[10]} />
            </foreignObject>
            <foreignObject x={500} y={130} width="100" height="100" className="overflow-visible">
              <NodeComponent node={TECH_NODES[11]} />
            </foreignObject>
          </g>
        </svg>
      </div>
    </section>
  );
}
