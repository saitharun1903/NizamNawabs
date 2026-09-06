import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePublicPaths } from '@/lib/revalidate';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'all';

  const whereClause: any = {};
  if (search) {
    whereClause.name = { contains: search };
  }
  if (filter === 'active') {
    whereClause.isActive = true;
  } else if (filter === 'inactive') {
    whereClause.isActive = false;
  }

  const players = await prisma.player.findMany({
    where: whereClause,
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json({ players });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const player = await prisma.player.create({
      data: {
        name: data.name,
        jerseyNumber: parseInt(data.jerseyNumber, 10) || 0,
        position: data.position || 'Guard',
        photoUrl: data.photoUrl || '/brand/player-2.png',
        bio: data.bio || '',
        height: data.height || '',
        nationality: data.nationality || 'India',
        ppg: parseFloat(data.ppg) || 0.0,
        rpg: parseFloat(data.rpg) || 0.0,
        apg: parseFloat(data.apg) || 0.0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        displayOrder: parseInt(data.displayOrder, 10) || 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Player',
        entityId: player.id,
        details: `Created player: ${player.name} (#${player.jerseyNumber})`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths('/roster');

    return NextResponse.json({ success: true, player });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create player' }, { status: 500 });
  }
}
