import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nizam Nawabs production database...');

  // 1. Site Settings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
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

  // 2. Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin@nizam2025', salt);

  await prisma.adminUser.upsert({
    where: { email: 'admin@nizamnawabs.com' },
    update: { passwordHash },
    create: {
      email: 'admin@nizamnawabs.com',
      name: 'Nawabs Head Administrator',
      passwordHash,
      role: 'SUPERADMIN',
    },
  });

  // 3. Hero Slide
  const heroCount = await prisma.heroSlide.count();
  if (heroCount === 0) {
    await prisma.heroSlide.create({
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
        displayOrder: 1,
      },
    });
  }

  // 4. Team Info
  await prisma.teamInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      headline: 'THE HARDWOOD PRIDE OF TELANGANA',
      philosophy: 'Rooted in the grit and vibrancy of Telangana, Nizam Nawabs play fearless, high-speed basketball. We play with an aggressive defensive blueprint, electric transition offense, and relentless discipline.',
      telanganaIdentity: 'Representing Hyderabad and all districts across Telangana, the Nawabs connect local youth culture with professional athletic excellence. Every possession carries the unstoppable spirit of the state.',
      homeCourt: 'Kotla Vijaya Bhaskara Reddy (KVBR) Indoor Stadium, Yousufguda, Hyderabad',
      bannerImageUrl: '/brand/post-journey-players.png',
      achievementSummary: 'TPBL Season 1 Runners Up (Inaugural Season Finalists).',
    },
  });

  // 5. Players
  const playerCount = await prisma.player.count();
  if (playerCount === 0) {
    await prisma.player.createMany({
      data: [
        {
          name: 'Nawabs Captain',
          jerseyNumber: 7,
          position: 'Forward',
          photoUrl: '/brand/player-2.png',
          bio: 'Franchise leader known for ferocious rim protection, high-efficiency interior scoring, and court command.',
          height: '6 ft 6 in',
          nationality: 'India',
          ppg: 21.4,
          rpg: 9.8,
          apg: 4.2,
          isActive: true,
          displayOrder: 1,
        },
        {
          name: 'Lead Playmaker',
          jerseyNumber: 3,
          position: 'Point Guard',
          photoUrl: '/brand/player-1.png',
          bio: 'Quick-twitch floor general capable of breaking down full-court presses and orchestrating clutch fourth-quarter possessions.',
          height: '6 ft 1 in',
          nationality: 'India',
          ppg: 17.8,
          rpg: 4.1,
          apg: 8.6,
          isActive: true,
          displayOrder: 2,
        },
        {
          name: 'Perimeter Shooter',
          jerseyNumber: 11,
          position: 'Shooting Guard',
          photoUrl: '/brand/player-3.png',
          bio: 'Sharpshooter stretching the floor with deep three-point range and persistent off-ball motion.',
          height: '6 ft 4 in',
          nationality: 'India',
          ppg: 19.2,
          rpg: 5.3,
          apg: 3.5,
          isActive: true,
          displayOrder: 3,
        },
      ],
    });
  }

  // 6. Seasons
  const seasonCount = await prisma.season.count();
  if (seasonCount === 0) {
    await prisma.season.createMany({
      data: [
        {
          seasonName: 'TPBL Season 1',
          seasonNumber: 1,
          year: '2024',
          achievement: 'Runners Up',
          description: 'Historic inaugural campaign in the Telangana Pro Basketball League. Nizam Nawabs established an electrifying identity, dominating the round-robin matches and securing the Runners Up trophy.',
          coverImageUrl: '/brand/highlight-season1.png',
          isCurrent: false,
          status: 'Completed',
          displayOrder: 1,
        },
        {
          seasonName: 'TPBL Season 2',
          seasonNumber: 2,
          year: '2025',
          achievement: 'Championship Contenders',
          description: 'Entering Season 2 with refined tactical schemes, retained core stars, and high-altitude training camp targeting the TPBL Championship crown.',
          coverImageUrl: '/brand/post-retention-challenge.png',
          isCurrent: true,
          status: 'Active',
          displayOrder: 2,
        },
      ],
    });
  }

  // 7. Matches
  const matchCount = await prisma.match.count();
  if (matchCount === 0) {
    await prisma.match.createMany({
      data: [
        {
          homeTeam: 'Nizam Nawabs',
          awayTeam: 'Secunderabad Strikers',
          homeScore: 84,
          awayScore: 78,
          matchDate: '2024-11-20',
          matchTime: '18:00',
          venue: 'KVBR Indoor Stadium, Hyderabad',
          competition: 'TPBL Season 1 Semi-Final',
          status: 'Completed',
          ticketUrl: '',
          notes: 'High-octane defensive stop in the final 30 seconds secured Nawabs finals berth.',
        },
        {
          homeTeam: 'Hyderabad Hawks',
          awayTeam: 'Nizam Nawabs',
          homeScore: 91,
          awayScore: 87,
          matchDate: '2024-11-24',
          matchTime: '19:30',
          venue: 'Gachibowli Indoor Stadium, Hyderabad',
          competition: 'TPBL Season 1 Grand Final',
          status: 'Completed',
          ticketUrl: '',
          notes: 'Down-to-the-wire finals clash; Nawabs fought relentlessly to claim Season 1 Runners Up.',
        },
        {
          homeTeam: 'Nizam Nawabs',
          awayTeam: 'Warangal Warriors',
          homeScore: null,
          awayScore: null,
          matchDate: '2025-10-15',
          matchTime: '19:00',
          venue: 'KVBR Indoor Stadium, Hyderabad',
          competition: 'TPBL Season 2 Opening Fixture',
          status: 'Upcoming',
          ticketUrl: '/contact',
          notes: 'Opening match of the new season. Tickets open at team box office.',
        },
      ],
    });
  }

  // 8. Journey Milestones
  const milestoneCount = await prisma.journeyMilestone.count();
  if (milestoneCount === 0) {
    await prisma.journeyMilestone.createMany({
      data: [
        {
          yearLabel: '2024',
          title: 'Franchise Inception',
          description: 'Nizam Nawabs founded with a mission to elevate professional basketball standards in Telangana, bringing world-class player development to Hyderabad.',
          category: 'Foundation',
          imageUrl: '/brand/logo-crest.png',
          displayOrder: 1,
          isVisible: true,
        },
        {
          yearLabel: '2024',
          title: 'TPBL Player Auction',
          description: 'Assembled a potent roster combining seasoned domestic stars and explosive university athletes at the official league auction.',
          category: 'Auction',
          imageUrl: '/brand/highlight-auction.png',
          displayOrder: 2,
          isVisible: true,
        },
        {
          yearLabel: '2024',
          title: 'The Journey: Season 1 Run',
          description: 'Surged through regular season fixtures with relentless team chemistry and dominant home court performances.',
          category: 'Competition',
          imageUrl: '/brand/post-journey-players.png',
          displayOrder: 3,
          isVisible: true,
        },
        {
          yearLabel: '2024',
          title: 'Season 1 Runners Up Honors',
          description: 'Clinched the prestigious Runners Up trophy in the inaugural Telangana Pro Basketball League championship series.',
          category: 'Silverware',
          imageUrl: '/brand/highlight-season1.png',
          displayOrder: 4,
          isVisible: true,
        },
        {
          yearLabel: '2025',
          title: 'Season 2 Roster Retention',
          description: 'Announced core roster retentions and launched the public prediction challenge ahead of the upcoming campaign.',
          category: 'Preparation',
          imageUrl: '/brand/post-retention-challenge.png',
          displayOrder: 5,
          isVisible: true,
        },
      ],
    });
  }

  // 9. Gallery Items
  const galleryCount = await prisma.galleryItem.count();
  if (galleryCount === 0) {
    await prisma.galleryItem.createMany({
      data: [
        {
          title: 'The Journey — Starting Roster',
          caption: 'Official Season 1 team portrait featuring Nawabs in home white and orange kits.',
          imageUrl: '/brand/post-journey-players.png',
          category: 'Match Day',
          isFeatured: true,
          displayOrder: 1,
          isPublished: true,
        },
        {
          title: 'The MVP Flight',
          caption: 'Mid-air finish above the rim during the championship elimination rounds.',
          imageUrl: '/brand/post-mvp.png',
          category: 'Match Day',
          isFeatured: true,
          displayOrder: 2,
          isPublished: true,
        },
        {
          title: 'TPBL Player Auction Podium',
          caption: 'Nizam Nawabs management securing franchise key picks at the official auction.',
          imageUrl: '/brand/highlight-auction.png',
          category: 'Auction',
          isFeatured: false,
          displayOrder: 3,
          isPublished: true,
        },
        {
          title: 'TPBL Season 1 Runners Up Crest',
          caption: 'Telangana Pro Basketball League official Season 1 medallion and honors.',
          imageUrl: '/brand/highlight-season1.png',
          category: 'Milestones',
          isFeatured: true,
          displayOrder: 4,
          isPublished: true,
        },
        {
          title: 'Retention Challenge Campaign',
          caption: 'Interactive campaign engaging fans statewide ahead of Season 2 tip-off.',
          imageUrl: '/brand/post-retention-challenge.png',
          category: 'Lifestyle',
          isFeatured: false,
          displayOrder: 5,
          isPublished: true,
        },
      ],
    });
  }

  // 10. Articles
  const articleCount = await prisma.article.count();
  if (articleCount === 0) {
    await prisma.article.createMany({
      data: [
        {
          title: 'Nizam Nawabs Complete Historic Inaugural Season as TPBL Runners Up',
          slug: 'nizam-nawabs-tpbl-season-1-runners-up',
          excerpt: 'A historic debut campaign establishes Nizam Nawabs as one of the most explosive forces in Telangana basketball.',
          content: `In an electrifying championship final that kept fans on their feet until the final buzzer, the Nizam Nawabs concluded their inaugural campaign in the Telangana Pro Basketball League (TPBL) by lifting the Season 1 Runners Up trophy.

From opening tip-off in November through the championship rounds, the Nawabs displayed an identity built on tenacity, fast transitions, and deep state pride.

Head Coach remarked: "Our players left everything on the floor. For our very first season together as a unit, finishing as finalists and runners-up sets a benchmark. We proved that Telangana basketball has unmatched intensity."

With Season 2 preparations already underway, the Nawabs look to build on this strong foundation and bring the championship crown back to Hyderabad.`,
          coverImageUrl: '/brand/post-journey-players.png',
          category: 'Season Review',
          author: 'Nawabs Media Desk',
          status: 'PUBLISHED',
          publishedAt: new Date('2024-11-26'),
          seoTitle: 'Nizam Nawabs Finish Season 1 as TPBL Runners Up',
          seoDescription: 'Read the full recap of Nizam Nawabs historic inaugural season in the Telangana Pro Basketball League.',
        },
        {
          title: 'Behind the Scenes: Inside the TPBL Season 2 Player Retention Process',
          slug: 'inside-tpbl-season-2-retention-strategy',
          excerpt: 'Examining the strategic roster moves and training camp plans preparing the Nawabs for the next campaign.',
          content: `As the Telangana Pro Basketball League gears up for Season 2, franchise front offices are entering critical retention windows.

The Nawabs have prioritized chemistry and athletic continuity, locking down key defensive anchors and perimeter shooting leaders while preparing for the supplemental draft.

"Contenders are built in the offseason," noted the management team. "We analyzed our shot efficiency and fourth-quarter execution from Season 1, and we are entering Season 2 with a squad built to dominate both ends of the court."`,
          coverImageUrl: '/brand/post-retention-challenge.png',
          category: 'Team News',
          author: 'Front Office',
          status: 'DRAFT',
          publishedAt: null,
          seoTitle: 'TPBL Season 2 Retention Process | Nizam Nawabs',
          seoDescription: 'Draft notes and strategy for the upcoming Telangana Pro Basketball League season.',
        },
      ],
    });
  }

  // 11. Sponsors (Only real sponsor verified from jersey: ZENNARA)
  const sponsorCount = await prisma.sponsor.count();
  if (sponsorCount === 0) {
    await prisma.sponsor.create({
      data: {
        name: 'Zennara',
        logoUrl: '',
        tier: 'Official Jersey Partner',
        websiteUrl: 'https://zennara.com',
        displayOrder: 1,
        isActive: true,
      },
    });
  }

  // 12. Navigation Items
  const navCount = await prisma.navigationItem.count();
  if (navCount === 0) {
    await prisma.navigationItem.createMany({
      data: [
        { label: 'HOME', url: '/', isExternal: false, isVisible: true, displayOrder: 1 },
        { label: 'TEAM', url: '/team', isExternal: false, isVisible: true, displayOrder: 2 },
        { label: 'ROSTER', url: '/roster', isExternal: false, isVisible: true, displayOrder: 3 },
        { label: 'MATCHES', url: '/matches', isExternal: false, isVisible: true, displayOrder: 4 },
        { label: 'JOURNEY', url: '/journey', isExternal: false, isVisible: true, displayOrder: 5 },
        { label: 'GALLERY', url: '/gallery', isExternal: false, isVisible: true, displayOrder: 6 },
        { label: 'NEWS', url: '/news', isExternal: false, isVisible: true, displayOrder: 7 },
        { label: 'CONTACT', url: '/contact', isExternal: false, isVisible: true, displayOrder: 8 },
      ],
    });
  }

  console.log('Database seeded successfully with authentic Nizam Nawabs content!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
