import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * ANYMATE — Landing Page v1
 *
 * What’s here
 * - Hero with headline + two CTA buttons
 * - Trust strip with SVG logo carousel (buttons + auto-advance)
 * - 3-feature section
 * - Social proof blurb
 * - Footer with basic links
 *
 * How to wire your SVGs
 * 1) Put your SVG files into /public/logos or import them directly.
 * 2) Replace the `logos` array below with your imports or public paths.
 *    Example: import LogoAcme from "../public/logos/acme.svg";
 *             then use: { src: LogoAcme, alt: "Acme" }
 * 3) Keep aspect ratios ~2:1 to avoid jumpy heights.
 */

// TODO: Replace with real SVG imports or public paths from your logo zip
const logos: { src: string; alt: string }[] = [
  { src: "/logos/logo1.svg", alt: "Logo 1" },
  { src: "/logos/logo2.svg", alt: "Logo 2" },
  { src: "/logos/logo3.svg", alt: "Logo 3" },
  { src: "/logos/logo4.svg", alt: "Logo 4" },
  { src: "/logos/logo5.svg", alt: "Logo 5" },
  { src: "/logos/logo6.svg", alt: "Logo 6" },
];

function LogoCarousel() {
  const [index, setIndex] = React.useState(0);
  const visible = 5; // how many logos to show at once

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % logos.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + logos.length) % logos.length);
  const next = () => setIndex((i) => (i + 1) % logos.length);

  const slice = Array.from({ length: visible }).map((_, k) => logos[(index + k) % logos.length]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="rounded-2xl" onClick={prev} aria-label="Previous logos">◀</Button>
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-5 gap-6 items-center">
            {slice.map((logo, i) => (
              <motion.div
                key={logo.alt + i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex items-center justify-center p-4 h-16 rounded-2xl bg-muted"
              >
                {/* Use <img> to preserve SVG as file; or inline with <logo /> if imported as ReactComponent */}
                <img src={logo.src} alt={logo.alt} className="max-h-10 w-auto opacity-80" />
              </motion.div>
            ))}
          </div>
        </div>
        <Button variant="secondary" className="rounded-2xl" onClick={next} aria-label="Next logos">▶</Button>
      </div>
    </div>
  );
}

export default function AnymateLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/40">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="font-semibold tracking-tight">anymate</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="opacity-80 hover:opacity-100">Features</a>
            <a href="#how" className="opacity-80 hover:opacity-100">How it works</a>
            <a href="#faq" className="opacity-80 hover:opacity-100">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost">Sign in</Button>
            <Button className="rounded-2xl">Get started</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-5xl font-semibold tracking-tight"
            >
              Animate anything.
              <span className="block text-foreground/70">In minutes, not days.</span>
            </motion.h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Anymate turns static assets into motion—fast. Import, tweak, export. No timeline headaches, no plugin maze.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button size="lg" variant="secondary" className="rounded-2xl">
                <Play className="mr-2 h-4 w-4" /> Watch demo
              </Button>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {[
                "No credit card required",
                "Export to MP4, GIF, or WebM",
                "Works with SVG, PNG, and Lottie",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {t}</li>
              ))}
            </ul>
          </div>

          <Card className="border-dashed">
            <CardContent className="p-4 md:p-6">
              <div className="aspect-video w-full rounded-2xl bg-muted grid place-items-center">
                <div className="text-center px-6">
                  <p className="font-medium">Drop your SVG here</p>
                  <p className="text-sm text-muted-foreground">Live preview placeholder — wire to your canvas later.</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Trusted by teams</p>
                <LogoCarousel />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Import instantly",
              body: "Drag in SVGs, PNGs, or Lottie and we map layers automatically.",
            },
            {
              title: "One-tap motion",
              body: "Apply smart presets (float, bounce, reveal) and fine-tune if you want.",
            },
            {
              title: "Export everywhere",
              body: "Render to MP4, GIF, WebM or export JSON for dev handoff.",
            },
          ].map((f) => (
            <Card key={f.title} className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Card className="rounded-2xl border-muted">
          <CardContent className="p-6 md:p-8">
            <p className="text-lg md:text-xl text-center max-w-3xl mx-auto text-muted-foreground">
              "We animated a full product tour in one afternoon. Anymate cut our time by 80%."
            </p>
            <p className="mt-2 text-center text-sm">— Design Lead, BetaCo</p>
          </CardContent>
        </Card>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-muted-foreground flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span>anymate</span>
          </div>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
