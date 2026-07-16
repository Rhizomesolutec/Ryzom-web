"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code, Palette, Megaphone, Video, Compass } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

// Registers ScrollTrigger in browser-only env
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceItem {
  id: string;
  title: string;
  icon: any;
  color: string;
  subservices: string[];
  description: string;
  side: "left" | "right";
  branchY: number; // Y position on central path (0-100)
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "branding",
    title: "Branding & Design",
    icon: Palette,
    color: "#EB5757", // Red
    subservices: ["Brand Identity", "UI/UX Design", "Creative Design"],
    description: "We shape unique identities and interfaces that resonate, building a strong visual foundation for your company's growth.",
    side: "left",
    branchY: 12,
  },
  {
    id: "development",
    title: "Development",
    icon: Code,
    color: "#2F80EC", // Blue
    subservices: ["Web Development", "Mobile App Development", "Payment Gateway Integration", "Custom Software"],
    description: "We engineer performant, responsive web and mobile solutions tailored to scale. Clean code meets intelligent architecture.",
    side: "right",
    branchY: 22,
  },
  {
    id: "marketing",
    title: "Digital Marketing",
    icon: Megaphone,
    color: "#219652", // Green
    subservices: ["Digital Marketing", "SEO Optimization", "Social Media Marketing"],
    description: "We amplify your digital reach, driving engagement and targeted visibility through calculated, growth-driven campaigns.",
    side: "left",
    branchY: 48,
  },
  {
    id: "media",
    title: "Media Production",
    icon: Video,
    color: "#F2C94D", // Yellow
    subservices: ["Photography", "Videography", "Motion Graphics"],
    description: "We capture and craft high-fidelity cinematic stories, videos, and motion assets that articulate your brand's philosophy.",
    side: "right",
    branchY: 58,
  },
  {
    id: "strategy",
    title: "Business Strategy",
    icon: Compass,
    color: "#9A51E0", // Purple
    subservices: ["Business Consulting", "Digital Transformation", "Growth Strategy"],
    description: "We guide digital evolutions and market-entry initiatives, laying the strategic roots that secure balanced, long-term expansion.",
    side: "left",
    branchY: 84,
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Initial SVG path drawing lengths for trunks
      const trunks = document.querySelectorAll(".services-trunk-path");
      const trunkTrails = document.querySelectorAll(".services-trunk-trail");

      trunks.forEach((trunk) => {
        const pathEl = trunk as SVGPathElement;
        const len = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
      });

      trunkTrails.forEach((trail) => {
        const pathEl = trail as SVGPathElement;
        const len = pathEl.getTotalLength();
        // Use a compact 60px dash segment for the trunk trails, low brightness
        gsap.set(pathEl, { strokeDasharray: `60 ${len}`, strokeDashoffset: len });
      });

      // 2. Main Trunk Scroll Trigger
      // Draw all parallel trunk lines on scroll
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 40%",
          end: "bottom 80%",
          scrub: 1.2,
        },
      });

      trunks.forEach((trunk) => {
        mainTimeline.to(trunk, {
          strokeDashoffset: 0,
          ease: "none",
        }, 0);
      });

      trunkTrails.forEach((trail) => {
        mainTimeline.to(trail, {
          strokeDashoffset: 0,
          ease: "none",
        }, 0);
      });

      // 3. Side Branches Scroll Trigger & Card Animations
      // Animate side branches and cards when scroll reaches specific depths
      SERVICES_DATA.forEach((service, idx) => {
        const branches = document.querySelectorAll(`.services-branch-path-${idx}`);
        const branchTrails = document.querySelectorAll(`.services-branch-trail-${idx}`);
        const card = cardRefs.current[idx];
        if (branches.length === 0 || !card) return;

        // Set initial state for all branch paths and trails
        branches.forEach((branch) => {
          const pathEl = branch as SVGPathElement;
          const len = pathEl.getTotalLength();
          gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
        });

        branchTrails.forEach((trail) => {
          const pathEl = trail as SVGPathElement;
          const len = pathEl.getTotalLength();
          // Use a compact 30px dash segment for branch trails
          gsap.set(pathEl, { strokeDasharray: `30 ${len}`, strokeDashoffset: len });
        });

        // Trigger branches and card on scroll
        ScrollTrigger.create({
          trigger: container,
          start: `top+=${service.branchY - 8}% center`,
          end: `top+=${service.branchY + 5}% center`,
          onEnter: () => {
            // Draw all branch paths in this group
            branches.forEach((branch) => {
              gsap.to(branch, {
                strokeDashoffset: 0,
                duration: 1.0,
                ease: "power2.out",
              });
            });
            branchTrails.forEach((trail) => {
              gsap.to(trail, {
                strokeDashoffset: 0,
                duration: 1.0,
                ease: "power2.out",
              });
            });
            // Fade/slide card in (staggered overshoot entrance)
            gsap.fromTo(card,
              { opacity: 0, y: 30, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: "back.out(1.25)",
              }
            );
          },
          onLeaveBack: () => {
            // Reset branch paths and card on scroll up
            branches.forEach((branch) => {
              const pathEl = branch as SVGPathElement;
              const len = pathEl.getTotalLength();
              gsap.to(branch, {
                strokeDashoffset: len,
                duration: 0.8,
                ease: "power2.in",
              });
            });
            branchTrails.forEach((trail) => {
              const pathEl = trail as SVGPathElement;
              const len = pathEl.getTotalLength();
              gsap.to(trail, {
                strokeDashoffset: len,
                duration: 0.8,
                ease: "power2.in",
              });
            });
            gsap.to(card, {
              opacity: 0,
              y: 20,
              scale: 0.95,
              duration: 0.6,
              ease: "power2.in",
            });
          },
        });

        // Continuous energy flow down the branch trails
        branchTrails.forEach((trail) => {
          const pathEl = trail as SVGPathElement;
          const len = pathEl.getTotalLength();
          gsap.fromTo(
            pathEl,
            { strokeDashoffset: len },
            {
              strokeDashoffset: -30,
              duration: gsap.utils.random(2.0, 3.0),
              repeat: -1,
              ease: "none",
              delay: gsap.utils.random(0, 1.5),
            }
          );
        });
      });

      // 4. Constant energy glow pulses flowing down the main root parallel lines
      trunkTrails.forEach((trail) => {
        const pathEl = trail as SVGPathElement;
        const len = pathEl.getTotalLength();
        gsap.fromTo(
          pathEl,
          { strokeDashoffset: len },
          {
            strokeDashoffset: -60,
            duration: gsap.utils.random(3.5, 5.0),
            repeat: -1,
            ease: "none",
            delay: gsap.utils.random(0, 2),
          }
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const setCardRef = (el: HTMLDivElement | null, idx: number) => {
    cardRefs.current[idx] = el;
  };

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative min-h-screen md:h-[1400px] py-16 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative h-full">
        {/* Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-3 block">
            Ecosystem Divisions
          </span>
          <h2 className="text-3xl md:text-5xl font-bohuan uppercase tracking-wider text-white">
            Our Root Systems
          </h2>
        </div>

        {/* Central Growing SVG Root (Hidden on mobile for visual cleanliness, cards layout absolute on desktop) */}
        <div className="absolute top-[180px] h-[1000px] left-0 right-0 w-full pointer-events-none hidden md:block z-0">
          <div id="services-trunk-top" className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 pointer-events-none opacity-0" />
          <div id="services-trunk-bottom" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 pointer-events-none opacity-0" />
          <svg
            viewBox="0 0 1200 1000"
            fill="none"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Background base path guides */}
            <path
              d="M 600 0 C 580 150, 620 300, 600 500 C 570 700, 630 850, 600 1000"
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="4"
            />
            <path
              d="M 580 0 L 580 420 Q 580 460, 600 460"
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="3"
            />
            <path
              d="M 620 0 L 620 280 Q 620 320, 600 320"
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="3"
            />

            {/* Central Tapered Parallel Trunks (Drawn on scroll) */}
            {/* Left Trunk (Merges into Center at 460) */}
            <path
              className="services-trunk-path"
              d="M 580 0 L 580 420 Q 580 460, 600 460"
              stroke="url(#main-root-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              className="services-trunk-trail"
              d="M 580 0 L 580 420 Q 580 460, 600 460"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: "drop-shadow(0 0 3px #EB5757)" }}
            />

            {/* Center Trunk */}
            <path
              className="services-trunk-path"
              d="M 600 0 C 580 150, 620 300, 600 500 C 570 700, 630 850, 600 1000"
              stroke="url(#main-root-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="services-trunk-trail"
              d="M 600 0 C 580 150, 620 300, 600 500 C 570 700, 630 850, 600 1000"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.6"
              style={{ filter: "drop-shadow(0 0 4px #2F80EC)" }}
            />

            {/* Right Trunk (Merges into Center at 320) */}
            <path
              className="services-trunk-path"
              d="M 620 0 L 620 280 Q 620 320, 600 320"
              stroke="url(#main-root-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              className="services-trunk-trail"
              d="M 620 0 L 620 280 Q 620 320, 600 320"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: "drop-shadow(0 0 3px #219652)" }}
            />

            {/* Cross-connections (Organic curves) */}
            <path className="services-trunk-path" d="M 580 80 Q 600 90, 620 80" stroke="url(#main-root-grad)" strokeWidth="1.5" opacity="0.4" />
            <path className="services-trunk-path" d="M 580 200 Q 600 210, 620 200" stroke="url(#main-root-grad)" strokeWidth="1.5" opacity="0.4" />
            <path className="services-trunk-path" d="M 580 360 Q 600 370, 620 360" stroke="url(#main-root-grad)" strokeWidth="1.5" opacity="0.4" />

            {/* Branches and double connectors with terminal nodes */}
            {/* Branding Branch (Left Y=80, ends at x=408) */}
            <g>
              <path className="services-branch-path-0" d="M 580 80 C 520 80, 500 115, 450 115 L 408 115" stroke="#EB5757" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
              <path className="services-branch-trail-0" d="M 580 80 C 520 80, 500 115, 450 115 L 408 115" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" style={{ filter: "drop-shadow(0 0 2px #EB5757)" }} />
              <path className="services-branch-path-0" d="M 450 115 Q 430 95, 408 95" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-0" d="M 450 115 Q 430 95, 408 95" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #EB5757)" }} />
              <path className="services-branch-path-0" d="M 450 115 Q 430 135, 408 135" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-0" d="M 450 115 Q 430 135, 408 135" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #EB5757)" }} />
              <circle className="services-branch-node-0" cx="408" cy="95" r="3.5" fill="#EB5757" style={{ filter: "drop-shadow(0 0 4px #EB5757)" }} />
              <circle className="services-branch-node-0" cx="408" cy="135" r="3.5" fill="#EB5757" style={{ filter: "drop-shadow(0 0 4px #EB5757)" }} />
            </g>

            {/* Development Branch (Right Y=180, ends at x=792) */}
            <g>
              <path className="services-branch-path-1" d="M 620 180 C 680 180, 700 215, 750 215 L 792 215" stroke="#2F80EC" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
              <path className="services-branch-trail-1" d="M 620 180 C 680 180, 700 215, 750 215 L 792 215" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" style={{ filter: "drop-shadow(0 0 2px #2F80EC)" }} />
              <path className="services-branch-path-1" d="M 750 215 Q 770 195, 792 195" stroke="#2F80EC" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-1" d="M 750 215 Q 770 195, 792 195" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #2F80EC)" }} />
              <path className="services-branch-path-1" d="M 750 215 Q 770 235, 792 235" stroke="#2F80EC" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-1" d="M 750 215 Q 770 235, 792 235" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #2F80EC)" }} />
              <circle className="services-branch-node-1" cx="792" cy="195" r="3.5" fill="#2F80EC" style={{ filter: "drop-shadow(0 0 4px #2F80EC)" }} />
              <circle className="services-branch-node-1" cx="792" cy="235" r="3.5" fill="#2F80EC" style={{ filter: "drop-shadow(0 0 4px #2F80EC)" }} />
            </g>

            {/* Marketing Branch (Left Y=440, ends at x=360) */}
            <g>
              <path className="services-branch-path-2" d="M 580 440 C 520 440, 480 475, 410 475 L 360 475" stroke="#219652" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
              <path className="services-branch-trail-2" d="M 580 440 C 520 440, 480 475, 410 475 L 360 475" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" style={{ filter: "drop-shadow(0 0 2px #219652)" }} />
              <path className="services-branch-path-2" d="M 410 475 Q 390 455, 360 455" stroke="#219652" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-2" d="M 410 475 Q 390 455, 360 455" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #219652)" }} />
              <path className="services-branch-path-2" d="M 410 475 Q 390 495, 360 495" stroke="#219652" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-2" d="M 410 475 Q 390 495, 360 495" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #219652)" }} />
              <circle className="services-branch-node-2" cx="360" cy="455" r="3.5" fill="#219652" style={{ filter: "drop-shadow(0 0 4px #219652)" }} />
              <circle className="services-branch-node-2" cx="360" cy="495" r="3.5" fill="#219652" style={{ filter: "drop-shadow(0 0 4px #219652)" }} />
            </g>

            {/* Media Branch (Right Y=530, ends at x=840) */}
            <g>
              <path className="services-branch-path-3" d="M 600 530 C 680 530, 720 575, 790 575 L 840 575" stroke="#F2C94D" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
              <path className="services-branch-trail-3" d="M 600 530 C 680 530, 720 575, 790 575 L 840 575" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" style={{ filter: "drop-shadow(0 0 2px #F2C94D)" }} />
              <path className="services-branch-path-3" d="M 790 575 Q 810 555, 840 555" stroke="#F2C94D" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-3" d="M 790 575 Q 810 555, 840 555" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #F2C94D)" }} />
              <path className="services-branch-path-3" d="M 790 575 Q 810 595, 840 595" stroke="#F2C94D" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-3" d="M 790 575 Q 810 595, 840 595" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #F2C94D)" }} />
              <circle className="services-branch-node-3" cx="840" cy="555" r="3.5" fill="#F2C94D" style={{ filter: "drop-shadow(0 0 4px #F2C94D)" }} />
              <circle className="services-branch-node-3" cx="840" cy="595" r="3.5" fill="#F2C94D" style={{ filter: "drop-shadow(0 0 4px #F2C94D)" }} />
            </g>

            {/* Strategy Branch (Left Y=790, ends at x=432) */}
            <g>
              <path className="services-branch-path-4" d="M 600 790 C 530 790, 500 835, 460 835 L 432 835" stroke="#9A51E0" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
              <path className="services-branch-trail-4" d="M 600 790 C 530 790, 500 835, 460 835 L 432 835" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" style={{ filter: "drop-shadow(0 0 2px #9A51E0)" }} />
              <path className="services-branch-path-4" d="M 460 835 Q 450 815, 432 815" stroke="#9A51E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-4" d="M 460 835 Q 450 815, 432 815" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #9A51E0)" }} />
              <path className="services-branch-path-4" d="M 460 835 Q 450 855, 432 855" stroke="#9A51E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
              <path className="services-branch-trail-4" d="M 460 835 Q 450 855, 432 855" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" style={{ filter: "drop-shadow(0 0 1.5px #9A51E0)" }} />
              <circle className="services-branch-node-4" cx="432" cy="815" r="3.5" fill="#9A51E0" style={{ filter: "drop-shadow(0 0 4px #9A51E0)" }} />
              <circle className="services-branch-node-4" cx="432" cy="855" r="3.5" fill="#9A51E0" style={{ filter: "drop-shadow(0 0 4px #9A51E0)" }} />
            </g>

            {/* Definitions */}
            <defs>
              <linearGradient id="main-root-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#EB5757" />
                <stop offset="50%" stopColor="#2F80EC" />
                <stop offset="75%" stopColor="#219652" />
                <stop offset="100%" stopColor="#9A51E0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Services Cards Container */}
        <div className="relative md:absolute md:top-[180px] md:left-0 md:right-0 md:h-[1000px] z-10 flex flex-col md:block gap-6 mt-12 md:mt-0 px-4 md:px-0">
          {/* Central Organic Vertical Trunk Line (Mobile only) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-8 md:hidden z-0 pointer-events-none opacity-30">
            <svg viewBox="0 0 32 1000" className="w-full h-full" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="root-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#2F80EC" />
                  <stop offset="50%" stopColor="#EB5757" />
                  <stop offset="75%" stopColor="#219652" />
                  <stop offset="100%" stopColor="#9B51E0" />
                </linearGradient>
                <linearGradient id="root-gradient-sub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2F80EC" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Main Winding Root Trunk */}
              <path
                d="M 16 0 C 10 150, 22 300, 16 500 C 10 700, 22 850, 16 1000"
                stroke="url(#root-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Secondary Winding Sub-root */}
              <path
                d="M 12 0 C 12 250, 18 400, 16 500"
                stroke="url(#root-gradient-sub)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Third Winding Sub-root */}
              <path
                d="M 20 0 C 20 180, 16 320, 16 420"
                stroke="url(#root-gradient-sub)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Small lateral rootlet sprouts */}
              <path
                d="M 13 180 Q 6 200, 2 220"
                stroke="#2F80EC"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <path
                d="M 19 320 Q 26 340, 30 360"
                stroke="#EB5757"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <path
                d="M 13 600 Q 4 620, 2 640"
                stroke="#219652"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <path
                d="M 19 820 Q 28 840, 30 860"
                stroke="#9B51E0"
                strokeWidth="0.8"
                opacity="0.5"
              />
            </svg>
          </div>

          {SERVICES_DATA.map((service, idx) => {
            const IconComponent = service.icon;
            const isLeft = idx % 2 === 0;

            // Desktop absolute positioning coords (Y center matches: 115, 215, 475, 575, 835)
            // Card height is ~190px, so top coords are: 20px, 120px, 380px, 480px, 740px
            // Staggered horizontal offsets (8%, 12%, 14%) to make it look organic/unordered
            const absoluteClasses =
              idx === 0 ? "md:left-[12%] md:top-[20px] md:w-[22%]" :
                idx === 1 ? "md:right-[12%] md:top-[120px] md:w-[22%]" :
                  idx === 2 ? "md:left-[8%] md:top-[380px] md:w-[22%]" :
                    idx === 3 ? "md:right-[8%] md:top-[480px] md:w-[22%]" :
                      "md:left-[14%] md:top-[740px] md:w-[22%]";

            return (
              <div
                key={service.id}
                id={`services-card-${idx}`}
                ref={(el) => setCardRef(el, idx)}
                className={`w-[calc(50%-16px)] opacity-100 md:opacity-0 translate-y-0 md:translate-y-6 md:absolute relative ${isLeft ? "self-start" : "self-end"
                  } ${absoluteClasses}`}
              >
                {isLeft ? (
                  /* Organic Curved Branch Connector (Left Card -> connects to Right Center Trunk) */
                  <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center md:hidden pointer-events-none z-0 w-4 h-12">
                    <svg viewBox="0 0 16 48" className="w-full h-full" fill="none">
                      {/* Glowing Node at the trunk intersection */}
                      <circle
                        cx="14"
                        cy="12"
                        r="2.5"
                        fill={service.color}
                        style={{
                          filter: `drop-shadow(0 0 4px ${service.color})`,
                        }}
                      />
                      {/* Curved branch path (curves to the right) */}
                      <path
                        d="M 0 24 C 6 24, 8 12, 14 12"
                        stroke={service.color}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                      <path
                        d="M 0 24 C 6 24, 8 12, 14 12"
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.35"
                        style={{ filter: `drop-shadow(0 0 1.5px ${service.color})` }}
                      />
                      {/* Secondary sprout branch */}
                      <path
                        d="M 6 18 Q 10 32, 0 32"
                        stroke={service.color}
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        opacity="0.35"
                      />
                      <circle
                        cx="0"
                        cy="32"
                        r="1.5"
                        fill={service.color}
                        opacity="0.6"
                      />
                    </svg>
                  </div>
                ) : (
                  /* Organic Curved Branch Connector (Right Card -> connects to Left Center Trunk) */
                  <div className="absolute right-full top-1/2 -translate-y-1/2 flex items-center md:hidden pointer-events-none z-0 w-4 h-12">
                    <svg viewBox="0 0 16 48" className="w-full h-full" fill="none">
                      {/* Glowing Node at the trunk intersection */}
                      <circle
                        cx="2"
                        cy="12"
                        r="2.5"
                        fill={service.color}
                        style={{
                          filter: `drop-shadow(0 0 4px ${service.color})`,
                        }}
                      />
                      {/* Curved branch path (curves to the left) */}
                      <path
                        d="M 2 12 C 8 12, 10 24, 16 24"
                        stroke={service.color}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                      <path
                        d="M 2 12 C 8 12, 10 24, 16 24"
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.35"
                        style={{ filter: `drop-shadow(0 0 1.5px ${service.color})` }}
                      />
                      {/* Secondary sprout branch */}
                      <path
                        d="M 10 18 Q 6 32, 16 32"
                        stroke={service.color}
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        opacity="0.35"
                      />
                      <circle
                        cx="16"
                        cy="32"
                        r="1.5"
                        fill={service.color}
                        opacity="0.6"
                      />
                    </svg>
                  </div>
                )}

                <ServiceCard
                  service={service}
                  Icon={IconComponent}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  service: ServiceItem;
  Icon: any;
}

function ServiceCard({ service, Icon }: CardProps) {
  const cardRef = useMagnetic(0.08);

  return (
    <div
      ref={cardRef as any}
      className="glass-panel rounded-xl p-3 md:p-6 relative overflow-hidden group select-none glow-border cursor-pointer transition-all duration-300"
      style={{
        boxShadow: `0 0 10px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02)`,
      }}
    >
      {/* Decorative colored glow on card hover */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: service.color }}
      />

      <div className="flex items-center justify-between mb-3 md:mb-5">
        <div
          className="w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center border border-white/10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderColor: `rgba(${service.color === "#EB5757" ? "235, 87, 87" :
              service.color === "#2F80EC" ? "47, 128, 236" :
                service.color === "#219652" ? "33, 150, 82" :
                  service.color === "#F2C94D" ? "242, 201, 77" : "154, 81, 224"
              }, 0.15)`,
          }}
        >
          <Icon className="w-3.5 h-3.5 md:w-5 md:h-5" style={{ color: service.color }} />
        </div>
        <span
          className="text-[7px] md:text-[9px] tracking-widest font-semibold font-cascadia uppercase px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full border"
          style={{
            borderColor: `${service.color}40`,
            color: service.color,
            backgroundColor: `${service.color}0a`,
          }}
        >
          {service.id}
        </span>
      </div>

      <h3 className="text-xs md:text-lg font-bohuan uppercase tracking-wider text-white mb-1.5 md:mb-3 group-hover:translate-x-1 transition-transform duration-300">
        {service.title}
      </h3>

      <p className="text-white/40 text-[9px] md:text-[11px] leading-relaxed mb-3 md:mb-5">
        {service.description}
      </p>

      {/* Bullet Services List (Horizontal tag chips for visual compactness) */}
      <div className="border-t border-white/5 pt-2.5 md:pt-4 flex flex-wrap gap-1 md:gap-1.5">
        {service.subservices.map((sub, i) => {
          const isHighlighted = service.id === "development" && sub === "Custom Software";
          return isHighlighted ? (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[6px] md:text-[8px] font-cascadia font-semibold border"
              style={{
                color: service.color,
                borderColor: `${service.color}60`,
                backgroundColor: `${service.color}15`,
                boxShadow: `0 0 6px ${service.color}40`,
              }}
            >
              ✦ {sub}
            </span>
          ) : (
            <span
              key={i}
              className="px-1 py-0.5 rounded text-[6px] md:text-[8px] font-cascadia text-white/60 bg-white/5 border border-white/5"
            >
              {sub}
            </span>
          );
        })}
      </div>
    </div>
  );
}
