"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
}

interface Glow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  targetRadius: number;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

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

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Initialize neural network nodes — lighter on mobile for scroll performance
    const isMobile = window.innerWidth <= 768;
    const nodeCount = Math.min(
      isMobile ? 28 : 100,
      Math.floor((window.innerWidth * window.innerHeight) / (isMobile ? 28000 : 12000))
    );
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
        baseRadius: Math.random() * 1.5 + 0.5,
      });
    }

    // Initialize large volumetric background glows (2 on mobile, 4 on desktop)
    const glows: Glow[] = isMobile
      ? [
          { x: canvas.width * 0.3, y: canvas.height * 0.3, vx: 0.12, vy: 0.08, color: "rgba(235, 87, 87, 0.07)", radius: 220, targetRadius: 220 },
          { x: canvas.width * 0.7, y: canvas.height * 0.65, vx: -0.08, vy: 0.1, color: "rgba(47, 128, 236, 0.07)", radius: 260, targetRadius: 260 },
        ]
      : [
          { x: canvas.width * 0.25, y: canvas.height * 0.25, vx: 0.15, vy: 0.1, color: "rgba(235, 87, 87, 0.08)", radius: 300, targetRadius: 300 },
          { x: canvas.width * 0.75, y: canvas.height * 0.3, vx: -0.1, vy: 0.15, color: "rgba(47, 128, 236, 0.08)", radius: 350, targetRadius: 350 },
          { x: canvas.width * 0.5, y: canvas.height * 0.7, vx: 0.08, vy: -0.12, color: "rgba(33, 150, 82, 0.08)", radius: 400, targetRadius: 400 },
          { x: canvas.width * 0.8, y: canvas.height * 0.8, vx: -0.12, vy: -0.08, color: "rgba(154, 81, 224, 0.08)", radius: 300, targetRadius: 300 },
        ];

    // Loop
    let animationFrameId: number;
    const animate = () => {
      // Clear with slight transparency for a tiny trail effect (pure black backdrop)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Volumetric Glows
      glows.forEach((glow) => {
        // Move glow
        glow.x += glow.vx;
        glow.y += glow.vy;

        // Bounce glows off screen bounds
        if (glow.x - glow.radius < 0 || glow.x + glow.radius > canvas.width) glow.vx *= -1;
        if (glow.y - glow.radius < 0 || glow.y + glow.radius > canvas.height) glow.vy *= -1;

        // Draw radial gradient
        const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
        gradient.addColorStop(0, glow.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // 2. Draw Digital Grid (desktop only — expensive on mobile)
      if (!isMobile) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
        ctx.lineWidth = 1;
        const gridSize = 60;
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
      }

      // 3. Update & Draw Neural Nodes
      nodes.forEach((node, i) => {
        // Apply slow drifting motion
        node.x += node.vx;
        node.y += node.vy;

        // Boundary wrap
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;

        // Interactive mouse parallax/attraction
        const dx = mouse.current.x - node.x;
        const dy = mouse.current.y - node.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 200;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          // Slowly pull nodes towards mouse
          node.x += (dx / dist) * force * 0.6;
          node.y += (dy / dist) * force * 0.6;
          node.radius = node.baseRadius * (1 + force * 1.5);
        } else {
          node.radius = node.baseRadius;
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = dist < maxDist ? "rgba(47, 128, 236, 0.8)" : "rgba(255, 255, 255, 0.15)";
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ndx = node.x - other.x;
          const ndy = node.y - other.y;
          const ndist = Math.hypot(ndx, ndy);
          const connectDist = 120;

          if (ndist < connectDist) {
            const alpha = (connectDist - ndist) / connectDist * 0.08;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            
            // Highlight connections close to mouse cursor
            if (dist < maxDist && Math.hypot(mouse.current.x - other.x, mouse.current.y - other.y) < maxDist) {
              ctx.strokeStyle = `rgba(47, 128, 236, ${alpha * 2.5})`;
              ctx.lineWidth = 0.8;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.lineWidth = 0.5;
            }
            
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 w-full h-full pointer-events-none"
      style={{ background: "#000000" }}
    />
  );
}
