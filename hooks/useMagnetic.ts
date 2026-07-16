"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: any) => {
      const { clientX, clientY } = e;
      const bounding = element.getBoundingClientRect();
      
      // Calculate cursor position relative to the element center
      const x = clientX - (bounding.left + bounding.width / 2);
      const y = clientY - (bounding.top + bounding.height / 2);

      // Move the element slightly towards the cursor
      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Return element to original position
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove as EventListener);
    element.addEventListener("mouseleave", handleMouseLeave as EventListener);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove as EventListener);
      element.removeEventListener("mouseleave", handleMouseLeave as EventListener);
    };
  }, [strength]);

  return ref;
}
