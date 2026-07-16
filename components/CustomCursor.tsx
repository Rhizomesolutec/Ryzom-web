"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [hovered, setHovered] = useState(false);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!canvas || !dot || !ring) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;

      // Spawn particles occasionally on mouse move
      if (Math.random() < 0.4) {
        const colors = ["#EB5757", "#2F80EC", "#219652", "#F2C94D", "#9A51E0", "#F3994B"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          alpha: 1.0,
          color: randomColor,
          size: Math.random() * 2 + 1,
        });
      }
    };

    // Track hover states for links and buttons
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.classList.contains("interactive-cursor") ||
        target.style.cursor === "pointer";
      
      setHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    // Smooth follow loop
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp mouse coordinate for smooth lag effect
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.15;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.15;

      // Render dot & ring positions via GSAP or direct style mapping
      gsap.set(dot, {
        x: mouse.current.targetX,
        y: mouse.current.targetY,
        xPercent: -50,
        yPercent: -50,
      });

      gsap.set(ring, {
        x: mouse.current.x,
        y: mouse.current.y,
        xPercent: -50,
        yPercent: -50,
        scale: hovered ? 1.8 : 1.0,
        borderColor: hovered ? "rgba(47, 128, 236, 0.8)" : "rgba(255, 255, 255, 0.4)",
        backgroundColor: hovered ? "rgba(47, 128, 236, 0.05)" : "transparent",
      });

      // Update & render particles
      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02; // Decay rate
        
        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hovered]);

  return (
    <>
      {/* Canvas for particle trails */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998] w-full h-full hidden md:block"
      />
      {/* Sharp central dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-transform duration-100 hidden md:block"
      />
      {/* Lagging outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/40 rounded-full pointer-events-none z-[9999] transition-[scale,border-color,background-color] duration-300 hidden md:block"
      />
    </>
  );
}
