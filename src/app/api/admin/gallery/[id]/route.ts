import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const updated = await prisma.galleryItem.update({
      where: { id: params.id },
      data: {
        title: data.title,
        caption: data.caption,
        imageUrl: data.imageUrl,
        category: data.category,
        isFeatured: Boolean(data.isFeatured),
        displayOrder: parseInt(data.displayOrder, 10) || 0,
        isPublished: Boolean(data.isPublished),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'GalleryItem',
        entityId: updated.id,
        details: `Updated gallery item: ${updated.title}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.galleryItem.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });

    await prisma.galleryItem.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'GalleryItem',
        entityId: params.id,
        details: `Deleted gallery item: ${existing.title}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete gallery item' }, { status: 500 });
  }
}
