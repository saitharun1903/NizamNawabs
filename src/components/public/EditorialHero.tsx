'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import BasketballCanvas from '@/components/3d/BasketballCanvas';
import { Trophy, ArrowDown, ChevronRight, Play, Flame } from 'lucide-react';
import gsap from 'gsap';
import { MOTION, isReducedMotion } from '@/lib/motion';

interface EditorialHeroProps {
  heroData?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
    eyebrow?: string;
  } | null;
}

export default function EditorialHero({ heroData }: EditorialHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;

    let hasPlayed = false;
    let fallbackTimer: NodeJS.Timeout | null = null;

    const runEntrance = () => {
      if (hasPlayed) return;
      hasPlayed = true;

      const tl = gsap.timeline({ defaults: { ease: MOTION.ease.out } });

      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          title1Ref.current,
          { opacity: 0, y: 60, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85 },
          '-=0.3'
        )
        .fromTo(
          title2Ref.current,
          { opacity: 0, y: 60, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.65 },
          '-=0.4'
        );
    };

    // Check if intro is playing or already seen
    let alreadySeen = false;
    let forceIntro = false;
    try {
      const params = new URLSearchParams(window.location.search);
      forceIntro = params.get('intro') === '1';
      alreadySeen = Boolean(sessionStorage.getItem('nizam_intro_seen'));
    } catch {
      // storage access fallback
    }

    if (alreadySeen && !forceIntro) {
      // Intro will not play, run hero entrance immediately
      runEntrance();
    } else {
      // Listen for intro reveal broadcast
      const handleIntroReveal = () => {
        runEntrance();
      };
      window.addEventListener('nizam:intro-reveal', handleIntroReveal, { once: true });

      // Fallback safeguard: if intro event doesn't fire within 2.4s, animate anyway
      fallbackTimer = setTimeout(runEntrance, 2400);

      return () => {
        window.removeEventListener('nizam:intro-reveal', handleIntroReveal);
        if (fallbackTimer) clearTimeout(fallbackTimer);
      };
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-brand-black flex flex-col justify-between overflow-hidden pt-24 pb-10 border-b border-surface-border selection:bg-brand-orange selection:text-white"
    >
      {/* Background Architectural Court Markings & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle orange radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Tactical Key & Free Throw Circle SVG */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full opacity-15 stroke-zinc-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          fill="none"
          strokeWidth="1.2"
        >
          {/* Key Area */}
          <rect x="350" y="100" width="300" height="400" />
          <circle cx="500" cy="500" r="150" strokeDasharray="6 6" />
          <circle cx="500" cy="500" r="300" stroke="#FF5E00" strokeWidth="0.8" opacity="0.6" />
          {/* 3-Point Arc */}
          <path d="M 200 100 L 200 300 C 200 650, 800 650, 800 300 L 800 100" />
          <line x1="500" y1="0" x2="500" y2="1000" strokeDasharray="4 4" opacity="0.4" />
        </svg>

        {/* Halftone / Dot Grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Editorial Telemetry Bar */}
      <div ref={metaRef} className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border/50 pb-4 text-[11px] font-sans font-medium tracking-wider text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
            <span className="text-white font-bold">17.4239° N, 78.4738° E</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline">HYDERABAD, TELANGANA</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/15 border border-brand-orange/40 text-brand-orange font-sans font-bold uppercase text-xs tracking-wider">
              <Trophy className="w-3 h-3 text-brand-orange" />
              <span>TPBL SEASON 1 RUNNERS UP</span>
            </div>
            <span className="text-zinc-400 font-sans font-semibold text-[10px] uppercase tracking-wider hidden md:inline">
              OFFICIAL FRANCHISE
            </span>
          </div>
        </div>
      </div>

      {/* Centerpiece Composition: Enormous Typography + 3D Basketball Layering */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-4 sm:py-8 lg:py-12 my-auto w-full max-w-[1700px] mx-auto px-4 overflow-hidden">
        {/* Layer 1: Background Title "NIZAM" */}
        <div className="w-full text-center select-none overflow-visible">
          <h1
            ref={title1Ref}
            className="font-display text-[clamp(3.5rem,17vw,13rem)] leading-[0.78] tracking-tighter text-zinc-100 uppercase font-black drop-shadow-2xl transition-all"
            style={{
              letterSpacing: '-0.04em',
            }}
          >
            NIZAM
          </h1>
        </div>

        {/* Layer 2: Interactive 3D Basketball Canvas Floating In-Between */}
        <div
          className="relative w-full max-w-2xl h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] -my-10 sm:-my-16 md:-my-24 lg:-my-32 z-20 cursor-grab active:cursor-grabbing"
        >
          <BasketballCanvas />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <span className="text-[9px] sm:text-[10px] uppercase font-sans font-bold tracking-wider text-zinc-400 bg-brand-black/80 px-3 py-1 rounded-full border border-surface-border backdrop-blur-sm">
              DRAG TO ROTATE BALL
            </span>
          </div>
        </div>

        {/* Layer 3: Foreground Title "NAWABS" with Orange Flare */}
        <div className="w-full text-center select-none z-30">
          <h2
            ref={title2Ref}
            className="font-display text-[clamp(3.5rem,17vw,13rem)] leading-[0.78] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-brand-white via-zinc-200 to-zinc-500 uppercase font-black"
            style={{
              letterSpacing: '-0.04em',
            }}
          >
            NAWABS
          </h2>
        </div>
      </div>

      {/* Bottom Editorial Controls & Narrative Statement */}
      <div ref={ctaRef} className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-surface-border/60 pt-6">
          {/* Asymmetric Editorial Statement */}
          <div className="md:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-brand-orange text-[11px] font-sans font-bold tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>{heroData?.eyebrow || 'TELANGANA • PROFESSIONAL BASKETBALL'}</span>
            </div>
            <p className="text-sm sm:text-base lg:text-[17px] text-zinc-300 font-sans font-normal max-w-xl leading-[1.65]">
              {heroData?.subtitle ||
                'Bold basketball. Local pride. Unstoppable spirit on the hardwood. Representing Hyderabad across the Telangana Pro Basketball League.'}
            </p>
          </div>

          {/* Action CTAs — Stacked full-width on mobile, side-by-side on sm+ */}
          <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center md:justify-end gap-3 sm:gap-4 w-full">
            <Link
              href={heroData?.ctaUrl || '/roster'}
              className="btn-motion inline-flex items-center justify-center gap-2.5 bg-brand-orange hover:bg-brand-orangeHover text-white px-6 py-3.5 min-h-[48px] rounded-xl font-sans font-bold uppercase tracking-wider text-xs shadow-lg shadow-brand-orange/25 group text-center"
            >
              <span>{heroData?.ctaLabel || 'VIEW ROSTER'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href={heroData?.secondaryCtaUrl || '/matches'}
              className="btn-motion inline-flex items-center justify-center gap-2.5 bg-surface-card hover:bg-surface-elevated border border-surface-border hover:border-surface-borderHover text-white px-6 py-3.5 min-h-[48px] rounded-xl font-sans font-bold uppercase tracking-wider text-xs group text-center"
            >
              <Play className="w-3 h-3 text-brand-orange fill-brand-orange" />
              <span>{heroData?.secondaryCtaLabel || 'MATCH HIGHLIGHTS'}</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex items-center justify-between text-zinc-500 text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider pt-2">
          <span>01 / ARCHITECTURAL OPENING</span>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="hidden sm:inline">SCROLL TO DISCOVER</span>
            <ArrowDown className="w-3.5 h-3.5 text-brand-orange opacity-75 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
