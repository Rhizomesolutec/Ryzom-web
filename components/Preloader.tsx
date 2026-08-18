"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORBIT_COLORS = ["#2F80EC", "#EB5757", "#219652", "#F2C94D", "#9A51E0", "#F3994B"];

/**
 * Fast Living Core preloader — glass sphere + Y mark.
 * Exits as soon as the app is ready (capped short so it never feels slow).
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const MIN_MS = 520;
    const MAX_MS = 900;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, Math.min(MIN_MS - elapsed, MAX_MS - elapsed));
      window.setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    // Hard cap — never block browsing
    const cap = window.setTimeout(finish, MAX_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(cap);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Loading"
          role="status"
        >
          {/* Soft core bloom */}
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(47,128,236,0.45) 0%, rgba(154,81,224,0.15) 45%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative w-[72px] h-[72px] flex items-center justify-center">
            {/* Orbiting brand sparks */}
            {ORBIT_COLORS.map((color, i) => (
              <span
                key={color}
                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}`,
                  animation: `ryzom-preloader-orbit ${1.4 + i * 0.08}s linear infinite`,
                  animationDelay: `${-i * 0.18}s`,
                  // offset via transform in keyframes using custom property
                  ["--orbit-r" as string]: `${26 + (i % 3) * 3}px`,
                  ["--orbit-start" as string]: `${i * 60}deg`,
                }}
                aria-hidden
              />
            ))}

            {/* Living Core glass sphere */}
            <motion.div
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: 52,
                height: 52,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                background:
                  "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.6) 100%)",
                border: "1.1px solid rgba(255,255,255,0.35)",
                boxShadow: `
                  inset 0 2.5px 4.5px rgba(255,255,255,0.4),
                  inset 0 -2.5px 4.5px rgba(0,0,0,0.5),
                  0 8px 26px rgba(0,0,0,0.8),
                  0 0 16px rgba(47,128,236,0.35),
                  0 0 28px rgba(255,255,255,0.12)
                `,
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="absolute rounded-full opacity-45 animate-spin-slow-core"
                style={{
                  width: 28,
                  height: 28,
                  background:
                    "conic-gradient(from 0deg, #2F80EC55, #EB575755, #21965255, #F2C94D55, #9A51E055, #F3994B55, #2F80EC55)",
                  filter: "blur(4px)",
                }}
                aria-hidden
              />

              {/* Navbar / Living Core Y */}
              <svg
                viewBox="0 0 24 28"
                className="relative z-10"
                style={{
                  width: 16,
                  height: 19,
                  filter: "drop-shadow(0 0 3.5px rgba(255,255,255,0.75))",
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
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
