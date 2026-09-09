"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Phone, Mail, MapPin, Send, Globe } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";
import Logo from "./Logo";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSent, setIsSent] = useState(false);
  const connectorPathRef = useRef<SVGPathElement | null>(null);

  const ctaSubmitRef = useMagnetic(0.2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormState({ name: "", email: "", message: "" });
    }, 4000);
  };

  useEffect(() => {
    // Animate energy pulse down the connector line in contact section
    const path = connectorPathRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: pathLength, strokeDashoffset: pathLength },
      {
        strokeDashoffset: -pathLength,
        duration: 3.5,
        repeat: -1,
        ease: "none",
      }
    );

    return () => {
      gsap.killTweensOf(path);
    };
  }, []);

  return (
    <section
      id="contact"
      className="relative min-h-screen py-32 bg-black overflow-hidden flex items-center select-none"
    >
      {/* Interactive Map Background Layer */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        <svg
          viewBox="0 0 1000 500"
          className="w-full max-w-5xl h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Abstract dots grid simulating world map outline */}
          {/* Custom tech grid */}
          <g fill="rgba(255, 255, 255, 0.15)">
            <circle cx="150" cy="150" r="1.5" />
            <circle cx="180" cy="160" r="1.5" />
            <circle cx="210" cy="180" r="1.5" />
            <circle cx="250" cy="140" r="1.5" />
            <circle cx="300" cy="170" r="1.5" />
            <circle cx="480" cy="130" r="1.5" />
            <circle cx="520" cy="160" r="1.5" />
            <circle cx="560" cy="180" r="1.5" />
            <circle cx="610" cy="150" r="1.5" />
            <circle cx="780" cy="160" r="1.5" />
            <circle cx="820" cy="220" r="1.5" />
            
            {/* Tech nodes */}
            <circle cx="200" cy="300" r="1.5" />
            <circle cx="250" cy="330" r="1.5" />
            <circle cx="300" cy="320" r="1.5" />
            <circle cx="350" cy="380" r="1.5" />
            <circle cx="500" cy="350" r="1.5" />
            <circle cx="550" cy="310" r="1.5" />
            <circle cx="600" cy="370" r="1.5" />
            <circle cx="720" cy="300" r="1.5" />
            <circle cx="750" cy="340" r="1.5" />
            <circle cx="800" cy="360" r="1.5" />
          </g>

          {/* Connected network paths */}
          <path
            d="M 210 180 L 300 170 L 480 130 M 480 130 L 520 160 L 610 150 M 300 170 L 250 330 L 350 380 M 520 160 L 500 350 L 600 370 M 610 150 L 720 300 L 800 360"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Pulsing Hotspots (Bangalore, New York, London) */}
          {/* Bangalore Hotspot */}
          <g>
            <circle cx="680" cy="280" r="6" fill="#2F80EC" />
            <circle cx="680" cy="280" r="16" stroke="#2F80EC" strokeWidth="1" className="animate-ping origin-center" />
          </g>
          {/* New York Hotspot */}
          <g>
            <circle cx="280" cy="180" r="6" fill="#EB5757" />
            <circle cx="280" cy="180" r="16" stroke="#EB5757" strokeWidth="1" className="animate-ping origin-center" />
          </g>
          {/* London Hotspot */}
          <g>
            <circle cx="490" cy="150" r="6" fill="#219652" />
            <circle cx="490" cy="150" r="16" stroke="#219652" strokeWidth="1" className="animate-ping origin-center" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Contact Info & Brand CTA */}
          <div className="flex flex-col items-start">
            <span className="text-xs font-cascadia uppercase tracking-widest text-brand-blue mb-4 block">
              Grow with Us
            </span>
            <h2 className="text-3xl md:text-6xl font-bohuan uppercase tracking-wider text-white leading-tight mb-8">
              Let's Grow<br />Together
            </h2>
            <p className="text-white/40 text-xs md:text-sm font-cascadia leading-relaxed mb-12 max-w-md">
              Small structural optimizations yield exponential business strength. Get in touch with our team to map out your digital evolution.
            </p>

            {/* Direct Contact Details */}
            <div className="flex flex-col gap-6 w-full max-w-sm mb-12 relative">
              {/* SVG Root Path connecting info blocks */}
              <svg className="absolute left-4 top-4 bottom-4 w-6 h-full pointer-events-none hidden md:block" fill="none">
                <path d="M 12 0 V 100" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" />
                <path ref={connectorPathRef} d="M 12 0 V 100" stroke="#2F80EC" strokeWidth="2" />
              </svg>

              <div className="flex items-center gap-6 group pl-0 md:pl-10">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-cascadia text-white/30 block">Call us</span>
                  <a href="tel:+919744643646" className="text-xs font-cascadia text-white hover:text-white transition-colors">
                    +91 97446 43646
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 group pl-0 md:pl-10">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-cascadia text-white/30 block">Email us</span>
                  <a href="mailto:hello@ryzom.in" className="text-xs font-cascadia text-white hover:text-white transition-colors">
                    hello@ryzom.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 group pl-0 md:pl-10">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-cascadia text-white/30 block">HQ Location</span>
                  <span className="text-xs font-cascadia text-white/70 group-hover:text-white transition-colors">
                    Bangalore, Karnataka, India
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-6 mb-8">
              {["LinkedIn", "Twitter", "Instagram", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[10px] font-cascadia uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>

            {/* Signature closing logo (Core final destination) */}
            <div id="contact-logo" className="mt-4 transition-all duration-700 pointer-events-auto relative group inline-block">
              {/* Gradient glow effect behind the logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red opacity-30 blur-2xl rounded-full group-hover:opacity-70 transition-opacity duration-500" />
              <Logo className="w-36 md:w-40 h-auto opacity-70 hover:opacity-100 transition-opacity relative z-10" />
            </div>
          </div>

          {/* Right: Floating Glass Card Form */}
          <div className="relative">
            {/* Glowing borders and corner frames */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-red opacity-10 blur-xl" />
            
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 md:p-10 rounded-2xl border border-white/5 relative z-10 w-full flex flex-col gap-6"
              style={{
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.8)`,
              }}
            >
              <div>
                <h3 className="text-lg md:text-xl font-bohuan uppercase tracking-wider text-white mb-2">
                  Initiate System Contact
                </h3>
                <p className="text-[10px] font-cascadia text-white/40">
                  Fill in your project requirements to activate a response.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-cascadia">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-cascadia text-white placeholder-white/20 focus:outline-none focus:border-brand-blue focus:bg-white/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-cascadia">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. john@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-cascadia text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-cascadia">Project Scope</label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe your design, code, or branding goals..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-cascadia text-white placeholder-white/20 focus:outline-none focus:border-brand-green focus:bg-white/10 transition-all resize-none"
                />
              </div>

              <div ref={ctaSubmitRef as any} className="mt-2">
                <button
                  type="submit"
                  disabled={isSent}
                  className="relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-white text-black border border-white hover:bg-black hover:text-white transition-all duration-300 w-full cursor-pointer hover:shadow-[0_0_15px_rgba(47,128,236,0.4)]"
                >
                  {isSent ? (
                    <>
                      <span>System Connected</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
