import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Ticket, ShieldAlert } from 'lucide-react';

interface MatchProps {
  match: {
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
    ticketUrl?: string;
    notes?: string;
  };
}

function formatMatchDate(dateStr: string) {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
      }
    }
  } catch {}
  return dateStr;
}

export default function MatchCard({ match }: MatchProps) {
  const isCompleted = match.status?.toLowerCase() === 'completed';
  const isLive = match.status?.toLowerCase() === 'live';
  const isUpcoming = match.status?.toLowerCase() === 'upcoming';

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 sm:p-6 hover:border-brand-orange/50 transition-all duration-300 shadow-xl space-y-5 sm:space-y-6">
      {/* Header: Competition & Status */}
      <div className="flex items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-surface-border/60">
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-orange">
          {match.competition}
        </span>
        <span
          className={`px-2.5 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${
            isLive
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : isCompleted
              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              : 'bg-brand-orange/20 text-brand-orange border border-brand-orange/40 animate-pulse'
          }`}
        >
          {match.status}
        </span>
      </div>

      {/* Main Scoreboard Representation */}
      <div className="grid grid-cols-5 items-center gap-1 sm:gap-2 text-center">
        {/* Home Team */}
        <div className="col-span-2 text-right pr-1">
          <h4
            className={`font-display font-black text-lg sm:text-2xl tracking-tight leading-tight uppercase break-words ${
              match.homeTeam.includes('Nizam') ? 'text-brand-orange' : 'text-white'
            }`}
          >
            {match.homeTeam}
          </h4>
          <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-zinc-400 block pt-0.5">
            {match.homeTeam.includes('Nizam') ? 'HOME SQUAD' : 'OPPONENT'}
          </span>
        </div>

        {/* Score / VS Center */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {isCompleted ? (
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-brand-black border border-surface-border font-display text-xl sm:text-3xl font-black text-white shadow-inner tracking-tight">
              {`${match.homeScore} - ${match.awayScore}`}
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-black border border-surface-border flex items-center justify-center font-display font-bold text-xs sm:text-sm text-zinc-400">
              VS
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="col-span-2 text-left pl-1">
          <h4
            className={`font-display font-black text-lg sm:text-2xl tracking-tight leading-tight uppercase break-words ${
              match.awayTeam.includes('Nizam') ? 'text-brand-orange' : 'text-white'
            }`}
          >
            {match.awayTeam}
          </h4>
          <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-zinc-400 block pt-0.5">
            {match.awayTeam.includes('Nizam') ? 'AWAY SQUAD' : 'OPPONENT'}
          </span>
        </div>
      </div>

      {/* Venue and Timing Details */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 font-sans border-t border-surface-border/40">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-brand-orange shrink-0" />
          <span>{formatMatchDate(match.matchDate)}</span>
          <span className="text-zinc-600">•</span>
          <Clock className="w-3.5 h-3.5 text-brand-orange shrink-0" />
          <span>{match.matchTime} IST</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
          <span className="truncate" title={match.venue}>
            {match.venue}
          </span>
        </div>
      </div>

      {/* Notes or Ticket Action */}
      {match.notes && (
        <p className="text-xs text-zinc-400 italic bg-brand-black/40 p-2.5 rounded border border-surface-border/40 font-sans">
          "{match.notes}"
        </p>
      )}

      {isUpcoming && match.ticketUrl && (
        <Link
          href={match.ticketUrl}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white py-2.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          <Ticket className="w-4 h-4" />
          <span>GET TICKETS / ATTEND</span>
        </Link>
      )}
    </div>
  );
}
