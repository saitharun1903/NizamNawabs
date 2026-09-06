import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalPlayers,
      activePlayers,
      totalMatches,
      upcomingMatches,
      totalGallery,
      publishedArticles,
      draftArticles,
      seasonsCount,
      recentLogs,
    ] = await Promise.all([
      prisma.player.count(),
      prisma.player.count({ where: { isActive: true } }),
      prisma.match.count(),
      prisma.match.count({ where: { status: 'Upcoming' } }),
      prisma.galleryItem.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.season.count(),
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalPlayers,
        activePlayers,
        totalMatches,
        upcomingMatches,
        totalGallery,
        publishedArticles,
        draftArticles,
        seasonsCount,
      },
      recentLogs,
    });
  } catch (error: any) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
