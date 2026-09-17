"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function isTouchMobile() {
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Native scroll on mobile — Lenis causes lag / fighting with touch
    if (isTouchMobile()) {
      (window as any).lenis = null;
      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => {
        window.clearTimeout(refreshTimer);
        window.removeEventListener("resize", onResize);
      };
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      syncTouch: false,
    });

    (window as any).lenis = lenis;

    // Keep GSAP pin/scrub sections (Selected Work) in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    // Refresh after layout paints so pin distances are accurate
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return <>{children}</>;
}
