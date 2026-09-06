'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Flame, Users } from 'lucide-react';

interface PlayerItem {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
  photoUrl: string;
  bio: string;
  height: string;
  nationality: string;
  ppg: number;
  rpg: number;
  apg: number;
  isActive: boolean;
  displayOrder: number;
}

interface InteractiveRosterStageProps {
  players: PlayerItem[];
}

export default function InteractiveRosterStage({ players }: InteractiveRosterStageProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!players || players.length === 0) {
    return (
      <section className="py-24 bg-[#09090B] text-center border-b border-surface-border">
        <p className="font-display font-black text-2xl text-zinc-400 tracking-tight">ROSTER ANNOUNCEMENT IN PROGRESS</p>
        <p className="text-xs text-zinc-400 pt-2 font-sans">
          Official squad player registrations updating soon.
        </p>
      </section>
    );
  }

  const currentPlayer = players[activeIndex] || players[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % players.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + players.length) % players.length);
  };

  return (
    <section className="relative py-16 sm:py-24 lg:py-40 bg-[#08080A] overflow-hidden border-b border-surface-border selection:bg-brand-orange selection:text-white scroll-reveal">
      {/* Gigantic Jersey Number Watermark in Background */}
      <div className="absolute right-0 sm:right-10 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.05] z-0">
        <span className="font-display text-[42vw] font-black leading-none text-white tracking-tighter">
          #{currentPlayer.jerseyNumber}
        </span>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 space-y-8 sm:space-y-16">
        {/* Section Top Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border/50 pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-brand-orange uppercase tracking-wider font-bold">
              {"// 04"}
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-300">
              ACTIVE SQUAD STAGE
            </span>
          </div>

          {/* Player Switcher Tabs — Touch Scrollable */}
          <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {players.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(idx)}
                className={`shrink-0 whitespace-nowrap px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-all flex items-center ${
                  idx === activeIndex
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                    : 'bg-surface-card text-zinc-400 hover:text-white hover:bg-surface-elevated border border-surface-border'
                }`}
              >
                #{p.jerseyNumber} {p.name.split(' ')[0]}
              </button>
            ))}

            <Link
              href="/roster"
              className="ml-2 shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-brand-orange hover:text-white transition-colors min-h-[44px]"
            >
              <span>FULL ROSTER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* The Grand Editorial Player Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Player Portrait with Dramatic Silhouette Lighting */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Atmospheric Orange Rim Halo */}
            <div className="absolute w-[280px] sm:w-[460px] h-[280px] sm:h-[460px] bg-brand-orange/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Portrait Container with Soft Vignette */}
            <div className="relative z-10 w-full max-w-lg h-[340px] sm:h-[440px] md:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden border border-surface-border/80 shadow-2xl bg-[#121214] group">
              <img
                key={currentPlayer.id}
                src={currentPlayer.photoUrl || '/brand/player-1.png'}
                alt={currentPlayer.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top animate-fade-slide-in filter brightness-95 group-hover:scale-[1.025] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Float Jersey Tag */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-brand-orange/50 text-white font-display text-2xl font-black tracking-tight">
                  NO. <span className="text-brand-orange">#{currentPlayer.jerseyNumber}</span>
                </span>
              </div>

              {/* Status Tag */}
              <div className="absolute top-6 right-6 z-20">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-sans text-[11px] uppercase font-bold tracking-wider">
                  ACTIVE ROSTER
                </span>
              </div>

              {/* Bottom Tagline */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-wider text-zinc-400 font-medium">
                  {currentPlayer.nationality}
                </span>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-orange">
                  {currentPlayer.position}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Oversized Typography & Technical Athletic Metadata */}
          <div className="lg:col-span-6 space-y-8 lg:pl-6">
            {/* Position & Phase Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-sans font-bold text-xs uppercase tracking-wider">
                {currentPlayer.position}
              </span>
              <span className="text-xs font-sans text-zinc-400 uppercase tracking-wider font-medium">
                TELANGANA PRO BASKETBALL LEAGUE
              </span>
            </div>

            {/* Enormous Player Name Typography */}
            <div className="space-y-1">
              <h2
                key={`name-${currentPlayer.id}`}
                className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.88] uppercase font-black animate-fade-slide-in break-words"
              >
                {currentPlayer.name}
              </h2>
              <span className="font-display text-2xl sm:text-4xl text-brand-orange tracking-tight block font-black">
                JERSEY #{currentPlayer.jerseyNumber}
              </span>
            </div>

            {/* Bio Editorial Summary — Natural Sentence Case Manrope */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-sans leading-[1.7] max-w-xl font-normal">
              {currentPlayer.bio ||
                `${currentPlayer.name} plays ${currentPlayer.position} for the Nizam Nawabs, bringing athletic intensity and court leadership to the Telangana squad.`}
            </p>

            {/* Athletic Metrics Grid or STATS TBA */}
            {currentPlayer.ppg > 0 || currentPlayer.rpg > 0 || currentPlayer.apg > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-surface-card border border-surface-border">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-sans uppercase font-bold tracking-wider text-zinc-400 block">
                    PTS / GM
                  </span>
                  <span className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight font-black">
                    {currentPlayer.ppg > 0 ? currentPlayer.ppg.toFixed(1) : '—'}
                  </span>
                </div>

                <div className="space-y-1 border-x border-surface-border/60 px-2 sm:px-4">
                  <span className="text-[10px] sm:text-[11px] font-sans uppercase font-bold tracking-wider text-zinc-400 block">
                    REB / GM
                  </span>
                  <span className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-orange tracking-tight font-black">
                    {currentPlayer.rpg > 0 ? currentPlayer.rpg.toFixed(1) : '—'}
                  </span>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <span className="text-[10px] sm:text-[11px] font-sans uppercase font-bold tracking-wider text-zinc-400 block">
                    AST / GM
                  </span>
                  <span className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight font-black">
                    {currentPlayer.apg > 0 ? currentPlayer.apg.toFixed(1) : '—'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-card border border-surface-border/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-zinc-400 block">
                    ATHLETIC METRICS
                  </span>
                  <span className="text-xs text-zinc-400 font-sans">
                    Season match box scores pending verification
                  </span>
                </div>
                <span className="px-3 py-1 rounded-md bg-white/5 border border-surface-border text-zinc-400 font-sans text-xs font-bold uppercase tracking-wider">
                  STATS TBA
                </span>
              </div>
            )}

            {/* Height & Spec Tag */}
            {currentPlayer.height && (
              <div className="flex items-center gap-4 text-xs font-sans text-zinc-400">
                <span className="text-zinc-400">HEIGHT SPECIFICATION:</span>
                <span className="text-white font-bold">{currentPlayer.height}</span>
              </div>
            )}

            {/* Stage Controls: Prev / Next buttons */}
            <div className="flex items-center gap-4 pt-2 sm:pt-4">
              <button
                onClick={handlePrev}
                aria-label="Previous Player"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-card hover:bg-surface-elevated border border-surface-border flex items-center justify-center text-white hover:text-brand-orange transition-colors shrink-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next Player"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-card hover:bg-surface-elevated border border-surface-border flex items-center justify-center text-white hover:text-brand-orange transition-colors shrink-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <span className="text-xs font-sans font-semibold text-zinc-400 tracking-wider pl-2 uppercase">
                PLAYER {activeIndex + 1} OF {players.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
