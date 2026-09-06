import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePublicPaths } from '@/lib/revalidate';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const whereClause: any = {};
  if (status && status !== 'all') {
    whereClause.status = status;
  }

  const matches = await prisma.match.findMany({
    where: whereClause,
    orderBy: { matchDate: 'desc' },
  });

  return NextResponse.json({ matches });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const match = await prisma.match.create({
      data: {
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        homeScore: data.homeScore !== undefined && data.homeScore !== '' ? parseInt(data.homeScore, 10) : null,
        awayScore: data.awayScore !== undefined && data.awayScore !== '' ? parseInt(data.awayScore, 10) : null,
        matchDate: data.matchDate,
        matchTime: data.matchTime || '19:00',
        venue: data.venue,
        competition: data.competition || 'Telangana Pro Basketball League',
        status: data.status || 'Upcoming',
        ticketUrl: data.ticketUrl || '',
        notes: data.notes || '',
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Match',
        entityId: match.id,
        details: `Created fixture: ${match.homeTeam} vs ${match.awayTeam}`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths('/matches');

    return NextResponse.json({ success: true, match });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create match' }, { status: 500 });
  }
}
