'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const courtLinesRef = useRef<SVGSVGElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already seen the intro in this session
    try {
      const params = new URLSearchParams(window.location.search);
      const forceIntro = params.get('intro') === '1';
      const alreadySeen = sessionStorage.getItem('nizam_intro_seen');

      if (!forceIntro && alreadySeen) {
        setIsVisible(false);
        return;
      }
    } catch {
      // In case of restricted iframe/storage
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem('nizam_intro_seen', 'true');
          } catch {
            // ignore storage error
          }
          setIsVisible(false);
        },
      });

      if (prefersReducedMotion) {
        // Reduced motion: Clean fade with zero rotation
        tl.fromTo(
          logoWrapperRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        )
          .fromTo(
            textRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
          )
          .to(overlayRef.current, {
            opacity: 0,
            duration: 0.4,
            delay: 0.4,
            ease: 'power2.inOut',
          });
      } else {
        // Full Cinematic Opening Sequence (Target ~2.0s)
        // Step 1: Initial state set
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(logoWrapperRef.current, { opacity: 0, scale: 0.72 });
        gsap.set(glowRef.current, { opacity: 0, scale: 0.8 });
        gsap.set(courtLinesRef.current, { opacity: 0, scale: 0.96 });
        gsap.set(textRef.current, { opacity: 0, y: 14 });
        gsap.set(badgeRef.current, { opacity: 0, y: -8 });

        // Step 2: Atmospheric court lines and amber glow reveal (0.0s - 0.5s)
        tl.to(
          courtLinesRef.current,
          { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
          0.05
        )
          .to(
            glowRef.current,
            { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
            0.1
          )
          .to(
            badgeRef.current,
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            0.15
          )

          // Step 3: Logo crest entrance (scale up gently and fade in) (0.15s - 0.65s)
          .to(
            logoWrapperRef.current,
            { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' },
            0.2
          )

          // Step 4: Controlled, stately 360-degree rotation (0.3s - 1.2s)
          // Uses power2.inOut for smooth acceleration and precise deceleration into lock
          .to(
            logoImgRef.current,
            {
              rotation: 360,
              duration: 0.95,
              ease: 'power2.inOut',
            },
            0.3
          )

          // Step 5: Settle impulse on logo at finish (1.2s - 1.4s)
          .to(
            logoWrapperRef.current,
            {
              scale: 1.05,
              duration: 0.15,
              ease: 'power1.out',
              yoyo: true,
              repeat: 1,
            },
            1.22
          )

          // Step 6: Brand Name & Supporting Tagline reveal (1.25s - 1.65s)
          .to(
            textRef.current,
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
            1.28
          )

          // Step 7: Seamless Dissolve into Homepage Hero (1.75s - 2.15s)
          .to(
            overlayRef.current,
            {
              opacity: 0,
              scale: 1.03,
              duration: 0.45,
              ease: 'power2.inOut',
              pointerEvents: 'none',
            },
            1.75
          );
      }
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      id="nizam-cinematic-intro"
      aria-label="Nizam Nawabs Opening"
      className="fixed inset-0 z-[99999] bg-[#080809] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Inline early-exit script to prevent flash on returning session visits */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (sessionStorage.getItem('nizam_intro_seen') && !window.location.search.includes('intro=1')) {
                var el = document.getElementById('nizam-cinematic-intro');
                if (el) el.style.display = 'none';
              }
            } catch (e) {}
          `,
        }}
      />

      {/* Atmospheric Radial Orange Core Glow */}
      <div
        ref={glowRef}
        className="absolute w-[460px] sm:w-[600px] h-[460px] sm:h-[600px] rounded-full pointer-events-none opacity-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255, 94, 0, 0.16) 0%, rgba(255, 94, 0, 0.04) 45%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Minimal Hardwood Geometry (SVG Court Arc & Center Line) */}
      <svg
        ref={courtLinesRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="courtGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5E00" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FF5E00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center Court Circle */}
        <circle
          cx="50%"
          cy="50%"
          r="140"
          fill="none"
          stroke="#FF5E00"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.22"
        />
        {/* Outer Restraining Perimeter Arc */}
        <circle
          cx="50%"
          cy="50%"
          r="260"
          fill="none"
          stroke="#FAF9F6"
          strokeWidth="1"
          strokeDasharray="2 10"
          strokeOpacity="0.08"
        />
        {/* Center Dividing Division Line */}
        <line
          x1="12%"
          y1="50%"
          x2="88%"
          y2="50%"
          stroke="#FF5E00"
          strokeWidth="1"
          strokeDasharray="6 8"
          strokeOpacity="0.16"
        />
      </svg>

      {/* Top Editorial Franchise Label */}
      <div ref={badgeRef} className="absolute top-10 sm:top-14 text-center opacity-0 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-dark/90 border border-surface-border backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.25em] text-zinc-400 uppercase">
            TELANGANA PRO BASKETBALL LEAGUE • OFFICIAL FRANCHISE
          </span>
        </div>
      </div>

      {/* Center Stage: Nizam Nawabs Crest & Brand Reveal */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Crest Wrapper */}
        <div
          ref={logoWrapperRef}
          className="relative flex items-center justify-center opacity-0"
        >
          {/* Subtle Ambient Backing Behind Logo */}
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-brand-orange/15 blur-xl pointer-events-none" />

          {/* Official Nizam Nawabs Logo Image */}
          <img
            ref={logoImgRef}
            src="/brand/logo-crest.png"
            alt="Nizam Nawabs Logo Crest"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain relative z-10 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] will-change-transform"
          />
        </div>

        {/* Brand Reveal Typography */}
        <div ref={textRef} className="mt-6 sm:mt-7 space-y-1.5 opacity-0">
          <h1
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight uppercase leading-none"
            style={{ letterSpacing: '-0.03em' }}
          >
            NIZAM NAWABS
          </h1>

          <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.28em] text-brand-orange uppercase">
            TELANGANA • PROFESSIONAL BASKETBALL
          </p>

          <div className="pt-1">
            <span className="inline-block text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.2em] text-zinc-400 uppercase">
              HYDERABAD • TPBL SEASON 1 RUNNERS UP
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Corner Sub-telemetry for Cinematic Atmosphere */}
      <div className="absolute bottom-6 left-6 hidden sm:block text-[9px] font-sans font-medium text-zinc-600 tracking-wider uppercase">
        <span>LOC: 17.4239° N, 78.4738° E</span>
      </div>
      <div className="absolute bottom-6 right-6 hidden sm:block text-[9px] font-sans font-medium text-zinc-600 tracking-wider uppercase">
        <span>ARENA: KVBR STADIUM</span>
      </div>
    </div>
  );
}
