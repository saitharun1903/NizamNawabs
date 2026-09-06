import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/db';
import { ArrowLeft, Calendar, User, Share2, Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <article className="py-12 sm:py-24 space-y-8 sm:space-y-12 bg-brand-black">
      {/* Back link & Category */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-zinc-400 hover:text-brand-orange transition-colors mb-6 sm:mb-8 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL STORIES</span>
        </Link>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded bg-brand-orange text-white text-xs font-sans font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-zinc-400 font-sans font-medium">
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'RECENT'}
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.88] uppercase break-words">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 py-4 border-y border-surface-border text-xs text-zinc-400 font-sans font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-orange" />
              <span>BY {article.author.toUpperCase()}</span>
            </div>
            <span>•</span>
            <div className="text-brand-orange font-bold font-sans uppercase tracking-wider">
              NIZAM NAWABS OFFICIAL
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImageUrl && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden border border-surface-border bg-black max-h-[520px]">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-invert prose-orange max-w-none text-zinc-300 font-sans text-base sm:text-lg leading-[1.7] space-y-6 font-normal">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Footer info stamp */}
        <div className="mt-16 pt-8 border-t border-surface-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <span className="font-sans uppercase tracking-wider text-zinc-400">
            TELANGANA PRO BASKETBALL LEAGUE • NIZAM NAWABS
          </span>
          <Link
            href="/contact"
            className="text-brand-orange hover:text-white font-sans font-bold uppercase tracking-wider"
          >
            MEDIA & PRESS INQUIRIES →
          </Link>
        </div>
      </div>
    </article>
  );
}
