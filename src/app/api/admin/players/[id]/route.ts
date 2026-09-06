import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePublicPaths } from '@/lib/revalidate';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const player = await prisma.player.findUnique({ where: { id: params.id } });
  if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 });

  return NextResponse.json({ player });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const existing = await prisma.player.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Player not found' }, { status: 404 });

    const updated = await prisma.player.update({
      where: { id: params.id },
      data: {
        name: data.name !== undefined ? data.name : existing.name,
        jerseyNumber: data.jerseyNumber !== undefined ? parseInt(data.jerseyNumber, 10) : existing.jerseyNumber,
        position: data.position !== undefined ? data.position : existing.position,
        photoUrl: data.photoUrl !== undefined ? data.photoUrl : existing.photoUrl,
        bio: data.bio !== undefined ? data.bio : existing.bio,
        height: data.height !== undefined ? data.height : existing.height,
        nationality: data.nationality !== undefined ? data.nationality : existing.nationality,
        ppg: data.ppg !== undefined ? parseFloat(data.ppg) : existing.ppg,
        rpg: data.rpg !== undefined ? parseFloat(data.rpg) : existing.rpg,
        apg: data.apg !== undefined ? parseFloat(data.apg) : existing.apg,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive,
        displayOrder: data.displayOrder !== undefined ? (parseInt(data.displayOrder, 10) || 0) : existing.displayOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Player',
        entityId: updated.id,
        details: `Updated player: ${updated.name}`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths('/roster');

    return NextResponse.json({ success: true, player: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update player' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.player.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Player not found' }, { status: 404 });

    await prisma.player.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Player',
        entityId: params.id,
        details: `Deleted player: ${existing.name} (#${existing.jerseyNumber})`,
        userEmail: session.email,
      },
    });

    revalidatePublicPaths('/roster');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete player' }, { status: 500 });
  }
}
