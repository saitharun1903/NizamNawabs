import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await prisma.navigationItem.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    // Critical protection: Ensure admin route cannot be added to public navigation
    const targetUrl = (data.url || '').trim().toLowerCase();
    if (targetUrl.startsWith('/admin') || targetUrl.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Protected system routes (/admin, /api) cannot be added to public navigation.' },
        { status: 400 }
      );
    }

    const item = await prisma.navigationItem.create({
      data: {
        label: data.label.toUpperCase(),
        url: data.url,
        isExternal: Boolean(data.isExternal),
        isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
        displayOrder: parseInt(data.displayOrder, 10) || 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'NavigationItem',
        entityId: item.id,
        details: `Added navigation link: ${item.label} -> ${item.url}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create navigation item' }, { status: 500 });
  }
}
