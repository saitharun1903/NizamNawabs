import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    });
  } catch (err) {
    console.warn('[NewsPage] Database query notice (using defaults):', err);
  }

  return (
    <div className="py-12 sm:py-24 space-y-10 sm:space-y-16 bg-brand-black overflow-hidden">
      {/* Header */}
      <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-surface-border court-lines-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/40 text-brand-orange text-xs font-sans font-bold uppercase tracking-wider">
            <Newspaper className="w-4 h-4 text-brand-orange" />
            <span>DISPATCHES FROM THE SQUAD</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.88] uppercase">
            NEWS & <span className="text-brand-orange">ARTICLES</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-sans leading-relaxed font-normal">
            Official announcements, in-depth player profiles, and strategic reviews from the Nawabs front office.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-surface-card border border-surface-border rounded-xl overflow-hidden group hover:border-brand-orange/60 transition-all duration-300 shadow-xl flex flex-col"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-black">
                  <img
                    src={article.coverImageUrl || '/brand/post-journey-players.png'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded bg-brand-orange text-white text-[10px] font-sans font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight group-hover:text-brand-orange transition-colors leading-tight uppercase break-words">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed font-sans font-normal">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-zinc-400 font-sans font-medium">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{article.author}</span>
                    </div>
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-brand-orange hover:text-white font-sans font-bold uppercase tracking-wider flex items-center gap-1 min-h-[44px]"
                    >
                      <span>READ STORY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card rounded-xl border border-surface-border space-y-4">
            <Newspaper className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="font-display font-black text-2xl text-zinc-300 tracking-tight uppercase">
              NO STORIES YET
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Published announcements and feature stories will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
