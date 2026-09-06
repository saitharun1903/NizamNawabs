import React from 'react';
import prisma from '@/lib/db';
import { Trophy, Clock, Flag, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function JourneyPage() {
  const milestones = await prisma.journeyMilestone.findMany({
    where: { isVisible: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="py-24 space-y-16 bg-brand-black">
      {/* Header */}
      <section className="relative pt-12 pb-16 border-b border-surface-border court-lines-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-brand-orange" />
            <span>HISTORICAL CHRONOLOGY</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.88] uppercase">
            THE <span className="text-brand-orange">JOURNEY</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-sans leading-relaxed font-normal">
            The official historical chronology of the Nizam Nawabs, detailing pivotal franchise milestones, campaigns, and hardwood achievements.
          </p>
        </div>
      </section>

      {/* Visual Timeline Stream */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {milestones.length > 0 ? (
          <div className="relative border-l-2 border-brand-orange/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-16">
            {milestones.map((m, index) => (
              <div key={m.id} className="relative group">
                {/* Timeline Pin Node */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-brand-black border-2 border-brand-orange flex items-center justify-center group-hover:scale-125 transition-transform shadow-lg shadow-brand-orange/30">
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                </div>

                {/* Milestone Card */}
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 sm:p-8 space-y-5 hover:border-brand-orange/60 transition-all duration-300 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="font-display font-black text-4xl sm:text-5xl text-brand-orange tracking-tight">
                      {m.yearLabel}
                    </span>
                    <span className="px-3 py-1 rounded bg-black/60 border border-surface-border text-xs font-sans font-bold uppercase tracking-wider text-zinc-300">
                      {m.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight uppercase">
                      {m.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 leading-[1.65] font-sans font-normal">
                      {m.description}
                    </p>
                  </div>

                  {m.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-surface-border bg-black max-h-80">
                      <img
                        src={m.imageUrl}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card rounded-xl border border-surface-border space-y-4">
            <Clock className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="font-display font-black text-2xl text-zinc-300 tracking-tight uppercase">
              MILESTONES UPDATING
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Historical timeline entries are being cataloged by the club archives.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
