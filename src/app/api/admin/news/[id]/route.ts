import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePublicPaths } from '@/lib/revalidate';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const existing = await prisma.article.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    const isNowPublished = data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED';
    const publishedAt = isNowPublished ? new Date() : existing.publishedAt;

    const updated = await prisma.article.update({
      where: { id: params.id },
      data: {
        title: data.title !== undefined ? data.title : existing.title,
        slug: data.slug !== undefined ? data.slug : existing.slug,
        excerpt: data.excerpt !== undefined ? data.excerpt : existing.excerpt,
        content: data.content !== undefined ? data.content : existing.content,
        coverImageUrl: data.coverImageUrl !== undefined ? data.coverImageUrl : existing.coverImageUrl,
        category: data.category !== undefined ? data.category : existing.category,
        author: data.author !== undefined ? data.author : existing.author,
        status: data.status !== undefined ? data.status : existing.status,
        publishedAt: data.status === 'PUBLISHED' ? (publishedAt || new Date()) : (data.status === 'DRAFT' ? null : existing.publishedAt),
        seoTitle: data.seoTitle !== undefined ? data.seoTitle : existing.seoTitle,
        seoDescription: data.seoDescription !== undefined ? data.seoDescription : existing.seoDescription,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: data.status !== existing.status ? (data.status === 'PUBLISHED' ? 'PUBLISH' : 'UNPUBLISH') : 'UPDATE',
        entityType: 'Article',
        entityId: updated.id,
        details: `Updated article: "${updated.title}" [${updated.status}]`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths('/news');

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.article.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    await prisma.article.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Article',
        entityId: params.id,
        details: `Deleted article: "${existing.title}"`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths('/news');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete article' }, { status: 500 });
  }
}
