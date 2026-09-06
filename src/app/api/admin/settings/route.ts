import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePublicPaths } from '@/lib/revalidate';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let settings = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        id: 'default',
        teamName: 'Nizam Nawabs',
        shortName: 'Nawabs',
        tagline: 'Bold basketball, local pride, unstoppable spirit',
        logoUrl: '/brand/logo-crest.png',
        primaryColor: '#FF5E00',
        secondaryColor: '#080809',
        instagramUrl: 'https://www.instagram.com/nizamnawabs_basketball/',
        youtubeUrl: 'https://www.youtube.com/@fgsnpro',
        contactEmail: 'contact@nizamnawabs.com',
        phone: '+91 40 2345 6789',
        location: 'Hyderabad, Telangana, India',
        footerText: '© Nizam Nawabs Professional Basketball Club. Telangana, India.',
        seoTitle: 'Nizam Nawabs | Professional Basketball Team — Telangana',
        seoDescription: 'Official website of Nizam Nawabs, professional basketball club in the Telangana Pro Basketball League (TPBL). Season 1 Runners Up.',
        ogImageUrl: '/brand/reference-full.png',
      },
    });
  }

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        teamName: data.teamName,
        shortName: data.shortName,
        tagline: data.tagline,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        instagramUrl: data.instagramUrl,
        youtubeUrl: data.youtubeUrl,
        contactEmail: data.contactEmail,
        phone: data.phone,
        location: data.location,
        footerText: data.footerText,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImageUrl: data.ogImageUrl,
        aiEnabled: typeof data.aiEnabled === 'boolean' ? data.aiEnabled : true,
        aiAssistantName: data.aiAssistantName || 'Nizam Nawabs Assistant',
        aiWelcomeMessage: data.aiWelcomeMessage || "Hey. I'm the Nizam Nawabs Assistant. What would you like to know about the team?",
        aiSuggestedPrompts: data.aiSuggestedPrompts || "Who are Nizam Nawabs?;Show me the roster;When is the next match?;Tell me about Season 1;Latest team news",
        tickerText: typeof data.tickerText === 'string' ? data.tickerText : undefined,
      },
      create: {
        id: 'default',
        teamName: data.teamName,
        shortName: data.shortName,
        tagline: data.tagline,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        instagramUrl: data.instagramUrl,
        youtubeUrl: data.youtubeUrl,
        contactEmail: data.contactEmail,
        phone: data.phone,
        location: data.location,
        footerText: data.footerText,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImageUrl: data.ogImageUrl,
        aiEnabled: typeof data.aiEnabled === 'boolean' ? data.aiEnabled : true,
        aiAssistantName: data.aiAssistantName || 'Nizam Nawabs Assistant',
        aiWelcomeMessage: data.aiWelcomeMessage || "Hey. I'm the Nizam Nawabs Assistant. What would you like to know about the team?",
        aiSuggestedPrompts: data.aiSuggestedPrompts || "Who are Nizam Nawabs?;Show me the roster;When is the next match?;Tell me about Season 1;Latest team news",
        tickerText: typeof data.tickerText === 'string' ? data.tickerText : '',
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'SiteSetting',
        entityId: 'default',
        details: 'Updated global site settings & brand identity',
        userEmail: session.email,
      },
    });

    revalidatePublicPaths();

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
