'use client';

import React from 'react';

interface SponsorItem {
  id: string;
  name: string;
  logoUrl: string;
  tier: string;
  websiteUrl: string;
}

interface PartnersStripProps {
  sponsors: SponsorItem[];
}

export default function PartnersStrip({ sponsors }: PartnersStripProps) {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#08080A] border-b border-surface-border overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        <div className="flex items-center justify-between border-b border-surface-border/50 pb-4 text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400">
          <span>{"// 07 COMMERCIAL ALLIANCES"}</span>
          <span>OFFICIAL JERSEY & LEAGUE PARTNERS</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-surface-card border border-surface-border/80 hover:border-brand-orange/60 transition-all group"
            >
              <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight group-hover:text-brand-orange transition-colors uppercase">
                {sponsor.name.toUpperCase()}
              </span>
              <div className="h-6 w-[1px] bg-surface-border" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-orange">
                {sponsor.tier}
              </span>
            </div>
          ))}

          {/* Telangana Pro Basketball League Affiliation */}
          <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-surface-card/60 border border-surface-border/60">
            <span className="font-display font-black text-2xl sm:text-3xl text-zinc-300 tracking-tight">
              TPBL
            </span>
            <div className="h-6 w-[1px] bg-surface-border" />
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-zinc-400">
              TELANGANA PRO BASKETBALL LEAGUE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
