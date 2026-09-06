import React from 'react';
import prisma from '@/lib/db';
import RosterCard from '@/components/public/RosterCard';
import InteractiveRosterStage from '@/components/public/InteractiveRosterStage';
import { Users, Shield, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RosterPage({
  searchParams,
}: {
  searchParams: { position?: string };
}) {
  const selectedPos = searchParams?.position || 'all';

  const whereClause: any = { isActive: true };
  if (selectedPos && selectedPos !== 'all') {
    whereClause.position = { contains: selectedPos };
  }

  const players = await prisma.player.findMany({
    where: whereClause,
    orderBy: { displayOrder: 'asc' },
  });

  const allActivePlayers = await prisma.player.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  const positions = ['all', 'Guard', 'Forward', 'Center'];

  return (
    <div className="pt-20 space-y-16 bg-brand-black">
      {/* 1. Viewport-Dominating Player Stage */}
      <InteractiveRosterStage players={allActivePlayers} />

      {/* 2. Squad Index Header */}
      <section className="relative pt-6 pb-12 border-b border-surface-border court-lines-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-brand-orange" />
            <span>FULL ATHLETE REGISTRY</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.88] uppercase">
            SQUAD <span className="text-brand-orange">DOSSIER</span>
          </h2>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-surface-border/60">
          <span className="text-xs uppercase font-sans font-bold tracking-wider text-zinc-400 mr-2">
            POSITION FILTER:
          </span>
          {positions.map((pos) => {
            const isActive = selectedPos.toLowerCase() === pos.toLowerCase();
            return (
              <a
                key={pos}
                href={pos === 'all' ? '/roster' : `/roster?position=${pos}`}
                className={`px-4 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'bg-surface-card text-zinc-400 hover:text-white hover:bg-surface-elevated border border-surface-border'
                }`}
              >
                {pos === 'all' ? 'ALL POSITIONS' : `${pos.toUpperCase()}S`}
              </a>
            );
          })}
        </div>

        {/* Players Grid */}
        <div className="pt-10">
          {players.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {players.map((player) => (
                <RosterCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-surface-card rounded-xl border border-surface-border space-y-4">
              <Users className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="font-display font-black text-2xl text-zinc-300 tracking-tight uppercase">
                NO PLAYERS FOUND IN THIS CATEGORY
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                Squad entries can be added or activated via the Admin CMS.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
