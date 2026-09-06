import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function fetchPage(urlPath) {
  const res = await fetch(`${BASE_URL}${urlPath}`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${urlPath}: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

async function runTests() {
  console.log('====================================================');
  console.log('DYNAMIC DATA ARCHITECTURE VERIFICATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // ----------------------------------------------------
  // TEST 1: Auto-generated live ticker from verified records
  // ----------------------------------------------------
  console.log('Test 1: Auto-Generated Live Marquee Ticker');
  // Ensure tickerText is empty in DB to test auto-generation
  await prisma.siteSetting.update({
    where: { id: 'default' },
    data: { tickerText: '' },
  });

  const homeHtml1 = await fetchPage('/');
  assert(homeHtml1.includes('NIZAM NAWABS'), 'Ticker contains team name');
  assert(homeHtml1.includes('TELANGANA PRO BASKETBALL LEAGUE'), 'Ticker contains league name');
  assert(
    homeHtml1.includes('TPBL SEASON 2') || homeHtml1.includes('CHAMPIONSHIP CONTENDERS') || homeHtml1.includes('RUNNERS UP'),
    'Ticker contains active season info'
  );
  assert(homeHtml1.includes('WARANGAL WARRIORS'), 'Ticker contains upcoming opponent from Match collection');

  // ----------------------------------------------------
  // TEST 2: Match Central & Score Ticker formatting
  // ----------------------------------------------------
  console.log('\nTest 2: ScoreTicker Match Ribbon');
  assert(homeHtml1.includes('HARDWOOD CENTRAL'), 'Ribbon header is present');
  assert(homeHtml1.includes('Warangal Warriors'), 'Nearest upcoming fixture is displayed');
  assert(homeHtml1.includes('Secunderabad Strikers') || homeHtml1.includes('Hyderabad Hawks'), 'Recent completed fixture is displayed');
  assert(homeHtml1.includes('84 : 78') || homeHtml1.includes('91 : 87'), 'Real completed box scores are displayed');
  assert(!homeHtml1.includes('TPBL Season 2 Schedule Announcement Coming Soon'), 'Hardcoded placeholder removed when matches exist');

  // ----------------------------------------------------
  // TEST 3: Dynamic Season Campaign Poster
  // ----------------------------------------------------
  console.log('\nTest 3: Season Campaign Poster & Silverware');
  const seasons = await prisma.season.findMany({ orderBy: { seasonNumber: 'asc' } });
  const spotlightSeason = seasons.find(s => s.achievement && s.achievement !== 'TBD') || seasons[0];
  const watermarkNumber = String(spotlightSeason.seasonNumber).padStart(2, '0');

  assert(homeHtml1.includes(watermarkNumber), `Poster includes dynamic season watermark (${watermarkNumber})`);
  assert(homeHtml1.includes(spotlightSeason.seasonName.toUpperCase()), 'Poster includes dynamic season title');
  assert(homeHtml1.includes(spotlightSeason.achievement.toUpperCase()), 'Poster includes dynamic achievement');

  // ----------------------------------------------------
  // TEST 4: Dynamic Roster & STATS TBA for unrecorded stats
  // ----------------------------------------------------
  console.log('\nTest 4: Roster Stage & Athletes');
  assert(homeHtml1.includes('Nawabs Captain') || homeHtml1.includes('Lead Playmaker'), 'Real players displayed from database');

  const testPlayer = await prisma.player.create({
    data: {
      name: 'Automated Test Player',
      jerseyNumber: 99,
      position: 'Forward',
      height: '6-6',
      ppg: 0,
      rpg: 0,
      apg: 0,
      isActive: true,
      bio: 'Dynamic verification test player',
    },
  });

  const rosterHtml = await fetchPage('/roster');
  assert(rosterHtml.includes('Automated Test Player'), 'Player #99 exists in roster');
  assert(rosterHtml.includes('STATS TBA'), 'Unrecorded stats gracefully display STATS TBA instead of fake metrics');

  await prisma.player.delete({ where: { id: testPlayer.id } });

  // ----------------------------------------------------
  // TEST 5: Custom Marquee Ticker CMS update and instant reflection
  // ----------------------------------------------------
  console.log('\nTest 5: Custom Marquee Ticker CMS Setting & Immediate Reflection');
  const customTickerString = 'EXCLUSIVE CMS TICKER • HYDERABAD HARDWOOD PRIDE • CHAMPIONSHIP DRIVE 2026';
  await prisma.siteSetting.update({
    where: { id: 'default' },
    data: { tickerText: customTickerString },
  });

  const homeHtmlCustom = await fetchPage('/');
  assert(homeHtmlCustom.includes('EXCLUSIVE CMS TICKER'), 'Custom ticker phrase 1 reflected on homepage');
  assert(homeHtmlCustom.includes('HYDERABAD HARDWOOD PRIDE'), 'Custom ticker phrase 2 reflected on homepage');
  assert(homeHtmlCustom.includes('CHAMPIONSHIP DRIVE 2026'), 'Custom ticker phrase 3 reflected on homepage');

  // Reset tickerText back to empty string
  await prisma.siteSetting.update({
    where: { id: 'default' },
    data: { tickerText: '' },
  });

  const homeHtmlReset = await fetchPage('/');
  assert(homeHtmlReset.includes('TELANGANA PRO BASKETBALL LEAGUE'), 'Auto-generated live ticker restored when tickerText is empty');

  // ----------------------------------------------------
  // TEST 6: Other Public Routes Cleanliness
  // ----------------------------------------------------
  console.log('\nTest 6: Public Routes Integrity');
  const teamHtml = await fetchPage('/team');
  assert(!teamHtml.includes('TPBL SEASON 1 SILVERWARE'), 'Hardcoded season 1 silverware label replaced with dynamic content');
  assert(teamHtml.includes('THE STORY OF'), 'Team page intact');

  const journeyHtml = await fetchPage('/journey');
  assert(journeyHtml.includes('JOURNEY') && journeyHtml.includes('HISTORICAL CHRONOLOGY'), 'Journey page intact');

  const matchesHtml = await fetchPage('/matches');
  assert(matchesHtml.includes('FIXTURES &'), 'Matches page intact');
  assert(matchesHtml.includes('Warangal Warriors'), 'Matches page displays database fixtures');

  console.log('\n====================================================');
  console.log(`ALL TESTS PASSED: ${passed}/${total}`);
  console.log('====================================================');
}

runTests()
  .catch((err) => {
    console.error('\nVerification failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
