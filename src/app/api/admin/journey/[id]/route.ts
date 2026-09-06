import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const updated = await prisma.journeyMilestone.update({
      where: { id: params.id },
      data: {
        yearLabel: data.yearLabel,
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        displayOrder: parseInt(data.displayOrder, 10) || 0,
        isVisible: Boolean(data.isVisible),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'JourneyMilestone',
        entityId: updated.id,
        details: `Updated milestone: ${updated.title}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, milestone: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update milestone' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.journeyMilestone.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });

    await prisma.journeyMilestone.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'JourneyMilestone',
        entityId: params.id,
        details: `Deleted milestone: ${existing.title}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete milestone' }, { status: 500 });
  }
}
