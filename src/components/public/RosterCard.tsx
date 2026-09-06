import React from 'react';

interface PlayerProps {
  player: {
    id: string;
    name: string;
    jerseyNumber: number;
    position: string;
    photoUrl: string;
    bio?: string;
    height?: string;
    nationality?: string;
    ppg: number;
    rpg: number;
    apg: number;
    isActive: boolean;
  };
}

export default function RosterCard({ player }: PlayerProps) {
  return (
    <div className="group relative bg-surface-card border border-surface-border rounded-lg overflow-hidden transition-all duration-300 hover:border-brand-orange/60 hover:-translate-y-1.5 shadow-xl flex flex-col">
      {/* Jersey Number Watermark & Active Tag */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="w-8 h-8 rounded-md bg-brand-black/80 backdrop-blur-md border border-brand-orange/40 text-brand-orange font-display text-lg flex items-center justify-center font-black">
          #{player.jerseyNumber}
        </span>
        {player.isActive && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans font-bold uppercase tracking-wider">
            ACTIVE
          </span>
        )}
      </div>

      {/* Position Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 py-1 rounded bg-brand-orange text-white text-[10px] font-sans font-bold uppercase tracking-wider shadow-md">
          {player.position}
        </span>
      </div>

      {/* Player Photo Frame */}
      <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-surface-dark via-surface-card to-black overflow-hidden flex items-end justify-center">
        {/* Court gradient backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-brand-orange/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

        <img
          src={player.photoUrl || '/brand/player-2.png'}
          alt={player.name}
          className="relative z-0 w-full h-full object-cover object-top filter brightness-95 group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
        />

        {/* Soft vignette overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-card to-transparent z-1" />
      </div>

      {/* Player Information & Stats */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display font-black text-2xl tracking-tight text-white group-hover:text-brand-orange transition-colors leading-tight uppercase break-words">
            {player.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans font-medium tracking-wide uppercase pt-0.5">
            <span>{player.height || 'PRO SQUAD'}</span>
            <span>•</span>
            <span>{player.nationality || 'INDIA'}</span>
          </div>
          {player.bio && (
            <p className="text-xs text-zinc-400 pt-2 line-clamp-2 leading-relaxed font-sans">
              {player.bio}
            </p>
          )}
        </div>

        {/* Athletic Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-border/60 text-center bg-brand-black/40 rounded p-2">
          <div>
            <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-zinc-400 block">
              PPG
            </span>
            <span className="font-display font-black text-lg text-white tracking-tight">
              {player.ppg > 0 ? player.ppg.toFixed(1) : '-'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-zinc-400 block">
              RPG
            </span>
            <span className="font-display font-black text-lg text-white tracking-tight">
              {player.rpg > 0 ? player.rpg.toFixed(1) : '-'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-zinc-400 block">
              APG
            </span>
            <span className="font-display font-black text-lg text-white tracking-tight">
              {player.apg > 0 ? player.apg.toFixed(1) : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
