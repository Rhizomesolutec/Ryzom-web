"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useMagnetic } from "@/hooks/useMagnetic";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Magnetic refs for links
  const logoRef = useMagnetic(0.2);
  const linkRefs = [
    useMagnetic(0.3), // Services
    useMagnetic(0.3), // Work
    useMagnetic(0.3), // About
    useMagnetic(0.3), // Why Us
    useMagnetic(0.3), // Contact
  ];
  const ctaRef = useMagnetic(0.25);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Services", id: "services", path: "/services" },
    { name: "Work", id: "work", path: "/work" },
    { name: "About", id: "about", path: "/about" },
    { name: "Why RYZOM", id: "why-ryzom", path: "/why-ryzom" },
    { name: "Contact", id: "contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-4 ${scrolled
          ? "bg-black/40 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div ref={logoRef as any} className="cursor-pointer">
            <Link href="/" onClick={(e) => handleNavClick(e, "hero")}>
              <Logo className="w-28 md:w-32 h-auto" animateOnLoad={true} interactive={true} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <div key={item.id} ref={linkRefs[idx] as any} className="relative py-2">
                <Link
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="text-white/60 hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors duration-300 relative group"
                >
                  {item.name}
                  {/* Underline animation */}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-blue scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Contact CTA */}
          <div className="hidden md:block">
            <div ref={ctaRef as any}>
              <Link
                href="/contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="relative inline-flex items-center justify-center px-6 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-white text-black border border-white hover:bg-black hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(47,128,236,0.3)] glow-border"
              >
                Start a Project
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-brand-blue transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="text-white/70 hover:text-white text-xl uppercase tracking-widest font-semibold transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="mt-6 px-8 py-3 rounded-full text-sm uppercase tracking-widest font-semibold bg-white text-black hover:bg-brand-blue hover:text-white transition-all duration-300"
              >
                Start a Project
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
