'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Newspaper, Clock } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  category: string;
  author: string;
  publishedAt: string | Date | null;
}

interface MagazineNewsProps {
  articles: ArticleItem[];
}

export default function MagazineNews({ articles }: MagazineNewsProps) {
  if (!articles || articles.length === 0) return null;

  const leadStory = articles[0];
  const supportingStories = articles.slice(1);

  return (
    <section className="relative py-16 sm:py-24 lg:py-40 bg-[#0A0A0C] overflow-hidden border-b border-surface-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border/50 pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-brand-orange uppercase tracking-wider font-bold">
              {"// 06"}
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-300">
              DISPATCHES & PRESS RELEASES
            </span>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-brand-orange hover:text-white transition-colors min-h-[44px]"
          >
            <span>VIEW ALL DISPATCHES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Magazine Editorial Composition: Lead Cover Story + Stacked Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Dominant Magazine Cover Lead Story (7 Cols) */}
          {leadStory && (
            <div className="lg:col-span-7 group space-y-6">
              <Link href={`/news/${leadStory.slug}`} className="block relative">
                <div className="relative h-[260px] sm:h-[380px] md:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden bg-black border border-surface-border shadow-2xl">
                  <img
                    src={leadStory.coverImageUrl || '/brand/post-journey-players.png'}
                    alt={leadStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span className="px-3.5 py-1 rounded-full bg-brand-orange text-white text-xs font-sans font-bold uppercase tracking-wider shadow-lg shadow-brand-orange/30">
                      LEAD FEATURE
                    </span>
                  </div>
                </div>
              </Link>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-sans text-zinc-400 font-medium">
                  <span className="text-brand-orange font-bold uppercase tracking-wider">
                    {leadStory.category}
                  </span>
                  <span>•</span>
                  <span>BY {leadStory.author.toUpperCase()}</span>
                </div>

                <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-6xl text-white tracking-tight leading-[0.88] group-hover:text-brand-orange transition-colors uppercase">
                  <Link href={`/news/${leadStory.slug}`}>{leadStory.title}</Link>
                </h3>

                <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-sans leading-[1.65] max-w-2xl font-normal">
                  {leadStory.excerpt}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/news/${leadStory.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-brand-orange hover:text-white transition-colors group/link min-h-[44px]"
                  >
                    <span>READ FULL ARTICLE</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Asymmetric Stacked Supporting Editorial Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:border-l lg:border-surface-border lg:pl-10">
            <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 block font-bold">
              RECENT BULLETINS
            </span>

            <div className="space-y-6 sm:space-y-8 divide-y divide-surface-border/60">
              {supportingStories.map((story) => (
                <article key={story.id} className="pt-6 sm:pt-8 first:pt-0 group space-y-3">
                  <div className="flex items-center gap-3 text-xs font-sans text-zinc-400 font-medium">
                    <span className="text-brand-orange font-bold uppercase">{story.category}</span>
                    <span>•</span>
                    <span>{story.author}</span>
                  </div>

                  <h4 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-[0.95] group-hover:text-brand-orange transition-colors uppercase">
                    <Link href={`/news/${story.slug}`}>{story.title}</Link>
                  </h4>

                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed line-clamp-2 font-normal">
                    {story.excerpt}
                  </p>

                  <div className="pt-1">
                    <Link
                      href={`/news/${story.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-brand-orange hover:text-white transition-colors min-h-[44px]"
                    >
                      <span>READ DISPATCH</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter / Media Front Office Callout */}
            <div className="p-5 sm:p-8 rounded-3xl bg-surface-card border border-surface-border space-y-4">
              <span className="text-xs font-sans text-brand-orange uppercase tracking-wider font-bold block">
                PRESS & MEDIA INQUIRIES
              </span>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed font-normal">
                Accredited press outlets, broadcasters, and scouts may request match access and player interview credentials directly.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-white hover:text-brand-orange transition-colors min-h-[44px]"
              >
                <span>CONTACT MEDIA OFFICE →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
