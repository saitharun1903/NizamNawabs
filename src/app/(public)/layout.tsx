import React from 'react';
import prisma from '@/lib/db';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import CinematicIntro from '@/components/public/CinematicIntro';
import ScrollObserver from '@/components/public/ScrollObserver';
import BrandedPageTransition from '@/components/public/BrandedPageTransition';
import AIAssistant from '@/components/public/AIAssistant';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  if (!settings) {
    settings = {
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
      phone: '',
      location: 'Hyderabad, Telangana, India',
      footerText: '© Nizam Nawabs Professional Basketball Club. Telangana, India.',
      seoTitle: 'Nizam Nawabs | Professional Basketball Team — Telangana',
      seoDescription: 'Official website of Nizam Nawabs.',
      ogImageUrl: '/brand/reference-full.png',
      aiEnabled: true,
      aiAssistantName: 'Nizam Nawabs Assistant',
      aiWelcomeMessage: "Hey. I'm the Nizam Nawabs Assistant. What would you like to know about the team?",
      aiSuggestedPrompts: "Who are Nizam Nawabs?;Show me the roster;When is the next match?;Tell me about Season 1;Latest team news",
      updatedAt: new Date(),
    };
  }

  const navItems = await prisma.navigationItem.findMany({
    where: { isVisible: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white">
      <CinematicIntro />
      <ScrollObserver />
      <PublicNavbar
        navItems={navItems.map((n) => ({
          id: n.id,
          label: n.label,
          url: n.url,
          isExternal: n.isExternal,
        }))}
        teamName={settings.teamName}
        instagramUrl={settings.instagramUrl}
        youtubeUrl={settings.youtubeUrl}
      />
      <BrandedPageTransition>
        <main className="flex-1">{children}</main>
      </BrandedPageTransition>
      <PublicFooter
        settings={{
          teamName: settings.teamName,
          tagline: settings.tagline,
          footerText: settings.footerText,
          instagramUrl: settings.instagramUrl,
          youtubeUrl: settings.youtubeUrl,
          contactEmail: settings.contactEmail,
          location: settings.location,
        }}
      />
      <AIAssistant
        initialSettings={{
          enabled: settings.aiEnabled,
          assistantName: settings.aiAssistantName,
          welcomeMessage: settings.aiWelcomeMessage,
          suggestedPrompts: settings.aiSuggestedPrompts,
        }}
      />
    </div>
  );
}
