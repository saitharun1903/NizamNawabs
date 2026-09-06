import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let teamInfo = await prisma.teamInfo.findUnique({ where: { id: 'default' } });
  if (!teamInfo) {
    teamInfo = await prisma.teamInfo.create({
      data: {
        id: 'default',
        headline: 'THE HARDWOOD PRIDE OF TELANGANA',
        philosophy: 'Rooted in the grit and vibrancy of Telangana, Nizam Nawabs play fearless, high-speed basketball.',
        telanganaIdentity: 'Representing Hyderabad and all districts across Telangana, the Nawabs connect local youth culture with professional athletic excellence.',
        homeCourt: 'Kotla Vijaya Bhaskara Reddy (KVBR) Indoor Stadium, Yousufguda, Hyderabad',
        bannerImageUrl: '/brand/post-journey-players.png',
        achievementSummary: 'TPBL Season 1 Runners Up (Inaugural Season Finalists).',
      },
    });
  }

  return NextResponse.json({ teamInfo });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const updated = await prisma.teamInfo.upsert({
      where: { id: 'default' },
      update: {
        headline: data.headline,
        philosophy: data.philosophy,
        telanganaIdentity: data.telanganaIdentity,
        homeCourt: data.homeCourt,
        bannerImageUrl: data.bannerImageUrl,
        achievementSummary: data.achievementSummary,
      },
      create: {
        id: 'default',
        headline: data.headline,
        philosophy: data.philosophy,
        telanganaIdentity: data.telanganaIdentity,
        homeCourt: data.homeCourt,
        bannerImageUrl: data.bannerImageUrl,
        achievementSummary: data.achievementSummary,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'TeamInfo',
        entityId: 'default',
        details: 'Updated team information and philosophy',
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, teamInfo: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update team info' }, { status: 500 });
  }
}
