"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Smartphone,
  Cloud,
  Cpu,
  Sparkles,
  Megaphone,
  Compass,
  Video,
  Brain,
  CreditCard,
  BarChart3,
  Palette,
  type LucideIcon,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BRAND = {
  blue: "#2F80EC",
  red: "#EB5757",
  green: "#219652",
  yellow: "#F2C94D",
  purple: "#9A51E0",
  orange: "#F3994B",
} as const;

const BRAND_RGB = [
  [47, 128, 236],
  [235, 87, 87],
  [33, 150, 82],
  [242, 201, 77],
  [154, 81, 224],
  [243, 153, 75],
] as const;

const ACTIVE_CHIP_COUNT = 7;
const CHIP_ROTATE_MS = 9000;
const MOBILE_CHIP_ROTATE_MS = 3000;

/* ── Digital Knowledge Network chips ── */
type ServiceNodeDef = {
  id: string;
  label: string;
  /** Compact label for mobile orbital chips */
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  x: number;
  y: number;
  mx?: number;
  my?: number;
  /** 0 = midground readable, 1 = deeper / softer */
  depth: 0 | 1;
};

const SERVICE_NODES: ServiceNodeDef[] = [
  // mx/my = mobile only — around Living Core (shifted slightly down with the animation stage)
  { id: "ai", label: "AI Intelligence", shortLabel: "AI", icon: Brain, color: BRAND.purple, x: 74, y: 14, mx: 12, my: 16, depth: 0 },
  { id: "api", label: "API Integration", shortLabel: "API", icon: Cpu, color: BRAND.green, x: 90, y: 26, mx: 88, my: 16, depth: 0 },
  { id: "cloud", label: "Cloud Infrastructure", shortLabel: "Cloud", icon: Cloud, color: BRAND.blue, x: 86, y: 46, mx: 8, my: 24, depth: 0 },
  { id: "web", label: "Web Engineering", shortLabel: "Web", icon: Code2, color: BRAND.blue, x: 78, y: 62, mx: 92, my: 24, depth: 0 },
  { id: "mobile", label: "Mobile Apps", shortLabel: "Apps", icon: Smartphone, color: BRAND.red, x: 92, y: 66, mx: 10, my: 32, depth: 1 },
  { id: "marketing", label: "Digital Marketing", shortLabel: "Marketing", icon: Megaphone, color: BRAND.orange, x: 20, y: 76, mx: 90, my: 32, depth: 0 },
  { id: "brand", label: "Brand Identity", shortLabel: "Brand", icon: Sparkles, color: BRAND.red, x: 52, y: 12, mx: 14, my: 20, depth: 1 },
  { id: "strategy", label: "Business Strategy", shortLabel: "Strategy", icon: Compass, color: BRAND.purple, x: 36, y: 80, mx: 86, my: 20, depth: 0 },
  { id: "media", label: "Media Production", shortLabel: "Media", icon: Video, color: BRAND.yellow, x: 12, y: 58, mx: 12, my: 28, depth: 1 },
  { id: "pay", label: "Payment Gateway", shortLabel: "Payment", icon: CreditCard, color: BRAND.orange, x: 60, y: 74, mx: 88, my: 28, depth: 1 },
  { id: "ux", label: "UI / UX Systems", shortLabel: "UX", icon: Palette, color: BRAND.yellow, x: 70, y: 80, mx: 50, my: 13, depth: 0 },
  { id: "analytics", label: "Analytics", shortLabel: "Growth", icon: BarChart3, color: BRAND.green, x: 94, y: 38, mx: 50, my: 35, depth: 1 },
];

/** Pick 2–3 random chip ids for the mobile blink cycle */
function pickRandomMobileChips(prev: string[] = []): string[] {
  const count = Math.random() < 0.45 ? 2 : 3;
  const pool = SERVICE_NODES.map((n) => n.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  let next = pool.slice(0, count);
  const same =
    next.length === prev.length && next.every((id) => prev.includes(id));
  if (same && pool.length > count) {
    next = pool.slice(1, 1 + count);
  }
  return next;
}

const INITIAL_ACTIVE = SERVICE_NODES.slice(0, ACTIVE_CHIP_COUNT).map((n) => n.id);
const INITIAL_MOBILE_ACTIVE = ["brand", "ai", "cloud"];

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  hue: number;
};

type ConstellationNode = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  pulse: number;
  breathe: number;
};

type Edge = {
  a: number;
  b: number;
  life: number;
  target: number;
  hue: number;
  packet: number;
  packetSpeed: number;
};

type NeonBolt = {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  hue: number;
  width: number;
  life: number;
};

type Ribbon = {
  color: readonly [number, number, number];
  phase: number;
  speed: number;
  amp: number;
  width: number;
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootPathRef = useRef<SVGPathElement | null>(null);
  const rootTrailRef = useRef<SVGPathElement | null>(null);
  const ecosystemRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const ambientRef = useRef<HTMLDivElement | null>(null);
  const networkSvgRef = useRef<SVGSVGElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const ctaWrapperRef = useRef<HTMLDivElement | null>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const activeIdsRef = useRef<string[]>(INITIAL_ACTIVE);
  const focusWaveRef = useRef<HTMLDivElement | null>(null);
  const isMobileRef = useRef(false);

  const prefersReducedMotion = useReducedMotion();
  const ctaPrimaryRef = useMagnetic(0.22);
  const ctaSecondaryRef = useMagnetic(0.22);

  const [activeIds, setActiveIds] = useState<string[]>(INITIAL_ACTIVE);
  const [mobileActiveIds, setMobileActiveIds] = useState<string[]>(INITIAL_MOBILE_ACTIVE);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  /** Mobile focus-mode intro complete */
  const [focusReady, setFocusReady] = useState(false);
  const [focusWave, setFocusWave] = useState(false);

  const nodeById = useMemo(() => {
    const map = new Map<string, ServiceNodeDef>();
    SERVICE_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Detect mobile viewport (desktop Hero must remain untouched)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      isMobileRef.current = mq.matches;
      setIsMobile(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Keep ref in sync for rAF network drawing (desktop chips)
  useEffect(() => {
    activeIdsRef.current = isMobile ? mobileActiveIds : activeIds;
  }, [activeIds, mobileActiveIds, isMobile]);

  // Desktop chip rotation
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const timer = window.setInterval(() => {
      setActiveIds((prev) => {
        const inactive = SERVICE_NODES.filter((n) => !prev.includes(n.id));
        if (!inactive.length) return prev;
        const outIdx = Math.floor(Math.random() * prev.length);
        const incoming = inactive[Math.floor(Math.random() * inactive.length)];
        const next = [...prev];
        next[outIdx] = incoming.id;
        return next;
      });
    }, CHIP_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isMobile]);

  // Mobile: every 3s blink out current 2–3 chips and show another random set
  useEffect(() => {
    if (prefersReducedMotion || !isMobile) return;
    const timer = window.setInterval(() => {
      setMobileActiveIds((prev) => pickRandomMobileChips(prev));
    }, MOBILE_CHIP_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isMobile]);

  // Mobile cinematic focus-mode intro (~1.8s)
  useEffect(() => {
    if (!isMobile) {
      setFocusReady(true);
      return;
    }
    if (prefersReducedMotion) {
      setFocusReady(true);
      return;
    }

    setFocusReady(false);
    const t1 = window.setTimeout(() => setFocusWave(true), 180);
    const t2 = window.setTimeout(() => setFocusReady(true), 1100);
    const t3 = window.setTimeout(() => setFocusWave(false), 1800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced =
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = Math.max(
        window.innerHeight,
        canvas.parentElement?.clientHeight || window.innerHeight
      );
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let pointerX = width * 0.5;
    let pointerY = height * 0.4;
    let coreX = width * 0.62;
    let coreY = height * 0.42;

    const updateCoreOrigin = () => {
      const section = document.getElementById("hero");
      const sectionRect = section?.getBoundingClientRect();
      if (!sectionRect) return;

      // Prefer the live Living Core sphere when it's visible in the Hero
      const living = (document.getElementById("living-core-sphere") ||
        document.querySelector(".animate-spin-slow-core")?.parentElement) as HTMLElement | null;
      if (living) {
        const rect = living.getBoundingClientRect();
        const opacity = parseFloat(getComputedStyle(living).opacity || "0");
        if (rect.width > 8 && opacity > 0.05) {
          coreX = rect.left + rect.width / 2 - sectionRect.left;
          coreY = rect.top + rect.height / 2 - sectionRect.top;
          return;
        }
      }

      const start = document.getElementById("hero-core-start");
      if (start) {
        const rect = start.getBoundingClientRect();
        coreX = rect.left + rect.width / 2 - sectionRect.left;
        coreY = rect.top + rect.height / 2 - sectionRect.top;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      targetMouseX = e.clientX / width - 0.5;
      targetMouseY = e.clientY / height - 0.5;
      const section = document.getElementById("hero");
      const sectionRect = section?.getBoundingClientRect();
      if (sectionRect) {
        pointerX = e.clientX - sectionRect.left;
        pointerY = e.clientY - sectionRect.top;
      } else {
        pointerX = e.clientX;
        pointerY = e.clientY;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Mobile: subtle device-orientation parallax + touch near-core glow
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!isMobileRef.current || reduced) return;
      const gamma = Math.max(-35, Math.min(35, e.gamma ?? 0));
      const beta = Math.max(20, Math.min(70, e.beta ?? 45));
      targetMouseX = (gamma / 35) * 0.18;
      targetMouseY = ((beta - 45) / 25) * 0.12;
    };
    const handleTouch = (e: TouchEvent) => {
      if (!isMobileRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      const section = document.getElementById("hero");
      const sectionRect = section?.getBoundingClientRect();
      if (sectionRect) {
        pointerX = touch.clientX - sectionRect.left;
        pointerY = touch.clientY - sectionRect.top;
      }
    };
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });

    const isMobileView = width < 768;

    /* ── Digital constellation (intelligent brain nodes) ── */
    const nodeCount = reduced
      ? 8
      : isMobileView
        ? 14
        : Math.min(38, Math.floor((width * height) / 32000) + 22);
    const nodes: ConstellationNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Bias away from dense left copy on desktop
      const biasRight = Math.random() > 0.35;
      const bx = biasRight
        ? 0.45 + Math.random() * 0.5
        : 0.08 + Math.random() * 0.35;
      const by = 0.12 + Math.random() * 0.78;
      nodes.push({
        x: bx * width,
        y: by * height,
        baseX: bx,
        baseY: by,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.8 + 0.6,
        hue: Math.floor(Math.random() * BRAND_RGB.length),
        pulse: Math.random() * Math.PI * 2,
        breathe: 0.6 + Math.random() * 0.8,
      });
    }

    /* Evolving edges — connections appear / dissolve */
    const edges: Edge[] = [];
    const maxEdges = reduced ? 8 : isMobileView ? 16 : 48;
    const seedEdge = () => {
      if (edges.length >= maxEdges) return;
      const a = Math.floor(Math.random() * nodes.length);
      let b = Math.floor(Math.random() * nodes.length);
      if (a === b) b = (b + 1) % nodes.length;
      const na = nodes[a];
      const nb = nodes[b];
      const d = Math.hypot(na.x - nb.x, na.y - nb.y);
      if (d > 280 || d < 40) return;
      edges.push({
        a,
        b,
        life: 0,
        target: 0.5 + Math.random() * 0.5,
        hue: Math.floor(Math.random() * BRAND_RGB.length),
        packet: Math.random(),
        packetSpeed: 0.002 + Math.random() * 0.004,
      });
    };
    for (let i = 0; i < maxEdges * 0.55; i++) seedEdge();

    /* Soft volumetric glows — mobile centers glow on Core */
    const glows = isMobileView
      ? [
          { x: width * 0.5, y: height * 0.28, baseX: 0.5, baseY: 0.28, r: 200, rgb: BRAND_RGB[0], a: 0.1 },
          { x: width * 0.5, y: height * 0.32, baseX: 0.5, baseY: 0.32, r: 160, rgb: BRAND_RGB[4], a: 0.06 },
          { x: width * 0.5, y: height * 0.7, baseX: 0.5, baseY: 0.7, r: 180, rgb: BRAND_RGB[1], a: 0.04 },
        ]
      : [
          { x: width * 0.62, y: height * 0.4, baseX: 0.62, baseY: 0.4, r: 320, rgb: BRAND_RGB[0], a: 0.07 },
          { x: width * 0.25, y: height * 0.3, baseX: 0.25, baseY: 0.3, r: 260, rgb: BRAND_RGB[4], a: 0.045 },
          { x: width * 0.75, y: height * 0.7, baseX: 0.75, baseY: 0.7, r: 280, rgb: BRAND_RGB[1], a: 0.04 },
          { x: width * 0.45, y: height * 0.85, baseX: 0.45, baseY: 0.85, r: 240, rgb: BRAND_RGB[2], a: 0.035 },
        ];

    /* Neon ribbons around Living Core — lighter on mobile */
    const ribbons: Ribbon[] = reduced
      ? []
      : isMobileView
        ? [
            { color: BRAND_RGB[0], phase: 0, speed: 0.006, amp: 28, width: 1.0 },
            { color: BRAND_RGB[4], phase: Math.PI * 0.9, speed: 0.005, amp: 36, width: 0.8 },
          ]
        : [
            { color: BRAND_RGB[0], phase: 0, speed: 0.008, amp: 55, width: 1.2 },
            { color: BRAND_RGB[4], phase: Math.PI * 0.7, speed: 0.006, amp: 70, width: 1.0 },
            { color: BRAND_RGB[1], phase: Math.PI * 1.4, speed: 0.01, amp: 45, width: 0.9 },
          ];

    /* Occasional neon energy bolts flowing into core */
    const bolts: NeonBolt[] = [];
    const spawnBolt = () => {
      if (reduced || bolts.length > 3) return;
      const from = nodes[Math.floor(Math.random() * nodes.length)];
      const mid1 = {
        x: (from.x + coreX) / 2 + (Math.random() - 0.5) * 80,
        y: (from.y + coreY) / 2 + (Math.random() - 0.5) * 60,
      };
      const mid2 = {
        x: (mid1.x + coreX) / 2 + (Math.random() - 0.5) * 40,
        y: (mid1.y + coreY) / 2 + (Math.random() - 0.5) * 30,
      };
      bolts.push({
        points: [
          { x: from.x, y: from.y },
          mid1,
          mid2,
          { x: coreX, y: coreY },
        ],
        progress: 0,
        speed: 0.006 + Math.random() * 0.008,
        hue: Math.floor(Math.random() * BRAND_RGB.length),
        width: 0.8 + Math.random() * 0.6,
        life: 1,
      });
    };

    /* Floating dust / spark micro-particles */
    const dustCount = reduced ? 6 : isMobileView ? 12 : 28;
    const dust: Dust[] = [];
    for (let i = 0; i < dustCount; i++) {
      dust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        r: Math.random() * 0.9 + 0.2,
        a: 0.08 + Math.random() * 0.12,
        hue: Math.floor(Math.random() * BRAND_RGB.length),
      });
    }

    const scrollObj = { progress: 0 };
    let gridOffset = 0;
    let time = 0;
    let edgeTimer = 0;
    let boltTimer = 0;

    const gsapCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollObj.progress = self.progress;
        },
        onLeave: () => {
          canvas.style.opacity = "0";
          if (ambientRef.current) ambientRef.current.style.opacity = "0";
        },
        onEnterBack: () => {
          canvas.style.opacity = "1";
          if (ambientRef.current) ambientRef.current.style.opacity = "1";
        },
      });

      const logo = logoWrapperRef.current;
      const headline = headlineRef.current;
      const description = descriptionRef.current;
      const cta = ctaWrapperRef.current;
      const ecosystem = ecosystemRef.current;

      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (logo) textTl.to(logo, { y: -60, opacity: 0, scale: 0.92, ease: "none" }, 0);
      if (headline) textTl.to(headline, { y: -90, opacity: 0, ease: "none" }, 0.05);
      if (description) textTl.to(description, { y: -70, opacity: 0, ease: "none" }, 0.1);
      if (cta) textTl.to(cta, { y: -50, opacity: 0, ease: "none" }, 0.08);
      if (ecosystem) {
        textTl.to(ecosystem, { scale: 0.85, opacity: 0.35, y: 40, ease: "none" }, 0);
      }
      if (ambientRef.current) {
        textTl.to(ambientRef.current, { opacity: 0.15, ease: "none" }, 0.2);
      }

      const rootPath = rootPathRef.current;
      const rootTrail = rootTrailRef.current;
      if (rootPath && rootTrail) {
        const rootLen = rootPath.getTotalLength();
        gsap.set(rootPath, { strokeDasharray: rootLen, strokeDashoffset: rootLen });
        gsap.set(rootTrail, { strokeDasharray: `48 ${rootLen}`, strokeDashoffset: rootLen });

        gsap.to(rootPath, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        if (!reduced) {
          gsap.fromTo(
            rootTrail,
            { strokeDashoffset: rootLen },
            { strokeDashoffset: -48, duration: 3.2, repeat: -1, ease: "none" }
          );
        }
      }

      if (!reduced) {
        ringRefs.current.forEach((ring, i) => {
          if (!ring) return;
          gsap.to(ring, {
            rotate: i % 2 === 0 ? 360 : -360,
            duration: 40 + i * 18,
            repeat: -1,
            ease: "none",
          });
          gsap.to(ring, {
            scale: 1 + (i + 1) * 0.015,
            duration: 4 + i,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        });

      }
    });

    const applyParallax = () => {
      if (reduced) return;
      const mobile = isMobileRef.current;
      const contentAmp = mobile ? 6 : 14;
      const ecoAmp = mobile ? 10 : 28;
      const ambientAmp = mobile ? 4 : 10;
      if (contentRef.current) {
        gsap.set(contentRef.current, { x: mouseX * -contentAmp, y: mouseY * -contentAmp * 0.55 });
      }
      if (ecosystemRef.current) {
        gsap.set(ecosystemRef.current, { x: mouseX * ecoAmp, y: mouseY * ecoAmp * 0.65 });
      }
      if (ambientRef.current && !mobile) {
        gsap.set(ambientRef.current, { x: mouseX * ambientAmp, y: mouseY * ambientAmp * 0.6 });
      }
    };

    /** Living Core + cursor proximity for chips, and SVG knowledge network */
    const applyNetworkAndProximity = () => {
      const section = document.getElementById("hero");
      const sr = section?.getBoundingClientRect();
      if (!sr) return;

      const absCoreX = coreX + sr.left;
      const absCoreY = coreY + sr.top;
      const absPointerX = pointerX + sr.left;
      const absPointerY = pointerY + sr.top;

      const svg = networkSvgRef.current;
      const lines: string[] = [];
      const packets: string[] = [];
      const t = performance.now() / 1000;

      activeIdsRef.current.forEach((id) => {
        const el = chipRefs.current.get(id);
        if (!el) return;
        const node = SERVICE_NODES.find((n) => n.id === id);
        if (!node) return;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const distCore = Math.hypot(absCoreX - cx, absCoreY - cy);
        const coreNear = Math.max(0, 1 - distCore / 280);
        const distPointer = Math.hypot(absPointerX - cx, absPointerY - cy);
        const pointerNear = Math.max(0, 1 - distPointer / 140);
        const near = Math.max(coreNear * 0.85, pointerNear);
        const isHovered = el.dataset.hovered === "1";

        if (!reduced && !isHovered) {
          const shell = el.querySelector("[data-shell]") as HTMLElement | null;
          if (shell) {
            const scale = 1 + near * 0.04;
            const glowHex = Math.min(255, Math.floor(30 + near * 70))
              .toString(16)
              .padStart(2, "0");
            const borderHex = Math.min(255, Math.floor(50 + near * 90))
              .toString(16)
              .padStart(2, "0");
            shell.style.boxShadow = `0 0 ${14 + near * 24}px ${node.color}${glowHex}, inset 0 0 12px rgba(255,255,255,${(0.03 + near * 0.05).toFixed(3)})`;
            shell.style.borderColor = `${node.color}${borderHex}`;
            shell.style.transform = `scale(${scale.toFixed(3)})`;
          }
        }

        // Connection to Living Core (section-relative %)
        const x1 = ((cx - sr.left) / sr.width) * 100;
        const y1 = ((cy - sr.top) / sr.height) * 100;
        const x2 = (coreX / sr.width) * 100;
        const y2 = (coreY / sr.height) * 100;
        const lineOp = 0.08 + coreNear * 0.35 + (isHovered ? 0.2 : 0);
        const mx = (x1 + x2) / 2 + Math.sin(t + distCore) * 1.2;
        const my = (y1 + y2) / 2 - 2;

        lines.push(
          `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}" fill="none" stroke="${node.color}" stroke-width="0.12" opacity="${lineOp.toFixed(3)}" stroke-linecap="round"/>`
        );

        if (coreNear > 0.15 || isHovered) {
          const p = (t * (0.12 + coreNear * 0.15) + distCore * 0.001) % 1;
          // Approximate point on quadratic Bezier
          const px = (1 - p) * (1 - p) * x1 + 2 * (1 - p) * p * mx + p * p * x2;
          const py = (1 - p) * (1 - p) * y1 + 2 * (1 - p) * p * my + p * p * y2;
          packets.push(
            `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="0.28" fill="${node.color}" opacity="${(0.35 + coreNear * 0.5).toFixed(2)}"/>`
          );
        }
      });

      // Occasional chip-to-chip links among nearby active chips
      const centers: { id: string; x: number; y: number; color: string }[] = [];
      activeIdsRef.current.forEach((id) => {
        const el = chipRefs.current.get(id);
        const node = SERVICE_NODES.find((n) => n.id === id);
        if (!el || !node) return;
        const rect = el.getBoundingClientRect();
        centers.push({
          id,
          x: ((rect.left + rect.width / 2 - sr.left) / sr.width) * 100,
          y: ((rect.top + rect.height / 2 - sr.top) / sr.height) * 100,
          color: node.color,
        });
      });
      for (let i = 0; i < centers.length; i++) {
        for (let j = i + 1; j < centers.length; j++) {
          const a = centers[i];
          const b = centers[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 22) {
            const aEl = chipRefs.current.get(a.id);
            const bEl = chipRefs.current.get(b.id);
            const bright =
              aEl?.dataset.hovered === "1" || bEl?.dataset.hovered === "1"
                ? 0.22
                : 0.07;
            lines.push(
              `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${a.color}" stroke-width="0.08" opacity="${bright}"/>`
            );
          }
        }
      }

      if (svg) {
        const g = svg.querySelector("[data-network-dynamic]");
        if (g) g.innerHTML = lines.join("") + packets.join("");
      }
    };

    let animationId = 0;
    let lastTs = 0;
    let proxTick = 0;

    const pointOnBezier = (
      pts: { x: number; y: number }[],
      t: number
    ): { x: number; y: number } => {
      // Simple multi-segment lerp along polyline
      const segs = pts.length - 1;
      const f = Math.max(0, Math.min(0.999, t)) * segs;
      const i = Math.floor(f);
      const u = f - i;
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * u,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * u,
      };
    };

    const render = (ts: number) => {
      const dt = lastTs ? Math.min((ts - lastTs) / 16.67, 2) : 1;
      lastTs = ts;
      time += 0.016 * dt;

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;
      applyParallax();
      updateCoreOrigin();

      // Throttle network + proximity updates (~20fps)
      proxTick += dt;
      if (proxTick > 3) {
        proxTick = 0;
        applyNetworkAndProximity();
      }

      const progress = scrollObj.progress;
      const fade = 1 - progress * 0.85;
      const speed = 1 + progress * 2.2;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(mouseX * 24, mouseY * 18);
      ctx.globalAlpha = fade;

      /* 1. Volumetric glows */
      glows.forEach((g, i) => {
        const mx = mouseX * (30 + i * 12);
        const my = mouseY * (24 + i * 10);
        g.x = width * g.baseX + mx + Math.sin(time * 0.35 + i) * 18;
        g.y = height * g.baseY + my + Math.cos(time * 0.28 + i) * 14;
        if (i === 0) {
          g.x += (coreX - g.x) * 0.08;
          g.y += (coreY - g.y) * 0.08;
        }
        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        const [r, gch, b] = g.rgb;
        grad.addColorStop(0, `rgba(${r},${gch},${b},${g.a})`);
        grad.addColorStop(0.45, `rgba(${r},${gch},${b},${g.a * 0.35})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(g.x - g.r, g.y - g.r, g.r * 2, g.r * 2);
      });

      /* 2. Digital blueprint — grid + coordinate ticks (<5% opacity) */
      if (!reduced) {
        gridOffset = (gridOffset + 0.1 * speed * dt) % 80;
        ctx.strokeStyle = `rgba(255,255,255,${0.028 * fade})`;
        ctx.lineWidth = 0.5;
        for (let x = -80 + gridOffset; x < width + 80; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = -80 + gridOffset * 0.55; y < height + 80; y += 80) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Alignment guides / measurement ticks near edges
        ctx.strokeStyle = `rgba(47,128,236,${0.035 * fade})`;
        ctx.lineWidth = 0.6;
        for (let i = 0; i < 6; i++) {
          const gx = width * (0.15 + i * 0.14);
          const gy = height * (0.18 + (i % 3) * 0.22);
          ctx.beginPath();
          ctx.moveTo(gx - 8, gy);
          ctx.lineTo(gx + 8, gy);
          ctx.moveTo(gx, gy - 8);
          ctx.lineTo(gx, gy + 8);
          ctx.stroke();
        }

        // Wireframe circles around core (blueprint rings)
        ctx.strokeStyle = `rgba(255,255,255,${0.03 * fade})`;
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(coreX, coreY, 90 + i * 55, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      /* 3. Neon ribbons around core */
      ribbons.forEach((ribbon, ri) => {
        ribbon.phase += ribbon.speed * speed * dt;
        const segs = 48;
        ctx.beginPath();
        for (let s = 0; s <= segs; s++) {
          const t = s / segs;
          const angle = ribbon.phase + t * Math.PI * 2 + ri * 0.9;
          const radius =
            90 +
            ri * 48 +
            Math.sin(ribbon.phase * 1.4 + t * Math.PI * 4) * ribbon.amp * 0.35 +
            Math.cos(t * Math.PI * 3 + ribbon.phase) * 18;
          const x = coreX + Math.cos(angle) * radius + mouseX * (12 + ri * 6);
          const y =
            coreY +
            Math.sin(angle) * radius * 0.72 +
            mouseY * (10 + ri * 5) +
            Math.sin(t * Math.PI * 2 + time) * 8;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const [r, g, b] = ribbon.color;
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.14 * fade})`;
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = "round";
        ctx.shadowColor = `rgba(${r},${g},${b},0.35)`;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      /* 4. Constellation nodes — breathe + mouse proximity */
      nodes.forEach((n, i) => {
        n.pulse += 0.02 * n.breathe * dt;
        // Soft drift around base with core magnetism
        const dx = coreX - n.x;
        const dy = coreY - n.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > 60 && dist < 500) {
          n.vx += (dx / dist) * 0.00035 * speed;
          n.vy += (dy / dist) * 0.00035 * speed;
        }
        // Mouse influence
        const mdx = pointerX - n.x + mouseX * 24;
        const mdy = pointerY - n.y + mouseY * 18;
        // Use screen-space approx after translate — keep soft
        const md = Math.hypot(n.x - (pointerX - mouseX * 24), n.y - (pointerY - mouseY * 18));
        const near = Math.max(0, 1 - md / 150);
        if (near > 0) {
          n.vx += ((pointerX - mouseX * 24 - n.x) / 150) * 0.015 * near;
          n.vy += ((pointerY - mouseY * 18 - n.y) / 150) * 0.015 * near;
        }
        void mdx;
        void mdy;

        n.vx *= 0.99;
        n.vy *= 0.99;
        n.x += n.vx * speed * dt;
        n.y += n.vy * speed * dt;

        // Soft leash to base
        n.x += (n.baseX * width - n.x) * 0.002;
        n.y += (n.baseY * height - n.y) * 0.002;

        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        const [r, g, b] = BRAND_RGB[n.hue];
        const breath = 0.55 + Math.sin(n.pulse) * 0.35;
        const alpha = (0.2 + near * 0.45) * breath * fade;
        const radius = n.r * (1 + near * 0.5 + Math.sin(n.pulse) * 0.15);

        // Soft bloom
        const bloom = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 6);
        bloom.addColorStop(0, `rgba(${r},${g},${b},${0.14 * (0.4 + near) * fade})`);
        bloom.addColorStop(1, "transparent");
        ctx.fillStyle = bloom;
        ctx.fillRect(n.x - radius * 6, n.y - radius * 6, radius * 12, radius * 12);

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Tiny inner white spark
        if (near > 0.4 || Math.sin(n.pulse + i) > 0.85) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.35 * fade})`;
          ctx.fill();
        }
      });

      /* 5. Evolving constellation edges + living data packets */
      edgeTimer += dt;
      if (edgeTimer > 45) {
        edgeTimer = 0;
        // Dissolve some, spawn some
        for (let i = edges.length - 1; i >= 0; i--) {
          if (Math.random() < 0.25) edges[i].target = 0;
        }
        seedEdge();
        seedEdge();
      }

      for (let i = edges.length - 1; i >= 0; i--) {
        const e = edges[i];
        e.life += (e.target - e.life) * 0.02 * dt;
        if (e.target === 0 && e.life < 0.02) {
          edges.splice(i, 1);
          continue;
        }
        // Occasionally revive
        if (e.target > 0 && Math.random() < 0.0008) e.target = 0;
        if (e.target === 0 && Math.random() < 0.001) e.target = 0.4 + Math.random() * 0.5;

        const na = nodes[e.a];
        const nb = nodes[e.b];
        if (!na || !nb) continue;

        const d = Math.hypot(na.x - nb.x, na.y - nb.y);
        if (d > 320) {
          e.target = 0;
        }

        const [r, g, b] = BRAND_RGB[e.hue];
        // Strengthen near mouse
        const midX = (na.x + nb.x) / 2;
        const midY = (na.y + nb.y) / 2;
        const md = Math.hypot(midX - (pointerX - mouseX * 24), midY - (pointerY - mouseY * 18));
        const near = Math.max(0, 1 - md / 180);

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(0.06 + near * 0.14) * e.life * fade})`;
        ctx.lineWidth = 0.6 + near * 0.8;
        ctx.stroke();

        // Data packet traveling along edge
        if (e.life > 0.3 && !reduced) {
          e.packet = (e.packet + e.packetSpeed * speed * dt) % 1;
          const px = na.x + (nb.x - na.x) * e.packet;
          const py = na.y + (nb.y - na.y) * e.packet;
          ctx.beginPath();
          ctx.arc(px, py, 1.2 + near * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${(0.45 + near * 0.4) * e.life * fade})`;
          ctx.fill();
          // Soft trail bloom
          const pg = ctx.createRadialGradient(px, py, 0, px, py, 8);
          pg.addColorStop(0, `rgba(${r},${g},${b},${0.2 * e.life * fade})`);
          pg.addColorStop(1, "transparent");
          ctx.fillStyle = pg;
          ctx.fillRect(px - 8, py - 8, 16, 16);
        }
      }

      /* 6. Neon energy bolts flowing into Living Core */
      boltTimer += dt;
      if (boltTimer > 90 && Math.random() < 0.4) {
        boltTimer = 0;
        spawnBolt();
      }
      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        bolt.progress += bolt.speed * speed * dt;
        bolt.life -= 0.006 * dt;
        if (bolt.progress > 1.15 || bolt.life <= 0) {
          bolts.splice(i, 1);
          continue;
        }
        const [r, g, b] = BRAND_RGB[bolt.hue];
        const visible = Math.min(1, bolt.progress);
        const startT = Math.max(0, bolt.progress - 0.35);
        const steps = 20;
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const t = startT + (visible - startT) * (s / steps);
          const p = pointOnBezier(bolt.points, Math.min(1, t));
          if (s === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.22 * bolt.life * fade})`;
        ctx.lineWidth = bolt.width;
        ctx.lineCap = "round";
        ctx.shadowColor = `rgba(${r},${g},${b},0.4)`;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Head spark
        const head = pointOnBezier(bolt.points, Math.min(1, bolt.progress));
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.5 * bolt.life * fade})`;
        ctx.fill();
      }

      /* 7. Floating dust */
      dust.forEach((d) => {
        d.x += d.vx * speed * dt;
        d.y += d.vy * speed * dt;
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;
        const [r, g, b] = BRAND_RGB[d.hue];
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${d.a * fade})`;
        ctx.fill();
      });

      /* 8. Core halo + soft rays */
      const halo = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 180);
      halo.addColorStop(0, `rgba(154,81,224,${0.1 * fade})`);
      halo.addColorStop(0.35, `rgba(47,128,236,${0.05 * fade})`);
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.fillRect(coreX - 180, coreY - 180, 360, 360);

      if (!reduced) {
        for (let ray = 0; ray < 6; ray++) {
          const a = time * 0.15 + (ray / 6) * Math.PI * 2;
          const len = 140 + Math.sin(time + ray) * 30;
          const x2 = coreX + Math.cos(a) * len;
          const y2 = coreY + Math.sin(a) * len * 0.7;
          const rg = ctx.createLinearGradient(coreX, coreY, x2, y2);
          const rgb = BRAND_RGB[ray % BRAND_RGB.length];
          rg.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.12 * fade})`);
          rg.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(coreX, coreY);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = rg;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    if (reduced) {
      updateCoreOrigin();
      ctx.clearRect(0, 0, width, height);
      glows.forEach((g) => {
        g.x = width * g.baseX;
        g.y = height * g.baseY;
        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        const [r, gch, b] = g.rgb;
        grad.addColorStop(0, `rgba(${r},${gch},${b},${g.a})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(g.x - g.r, g.y - g.r, g.r * 2, g.r * 2);
      });
      // Static constellation
      nodes.forEach((n) => {
        const [r, g, b] = BRAND_RGB[n.hue];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.25)`;
        ctx.fill();
      });
    } else {
      animationId = requestAnimationFrame(render);
    }

    requestAnimationFrame(updateCoreOrigin);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      cancelAnimationFrame(animationId);
      gsapCtx.revert();
    };
  }, [prefersReducedMotion]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const lenis = (
        window as unknown as { lenis?: { scrollTo: (el: Element, opts: object) => void } }
      ).lenis;
      if (lenis) {
        lenis.scrollTo(targetElement, { offset: -80, duration: 1.5 });
      } else {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const lines = ["Ideas Into", "Intelligent Experiences"];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: isMobile ? 0.05 : 0.55,
      },
    },
  } as const;

  const lineVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
    },
  } as const;

  return (
    <section
      id="hero"
      className="relative min-h-[108svh] md:min-h-[160vh] flex flex-col overflow-x-hidden select-none pb-6 md:pb-0"
    >
      {/* Living digital environment */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 w-full h-full pointer-events-none transition-opacity duration-500"
        style={{ background: "transparent" }}
        aria-hidden
      />

      {/* Soft vignette — mobile centers on Core; desktop keeps asymmetric field */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_90%_55%_at_50%_28%,transparent_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.78)_100%)] md:bg-[radial-gradient(ellipse_70%_55%_at_62%_40%,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.75)_100%)]"
        aria-hidden
      />

      {/* Mobile focus-mode dim/blur veil */}
      <motion.div
        className="md:hidden absolute inset-0 z-[4] pointer-events-none"
        initial={false}
        animate={{
          opacity: focusReady ? 0 : 1,
          backdropFilter: focusReady ? "blur(0px)" : "blur(10px)",
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: "rgba(0,0,0,0.45)" }}
        aria-hidden
      />

      {/* Mobile Core pulse wave */}
      <motion.div
        ref={focusWaveRef}
        className="md:hidden absolute left-1/2 top-[34svh] -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-none rounded-full"
        initial={false}
        animate={
          focusWave
            ? { width: 420, height: 420, opacity: 0, borderColor: "rgba(47,128,236,0)" }
            : { width: 40, height: 40, opacity: focusReady ? 0 : 0.7, borderColor: "rgba(154,81,224,0.55)" }
        }
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderWidth: 1.5, boxShadow: "0 0 40px rgba(47,128,236,0.35)" }}
        aria-hidden
      />

      {/* ── Digital Knowledge Network (midground) ── */}
      <div
        ref={ambientRef}
        className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-500 overflow-hidden will-change-transform"
        aria-hidden
      >
        <style>{`
          ${SERVICE_NODES.map(
            (n) => `
            [data-svc="${n.id}"] {
              left: ${n.mx ?? n.x}%;
              top: ${n.my ?? n.y}%;
            }
            @media (min-width: 768px) {
              [data-svc="${n.id}"] {
                left: ${n.x}%;
                top: ${n.y}%;
              }
            }`
          ).join("")}
          @keyframes chip-float-a {
            0%, 100% { transform: translateY(0) rotate(-0.8deg); }
            50% { transform: translateY(-6px) rotate(0.8deg); }
          }
          @keyframes chip-float-b {
            0%, 100% { transform: translateY(0) rotate(0.6deg); }
            50% { transform: translateY(-4px) rotate(-0.6deg); }
          }
          @keyframes chip-breathe {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
        `}</style>

        {/* Connection lines: chips ↔ Living Core */}
        <svg
          ref={networkSvgRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <g data-network-dynamic />
        </svg>

        {/* Technology chips — same desktop style; mobile shows 2–3 with blink cycle */}
        <AnimatePresence>
          {(isMobile ? mobileActiveIds : activeIds).map((id, index) => {
            const node = nodeById.get(id);
            if (!node) return null;
            const Icon = node.icon;
            const isHovered = hoveredId === id;
            const visible = !isMobile || focusReady;
            return (
              <div
                key={id}
                data-svc={id}
                ref={(el) => {
                  if (el) chipRefs.current.set(id, el);
                  else chipRefs.current.delete(id);
                }}
                data-hovered={isHovered ? "1" : "0"}
                className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform z-[3]"
              >
                <motion.div
                  initial={
                    isMobile
                      ? { opacity: 0, scale: 0.7, filter: "blur(4px)" }
                      : { opacity: 0, scale: 0.86, filter: "blur(6px)" }
                  }
                  animate={{
                    opacity: visible
                      ? node.depth === 0
                        ? isMobile
                          ? 0.9
                          : 0.82
                        : isMobile
                          ? 0.65
                          : 0.5
                      : 0.2,
                    scale: isMobile
                      ? node.depth === 0
                        ? 0.62
                        : 0.56
                      : node.depth === 0
                        ? 1
                        : 0.94,
                    filter: "blur(0px)",
                  }}
                  exit={
                    isMobile
                      ? {
                          opacity: [0.9, 0, 0.55, 0],
                          scale: 0.75,
                          filter: "blur(4px)",
                          transition: { duration: 0.45, times: [0, 0.35, 0.65, 1] },
                        }
                      : { opacity: 0, scale: 0.88, filter: "blur(5px)" }
                  }
                  transition={{
                    duration: isMobile ? 0.4 : 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    data-float
                    style={{
                      animation: prefersReducedMotion
                        ? undefined
                        : `${index % 2 === 0 ? "chip-float-a" : "chip-float-b"} ${4.2 + (index % 4) * 0.55}s ease-in-out infinite`,
                      animationDelay: `${index * 0.15}s`,
                    }}
                  >
                    <div
                      data-shell
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="pointer-events-auto group relative flex items-center gap-1 md:gap-2 pl-1 pr-1.5 py-0.5 md:pl-2 md:pr-3 md:py-1.5 rounded-md md:rounded-xl border bg-black/50 backdrop-blur-md cursor-default transition-transform duration-300"
                      style={{
                        borderColor: isHovered ? `${node.color}90` : `${node.color}45`,
                        boxShadow: isHovered
                          ? `0 0 28px ${node.color}55, inset 0 0 14px rgba(255,255,255,0.06)`
                          : `0 0 14px ${node.color}28, inset 0 0 10px rgba(255,255,255,0.03)`,
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                        backdropFilter: isHovered ? "blur(14px)" : "blur(10px)",
                        WebkitBackdropFilter: isHovered ? "blur(14px)" : "blur(10px)",
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-lg md:rounded-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at 20% 50%, ${node.color}30 0%, transparent 70%)`,
                        }}
                      />
                      <span
                        className="relative z-10 w-3.5 h-3.5 md:w-6 md:h-6 rounded md:rounded-lg flex items-center justify-center border border-white/10 bg-white/[0.05]"
                        style={{ boxShadow: `0 0 8px ${node.color}40` }}
                      >
                        <Icon
                          className="w-2 h-2 md:w-3 md:h-3 transition-transform duration-500 group-hover:rotate-12"
                          style={{ color: node.color }}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="relative z-10 text-[7px] md:text-[11px] font-cascadia tracking-wide text-white/80 group-hover:text-white whitespace-nowrap transition-colors duration-300">
                        <span className="md:hidden">{node.shortLabel}</span>
                        <span className="hidden md:inline">{node.label}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Intro content — mobile: centered under Core / desktop: asymmetric left ── */}
      <div className="relative z-10 w-full pt-[58svh] md:pt-44 px-6 md:px-24 lg:px-28 pb-2 md:pb-0">
        <div
          ref={contentRef}
          className="relative max-w-sm md:max-w-lg w-full mx-auto md:mx-0 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 will-change-transform"
        >
          {/* Subtle focal field behind heading — desktop only (mobile uses Core glow) */}
          <div
            className="absolute -z-10 pointer-events-none left-[-12%] top-[8%] w-[120%] h-[70%] overflow-hidden hidden md:block"
            aria-hidden
          >
            {/* Soft radial glow */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 55% 50% at 35% 45%, rgba(47,128,236,0.14) 0%, rgba(154,81,224,0.08) 35%, transparent 70%)",
              }}
            />
            {/* Faint animated gradient mesh */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(47,128,236,0.1) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(154,81,224,0.08) 0%, transparent 45%), radial-gradient(circle at 40% 80%, rgba(235,87,87,0.05) 0%, transparent 40%)",
                animation: prefersReducedMotion ? undefined : "chip-breathe 8s ease-in-out infinite",
              }}
            />
            {/* Extremely subtle digital grid */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* Topology / data streams behind heading */}
            <svg
              className="absolute inset-0 w-full h-full opacity-50"
              viewBox="0 0 400 280"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="heading-stream" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={BRAND.blue} stopOpacity="0.35" />
                  <stop offset="50%" stopColor={BRAND.purple} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={BRAND.red} stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M 20 40 C 80 20, 140 90, 200 70 S 300 30, 380 90"
                stroke="url(#heading-stream)"
                strokeWidth="0.8"
                opacity="0.45"
                strokeDasharray="6 14"
              >
                {!prefersReducedMotion && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-40"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <path
                d="M 10 160 C 90 120, 150 200, 240 150 S 340 110, 390 180"
                stroke="url(#heading-stream)"
                strokeWidth="0.7"
                opacity="0.3"
                strokeDasharray="4 12"
              >
                {!prefersReducedMotion && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-32"
                    dur="11s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <path
                d="M 40 220 C 120 180, 180 240, 280 200"
                stroke={BRAND.green}
                strokeWidth="0.6"
                opacity="0.2"
                strokeDasharray="3 10"
              >
                {!prefersReducedMotion && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-26"
                    dur="9s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              {/* Soft light rays */}
              <line x1="80" y1="20" x2="160" y2="240" stroke={BRAND.blue} strokeWidth="0.4" opacity="0.08" />
              <line x1="140" y1="10" x2="200" y2="250" stroke={BRAND.purple} strokeWidth="0.4" opacity="0.07" />
              <circle cx="120" cy="100" r="36" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none" />
              <circle cx="220" cy="140" r="22" stroke="rgba(47,128,236,0.08)" strokeWidth="0.5" fill="none" />
            </svg>
          </div>

          {/* Brand mark lives in Navbar — keep Hero heading free of repeated "RYZOM" */}
          <div ref={logoWrapperRef} className="hidden" aria-hidden />

          <motion.h1
            ref={headlineRef}
            variants={containerVariants}
            initial="hidden"
            animate={focusReady || !isMobile ? "visible" : "hidden"}
            className="relative z-[1] font-bohuan uppercase text-white flex flex-col gap-1 md:gap-1 w-full max-w-[18.5rem] md:max-w-none"
          >
            {lines.map((line, i) => (
              <motion.span
                key={line}
                variants={lineVariants}
                className={`block text-[1.65rem] leading-[1.15] tracking-[0.07em] md:text-[2.75rem] lg:text-[3.15rem] md:leading-[1.12] md:tracking-[0.06em] ${
                  i === 1
                    ? "bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(47,128,236,0.2)]"
                    : "text-white/90"
                }`}
              >
                {line}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            ref={descriptionRef}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={
              focusReady || !isMobile
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 14, filter: "blur(6px)" }
            }
            transition={{
              duration: 0.7,
              delay: isMobile ? 0.12 : 1.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-[1] max-w-[18rem] md:max-w-md text-white/45 text-[11px] md:text-xs font-cascadia leading-relaxed tracking-wide"
          >
            We shape digital ecosystems through development, design, and growth strategy.
          </motion.p>

          <motion.div
            ref={ctaWrapperRef}
            initial={{ opacity: 0, y: 16 }}
            animate={
              focusReady || !isMobile
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 16 }
            }
            transition={{
              duration: 0.65,
              delay: isMobile ? 0.22 : 1.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-[1] flex flex-row items-center justify-center md:justify-start gap-2 md:gap-3 w-full max-w-sm md:max-w-md mt-1 md:mt-0.5"
          >
            <div ref={ctaPrimaryRef as React.RefObject<HTMLDivElement>} className="flex-1 md:flex-none">
              <a
                href="#contact"
                onClick={(e) => handleCtaClick(e, "contact")}
                className="group relative inline-flex items-center justify-center px-3 py-2 md:px-7 md:py-3 min-h-[36px] md:min-h-0 rounded-full text-[9px] md:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.18em] font-semibold text-white overflow-hidden cursor-pointer w-full md:w-auto md:min-w-[10.5rem] active:scale-[0.98] transition-transform"
              >
                <span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red opacity-90 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300"
                  aria-hidden
                />
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 blur-md bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red"
                  aria-hidden
                />
                <span className="relative z-10">Start a Project</span>
              </a>
            </div>

            <div ref={ctaSecondaryRef as React.RefObject<HTMLDivElement>} className="flex-1 md:flex-none">
              <a
                href="#work"
                onClick={(e) => handleCtaClick(e, "work")}
                className="group relative inline-flex items-center justify-center px-3 py-2 md:px-7 md:py-3 min-h-[36px] md:min-h-0 rounded-full text-[9px] md:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.18em] font-semibold text-white/85 hover:text-white cursor-pointer overflow-hidden w-full md:w-auto md:min-w-[10.5rem] active:scale-[0.98] transition-transform"
              >
                <span
                  className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/50 transition-colors duration-400"
                  aria-hidden
                />
                <span
                  className="absolute inset-[1px] rounded-full bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-400"
                  aria-hidden
                />
                <span
                  className="absolute bottom-[10px] left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-[55%] bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-500"
                  aria-hidden
                />
                <span className="relative z-10">Explore Our Work</span>
              </a>
            </div>
          </motion.div>

          {/* Mobile scroll hint — in flow so no empty gap below */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: focusReady ? 0.7 : 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="md:hidden flex flex-col items-center gap-1.5 pt-1 pointer-events-none"
            aria-hidden
          >
            <span className="text-[8px] font-cascadia uppercase tracking-[0.3em] text-white/30">
              Scroll
            </span>
            <span className="w-px h-5 bg-gradient-to-b from-white/25 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* ── Living Core ecosystem — mobile: top-center stage / desktop: asymmetric ── */}
      <div
        ref={ecosystemRef}
        className="absolute left-1/2 md:left-[62%] top-[34svh] md:top-[40%] -translate-x-1/2 -translate-y-1/2 w-[min(58vw,220px)] md:w-[min(78vw,520px)] h-[min(58vw,220px)] md:h-[min(78vw,520px)] pointer-events-none z-[1] will-change-transform"
        aria-hidden
      >
        <div
          className="absolute inset-[18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.06) 0%, rgba(47,128,236,0.04) 35%, transparent 70%)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(2px)",
            boxShadow:
              "inset 0 0 40px rgba(154,81,224,0.08), 0 0 80px rgba(47,128,236,0.08)",
          }}
        />

        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => {
              ringRefs.current[i] = el;
            }}
            className="absolute rounded-full border border-white/[0.07]"
            style={{
              inset: `${8 + i * 10}%`,
              borderColor:
                i === 0
                  ? "rgba(47,128,236,0.18)"
                  : i === 1
                    ? "rgba(154,81,224,0.14)"
                    : "rgba(235,87,87,0.1)",
            }}
          >
            <span
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                top: "8%",
                left: "50%",
                background: i === 0 ? BRAND.blue : i === 1 ? BRAND.purple : BRAND.red,
                boxShadow: `0 0 10px ${i === 0 ? BRAND.blue : i === 1 ? BRAND.purple : BRAND.red}`,
              }}
            />
            <span
              className="absolute w-1 h-1 rounded-full bg-white/50"
              style={{ bottom: "18%", right: "12%" }}
            />
          </div>
        ))}

        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full opacity-40"
          fill="none"
        >
          <circle
            cx="200"
            cy="200"
            r="168"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
            strokeDasharray="2 10"
          />
          <circle
            cx="200"
            cy="200"
            r="118"
            stroke="rgba(47,128,236,0.15)"
            strokeWidth="0.6"
            strokeDasharray="1 8"
          />
          {/* Precomputed ticks — avoids SSR/client float mismatches from Math.sin/cos */}
          {(
            [
              [295, 200, 325, 200],
              [247.5, 282.27, 262.5, 308.25],
              [152.5, 282.27, 137.5, 308.25],
              [105, 200, 75, 200],
              [152.5, 117.73, 137.5, 91.75],
              [247.5, 117.73, 262.5, 91.75],
            ] as const
          ).map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
          ))}
        </svg>

        <div
          id="hero-core-start"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none opacity-0"
        />
      </div>

      {/* ── Spinal root — mobile peeks trunk tip; scroll reveals more ── */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[2px] h-[18%] md:h-[50%] pointer-events-none z-0 overflow-visible">
        <div
          id="hero-core-trunk-top"
          className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-2 opacity-0"
        />
        <div
          id="hero-core-trunk-bottom"
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-2 h-2 opacity-0"
        />

        <svg
          viewBox="0 0 40 800"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full overflow-visible"
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="hero-scroll-root-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9A51E0" />
              <stop offset="30%" stopColor="#2F80EC" />
              <stop offset="60%" stopColor="#219652" />
              <stop offset="100%" stopColor="#EB5757" />
            </linearGradient>
            <linearGradient id="hero-trail-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          <path
            d="M 20 0 L 20 800"
            stroke="url(#hero-scroll-root-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
          />

          <path
            ref={rootPathRef}
            id="hero-root-path"
            d="M 20 0 L 20 800"
            stroke="url(#hero-scroll-root-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <path
            ref={rootTrailRef}
            id="hero-root-trail"
            d="M 20 0 L 20 800"
            stroke="url(#hero-trail-gradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.55"
            style={{ filter: "drop-shadow(0 0 4px #2F80EC)" }}
          />
        </svg>
      </div>

      {/* Scroll cue — desktop only; mobile reveals trunk on natural scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3 pointer-events-none md:bottom-14"
        aria-hidden
      >
        <span className="text-[9px] font-cascadia uppercase tracking-[0.35em] text-white/25">
          Scroll
        </span>
        <span className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </motion.div>

    </section>
  );
}
