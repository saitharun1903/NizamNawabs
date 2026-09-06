import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePublicPaths } from '@/lib/revalidate';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const updated = await prisma.season.update({
      where: { id: params.id },
      data: {
        seasonName: data.seasonName,
        seasonNumber: parseInt(data.seasonNumber, 10),
        year: data.year,
        achievement: data.achievement,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        isCurrent: Boolean(data.isCurrent),
        status: data.status,
        displayOrder: parseInt(data.displayOrder, 10) || 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Season',
        entityId: updated.id,
        details: `Updated season: ${updated.seasonName}`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths();

    return NextResponse.json({ success: true, season: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update season' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.season.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Season not found' }, { status: 404 });

    await prisma.season.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Season',
        entityId: params.id,
        details: `Deleted season: ${existing.seasonName}`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete season' }, { status: 500 });
  }
}
