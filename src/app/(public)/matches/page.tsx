import React from 'react';
import prisma from '@/lib/db';
import MatchCard from '@/components/public/MatchCard';
import { Calendar, Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const selectedStatus = searchParams?.status || 'all';

  const whereClause: any = {};
  if (selectedStatus && selectedStatus !== 'all') {
    whereClause.status = selectedStatus;
  }

  let matches: any[] = [];
  try {
    matches = await prisma.match.findMany({
      where: whereClause,
      orderBy: { matchDate: 'desc' },
    });
  } catch (err) {
    console.warn('[MatchesPage] Database query notice (using defaults):', err);
  }

  const statuses = [
    { label: 'ALL FIXTURES', value: 'all' },
    { label: 'UPCOMING', value: 'Upcoming' },
    { label: 'COMPLETED RESULTS', value: 'Completed' },
  ];

  return (
    <div className="py-12 sm:py-24 space-y-10 sm:space-y-16 bg-brand-black">
      {/* Header */}
      <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-surface-border court-lines-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-brand-orange" />
            <span>TELANGANA PRO BASKETBALL LEAGUE</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.88] uppercase">
            FIXTURES & <span className="text-brand-orange">RESULTS</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-sans leading-relaxed font-normal">
            Follow every match, tip-off time, venue location, and box score across our TPBL campaigns.
          </p>
        </div>
      </section>

      {/* Filter Tabs & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-surface-border/60 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-xs uppercase font-sans font-bold tracking-wider text-zinc-400 mr-1 shrink-0">
            FILTER:
          </span>
          {statuses.map((tab) => {
            const isActive = selectedStatus.toLowerCase() === tab.value.toLowerCase();
            return (
              <a
                key={tab.value}
                href={tab.value === 'all' ? '/matches' : `/matches?status=${tab.value}`}
                className={`shrink-0 min-h-[44px] flex items-center px-4 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'bg-surface-card text-zinc-400 hover:text-white hover:bg-surface-elevated border border-surface-border'
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card rounded-xl border border-surface-border space-y-4">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="font-display font-black text-2xl text-zinc-300 tracking-tight uppercase">
              SCHEDULE COMING SOON
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Match schedule and results will be announced as dates are finalized.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
