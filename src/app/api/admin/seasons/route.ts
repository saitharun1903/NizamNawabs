import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const seasons = await prisma.season.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json({ seasons });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const season = await prisma.season.create({
      data: {
        seasonName: data.seasonName,
        seasonNumber: parseInt(data.seasonNumber, 10) || 1,
        year: data.year,
        achievement: data.achievement,
        description: data.description || '',
        coverImageUrl: data.coverImageUrl || '/brand/highlight-season1.png',
        isCurrent: Boolean(data.isCurrent),
        status: data.status || 'Active',
        displayOrder: parseInt(data.displayOrder, 10) || 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Season',
        entityId: season.id,
        details: `Created season: ${season.seasonName} (${season.year})`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, season });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create season' }, { status: 500 });
  }
}
