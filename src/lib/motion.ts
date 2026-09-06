/**
 * Nizam Nawabs Unified Motion Language & Animation Tokens
 *
 * Designed to provide cinematic, fluid, predictable, and luxurious motion
 * across all components without jarring jumps or disconnected timings.
 */

export const MOTION = {
  // Purposeful easing curves (no linear for UI motion, no bouncy overshoot)
  ease: {
    // Standard natural deceleration for reveals, drawers, and incoming elements
    out: 'power3.out',
    // High-impact snappy deceleration for fast micro-interactions
    outExpo: 'expo.out',
    // Stately acceleration & deceleration for experience-level transitions
    inOut: 'power3.inOut',
    // CSS cubic-bezier curves for pure CSS transitions
    cssSmooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
    cssMicro: 'cubic-bezier(0.25, 1, 0.5, 1)',
  },

  // 3-Tier Hierarchy Durations (in seconds for GSAP)
  duration: {
    // Level 1: Micro-interactions (buttons, icons, pills, hover indicators)
    micro: 0.2, // 200ms
    button: 0.25, // 250ms

    // Level 2: Section & Content elements (cards, headings, content reveals)
    card: 0.35, // 350ms
    section: 0.65, // 650ms

    // Level 3: Experience transitions (page transition, 3D lerps, intro)
    pageExit: 0.2, // 200ms
    pageRotate: 0.45, // 450ms
    pageEntry: 0.3, // 300ms
    pageTotal: 0.85, // 850ms
    intro: 2.0, // 2000ms
  },

  // Stagger intervals for progressive reveals
  stagger: {
    fast: 0.05,
    normal: 0.08,
    relaxed: 0.12,
  },
};

/**
 * Utility to check if reduced motion is requested by the OS/browser
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
