import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const targetUrl = (data.url || '').trim().toLowerCase();
    if (targetUrl.startsWith('/admin') || targetUrl.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Protected system routes (/admin, /api) cannot be added to public navigation.' },
        { status: 400 }
      );
    }

    const updated = await prisma.navigationItem.update({
      where: { id: params.id },
      data: {
        label: data.label.toUpperCase(),
        url: data.url,
        isExternal: Boolean(data.isExternal),
        isVisible: Boolean(data.isVisible),
        displayOrder: parseInt(data.displayOrder, 10) || 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'NavigationItem',
        entityId: updated.id,
        details: `Updated navigation link: ${updated.label}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update navigation item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.navigationItem.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 });

    await prisma.navigationItem.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'NavigationItem',
        entityId: params.id,
        details: `Deleted navigation item: ${existing.label}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete navigation item' }, { status: 500 });
  }
}
