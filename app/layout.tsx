import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import NeuralBackground from "@/components/NeuralBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "RYZOM | Intelligent Digital Experiences",
  description: "RYZOM is a premium technology, branding, and business strategy company. We shape unique digital ecosystems through Development, Design, and Growth Strategy.",
  keywords: [
    "RYZOM",
    "Creative Agency",
    "Web Development",
    "Mobile Apps",
    "Brand Identity",
    "UI UX Design",
    "Digital Marketing",
    "SEO Optimization",
    "Business Strategy",
    "Digital Transformation",
  ],
  authors: [{ name: "RYZOM Team" }],
  openGraph: {
    title: "RYZOM | Intelligent Digital Experiences",
    description: "RYZOM is a premium technology, branding, and business strategy company.",
    url: "https://ryzom.in",
    siteName: "RYZOM",
    images: [
      {
        url: "/vercel.svg", // Fallback to verify
        width: 800,
        height: 600,
        alt: "RYZOM Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RYZOM | Intelligent Digital Experiences",
    description: "Premium technology, branding, and business strategy services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-full antialiased dark">
      <body className="relative min-h-full bg-black text-white selection:bg-brand-blue selection:text-white flex flex-col noise-overlay">
        <Preloader />

        {/* Custom cursor layer (Client only) */}
        <CustomCursor />

        {/* Global Neural Network Background */}
        <NeuralBackground />

        {/* Global Smooth Scrolling Container */}
        <SmoothScroll>
          {/* Header navigation */}
          <Navbar />
          
          {/* Main page content */}
          <main className="flex-1 flex flex-col relative z-10 w-full">
            {children}
          </main>

          {/* Floating WhatsApp CTA */}
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}


