'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Camera } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
}

interface MasonryGalleryProps {
  items: GalleryItem[];
}

export default function MasonryGallery({ items }: MasonryGalleryProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-24 lg:py-40 bg-[#070709] overflow-hidden border-b border-surface-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border/50 pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-brand-orange uppercase tracking-wider font-bold">
              {"// 05"}
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-300">
              HARDWOOD MOMENTS & VISUAL ARCHIVE
            </span>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-brand-orange hover:text-white transition-colors min-h-[44px]"
          >
            <span>EXPLORE FULL ARCHIVE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* MotionSites-Inspired Asymmetric Masonry Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Tile 1: Tall Vertical Portrait (5 cols, spans 2 rows) */}
          {items[0] && (
            <div
              className="md:col-span-5 relative h-[340px] sm:h-[480px] md:h-[620px] rounded-3xl overflow-hidden bg-[#121214] border border-surface-border group shadow-2xl"
            >
              <img
                src={items[0].imageUrl}
                alt={items[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
                  {items[0].category}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 space-y-1">
                <h4 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight uppercase">
                  {items[0].title}
                </h4>
                {items[0].caption && (
                  <p className="text-xs text-zinc-300 line-clamp-2 font-sans leading-relaxed">{items[0].caption}</p>
                )}
              </div>
            </div>
          )}

          {/* Right Column Grid for Tiles 2 & Typographic Quote */}
          <div className="md:col-span-7 space-y-6 sm:space-y-8">
            {/* Tile 2: Wide Panoramic Action Cut */}
            {items[1] && (
              <div
                className="relative h-[240px] sm:h-[320px] md:h-[380px] rounded-3xl overflow-hidden bg-[#121214] border border-surface-border group shadow-2xl"
              >
                <img
                  src={items[1].imageUrl}
                  alt={items[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
                    {items[1].category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 space-y-1">
                  <h4 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight leading-tight uppercase">
                    {items[1].title}
                  </h4>
                  {items[1].caption && (
                    <p className="text-xs text-zinc-300 line-clamp-1 font-sans leading-relaxed">{items[1].caption}</p>
                  )}
                </div>
              </div>
            )}

            {/* Typographic Asymmetric Accent Block (No Card/No Image) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center pt-2">
              <div className="space-y-2">
                <h3 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.85] uppercase">
                  HARDWOOD
                  <br />
                  <span className="text-brand-orange">CULTURE.</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed pt-1 sm:pt-2">
                  Capturing the intensity, player grit, and raw basketball passion of Hyderabad and Telangana.
                </p>
              </div>

              {/* Tile 3: Square Action Moment */}
              {items[2] && (
                <div
                  className="relative h-[200px] sm:h-[240px] md:h-[260px] rounded-3xl overflow-hidden bg-[#121214] border border-surface-border group shadow-xl"
                >
                  <img
                    src={items[2].imageUrl}
                    alt={items[2].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight line-clamp-1 uppercase">
                      {items[2].title}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tile 4: Full Bleed Wide Panoramic Frame */}
        {items[3] && (
          <div
            className="relative h-[240px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden bg-[#121214] border border-surface-border group shadow-2xl"
          >
            <img
              src={items[3].imageUrl}
              alt={items[3].title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <span className="px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-sans font-bold uppercase tracking-wider">
                FEATURED HARDWOOD ARCHIVE
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 max-w-xl space-y-1 sm:space-y-2">
              <h4 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none uppercase">
                {items[3].title}
              </h4>
              {items[3].caption && (
                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed line-clamp-2">{items[3].caption}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
