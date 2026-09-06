'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowUpRight, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SeasonItem {
  id: string;
  seasonName: string;
  seasonNumber: number;
  year: string;
  achievement: string;
  description: string;
  coverImageUrl: string;
  isCurrent: boolean;
  status: string;
}

interface SeasonCampaignPosterProps {
  seasons: SeasonItem[];
}

export default function SeasonCampaignPoster({ seasons }: SeasonCampaignPosterProps) {
  const season1 = seasons.find((s) => s.seasonNumber === 1) || {
    seasonName: 'TPBL Season 1',
    year: '2024',
    achievement: 'Runners Up',
    description:
      'Historic debut season in the Telangana Pro Basketball League culminating in a finals finish. An aggressive campaign that solidified the Nawabs as contenders on the hardwood.',
    coverImageUrl: '/brand/highlight-season1.png',
  };

  const season2 = seasons.find((s) => s.seasonNumber === 2);

  return (
    <section className="relative py-16 sm:py-24 lg:py-36 bg-brand-black overflow-hidden border-b border-surface-border scroll-reveal">
      {/* Gigantic Background Watermark "01" */}
      <div className="absolute -left-12 sm:left-4 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.04]">
        <span className="font-display text-[45vw] font-black leading-none text-white tracking-tighter">
          01
        </span>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 space-y-8 sm:space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border/50 pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-brand-orange uppercase tracking-wider font-bold">
              {"// 03"}
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-300">
              COMPETITIVE CAMPAIGN DOSSIER
            </span>
          </div>
          <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider">
            HISTORIC INAUGURAL RUN
          </span>
        </div>

        {/* The Sports Campaign Poster: Grand Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">
          {/* Main Poster Canvas (Season 1 Runners Up Spotlight) */}
          <div className="lg:col-span-8 bg-surface-dark border border-brand-orange/40 rounded-3xl p-5 sm:p-8 md:p-12 lg:p-14 relative overflow-hidden flex flex-col justify-between shadow-2xl group">
            {/* Poster Inner Atmospheric Lighting */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Poster Top Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-brand-orange text-white text-xs font-sans font-bold uppercase tracking-wider shadow-lg shadow-brand-orange/30">
                  {season1.year} CAMPAIGN
                </span>
                <span className="text-xs font-sans text-zinc-400 uppercase tracking-wider font-medium">
                  TELANGANA PRO BASKETBALL LEAGUE
                </span>
              </div>

              <div className="inline-flex items-center gap-2 text-brand-orange font-sans text-xs uppercase tracking-wider font-bold">
                <Trophy className="w-4 h-4 text-brand-orange" />
                <span>OFFICIAL SILVER MEDALISTS</span>
              </div>
            </div>

            {/* Poster Centerpiece: Massive Typography & Season Emblem */}
            <div className="relative z-10 py-6 sm:py-10 md:py-14 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                {/* Authentic Season 1 Emblem */}
                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl bg-black border border-surface-border overflow-hidden p-3 shadow-xl shrink-0 group-hover:scale-[1.03] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <img
                    src={season1.coverImageUrl}
                    alt="TPBL Season 1 Emblem"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-400 block">
                    SEASON 01
                  </span>
                  <h3 className="font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-brand-orange tracking-tight leading-[0.88] uppercase break-words">
                    RUNNERS UP
                  </h3>
                  <p className="text-xs font-sans text-zinc-400 uppercase tracking-wider pt-1">
                    DEBUT FINALS CONTENDERS • HYDERABAD HARDWOOD
                  </p>
                </div>
              </div>

              {/* Narrative Summary — Sentence Case Manrope */}
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-sans font-normal max-w-2xl leading-[1.65] pt-2">
                {season1.description}
              </p>
            </div>

            {/* Poster Bottom Stats Strip */}
            <div className="relative z-10 pt-6 sm:pt-8 border-t border-surface-border grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
              <div>
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-zinc-500 block">
                  LEAGUE FINISH
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  FINALISTS
                </span>
              </div>

              <div>
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-zinc-500 block">
                  ORGANIZER
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-brand-orange tracking-tight">
                  TPBL
                </span>
              </div>

              <div>
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-zinc-500 block">
                  HOME COURT
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  KVBR STADIUM
                </span>
              </div>

              <div>
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-zinc-500 block">
                  STATUS
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-zinc-300 tracking-tight">
                  HONORED
                </span>
              </div>
            </div>
          </div>

          {/* Asymmetric Side Column: Season 2 Championship Quest */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            {/* Season 2 Teaser Box */}
            <div className="bg-surface-card border border-surface-border rounded-3xl p-8 sm:p-10 space-y-8 flex-1 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-surface-border text-zinc-300 text-xs font-sans font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-brand-orange" />
                  <span>NEXT CAMPAIGN INCOMING</span>
                </div>

                <h4 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none uppercase">
                  {season2?.seasonName || 'TPBL SEASON 2'}
                </h4>

                <p className="text-sm text-zinc-300 font-sans leading-relaxed font-normal">
                  {season2?.description ||
                    'With the inaugural finals foundation established, Nizam Nawabs return to the hardwood targeting the TPBL Championship crown.'}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-surface-border/60">
                <div className="flex items-center justify-between text-xs font-sans font-semibold">
                  <span className="text-zinc-400">SEASON STATUS</span>
                  <span className="text-brand-orange font-bold uppercase tracking-wider">
                    {season2?.status || 'UPCOMING PRE-SEASON'}
                  </span>
                </div>

                <Link
                  href="/matches"
                  className="btn-motion w-full min-h-[48px] bg-brand-orange hover:bg-brand-orangeHover text-white py-3.5 rounded-xl font-sans font-bold uppercase tracking-wider text-xs shadow-xl shadow-brand-orange/20 flex items-center justify-center gap-2 group"
                >
                  <span>VIEW MATCH FIXTURES</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Authentic Brand Grounding Note */}
            <div className="p-6 rounded-2xl bg-[#121214] border border-surface-border/60 space-y-2">
              <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 block font-bold">
                GROUNDED IN TELANGANA
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans font-normal">
                Nizam Nawabs represents authentic professional basketball culture, local youth pipelines, and premier South Indian competition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
