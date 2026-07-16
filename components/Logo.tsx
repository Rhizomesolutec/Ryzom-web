"use client";

import { useState } from "react";

interface LogoProps {
  className?: string;
  animateOnLoad?: boolean;
  glowColor?: string;
  interactive?: boolean;
  permanentGlow?: boolean;
}

export default function Logo({
  className = "w-48 h-auto",
  glowColor = "#2F80EC",
  permanentGlow = false,
}: LogoProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${className} aspect-[24/5] relative overflow-hidden transition-all duration-300`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Images/Ryzom logo.webp"
        alt="RYZOM Logo"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-none h-auto mix-blend-screen select-none pointer-events-none transition-all duration-500"
        style={{
          filter: hovered || permanentGlow
            ? `drop-shadow(0 0 8px ${glowColor}) brightness(1.2)`
            : "brightness(1)",
        }}
      />
    </div>
  );
}
