import React from 'react';
import prisma from '@/lib/db';
import { Trophy, Shield, Flame, MapPin, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  let teamInfo: any = null;
  let featuredSeason: any = null;

  try {
    teamInfo = await prisma.teamInfo.findUnique({ where: { id: 'default' } });
    featuredSeason =
      (await prisma.season.findFirst({ where: { isCurrent: true } })) ||
      (await prisma.season.findFirst({ orderBy: { seasonNumber: 'desc' } }));
  } catch (err) {
    console.warn('[TeamPage] Database query notice (using defaults):', err);
  }

  return (
    <div className="py-24 space-y-20 bg-brand-black overflow-hidden">
      {/* Hero Header */}
      <section className="relative pt-12 pb-16 border-b border-surface-border court-lines-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-brand-orange" />
            <span>FRANCHISE ETHOS</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.88] uppercase">
            THE STORY OF
            <br />
            <span className="text-brand-orange">NIZAM NAWABS</span>
          </h1>

          <p className="text-lg text-zinc-300 max-w-2xl font-sans leading-relaxed font-normal">
            {teamInfo?.headline || 'THE HARDWOOD PRIDE OF TELANGANA'}
          </p>
        </div>
      </section>

      {/* Main Philosophy & Identity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-orange">
                COURT PHILOSOPHY
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight uppercase">
                RELENTLESS PACE.
                <br />
                UNCOMPROMISING DEFENSE.
              </h2>
              <p className="text-zinc-300 leading-[1.7] font-sans text-base sm:text-lg font-normal">
                {teamInfo?.philosophy ||
                  'Born from the heart of the Deccan, Nizam Nawabs embodies aggressive court tempo, local pride, and relentless athletic discipline.'}
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-surface-card border border-surface-border">
              <div className="flex items-center gap-3 text-brand-orange">
                <Shield className="w-5 h-5" />
                <h3 className="font-display font-black text-2xl text-white tracking-tight uppercase">
                  THE TELANGANA IDENTITY
                </h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans font-normal">
                {teamInfo?.telanganaIdentity ||
                  'Representing Hyderabad and all districts across Telangana, the Nawabs connect local youth culture with professional athletic excellence.'}
              </p>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-lg bg-surface-dark border border-surface-border/60">
              <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
              <div>
                <h4 className="font-display font-black text-lg text-white tracking-tight uppercase">HOME HARDWOOD</h4>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  {teamInfo?.homeCourt || 'Kotla Vijaya Bhaskara Reddy Indoor Stadium, Yousufguda, Hyderabad'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative space-y-6">
            <div className="rounded-xl overflow-hidden border border-surface-border shadow-2xl bg-black">
              <img
                src={teamInfo?.bannerImageUrl || '/brand/post-journey-players.png'}
                alt="Nizam Nawabs Squad"
                className="w-full h-[460px] object-cover"
              />
            </div>

            {/* Achievement Card */}
            <div className="p-6 rounded-xl bg-surface-card border border-brand-orange/40 flex items-center gap-5 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-brand-orange">
                  {featuredSeason?.seasonName ? `${featuredSeason.seasonName.toUpperCase()} SILVERWARE` : 'OFFICIAL HONORS'}
                </span>
                <h4 className="font-display font-black text-2xl text-white tracking-tight uppercase">
                  {featuredSeason?.achievement ? `${featuredSeason.seasonName.toUpperCase()} ${featuredSeason.achievement.toUpperCase()}` : 'CHAMPIONSHIP FINALISTS'}
                </h4>
                <p className="text-xs text-zinc-400 font-sans">
                  {featuredSeason?.description || teamInfo?.achievementSummary ||
                    'Historic finalists in the inaugural Telangana Pro Basketball League championship.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
