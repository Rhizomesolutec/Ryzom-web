"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

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
  "#about-node-0",
  "#about-node-1",
  "#about-node-2",
  "#about-node-3",
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

interface JourneyStep {
  id: string;
  sectionId: string;
  targetSelector: string;
  whyRyzomStageIdx?: number;
  servicesCardIdx?: number;
  workCardIdx?: number;
  aboutCardIdx?: number;
}

const JOURNEY_STEPS: JourneyStep[] = [
  { id: "hero", sectionId: "hero", targetSelector: "#hero-core-start" },

  { id: "why-ryzom-0", sectionId: "why-ryzom", targetSelector: "#why-ryzom-node-0", whyRyzomStageIdx: 0 },
  { id: "why-ryzom-1", sectionId: "why-ryzom", targetSelector: "#why-ryzom-node-1", whyRyzomStageIdx: 1 },
  { id: "why-ryzom-2", sectionId: "why-ryzom", targetSelector: "#why-ryzom-node-2", whyRyzomStageIdx: 2 },
  { id: "why-ryzom-3", sectionId: "why-ryzom", targetSelector: "#why-ryzom-node-3", whyRyzomStageIdx: 3 },
  { id: "why-ryzom-4", sectionId: "why-ryzom", targetSelector: "#why-ryzom-node-4", whyRyzomStageIdx: 4 },

  { id: "services-0", sectionId: "services", targetSelector: "#services-card-0", servicesCardIdx: 0 },
  { id: "services-1", sectionId: "services", targetSelector: "#services-card-1", servicesCardIdx: 1 },
  { id: "services-2", sectionId: "services", targetSelector: "#services-card-2", servicesCardIdx: 2 },
  { id: "services-3", sectionId: "services", targetSelector: "#services-card-3", servicesCardIdx: 3 },
  { id: "services-4", sectionId: "services", targetSelector: "#services-card-4", servicesCardIdx: 4 },

  { id: "work-0", sectionId: "work", targetSelector: "#work-card-0", workCardIdx: 0 },
  { id: "work-1", sectionId: "work", targetSelector: "#work-card-1", workCardIdx: 1 },
  { id: "work-2", sectionId: "work", targetSelector: "#work-card-2", workCardIdx: 2 },
  { id: "work-3", sectionId: "work", targetSelector: "#work-card-3", workCardIdx: 3 },

  // About — foundation, then each timeline card one-by-one
  { id: "about-foundation", sectionId: "about", targetSelector: "#about-core-foundation" },
  { id: "about-0", sectionId: "about", targetSelector: "#about-node-0", aboutCardIdx: 0 },
  { id: "about-1", sectionId: "about", targetSelector: "#about-node-1", aboutCardIdx: 1 },
  { id: "about-2", sectionId: "about", targetSelector: "#about-node-2", aboutCardIdx: 2 },
  { id: "about-3", sectionId: "about", targetSelector: "#about-node-3", aboutCardIdx: 3 },

  { id: "contact", sectionId: "contact", targetSelector: "#contact-logo" },
];

function scrollToY(y: number, duration = 0.55) {
  const maxScroll = Math.max(
    0,
    (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight
  );
  const top = Math.max(0, Math.min(y, maxScroll));
  const lenis = (window as any).lenis;
  if (lenis) {
    // Interrupt any in-flight scroll so reverse never queues / feels stuck
    lenis.scrollTo(top, { duration, immediate: false, force: true, lock: false });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
}

/** Snap section flush to viewport top — avoids mid-gap landings between sections */
function getSectionScrollY(sectionId: string): number {
  if (sectionId === "hero") return 0;
  const el = document.getElementById(sectionId);
  if (!el) return window.scrollY;

  const rect = el.getBoundingClientRect();
  return window.scrollY + rect.top;
}

/** Center a journey target in the viewport (About / Contact) */
function getTargetCenteredScrollY(selector: string): number {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return window.scrollY;
  const rect = el.getBoundingClientRect();
  return window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
}

function getWorkStepScrollY(workCardIdx: number): number {
  // Home Work is horizontal-pinned — scrub within pin distance
  const work = document.getElementById("work");
  if (!work) return window.scrollY;
  const base = getSectionScrollY("work");
  const track = work.querySelector('[style*="max-content"]') as HTMLElement | null;
  const scrollWidth = track?.scrollWidth ?? window.innerWidth;
  const pinDist = Math.max(scrollWidth - window.innerWidth, 0);
  const total = JOURNEY_STEPS.filter((s) => s.workCardIdx !== undefined).length;
  const t = workCardIdx / Math.max(total - 1, 1);
  return base + pinDist * t;
}

export default function LivingCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ progressIndex: 0 });
  const [existingTargets, setExistingTargets] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  const stepRef = useRef(0);
  const isLockRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSectionRef = useRef<string>("hero");
  const dissolveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const posRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });

  const [coreScale, setCoreScale] = useState(1.0);
  const scaleRef = useRef(1.0);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      let scale = 1.0;
      if (w <= 768) scale = 0.635;
      else if (w <= 1024) scale = 0.923;
      else scale = 1.0;
      setCoreScale(scale);
      scaleRef.current = scale;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const scanTargets = () => {
      const present = TARGET_SELECTORS.filter((sel) => document.querySelector(sel) !== null);
      setExistingTargets(present);
    };

    const timer = setTimeout(() => {
      scanTargets();
      setIsReady(true);
    }, 600);

    window.addEventListener("resize", scanTargets);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", scanTargets);
    };
  }, []);

  const executeStep = useCallback((targetStepIdx: number) => {
    const newIdx = Math.max(0, Math.min(JOURNEY_STEPS.length - 1, targetStepIdx));
    // Already on this step (e.g. last Contact step) — don't re-fire scroll to page bottom
    if (newIdx === stepRef.current) return;

    const prevIdx = stepRef.current;
    const goingUp = newIdx < prevIdx;
    stepRef.current = newIdx;
    const step = JOURNEY_STEPS[newIdx];
    const prevStep = JOURNEY_STEPS[prevIdx];

    // 1. Move core toward this journey target (snappy — kills prior tween so reverse isn't lagged)
    const elemIdx = existingTargets.indexOf(step.targetSelector);
    if (elemIdx !== -1) {
      gsap.killTweensOf(stateRef.current);
      gsap.to(stateRef.current, {
        progressIndex: elemIdx,
        duration: goingUp ? 0.4 : 0.55,
        ease: "power2.out",
        overwrite: true,
      });

      if (dissolveTimerRef.current) {
        clearTimeout(dissolveTimerRef.current);
        dissolveTimerRef.current = null;
      }

      if (step.sectionId === "contact") {
        dissolveTimerRef.current = setTimeout(() => {
          if (stepRef.current === newIdx) setIsDissolved(true);
        }, 500);
      } else {
        setIsDissolved(false);
      }
    }

    // 2. Scroll — shorter durations on reverse so upward never feels stuck
    const scrollDur = goingUp ? 0.45 : 0.55;
    const sectionChanged = !prevStep || prevStep.sectionId !== step.sectionId;

    if (step.sectionId === "why-ryzom") {
      if (sectionChanged || prevSectionRef.current !== "why-ryzom") {
        scrollToY(getSectionScrollY("why-ryzom"), scrollDur);
      }
    } else if (step.sectionId === "work" && step.workCardIdx !== undefined) {
      scrollToY(getWorkStepScrollY(step.workCardIdx), scrollDur);
    } else if (step.sectionId === "services" && step.servicesCardIdx !== undefined) {
      scrollToY(getTargetCenteredScrollY(step.targetSelector), scrollDur);
    } else if (step.sectionId === "about" || step.sectionId === "contact") {
      scrollToY(getTargetCenteredScrollY(step.targetSelector), scrollDur);
    } else {
      scrollToY(getSectionScrollY(step.sectionId), scrollDur);
    }

    prevSectionRef.current = step.sectionId;

    // 3. Why Ryzom — activate stage one-by-one
    if (step.whyRyzomStageIdx !== undefined) {
      const nodeBtn = document.getElementById(`why-ryzom-node-${step.whyRyzomStageIdx}`);
      if (nodeBtn) nodeBtn.click();
    }

    // 4. Services glow
    for (let i = 0; i < 5; i++) {
      const card = document.getElementById(`services-card-${i}`);
      if (!card) continue;
      if (step.servicesCardIdx === i) {
        card.classList.add("services-card-glow-active");
        const brandColors = ["235, 87, 87", "47, 128, 236", "33, 150, 82", "242, 201, 77", "154, 81, 224"];
        card.style.setProperty("--active-glow-color", brandColors[i]);
      } else {
        card.classList.remove("services-card-glow-active");
      }
    }

    // 5. Work glow
    for (let i = 0; i < 4; i++) {
      const card = document.getElementById(`work-card-${i}`);
      if (!card) continue;
      if (step.workCardIdx === i) {
        card.classList.add("work-card-glow-active");
        const brandColors = ["235, 87, 87", "47, 128, 236", "33, 150, 82", "242, 201, 77"];
        card.style.setProperty("--active-glow-color", brandColors[i]);
      } else {
        card.classList.remove("work-card-glow-active");
      }
    }

    // 6. About milestone glow
    const foundation = document.getElementById("about-core-foundation");
    if (foundation) {
      if (step.id === "about-foundation") {
        foundation.classList.add("about-foundation-glow-active");
      } else {
        foundation.classList.remove("about-foundation-glow-active");
      }
    }

    for (let i = 0; i < 4; i++) {
      const row = document.getElementById(`about-card-${i}`);
      const panel = row?.querySelector(".about-milestone-panel") as HTMLElement | null;
      if (!row || !panel) continue;
      if (step.aboutCardIdx === i) {
        panel.classList.add("about-card-glow-active");
        const brandColors = ["47, 128, 236", "235, 87, 87", "33, 150, 82", "154, 81, 224"];
        panel.style.setProperty("--active-glow-color", brandColors[i]);
      } else {
        panel.classList.remove("about-card-glow-active");
      }
    }

    // Shorter lock on reverse so upward scroll stays fluid
    isLockRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      isLockRef.current = false;
      lockTimerRef.current = null;
    }, goingUp ? 320 : 480);
  }, [existingTargets]);

  // Wheel / arrow / touch — step journey; fast flicks skip steps so reverse isn't sticky
  useEffect(() => {
    if (!isReady || existingTargets.length === 0) return;

    const handleWheel = (e: WheelEvent) => {
      // While locked, still prevent native scroll fighting Lenis — but don't queue
      if (isLockRef.current) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < 10) return;
      e.preventDefault();

      const dir = e.deltaY > 0 ? 1 : -1;
      // Strong upward/downward flick advances multiple journey steps
      const burst = Math.min(3, Math.max(1, Math.round(Math.abs(e.deltaY) / 90)));
      executeStep(stepRef.current + dir * burst);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isLockRef.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 36) return;
      const dir = deltaY > 0 ? 1 : -1;
      const burst = Math.min(3, Math.max(1, Math.round(Math.abs(deltaY) / 120)));
      executeStep(stepRef.current + dir * burst);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLockRef.current) return;
      if (["ArrowDown", "PageDown", "Space"].includes(e.code)) {
        e.preventDefault();
        executeStep(stepRef.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.code)) {
        e.preventDefault();
        executeStep(stepRef.current - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      if (dissolveTimerRef.current) clearTimeout(dissolveTimerRef.current);
    };
  }, [isReady, existingTargets, executeStep]);

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

  // Setup Canvas Particle System and Animation Loop
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
      let targetOnScreen = false;

      if (elA && elB) {
        const rectA = elA.getBoundingClientRect();
        const rectB = elB.getBoundingClientRect();

        const xA = rectA.left + rectA.width / 2;
        const yA = rectA.top + rectA.height / 2;
        const xB = rectB.left + rectB.width / 2;
        const yB = rectB.top + rectB.height / 2;

        rawX = xA * (1 - weight) + xB * weight;
        rawY = yA * (1 - weight) + yB * weight;
        targetOnScreen =
          rawY > -60 && rawY < window.innerHeight + 60 &&
          rawX > -60 && rawX < window.innerWidth + 60;
      } else if (elA) {
        const rectA = elA.getBoundingClientRect();
        rawX = rectA.left + rectA.width / 2;
        rawY = rectA.top + rectA.height / 2;
        targetOnScreen =
          rawY > -60 && rawY < window.innerHeight + 60 &&
          rawX > -60 && rawX < window.innerWidth + 60;
      }

      // If target is still off-screen (scroll catching up), hold last position —
      // never pin the Core to the bottom edge of the viewport
      let tx: number;
      let ty: number;
      if (!targetOnScreen && posRef.current.currentX !== 0) {
        tx = posRef.current.targetX || posRef.current.currentX;
        ty = posRef.current.targetY || posRef.current.currentY;
      } else {
        tx = rawX;
        ty = Math.max(80, Math.min(window.innerHeight - 80, rawY));
      }

      // Add a slow, organic breathing float & noise drift
      const time = Date.now() * 0.0012;
      const breathing = Math.sin(time * 1.5) * 10;
      const driftX = Math.sin(time) * 8;
      const driftY = Math.cos(time * 0.8) * 8;

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

      // Update HTML core glass shell position
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

      // Draw Particle System
      // A. Trail Particles
      const coreSpeed = Math.hypot(tx - cx, ty - cy);
      if (!isDissolved && coreSpeed > 0.8 && Math.random() < 0.6) {
        trail.push({
          x: drawX + (Math.random() - 0.5) * 8 * scaleRef.current,
          y: drawY + (Math.random() - 0.5) * 8 * scaleRef.current,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 + 0.2,
          size: (Math.random() * 2.5 + 0.8) * scaleRef.current,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 45,
          maxLife: 45
        });
      }

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

      // B. Orbit Particles
      if (!isDissolved) {
        orbiters.forEach((p) => {
          if (p.angle !== undefined && p.radius !== undefined && p.speed !== undefined) {
            const speedMult = isMagnetic ? 2.5 : 1.0;
            p.angle += p.speed * speedMult;
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

      // C. Logo Dispersion Particles
      if (isDissolved) {
        if (Math.random() < 0.55) {
          disperse.push({
            x: drawX + (Math.random() - 0.5) * 80 * scaleRef.current,
            y: drawY + (Math.random() - 0.5) * 20 * scaleRef.current,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 0.8 - 0.3,
            size: (Math.random() * 2.2 + 0.6) * scaleRef.current,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 60,
            maxLife: 60
          });
        }
      }

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
      {/* Canvas for particle system */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 3D Glassmorphic Living Core Sphere */}
      <div
        ref={coreRef}
        id="living-core-sphere"
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
            0 0 ${16 * coreScale}px rgba(47, 128, 236, 0.35),
            0 0 ${28 * coreScale}px rgba(255, 255, 255, 0.12)
          `
        }}
      >
        <div
          className="absolute rounded-full animate-spin-slow-core opacity-45"
          style={{
            width: `${28 * coreScale}px`,
            height: `${28 * coreScale}px`,
            background: "conic-gradient(from 0deg, #2F80EC55, #EB575755, #21965255, #F2C94D55, #9A51E055, #F3994B55, #2F80EC55)",
            filter: `blur(${4 * coreScale}px)`,
          }}
          aria-hidden
        />

        <svg
          viewBox="0 0 24 28"
          className="relative z-10"
          style={{
            width: `${16 * coreScale}px`,
            height: `${19 * coreScale}px`,
            filter: `drop-shadow(0 0 ${3.5 * coreScale}px rgba(255,255,255,0.75))`,
          }}
          fill="none"
          aria-hidden
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
