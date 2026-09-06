'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, Play, Sparkles } from 'lucide-react';
import BasketballCanvas from '@/components/3d/BasketballCanvas';

interface HeroProps {
  heroData?: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaUrl: string;
    secondaryCtaLabel: string;
    secondaryCtaUrl: string;
    backgroundMediaUrl: string;
  };
}

export default function HeroSection({ heroData }: HeroProps) {
  const eyebrow = heroData?.eyebrow || 'TELANGANA PRO BASKETBALL LEAGUE';
  const title = heroData?.title || 'NIZAM NAWABS';
  const subtitle = heroData?.subtitle || 'Season 1 Runners Up • Bold basketball, local pride, unstoppable spirit.';
  const ctaLabel = heroData?.ctaLabel || 'EXPLORE SQUAD';
  const ctaUrl = heroData?.ctaUrl || '/roster';
  const secondaryCtaLabel = heroData?.secondaryCtaLabel || 'MATCH HIGHLIGHTS';
  const secondaryCtaUrl = heroData?.secondaryCtaUrl || 'https://www.youtube.com/@fgsnpro';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-brand-black court-lines-pattern">
      {/* Dynamic Lighting Atmospheric Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-brand-orange/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-[450px] h-[450px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Large Background Typography Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-[0.03] text-center w-full">
        <span className="font-display text-[22vw] leading-none uppercase tracking-tighter text-white block">
          NAWABS
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Bold Athletic Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Achievement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card border border-brand-orange/40 backdrop-blur-md shadow-xl">
              <Trophy className="w-4 h-4 text-brand-orange animate-bounce" />
              <span className="text-xs font-condensed font-extrabold uppercase tracking-widest text-brand-orange">
                {eyebrow}
              </span>
            </div>

            {/* Massive Hero Title */}
            <div className="space-y-1">
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white leading-[0.88] drop-shadow-2xl">
                {title}
              </h1>
              <div className="flex items-center gap-3 pt-2">
                <span className="h-[2px] w-12 bg-brand-orange" />
                <span className="text-xs sm:text-sm font-condensed font-bold uppercase tracking-[0.3em] text-zinc-400">
                  Telangana Professional Basketball Franchise
                </span>
              </div>
            </div>

            {/* Editorial Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed font-sans font-normal">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={ctaUrl}
                className="group inline-flex items-center gap-3 bg-brand-orange hover:bg-brand-orangeHover text-white px-7 py-3.5 rounded font-condensed font-bold uppercase tracking-wider text-sm transition-all transform hover:-translate-y-0.5 shadow-xl shadow-brand-orange/25"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={secondaryCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-surface-card hover:bg-surface-elevated border border-surface-border text-zinc-200 hover:text-white px-6 py-3.5 rounded font-condensed font-bold uppercase tracking-wider text-sm transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current" />
                </div>
                <span>{secondaryCtaLabel}</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-surface-border/60 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <span className="font-display text-3xl sm:text-4xl text-white block">FINALIST</span>
                <span className="text-[11px] font-condensed uppercase tracking-wider text-zinc-400">
                  TPBL Season 1 Runners Up
                </span>
              </div>
              <div>
                <span className="font-display text-3xl sm:text-4xl text-brand-orange block">100%</span>
                <span className="text-[11px] font-condensed uppercase tracking-wider text-zinc-400">
                  Telangana Pride
                </span>
              </div>
              <div>
                <span className="font-display text-3xl sm:text-4xl text-white block">SEASON 2</span>
                <span className="text-[11px] font-condensed uppercase tracking-wider text-zinc-400">
                  Championship Quest
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Basketball Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Decorative Court Graphic Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-brand-orange/20 animate-spin-slow" />
              <div className="absolute w-56 h-56 rounded-full border border-white/5" />
            </div>

            {/* The 3D Canvas */}
            <div className="w-full h-[400px] sm:h-[480px] lg:h-[540px] z-10">
              <BasketballCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
