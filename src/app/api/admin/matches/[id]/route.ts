import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const existing = await prisma.match.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Match not found' }, { status: 404 });

    const updated = await prisma.match.update({
      where: { id: params.id },
      data: {
        homeTeam: data.homeTeam !== undefined ? data.homeTeam : existing.homeTeam,
        awayTeam: data.awayTeam !== undefined ? data.awayTeam : existing.awayTeam,
        homeScore: data.homeScore !== undefined ? (data.homeScore !== '' ? parseInt(data.homeScore, 10) : null) : existing.homeScore,
        awayScore: data.awayScore !== undefined ? (data.awayScore !== '' ? parseInt(data.awayScore, 10) : null) : existing.awayScore,
        matchDate: data.matchDate !== undefined ? data.matchDate : existing.matchDate,
        matchTime: data.matchTime !== undefined ? data.matchTime : existing.matchTime,
        venue: data.venue !== undefined ? data.venue : existing.venue,
        competition: data.competition !== undefined ? data.competition : existing.competition,
        status: data.status !== undefined ? data.status : existing.status,
        ticketUrl: data.ticketUrl !== undefined ? data.ticketUrl : existing.ticketUrl,
        notes: data.notes !== undefined ? data.notes : existing.notes,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Match',
        entityId: updated.id,
        details: `Updated match: ${updated.homeTeam} vs ${updated.awayTeam} (Score: ${updated.homeScore ?? '-'} - ${updated.awayScore ?? '-'})`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, match: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update match' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.match.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Match not found' }, { status: 404 });

    await prisma.match.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Match',
        entityId: params.id,
        details: `Deleted match: ${existing.homeTeam} vs ${existing.awayTeam}`,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete match' }, { status: 500 });
  }
}
