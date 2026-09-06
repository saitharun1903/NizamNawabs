'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

interface BrandedPageTransitionProps {
  children: React.ReactNode;
}

export default function BrandedPageTransition({ children }: BrandedPageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const isNavigatingRef = useRef(false);
  const targetPathRef = useRef<string | null>(null);
  const prevPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);

  // Animation DOM refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Global click interceptor for internal public links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      // Allow new tab or window clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore hash-only anchors, external links, tel/mailto, or target="_blank"
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank'
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.origin);
        // Ignore external domains
        if (targetUrl.origin !== window.location.origin) return;

        const targetPath = targetUrl.pathname;

        // Ignore admin or api routes
        if (targetPath.startsWith('/admin') || targetPath.startsWith('/api')) return;

        // Ignore if clicking the exact current path and search
        if (targetPath === window.location.pathname && targetUrl.search === window.location.search) {
          e.preventDefault();
          return;
        }

        // Prevent duplicate transition triggers if already navigating
        if (isNavigatingRef.current) {
          e.preventDefault();
          return;
        }

        // Genuine internal public route change!
        e.preventDefault();
        startTransition(targetUrl.pathname + targetUrl.search + targetUrl.hash);
      } catch {
        // Fallback to normal navigation if URL parsing fails
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => document.removeEventListener('click', handleDocumentClick, { capture: true });
  }, []);

  // Starts the transition sequence
  const startTransition = (targetHref: string) => {
    isNavigatingRef.current = true;
    targetPathRef.current = targetHref;
    setIsTransitioning(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Overlay entrance & single logo rotation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (prefersReducedMotion) {
        // Reduced motion: Clean, gentle fade without rotation
        tl.to(overlayRef.current, { opacity: 1, duration: 0.15, ease: 'power2.out' })
          .to(logoWrapperRef.current, { opacity: 1, scale: 1, duration: 0.15, ease: 'power2.out' }, 0.05)
          .call(() => {
            router.push(targetHref);
          }, undefined, 0.2);
      } else {
        // Step 1: Dark overlay and ambient glow appear (0.00s - 0.12s)
        gsap.set(overlayRef.current, { opacity: 0, display: 'flex' });
        gsap.set(logoWrapperRef.current, { opacity: 0, scale: 0.82 });
        gsap.set(logoImgRef.current, { rotation: 0 });
        gsap.set(textRef.current, { opacity: 0, y: 8 });

        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.14,
          ease: 'power2.out',
        })
          // Step 2: Logo scales in gently (0.05s - 0.20s)
          .to(
            logoWrapperRef.current,
            {
              opacity: 1,
              scale: 1,
              duration: 0.18,
              ease: 'power2.out',
            },
            0.05
          )
          // Step 3: Brand text reveals cleanly (0.10s)
          .to(
            textRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.2,
              ease: 'power2.out',
            },
            0.1
          )
          // Step 4: One single, controlled, stately 360° rotation (0.12s - 0.55s)
          .to(
            logoImgRef.current,
            {
              rotation: 360,
              duration: 0.44,
              ease: 'power2.inOut',
            },
            0.12
          )
          // Step 5: Trigger router navigation during rotation so route fetches concurrently
          .call(
            () => {
              router.push(targetHref);
            },
            undefined,
            0.22
          );
      }
    });

    // Safety fallback timeout in case route transition hangs (1.4s max)
    setTimeout(() => {
      if (isNavigatingRef.current) {
        finishTransition();
      }
    }, 1400);
  };

  // Finishes the transition once the new route is active
  const finishTransition = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          isNavigatingRef.current = false;
          targetPathRef.current = null;
        },
      });

      // Overlay fades away smoothly
      tl.to(overlayRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.22,
        ease: 'power2.inOut',
      });

      // New page container reveals with smooth subtle drift
      if (contentWrapperRef.current) {
        tl.fromTo(
          contentWrapperRef.current,
          { opacity: 0.6, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          0.05
        );
      }
    });
  };

  // Detect route changes (both link clicks and browser Back/Forward)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;

      if (isNavigatingRef.current) {
        // Link navigation route change: wait small buffer for logo rotation settle then finish
        setTimeout(() => {
          finishTransition();
        }, 120);
      } else {
        // Browser Back / Forward navigation: subtle page reveal
        if (contentWrapperRef.current) {
          gsap.fromTo(
            contentWrapperRef.current,
            { opacity: 0.7, y: 10 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
          );
        }
      }
    }
  }, [pathname]);

  return (
    <>
      {/* Branded Page Transition Overlay */}
      <div
        ref={overlayRef}
        id="nizam-page-transition"
        aria-hidden={!isTransitioning}
        className={`fixed inset-0 z-[99990] bg-[#080809] flex flex-col items-center justify-center select-none ${
          isTransitioning ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 hidden'
        }`}
        style={{
          transition: 'opacity 0.15s ease-out',
        }}
      >
        {/* Subtle Ambient Radial Orange Glow */}
        <div
          ref={glowRef}
          className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 94, 0, 0.14) 0%, rgba(255, 94, 0, 0.03) 50%, transparent 70%)',
            filter: 'blur(25px)',
          }}
        />

        {/* Minimal Hardwood Geometry SVG Arc */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50%"
            cy="50%"
            r="110"
            fill="none"
            stroke="#FF5E00"
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity="0.3"
          />
          <circle
            cx="50%"
            cy="50%"
            r="210"
            fill="none"
            stroke="#FAF9F6"
            strokeWidth="1"
            strokeDasharray="2 10"
            strokeOpacity="0.1"
          />
        </svg>

        {/* Center Stage: Logo Crest */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <div ref={logoWrapperRef} className="relative flex items-center justify-center">
            {/* Subtle glow rim behind logo */}
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-brand-orange/15 blur-lg pointer-events-none" />

            {/* Official Nizam Nawabs Crest */}
            <img
              ref={logoImgRef}
              src="/brand/logo-crest.png"
              alt="Nizam Nawabs Crest"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain relative z-10 filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] will-change-transform"
            />
          </div>

          {/* Minimal Brand Label Below Logo */}
          <div ref={textRef} className="mt-4 space-y-1">
            <span
              className="block font-display font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              NIZAM NAWABS
            </span>
            <span className="block font-sans text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-brand-orange uppercase">
              TELANGANA • BASKETBALL
            </span>
          </div>
        </div>
      </div>

      {/* Main Page Content with smooth reveal on route arrival */}
      <div ref={contentWrapperRef} className="flex-1 flex flex-col w-full">
        {children}
      </div>
    </>
  );
}
