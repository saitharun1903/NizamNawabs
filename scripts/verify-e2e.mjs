// scripts/verify-e2e.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3000';

async function main() {
  console.log('🏀 Starting Nizam Nawabs E2E Comprehensive Verification...\n');
  let failures = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`  ▪ Testing: ${name}... `);
      await fn();
      console.log('✅ PASS');
    } catch (err) {
      console.log('❌ FAIL');
      console.error('    Error:', err.message);
      failures++;
    }
  }

  // 1. PUBLIC ROUTES
  await test('Public Home Page (GET /)', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes('NIZAM NAWABS'), 'Home page should include NIZAM NAWABS');
    assert(html.includes('TELANGANA'), 'Home page should include TELANGANA');
  });

  await test('Public Roster Page (GET /roster)', async () => {
    const res = await fetch(`${BASE_URL}/roster`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('Active Roster') || html.includes('ROSTER') || html.includes('Roster'), 'Should render roster');
  });

  await test('Public Matches Page (GET /matches)', async () => {
    const res = await fetch(`${BASE_URL}/matches`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('Schedule') || html.includes('MATCH') || html.includes('Fixtures'), 'Should render matches');
  });

  await test('Public Journey Page (GET /journey)', async () => {
    const res = await fetch(`${BASE_URL}/journey`);
    assert.strictEqual(res.status, 200);
  });

  await test('Public Gallery Page (GET /gallery)', async () => {
    const res = await fetch(`${BASE_URL}/gallery`);
    assert.strictEqual(res.status, 200);
  });

  await test('Public News Page (GET /news)', async () => {
    const res = await fetch(`${BASE_URL}/news`);
    assert.strictEqual(res.status, 200);
  });

  await test('Public Contact Page (GET /contact)', async () => {
    const res = await fetch(`${BASE_URL}/contact`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('CONNECT WITH') || html.includes('NAWABS'), 'Should render contact page');
  });

  // 2. ROUTE GUARD (UNAUTHENTICATED PROTECTION)
  await test('Route Guard: Unauthenticated access to /api/admin/stats returns 401', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
  });

  // 3. AUTHENTICATION (LOGIN / ME / LOGOUT)
  let cookieHeader = '';
  await test('Auth: Reject invalid credentials', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nizamnawabs.com', password: 'wrongpassword' })
    });
    assert.strictEqual(res.status, 401);
  });

  await test('Auth: Successful login returns session cookie and admin profile', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nizamnawabs.com', password: 'admin@nizam2025' })
    });
    assert.strictEqual(res.status, 200);
    const rawCookies = res.headers.get('set-cookie');
    assert(rawCookies, 'Set-Cookie header must be present');
    assert(rawCookies.includes('nawabs_admin_session='), 'Should set nawabs_admin_session cookie');
    
    // Extract cookie value for subsequent requests
    const match = rawCookies.match(/nawabs_admin_session=([^;]+)/);
    assert(match, 'nawabs_admin_session value found');
    cookieHeader = `nawabs_admin_session=${match[1]}`;

    const json = await res.json();
    assert.strictEqual(json.user.email, 'admin@nizamnawabs.com');
  });

  await test('Auth: /api/auth/me succeeds with valid cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: cookieHeader }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.user.email, 'admin@nizamnawabs.com');
  });

  // 4. ADMIN STATS
  await test('Admin Stats API (/api/admin/stats) succeeds with cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: cookieHeader }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert(json.metrics, 'Should return metrics');
    assert(typeof json.metrics.totalPlayers === 'number', 'Should return players count');
    assert(typeof json.metrics.totalMatches === 'number', 'Should return matches count');
  });

  // 5. PLAYER CRUD LIFECYCLE
  let createdPlayerId = null;
  await test('Player CRUD: CREATE a new player via Admin API', async () => {
    const newPlayer = {
      name: 'Automated Test Player',
      jerseyNumber: 99,
      position: 'Forward',
      height: "6'6\"",
      weight: '210 lbs',
      hometown: 'Hyderabad, Telangana',
      college: 'Osmania University',
      bio: 'E2E automated test player bio.',
      photoUrl: '/brand/player-1.png',
      ppg: 18.5,
      rpg: 7.2,
      apg: 3.1,
      isActive: true,
      displayOrder: 99
    };

    const res = await fetch(`${BASE_URL}/api/admin/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify(newPlayer)
    });
    assert(res.ok, `Expected 200/201, got ${res.status}`);
    const json = await res.json();
    assert(json.player && json.player.id, 'Created player should have an ID');
    assert.strictEqual(json.player.name, 'Automated Test Player');
    createdPlayerId = json.player.id;
  });

  await test('Player CRUD: READ back created player', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/players/${createdPlayerId}`, {
      headers: { Cookie: cookieHeader }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.player.jerseyNumber, 99);
  });

  await test('Player CRUD: UPDATE created player', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/players/${createdPlayerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        name: 'Automated Test Player Updated',
        jerseyNumber: 77,
        position: 'Guard'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.player.jerseyNumber, 77);
    assert.strictEqual(json.player.name, 'Automated Test Player Updated');
  });

  await test('Player CRUD: DELETE created player', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/players/${createdPlayerId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader }
    });
    assert.strictEqual(res.status, 200);

    // Verify deletion
    const verifyRes = await fetch(`${BASE_URL}/api/admin/players/${createdPlayerId}`, {
      headers: { Cookie: cookieHeader }
    });
    assert.strictEqual(verifyRes.status, 404);
  });

  // 6. MATCHES CRUD LIFECYCLE
  let createdMatchId = null;
  await test('Matches CRUD: CREATE a match', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        homeTeam: 'Nizam Nawabs',
        awayTeam: 'E2E Rival Stars',
        matchDate: '2025-11-20',
        matchTime: '18:30',
        venue: 'KVBR Indoor Stadium, Yousufguda',
        competition: 'Telangana Pro Basketball League',
        status: 'Upcoming',
        ticketUrl: 'https://insider.in'
      })
    });
    assert(res.ok, `Expected 200/201, got ${res.status}`);
    const json = await res.json();
    assert(json.match && json.match.id, 'Created match should have an ID');
    createdMatchId = json.match.id;
  });

  await test('Matches CRUD: UPDATE match to COMPLETED with scores', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/matches/${createdMatchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        status: 'Completed',
        homeScore: 92,
        awayScore: 84,
        notes: 'Thrilling victory at Gachibowli.'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.match.status, 'Completed');
    assert.strictEqual(json.match.homeScore, 92);
  });

  await test('Matches CRUD: DELETE created match', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/matches/${createdMatchId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader }
    });
    assert.strictEqual(res.status, 200);
  });

  // 7. NEWS DRAFT VS PUBLISHED FILTERING
  let draftArticleId = null;
  const draftSlug = `internal-draft-${Date.now()}`;
  await test('News: Create draft article and verify it is hidden from public feed', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        title: 'Confidential Internal Draft Article',
        slug: draftSlug,
        excerpt: 'This should not be seen publicly.',
        content: 'Secret internal team bulletin details.',
        category: 'Team News',
        status: 'DRAFT'
      })
    });
    assert(res.ok, `Expected 200/201, got ${res.status}`);
    const json = await res.json();
    assert(json.article && json.article.id, 'Article must have ID');
    draftArticleId = json.article.id;

    // Fetch public news page and ensure draft does NOT appear
    const pubRes = await fetch(`${BASE_URL}/news`);
    const pubHtml = await pubRes.text();
    assert(!pubHtml.includes('Confidential Internal Draft Article'), 'Draft article must NOT appear on public news page');
  });

  await test('News: Publish draft article and verify update', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/news/${draftArticleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        status: 'PUBLISHED'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.article.status, 'PUBLISHED');

    // Clean up
    await fetch(`${BASE_URL}/api/admin/news/${draftArticleId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader }
    });
  });

  // 8. FILE UPLOAD
  await test('Media: Upload image via multipart form data', async () => {
    // Create a 1x1 PNG buffer
    const dummyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(dummyPngBase64, 'base64');

    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/png' });
    formData.append('file', blob, 'test-verification.png');
    formData.append('altText', 'Test Verification Image');

    const res = await fetch(`${BASE_URL}/api/admin/media/upload`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader
      },
      body: formData
    });
    assert(res.ok, `Expected upload success, got ${res.status}`);
    const json = await res.json();
    const url = json.fileUrl || (json.asset && json.asset.fileUrl);
    assert(url, 'Asset record returned with URL');
    assert(url.startsWith('/uploads/'), 'URL should start with /uploads/');

    // Verify physical file on disk
    const filePath = path.join(process.cwd(), 'public', url.replace(/^\//, ''));
    assert(fs.existsSync(filePath), `Uploaded file should exist on disk at ${filePath}`);

    // Clean up physical file
    fs.unlinkSync(filePath);
  });

  // 9. NAVIGATION SAFETY CONSTRAINT (CANNOT ADD ADMIN / API PATHS)
  await test('Navigation Safety: Cannot add /admin or /api to public navbar', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/navigation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        label: 'Sneaky Admin Link',
        url: '/admin/secret',
        displayOrder: 10
      })
    });
    assert.strictEqual(res.status, 400, 'Adding /admin route to navigation must return 400 Bad Request');
  });

  console.log(`\n========================================`);
  if (failures === 0) {
    console.log(`🎉 ALL TESTS PASSED SUCCESSFULLY! (0 failures)`);
    console.log(`========================================\n`);
  } else {
    console.error(`⚠️ ${failures} tests failed!`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error running verification:', err);
  process.exit(1);
});
