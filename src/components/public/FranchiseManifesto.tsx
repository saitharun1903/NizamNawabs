'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, MapPin, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface FranchiseManifestoProps {
  teamInfo?: {
    headline: string;
    philosophy: string;
    telanganaIdentity: string;
    homeCourt: string;
    bannerImageUrl: string;
    achievementSummary: string;
  } | null;
}

export default function FranchiseManifesto({ teamInfo }: FranchiseManifestoProps) {
  const headline = teamInfo?.headline || 'PRIDE OF TELANGANA BASKETBALL';
  const philosophy =
    teamInfo?.philosophy ||
    'Born from the heart of the Deccan, Nizam Nawabs embodies aggressive court tempo, local pride, and relentless athletic discipline. We represent the rising standard of professional basketball in South India.';
  const telanganaIdentity =
    teamInfo?.telanganaIdentity ||
    'Anchored in Telangana’s rich sporting heritage, the Nawabs bring together top domestic talent, high-altitude athletic conditioning, and an unwavering commitment to youth basketball culture.';
  const homeCourt = teamInfo?.homeCourt || 'Kotla Vijaya Bhaskara Reddy (KVBR) Indoor Stadium, Hyderabad';
  const bannerImage = teamInfo?.bannerImageUrl || '/brand/post-journey-players.png';

  return (
    <section className="relative py-16 sm:py-24 lg:py-36 bg-[#0B0B0D] overflow-hidden border-b border-surface-border scroll-reveal">
      {/* Background Graphic Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-5">
        <span className="font-display text-[26vw] leading-none font-black text-white">
          DECCAN
        </span>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Editorial Eyebrow & Index */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border/50 pb-4 sm:pb-6 mb-8 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-brand-orange uppercase tracking-wider font-bold">
              {"// 02"}
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-300">
              FRANCHISE MANIFESTO & IDENTITY
            </span>
          </div>
          <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider">
            TELANGANA PRO BASKETBALL LEAGUE
          </span>
        </div>

        {/* Asymmetrical Editorial Composition: Overlapping Image + Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Visual Column: Large Dominant Team Visual with Floating Badge */}
          <div className="lg:col-span-7 relative group">
            {/* Main Visual Frame */}
            <div className="relative overflow-hidden rounded-2xl border border-surface-border/90 hover:border-surface-borderHover transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl bg-black">
              <img
                src={bannerImage}
                alt="Nizam Nawabs Starting Core"
                loading="lazy"
                decoding="async"
                className="w-full h-[280px] sm:h-[420px] md:h-[520px] lg:h-[620px] object-cover object-center group-hover:scale-[1.025] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] filter brightness-95 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Lower Overlay Content */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 space-y-2">
                <span className="px-2.5 py-1 rounded bg-brand-orange text-white text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider inline-block">
                  TELANGANA ATHLETIC EXCELLENCE
                </span>
                <h3 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none uppercase">
                  {headline}
                </h3>
              </div>
            </div>

            {/* Asymmetrical Floating Trophy Accent */}
            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-8 sm:-right-6 z-20 bg-surface-card border border-brand-orange/50 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-xl max-w-full sm:max-w-[280px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 block font-bold">
                    OFFICIAL HONORS
                  </span>
                  <span className="font-display font-black text-xl text-white tracking-tight block uppercase">
                    TPBL SEASON 1
                  </span>
                  <span className="text-xs font-sans font-bold text-brand-orange uppercase tracking-wider">
                    RUNNERS UP • FINALISTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Editorial Narrative Column */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-brand-orange text-[11px] font-sans font-bold tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5" />
                <span>FRANCHISE PHILOSOPHY</span>
              </div>

              <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.85] uppercase">
                BOLD BASKETBALL.
                <br />
                <span className="text-brand-orange">
                  LOCAL PRIDE.
                </span>
              </h2>
            </div>

            {/* Philosophy Narrative — Sentence Case Manrope */}
            <div className="space-y-5 text-zinc-300 font-sans leading-[1.7] text-base sm:text-[17px] max-w-xl">
              <p className="border-l-2 border-brand-orange pl-5 text-zinc-200 font-normal">
                {philosophy}
              </p>
              <p className="text-zinc-400 text-sm sm:text-base font-normal">
                {telanganaIdentity}
              </p>
            </div>

            {/* Arena Technical Specs Box */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-3">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  HOME ARENA
                </span>
                <span className="text-brand-orange font-bold font-sans text-xs uppercase tracking-wider">KVBR INDOOR</span>
              </div>
              <p className="text-sm text-zinc-200 font-sans font-medium">
                {homeCourt}
              </p>
              <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] font-sans font-medium text-zinc-400 uppercase tracking-wider">
                <span>YOUSUFGUDA, HYDERABAD</span>
                <span>POLISHED MAPLE HARDWOOD</span>
              </div>
            </div>

            {/* Editorial Link */}
            <div>
              <Link
                href="/team"
                className="inline-flex items-center gap-2.5 text-xs font-sans font-bold uppercase tracking-wider text-brand-orange hover:text-white transition-colors group"
              >
                <span>READ COMPLETE FRANCHISE DOSSIER</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
