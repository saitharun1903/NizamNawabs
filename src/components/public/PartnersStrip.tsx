'use client';

import React from 'react';

interface SponsorItem {
  id: string;
  name: string;
  logoUrl?: string;
  tier: string;
  websiteUrl?: string;
}

interface PartnersStripProps {
  sponsors?: SponsorItem[];
}

export default function PartnersStrip({ sponsors = [] }: PartnersStripProps) {
  // Defensively filter out any test or invalid records
  const validSponsors = (sponsors || []).filter(s => {
    if (!s || !s.name) return false;
    const n = s.name.trim().toLowerCase();
    return !n.includes('test') && !n.includes('demo') && !n.includes('verification') && !n.includes('sample');
  });

  return (
    <section className="py-16 sm:py-24 bg-[#08080A] border-b border-surface-border overflow-hidden scroll-reveal">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-surface-border/50 pb-4 gap-2 text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400">
          <span>{"// 07 COMMERCIAL ALLIANCES & ACCREDITATION"}</span>
          <span>OFFICIAL JERSEY & LEAGUE PARTNERS</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-16">
          {validSponsors.map((sponsor) => {
            const Content = (
              <div className="flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-3.5 sm:py-5 rounded-2xl bg-surface-card border border-surface-border/80 hover:border-brand-orange/60 hover:bg-surface-elevated transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group">
                <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight group-hover:text-brand-orange transition-colors duration-200 uppercase">
                  {sponsor.name.toUpperCase()}
                </span>
                <div className="h-5 sm:h-6 w-[1px] bg-surface-border" />
                <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-brand-orange">
                  {sponsor.tier}
                </span>
              </div>
            );

            if (sponsor.websiteUrl && sponsor.websiteUrl.startsWith('http')) {
              return (
                <a
                  key={sponsor.id}
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-brand-orange rounded-2xl"
                  aria-label={`${sponsor.name} (${sponsor.tier})`}
                >
                  {Content}
                </a>
              );
            }

            return (
              <div key={sponsor.id} className="inline-block">
                {Content}
              </div>
            );
          })}

          {/* Official League Affiliation Card - Always displayed with high prestige */}
          <div className="flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-3.5 sm:py-5 rounded-2xl bg-surface-card/60 border border-surface-border/60">
            <span className="font-display font-black text-xl sm:text-2xl md:text-3xl text-zinc-300 tracking-tight">
              TPBL
            </span>
            <div className="h-5 sm:h-6 w-[1px] bg-surface-border" />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-zinc-300">
                TELANGANA PRO BASKETBALL LEAGUE
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans text-zinc-500 uppercase tracking-wider">
                OFFICIAL FRANCHISE CHARTER
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
