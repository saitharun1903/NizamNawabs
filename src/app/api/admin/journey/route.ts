import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const milestones = await prisma.journeyMilestone.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json({ milestones });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const milestone = await prisma.journeyMilestone.create({
      data: {
        yearLabel: data.yearLabel,
        title: data.title,
        description: data.description,
        category: data.category || 'Franchise',
        imageUrl: data.imageUrl || '',
        displayOrder: parseInt(data.displayOrder, 10) || 0,
        isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'JourneyMilestone',
        entityId: milestone.id,
        details: `Created timeline milestone: ${milestone.title}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, milestone });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create milestone' }, { status: 500 });
  }
}
