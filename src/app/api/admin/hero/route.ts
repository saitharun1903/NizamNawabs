import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let hero = await prisma.heroSlide.findFirst({
    orderBy: { displayOrder: 'asc' },
  });

  if (!hero) {
    hero = await prisma.heroSlide.create({
      data: {
        eyebrow: 'TELANGANA PRO BASKETBALL LEAGUE • SEASON 1 RUNNERS UP',
        title: 'NIZAM NAWABS',
        subtitle: 'Bold basketball. Local pride. Unstoppable spirit on the hardwood.',
        ctaLabel: 'VIEW ROSTER',
        ctaUrl: '/roster',
        secondaryCtaLabel: 'MATCH HIGHLIGHTS',
        secondaryCtaUrl: 'https://www.youtube.com/@fgsnpro',
        backgroundMediaUrl: '/brand/post-journey-players.png',
        isPublished: true,
      },
    });
  }

  return NextResponse.json({ hero });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const heroId = data.id;

    const updated = await prisma.heroSlide.upsert({
      where: { id: heroId || 'new' },
      update: {
        eyebrow: data.eyebrow,
        title: data.title,
        subtitle: data.subtitle,
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
        secondaryCtaLabel: data.secondaryCtaLabel,
        secondaryCtaUrl: data.secondaryCtaUrl,
        backgroundMediaUrl: data.backgroundMediaUrl,
        isPublished: data.isPublished,
      },
      create: {
        eyebrow: data.eyebrow,
        title: data.title,
        subtitle: data.subtitle,
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
        secondaryCtaLabel: data.secondaryCtaLabel,
        secondaryCtaUrl: data.secondaryCtaUrl,
        backgroundMediaUrl: data.backgroundMediaUrl,
        isPublished: data.isPublished,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'HeroSlide',
        entityId: updated.id,
        details: `Updated Hero configuration: "${updated.title}"`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, hero: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update hero' }, { status: 500 });
  }
}
