import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

interface MatchItem {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string;
  matchTime: string;
  venue: string;
  competition: string;
  status: string;
}

export default function ScoreTicker({ matches = [] }: { matches: MatchItem[] }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-surface-dark border-y border-surface-border py-2.5 px-4 text-center">
        <p className="text-xs uppercase font-sans font-bold tracking-wider text-zinc-400">
          TPBL Season 2 Schedule Announcement Coming Soon • Stay Tuned
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-dark/95 backdrop-blur-sm border-y border-surface-border overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
        {/* Label Tag */}
        <div className="bg-brand-orange text-white px-4 py-2.5 min-h-[40px] flex items-center justify-center gap-2 shrink-0 font-sans font-extrabold tracking-wider text-xs uppercase shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>TPBL HARDWOOD CENTRAL</span>
        </div>

        {/* Matches strip */}
        <div className="flex-1 overflow-x-auto no-scrollbar touch-momentum flex items-center divide-x divide-surface-border/80">
          {matches.slice(0, 4).map((m) => {
            const isCompleted = m.status === 'Completed';
            return (
              <div
                key={m.id}
                className="px-5 py-2.5 flex items-center gap-4 shrink-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-brand-orange font-bold">
                    {m.competition}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-sans font-bold tracking-wide text-white">
                    <span className={m.homeTeam.includes('Nizam') ? 'text-brand-orange' : 'text-zinc-300'}>
                      {m.homeTeam}
                    </span>
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded bg-black/70 font-display font-black text-white text-sm tracking-tight border border-surface-border">
                        {m.homeScore} : {m.awayScore}
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-sans font-bold text-[11px]">VS</span>
                    )}
                    <span className={m.awayTeam.includes('Nizam') ? 'text-brand-orange' : 'text-zinc-300'}>
                      {m.awayTeam}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col text-[10px] text-zinc-400 font-sans font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    {m.matchDate}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-500 truncate max-w-[120px]">
                    <MapPin className="w-3 h-3" />
                    {m.venue.split(',')[0]}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      : 'bg-brand-orange/15 text-brand-orange border border-brand-orange/30'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            );
          })}

          <Link
            href="/matches"
            className="px-4 py-2.5 flex items-center gap-1 text-xs font-sans font-bold tracking-wider uppercase text-zinc-400 hover:text-brand-orange transition-colors shrink-0"
          >
            <span>FULL SCHEDULE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
