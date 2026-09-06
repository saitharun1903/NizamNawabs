import React from 'react';
import prisma from '@/lib/db';
import EditorialHero from '@/components/public/EditorialHero';
import ScoreTicker from '@/components/public/ScoreTicker';
import FranchiseManifesto from '@/components/public/FranchiseManifesto';
import SeasonCampaignPoster from '@/components/public/SeasonCampaignPoster';
import InteractiveRosterStage from '@/components/public/InteractiveRosterStage';
import MasonryGallery from '@/components/public/MasonryGallery';
import MagazineNews from '@/components/public/MagazineNews';
import PartnersStrip from '@/components/public/PartnersStrip';

export const dynamic = 'force-dynamic';

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

export default async function HomePage() {
  let siteSettings: any = null;
  let heroSlide: any = null;
  let liveMatches: any[] = [];
  let upcomingMatches: any[] = [];
  let completedMatches: any[] = [];
  let teamInfo: any = null;
  let players: any[] = [];
  let seasons: any[] = [];
  let galleryItems: any[] = [];
  let articles: any[] = [];
  let sponsors: any[] = [];

  try {
    const results = await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: 'default' } }),
      prisma.heroSlide.findFirst({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.match.findMany({
        where: { status: 'Live' },
      }),
      prisma.match.findMany({
        where: { status: 'Upcoming' },
        orderBy: { matchDate: 'asc' },
        take: 4,
      }),
      prisma.match.findMany({
        where: { status: 'Completed' },
        orderBy: { matchDate: 'desc' },
        take: 4,
      }),
      prisma.teamInfo.findUnique({ where: { id: 'default' } }),
      prisma.player.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.season.findMany({
        orderBy: { seasonNumber: 'asc' },
      }),
      prisma.galleryItem.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
        take: 5,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      }),
      prisma.sponsor.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);
    siteSettings = results[0];
    heroSlide = results[1];
    liveMatches = results[2] || [];
    upcomingMatches = results[3] || [];
    completedMatches = results[4] || [];
    teamInfo = results[5];
    players = results[6] || [];
    seasons = results[7] || [];
    galleryItems = results[8] || [];
    articles = results[9] || [];
    sponsors = results[10] || [];
  } catch (dbErr) {
    console.warn('[HomePage] Database query notice (rendering with defaults):', dbErr);
  }

  // Combined smart match sorting: Live first, then nearest upcoming, then recent completed
  const sortedMatches = [...liveMatches, ...upcomingMatches, ...completedMatches];

  // Active / featured season
  const activeSeason = seasons.find((s) => s.isCurrent) || seasons[seasons.length - 1] || null;
  const achievementText = activeSeason?.achievement
    ? `${activeSeason.seasonName.toUpperCase()} ${activeSeason.achievement.toUpperCase()}`
    : teamInfo?.achievementSummary?.split('.')[0] || 'TELANGANA PRO BASKETBALL';

  // Dynamic Marquee Ticker generation
  let tickerPhrases: string[] = [];
  if (siteSettings?.tickerText && siteSettings.tickerText.trim().length > 0) {
    tickerPhrases = (siteSettings.tickerText as string)
      .split(/[\n•;]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
  }

  if (tickerPhrases.length === 0) {
    // Generate dynamic live ticker from verified database records
    const teamName = (siteSettings?.teamName || 'NIZAM NAWABS').toUpperCase();
    const competition = 'TELANGANA PRO BASKETBALL LEAGUE';
    const silverware = activeSeason?.achievement
      ? `${activeSeason.seasonName.toUpperCase()} ${activeSeason.achievement.toUpperCase()}`
      : 'HYDERABAD HARDWOOD CONTENDERS';
    const nearestUpcoming = upcomingMatches[0];
    const latestCompleted = completedMatches[0];

    tickerPhrases = [
      teamName,
      competition,
      silverware,
    ];

    if (nearestUpcoming) {
      tickerPhrases.push(
        `NEXT: ${nearestUpcoming.homeTeam.toUpperCase()} VS ${nearestUpcoming.awayTeam.toUpperCase()} (${formatMatchDate(nearestUpcoming.matchDate)})`
      );
    }

    if (latestCompleted && latestCompleted.homeScore !== null && latestCompleted.awayScore !== null) {
      tickerPhrases.push(
        `LATEST: ${latestCompleted.homeTeam.toUpperCase()} ${latestCompleted.homeScore} - ${latestCompleted.awayScore} ${latestCompleted.awayTeam.toUpperCase()}`
      );
    }

    if (siteSettings?.tagline) {
      tickerPhrases.push(siteSettings.tagline.toUpperCase());
    }

    if (teamInfo?.homeCourt) {
      tickerPhrases.push(`ARENA: ${teamInfo.homeCourt.split(',')[0].toUpperCase()}`);
    }
  }

  return (
    <div className="space-y-0 bg-brand-black text-brand-white selection:bg-brand-orange selection:text-white">
      {/* 1. Cinematic 3D Layered Hero */}
      <EditorialHero
        heroData={heroSlide || undefined}
        achievementBadge={achievementText}
      />

      {/* 2. Score & Schedule Ribbon */}
      <ScoreTicker matches={sortedMatches} />

      {/* 3. Dynamic Kinetic Marquee Tape */}
      <div className="bg-brand-orange py-3.5 overflow-hidden select-none border-y border-orange-500 shadow-md">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-10 font-display text-2xl tracking-wide text-white uppercase px-6 font-black">
            {tickerPhrases.map((phrase, idx) => (
              <React.Fragment key={`ticker-1-${idx}`}>
                <span>{phrase}</span>
                <span>•</span>
              </React.Fragment>
            ))}
          </div>
          <div
            className="flex items-center gap-10 font-display text-2xl tracking-wide text-white uppercase px-6 font-black"
            aria-hidden="true"
          >
            {tickerPhrases.map((phrase, idx) => (
              <React.Fragment key={`ticker-2-${idx}`}>
                <span>{phrase}</span>
                <span>•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Franchise Manifesto & Identity */}
      <FranchiseManifesto teamInfo={teamInfo} />

      {/* 5. Campaign Poster Driven from Database Seasons */}
      <SeasonCampaignPoster seasons={seasons} />

      {/* 6. Dominant Interactive Roster Stage */}
      <InteractiveRosterStage players={players} />

      {/* 7. MotionSites-Inspired Masonry Gallery */}
      <MasonryGallery items={galleryItems} />

      {/* 8. Sports Magazine News Editorial */}
      <MagazineNews articles={articles} />

      {/* 9. Verified Commercial Partners */}
      <PartnersStrip sponsors={sponsors} />
    </div>
  );
}
