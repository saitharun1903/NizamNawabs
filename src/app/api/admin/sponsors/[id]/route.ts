import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const updated = await prisma.sponsor.update({
      where: { id: params.id },
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
        tier: data.tier,
        websiteUrl: data.websiteUrl,
        displayOrder: parseInt(data.displayOrder, 10) || 0,
        isActive: Boolean(data.isActive),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Sponsor',
        entityId: updated.id,
        details: `Updated sponsor: ${updated.name}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, sponsor: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update sponsor' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.sponsor.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });

    await prisma.sponsor.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Sponsor',
        entityId: params.id,
        details: `Deleted sponsor: ${existing.name}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete sponsor' }, { status: 500 });
  }
}
