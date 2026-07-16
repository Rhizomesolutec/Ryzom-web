"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TARGET_SELECTORS = [
  "#hero-core-start",
  "#hero-core-trunk-top",
  "#hero-core-trunk-bottom",
  "#why-ryzom-node-0",
  "#why-ryzom-node-1",
  "#why-ryzom-node-2",
  "#why-ryzom-node-3",
  "#why-ryzom-node-4",
  "#services-trunk-top",
  "#services-card-0",
  "#services-card-1",
  "#services-card-2",
  "#services-card-3",
  "#services-card-4",
  "#services-trunk-bottom",
  "#work-card-0",
  "#work-card-1",
  "#work-card-2",
  "#work-card-3",
  "#about-core-foundation",
  "#contact-logo"
];

// Official RYZOM Brand Colors
const COLORS = [
  "#2F80EC", // Blue
  "#EB5757", // Red
  "#219652", // Green
  "#F2C94D", // Yellow
  "#9A51E0", // Purple
  "#F3994B"  // Orange
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  angle?: number;
  radius?: number;
  speed?: number;
}

export default function LivingCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ progressIndex: 0 });
  const [existingTargets, setExistingTargets] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  // Physics positions
  const posRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });

  // Responsive scale hook (Mobile: 33px, Tablet: 48px, Desktop: 52px)
  const [coreScale, setCoreScale] = useState(1.0);
  const scaleRef = useRef(1.0);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      let scale = 1.0;
      if (w <= 768) {
        scale = 0.635; // Keeps mobile size at 33px (52 * 0.635 ≈ 33px)
      } else if (w <= 1024) {
        scale = 0.923; // Keeps tablet size at 48px (52 * 0.923 ≈ 48px)
      } else {
        scale = 1.0;   // Desktop size: 52px (13% smaller than 60px)
      }
      setCoreScale(scale);
      scaleRef.current = scale;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Identify which anchors are present in the DOM
  useEffect(() => {
    const scanTargets = () => {
      const present = TARGET_SELECTORS.filter((sel) => document.querySelector(sel) !== null);
      setExistingTargets(present);
    };

    // Delay scan slightly to let Next.js client-side hydrate completely
    const timer = setTimeout(() => {
      scanTargets();
      setIsReady(true);
    }, 800);

    window.addEventListener("resize", scanTargets);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", scanTargets);
    };
  }, []);

  // 2. Set up ScrollTrigger to animate progressIndex smoothly across targets
  useEffect(() => {
    if (!isReady || existingTargets.length === 0) return;

    // Track scroll timeline
    const state = stateRef.current;

    // Create scrubbed GSAP timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          // Detect if we've reached the final contact logo target (last index)
          const isAtEnd = self.progress > 0.96;
          setIsDissolved(isAtEnd);
        }
      }
    });

    // Smooth continuous timeline for flow (not stuck anywhere, slow flow)
    tl.to(state, {
      progressIndex: existingTargets.length - 1,
      ease: "none",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (typeof document !== "undefined" && t.trigger === document.body) {
          t.kill();
        }
      });
    };
  }, [isReady, existingTargets]);

  // 3. Track Mouse movements for magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // 4. Setup Canvas Particle System and Lerp Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle arrays
    const orbiters: Particle[] = [];
    const trail: Particle[] = [];
    const disperse: Particle[] = [];

    // Initialize orbiters
    for (let i = 0; i < 35; i++) {
      orbiters.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.8 + 0.6,
        color: COLORS[i % COLORS.length],
        life: 0,
        maxLife: 0,
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 22 + 10,
        speed: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    // Reaction tracking state
    let lastMethodologyNode = -1;
    let lastActiveServiceCard = -1;

    let animFrame: number;

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progress = stateRef.current.progressIndex;
      const index = Math.min(existingTargets.length - 1, Math.max(0, progress));

      // Calculate Target Coordinates in screen space
      const idxA = Math.floor(index);
      const idxB = Math.ceil(index);
      const weight = index - idxA;

      const elA = document.querySelector(existingTargets[idxA]) as HTMLElement;
      const elB = document.querySelector(existingTargets[idxB]) as HTMLElement;

      let rawX = window.innerWidth / 2;
      let rawY = window.innerHeight / 2;

      if (elA && elB) {
        const rectA = elA.getBoundingClientRect();
        const rectB = elB.getBoundingClientRect();

        const xA = rectA.left + rectA.width / 2;
        const yA = rectA.top + rectA.height / 2;
        const xB = rectB.left + rectB.width / 2;
        const yB = rectB.top + rectB.height / 2;

        rawX = xA * (1 - weight) + xB * weight;
        rawY = yA * (1 - weight) + yB * weight;
      } else if (elA) {
        const rectA = elA.getBoundingClientRect();
        rawX = rectA.left + rectA.width / 2;
        rawY = rectA.top + rectA.height / 2;
      }

      // Constrain Y coordinate to remain near the top of the viewport (like passing on a road)
      const targetY = window.innerHeight * 0.15;
      let tx = rawX;
      let ty = targetY;

      if (index < 1.0) {
        // Hero Section: Blend from start position to top Y
        const blend = Math.max(0, 1 - index);
        ty = rawY * blend + targetY * (1 - blend);
      } else if (index > existingTargets.length - 2) {
        // Contact Section: Blend from top Y to final contact logo position
        const blend = Math.min(1, index - (existingTargets.length - 2));
        ty = targetY * (1 - blend) + rawY * blend;
      } else {
        // Middle sections: strictly stay at the top to simulate driving on a road
        ty = targetY;
      }

      // Add a slow, organic breathing float & noise drift (Living guide feeling)
      const time = Date.now() * 0.0012;
      const breathing = Math.sin(time * 1.5) * 12;
      const driftX = Math.sin(time) * 10;
      const driftY = Math.cos(time * 0.8) * 10;

      tx += driftX;
      ty += breathing + driftY;

      posRef.current.targetX = tx;
      posRef.current.targetY = ty;

      // Spring Physics for core position
      let cx = posRef.current.currentX;
      let cy = posRef.current.currentY;

      if (cx === 0 && cy === 0) {
        cx = tx;
        cy = ty;
      } else {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
      }

      posRef.current.currentX = cx;
      posRef.current.currentY = cy;

      // 5. Environmental Reactions & Triggers

      // (A) WhyRyzom Section: Trigger stages click
      const roundedIndex = Math.round(index);
      // Index indices 3 to 7 correspond to why-ryzom-node-0 to why-ryzom-node-4
      if (roundedIndex >= 3 && roundedIndex <= 7) {
        const stageIdx = roundedIndex - 3;
        if (stageIdx !== lastMethodologyNode) {
          lastMethodologyNode = stageIdx;
          const nodeBtn = document.getElementById(`why-ryzom-node-${stageIdx}`);
          if (nodeBtn) {
            nodeBtn.click();
          }
        }
      }

      // (B) Services Section Glow highlights
      // Indices 9 to 13 correspond to services-card-0 to services-card-4
      for (let i = 0; i < 5; i++) {
        const card = document.getElementById(`services-card-${i}`);
        if (card) {
          if (roundedIndex === i + 9) {
            card.classList.add("services-card-glow-active");
            // Set dynamic Tailwind RGB color variable matching card color
            const brandColors = ["235, 87, 87", "47, 128, 236", "33, 150, 82", "242, 201, 77", "154, 81, 224"];
            card.style.setProperty("--active-glow-color", brandColors[i]);
          } else {
            card.classList.remove("services-card-glow-active");
          }
        }
      }

      // (C) Work Section project glows
      // Indices 15 to 18 correspond to work-card-0 to work-card-3
      for (let i = 0; i < 4; i++) {
        const card = document.getElementById(`work-card-${i}`);
        if (card) {
          if (roundedIndex === i + 15) {
            card.classList.add("work-card-glow-active");
            const brandColors = ["47, 128, 236", "235, 87, 87", "33, 150, 82", "242, 201, 77"];
            card.style.setProperty("--active-glow-color", brandColors[i]);
          } else {
            card.classList.remove("work-card-glow-active");
          }
        }
      }

      // (D) About Foundation Glow
      const aboutFoundation = document.getElementById("about-core-foundation");
      if (aboutFoundation) {
        if (roundedIndex === 19) {
          aboutFoundation.classList.add("about-foundation-glow-active");
        } else {
          aboutFoundation.classList.remove("about-foundation-glow-active");
        }
      }

      // (E) Hero Trunk Glow
      const heroTrunkPath = document.getElementById("hero-root-path");
      const heroTrunkTrail = document.getElementById("hero-root-trail");
      if (heroTrunkPath && heroTrunkTrail) {
        if (roundedIndex >= 1 && roundedIndex <= 2) {
          heroTrunkPath.style.filter = "drop-shadow(0 0 10px rgba(154, 81, 224, 0.9))";
          (heroTrunkPath as any).style.strokeWidth = "5.5px";
          (heroTrunkTrail as any).style.opacity = "1.0";
        } else {
          heroTrunkPath.style.filter = "none";
          (heroTrunkPath as any).style.strokeWidth = "3.5px";
          (heroTrunkTrail as any).style.opacity = "0.6";
        }
      }

      // Mouse Lerp Spring Physics
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Magnetic Core Offset
      let drawX = cx;
      let drawY = cy;
      let isMagnetic = false;

      if (mouse.active) {
        const distToMouse = Math.hypot(mouse.x - cx, mouse.y - cy);
        if (distToMouse < 180) {
          isMagnetic = true;
          const pullStrength = (1 - distToMouse / 180) * 0.4;
          drawX += (mouse.x - cx) * pullStrength;
          drawY += (mouse.y - cy) * pullStrength;
        }
      }

      // Update HTML core glass shell position (Using translate(-50%, -50%) for perfect auto-centering)
      const coreHtml = coreRef.current;
      if (coreHtml) {
        if (isDissolved) {
          coreHtml.style.opacity = "0";
          coreHtml.style.transform = `translate3d(${drawX}px, ${drawY}px, 0) translate(-50%, -50%) scale(0)`;
        } else {
          coreHtml.style.opacity = "1";
          coreHtml.style.transform = `translate3d(${drawX}px, ${drawY}px, 0) translate(-50%, -50%) scale(${isMagnetic ? 1.15 : 1})`;
        }
      }

      // 6. Draw Particle System

      // --- A. Draw Trail Particles ---
      // Emit trail particle if moving (Scale emitter spread and particle sizes)
      const coreSpeed = Math.hypot(tx - cx, ty - cy);
      if (!isDissolved && coreSpeed > 0.8 && Math.random() < 0.6) {
        trail.push({
          x: drawX + (Math.random() - 0.5) * 8 * scaleRef.current,
          y: drawY + (Math.random() - 0.5) * 8 * scaleRef.current,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 + 0.2, // slight upward drift
          size: (Math.random() * 2.5 + 0.8) * scaleRef.current,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 45,
          maxLife: 45
        });
      }

      // Update and draw trails
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life--;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;

        const ratio = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8 * scaleRef.current;
        ctx.globalAlpha = ratio * 0.55;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // --- B. Draw Orbit Particles (Scale orbits and size)
      if (!isDissolved) {
        orbiters.forEach((p) => {
          if (p.angle !== undefined && p.radius !== undefined && p.speed !== undefined) {
            // Speed up orbits if magnetic attraction active
            const speedMult = isMagnetic ? 2.5 : 1.0;
            p.angle += p.speed * speedMult;

            // Animate radius breathing
            const breathe = Math.sin(Date.now() * 0.003 + p.angle) * 3;
            const r = (p.radius + breathe + (isMagnetic ? -6 : 0)) * scaleRef.current;

            p.x = drawX + Math.cos(p.angle) * r;
            p.y = drawY + Math.sin(p.angle) * r;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * scaleRef.current, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6 * scaleRef.current;
            ctx.globalAlpha = 0.8;
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      // --- C. Draw Logo Dispersion Particles ---
      if (isDissolved) {
        // Emit dispersing cloud from the final destination logo
        if (Math.random() < 0.55) {
          disperse.push({
            x: drawX + (Math.random() - 0.5) * 80 * scaleRef.current,
            y: drawY + (Math.random() - 0.5) * 20 * scaleRef.current,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 0.8 - 0.3, // flow upward
            size: (Math.random() * 2.2 + 0.6) * scaleRef.current,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 60,
            maxLife: 60
          });
        }
      }

      // Update and draw dispersion cloud
      for (let i = disperse.length - 1; i >= 0; i--) {
        const p = disperse[i];
        p.life--;
        if (p.life <= 0) {
          disperse.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;

        const ratio = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8 * scaleRef.current;
        ctx.globalAlpha = ratio * 0.75;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animFrame = requestAnimationFrame(updateAndRender);
    };

    updateAndRender();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isReady, existingTargets, isDissolved]);

  if (existingTargets.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden"
    >
      {/* Background canvas for trails, rays, and orbiting particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 3D Glassmorphic Living Core Sphere */}
      <div
        ref={coreRef}
        className="absolute rounded-full pointer-events-none transition-all duration-300 ease-out flex items-center justify-center"
        style={{
          width: `${52 * coreScale}px`,
          height: `${52 * coreScale}px`,
          opacity: 0,
          transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background: "radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.6) 100%)",
          border: `${1.1 * coreScale}px solid rgba(255, 255, 255, 0.35)`,
          boxShadow: `
            inset 0 ${2.5 * coreScale}px ${4.5 * coreScale}px rgba(255, 255, 255, 0.4),
            inset 0 -${2.5 * coreScale}px ${4.5 * coreScale}px rgba(0, 0, 0, 0.5),
            0 ${8 * coreScale}px ${26 * coreScale}px rgba(0, 0, 0, 0.8),
            0 0 ${16 * coreScale}px rgba(47, 128, 236, 0.15)
          `
        }}
      >
        {/* Dynamic rotating internal gradient core */}
        <div
          className="rounded-full animate-spin-slow-core opacity-90 relative"
          style={{
            width: `${20.8 * coreScale}px`,
            height: `${20.8 * coreScale}px`,
            background: "conic-gradient(from 0deg, #2F80EC, #EB5757, #219652, #F2C94D, #9A51E0, #F3994B, #2F80EC)",
            filter: `blur(${1.7 * coreScale}px)`,
            boxShadow: `
              0 0 ${8 * coreScale}px rgba(47, 128, 236, 0.8),
              0 0 ${16 * coreScale}px rgba(235, 87, 87, 0.6),
              0 0 ${24 * coreScale}px rgba(33, 150, 82, 0.4)
            `
          }}
        >
          {/* Extremely bright nucleus spot */}
          <div
            className="absolute bg-white rounded-full filter blur-[1px]"
            style={{
              inset: `${5.2 * coreScale}px`,
              boxShadow: `0 0 ${10 * coreScale}px #fff`
            }}
          />
        </div>

        {/* Outer dynamic breathing halo ring */}
        <div
          className="absolute rounded-full border border-white/10 opacity-30 animate-pulse"
          style={{
            inset: `-${2.6 * coreScale}px`,
            boxShadow: `0 0 ${10 * coreScale}px rgba(255,255,255,0.08)`
          }}
        />
      </div>
    </div>
  );
}
