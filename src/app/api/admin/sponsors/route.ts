import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePublicPaths } from '@/lib/revalidate';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json({ sponsors });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const sponsor = await prisma.sponsor.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl || '',
        tier: data.tier || 'Official Partner',
        websiteUrl: data.websiteUrl || '',
        displayOrder: parseInt(data.displayOrder, 10) || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Sponsor',
        entityId: sponsor.id,
        details: `Added sponsor: ${sponsor.name}`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths('/');

    return NextResponse.json({ success: true, sponsor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create sponsor' }, { status: 500 });
  }
}
