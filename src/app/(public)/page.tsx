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

export default async function HomePage() {
  // Fetch dynamic CMS data concurrently from SQLite database
  const [
    heroSlide,
    matches,
    teamInfo,
    players,
    seasons,
    galleryItems,
    articles,
    sponsors,
  ] = await Promise.all([
    prisma.heroSlide.findFirst({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.match.findMany({
      orderBy: { matchDate: 'desc' },
      take: 6,
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

  return (
    <div className="space-y-0 bg-brand-black text-brand-white selection:bg-brand-orange selection:text-white">
      {/* 1. Cinematic 3D Layered Hero */}
      <EditorialHero heroData={heroSlide || undefined} />

      {/* 2. Score & Schedule Ribbon */}
      <ScoreTicker matches={matches} />

      {/* 3. Kinetic Marquee Tape */}
      <div className="bg-brand-orange py-3.5 overflow-hidden select-none border-y border-orange-500 shadow-md">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-10 font-display text-2xl tracking-wide text-white uppercase px-6 font-black">
            <span>NIZAM NAWABS</span>
            <span>•</span>
            <span>TELANGANA PRO BASKETBALL</span>
            <span>•</span>
            <span>SEASON 1 RUNNERS UP</span>
            <span>•</span>
            <span>UNSTOPPABLE SPIRIT</span>
            <span>•</span>
            <span>HYDERABAD HARDWOOD CULTURE</span>
            <span>•</span>
            <span>BOLD BASKETBALL • LOCAL PRIDE</span>
            <span>•</span>
            <span>KVBR INDOOR STADIUM</span>
            <span>•</span>
          </div>
          <div className="flex items-center gap-10 font-display text-2xl tracking-wide text-white uppercase px-6 font-black">
            <span>NIZAM NAWABS</span>
            <span>•</span>
            <span>TELANGANA PRO BASKETBALL</span>
            <span>•</span>
            <span>SEASON 1 RUNNERS UP</span>
            <span>•</span>
            <span>UNSTOPPABLE SPIRIT</span>
            <span>•</span>
            <span>HYDERABAD HARDWOOD CULTURE</span>
            <span>•</span>
            <span>BOLD BASKETBALL • LOCAL PRIDE</span>
            <span>•</span>
            <span>KVBR INDOOR STADIUM</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* 4. Franchise Manifesto & Identity */}
      <FranchiseManifesto teamInfo={teamInfo} />

      {/* 5. Season 1 Runners Up Campaign Poster */}
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
