import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await prisma.galleryItem.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const item = await prisma.galleryItem.create({
      data: {
        title: data.title,
        caption: data.caption || '',
        imageUrl: data.imageUrl,
        category: data.category || 'Match Day',
        isFeatured: Boolean(data.isFeatured),
        displayOrder: parseInt(data.displayOrder, 10) || 0,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'GalleryItem',
        entityId: item.id,
        details: `Added gallery image: ${item.title}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add gallery item' }, { status: 500 });
  }
}
