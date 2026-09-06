import React from 'react';
import prisma from '@/lib/db';
import { Camera, Image as ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCat = searchParams?.category || 'all';

  const whereClause: any = { isPublished: true };
  if (selectedCat && selectedCat !== 'all') {
    whereClause.category = selectedCat;
  }

  let items: any[] = [];
  try {
    items = await prisma.galleryItem.findMany({
      where: whereClause,
      orderBy: { displayOrder: 'asc' },
    });
  } catch (err) {
    console.warn('[GalleryPage] Database query notice (using defaults):', err);
  }

  const categories = ['all', 'Match Day', 'Auction', 'Milestones', 'Lifestyle'];

  return (
    <div className="py-24 space-y-16 bg-brand-black overflow-hidden">
      {/* Header */}
      <section className="relative pt-12 pb-16 border-b border-surface-border court-lines-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4 text-brand-orange" />
            <span>VISUAL ARCHIVE</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.88] uppercase">
            HARDWOOD <span className="text-brand-orange">GALLERY</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-sans leading-relaxed font-normal">
            A curated photographic documentation of the Nizam Nawabs journey, high-intensity TPBL fixtures, player auctions, and team culture.
          </p>
        </div>
      </section>

      {/* Category Tabs & Mosaic Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-center gap-3 pb-6 border-b border-surface-border/60 overflow-x-auto no-scrollbar touch-momentum -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-xs uppercase font-sans font-bold tracking-wider text-zinc-400 mr-2 whitespace-nowrap">
            CATEGORIES:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCat.toLowerCase() === cat.toLowerCase();
            return (
              <a
                key={cat}
                href={cat === 'all' ? '/gallery' : `/gallery?category=${cat}`}
                className={`px-4 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'bg-surface-card text-zinc-400 hover:text-white hover:bg-surface-elevated border border-surface-border'
                }`}
              >
                {cat.toUpperCase()}
              </a>
            );
          })}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-surface-border bg-black shadow-xl flex flex-col"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-surface-border text-brand-orange text-[10px] font-sans font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-surface-card flex-1 flex flex-col justify-between space-y-2">
                  <h4 className="font-display font-black text-2xl text-white tracking-tight group-hover:text-brand-orange transition-colors uppercase">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card rounded-xl border border-surface-border space-y-4">
            <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="font-display font-black text-2xl text-zinc-300 tracking-tight uppercase">
              TEAM MOMENTS ARE COMING SOON
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Captures from training camp and upcoming matches will be updated here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
