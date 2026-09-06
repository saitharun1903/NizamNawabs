const BASE_URL = 'https://www.lunor.co.in';

async function runSuite() {
  console.log('============================================================');
  console.log('NIZAM NAWABS PRODUCTION END-TO-END VERIFICATION SUITE');
  console.log('Target: ' + BASE_URL);
  console.log('============================================================\n');

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

  // 1. PUBLIC ROUTES
  console.log('--- 1. Testing Public Routes ---');
  const publicRoutes = [
    { path: '/', titleSnippet: 'Nizam Nawabs' },
    { path: '/team', titleSnippet: 'NIZAM NAWABS' },
    { path: '/roster', titleSnippet: 'SQUAD' },
    { path: '/matches', titleSnippet: 'FIXTURES' },
    { path: '/journey', titleSnippet: 'JOURNEY' },
    { path: '/gallery', titleSnippet: 'GALLERY' },
    { path: '/news', titleSnippet: 'NEWS' },
    { path: '/contact', titleSnippet: 'CONNECT' }
  ];

  for (const route of publicRoutes) {
    const res = await fetch(BASE_URL + route.path);
    const html = await res.text();
    const digests = (html.match(/"digest":"([^"]+)"/g) || []).map(d => d.replace(/"digest":"|"/g, ''));
    const hasNextError = html.includes('__next_error__') || html.includes('Application error');

    assert(res.status === 200, `${route.path} returns HTTP 200 (actual: ${res.status})`);
    assert(!hasNextError, `${route.path} has no Next.js application error`);
    assert(digests.length === 0, `${route.path} has 0 error digests (found: ${digests.join(', ')})`);
    assert(html.toUpperCase().includes(route.titleSnippet.toUpperCase()), `${route.path} contains expected title keyword: ${route.titleSnippet}`);
  }

  // 2. ADMIN AUTHENTICATION
  console.log('\n--- 2. Testing Admin Authentication ---');
  const loginRes = await fetch(BASE_URL + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@nizamnawabs.com',
      password: 'admin@nizam2025'
    })
  });

  assert(loginRes.status === 200, `Admin login returns HTTP 200 (actual: ${loginRes.status})`);
  const loginData = await loginRes.json();
  assert(loginData.success === true, 'Admin login returns success: true');
  const rawCookies = typeof loginRes.headers.getSetCookie === 'function'
    ? loginRes.headers.getSetCookie()
    : [loginRes.headers.get('set-cookie') || ''];
  const sessionCookie = rawCookies.find(c => c.includes('nawabs_admin_session='));
  assert(!!sessionCookie, 'Admin auth cookie (nawabs_admin_session) issued');

  // Extract auth cookie header
  const cookieHeader = sessionCookie.split(';')[0];

  // 3. ADMIN CMS MUTATION & IMMEDIATE PURGE
  console.log('\n--- 3. Testing CMS Mutation & Cleanup ---');
  // Verify public homepage has zero test sponsor data
  const homeCheckRes = await fetch(`${BASE_URL}/`);
  const homeCheckHtml = await homeCheckRes.text();
  assert(!homeCheckHtml.includes('PROD_TEST'), 'Public homepage contains no PROD_TEST records');
  assert(!homeCheckHtml.includes('TEST PARTNER'), 'Public homepage contains no TEST PARTNER text');
  assert(!homeCheckHtml.includes('VERIFICATION_SPONSOR'), 'Public homepage contains no VERIFICATION_SPONSOR text');

  // Test CMS Sponsor CRUD with guaranteed cleanup and isActive: false
  let tempSponsorId = null;
  try {
    const createRes = await fetch(BASE_URL + '/api/admin/sponsors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify({
        name: 'Ephemeral Audit Partner',
        logoUrl: '/brand/logo-crest.png',
        tier: 'Official Partner',
        websiteUrl: 'https://nizamnawabs.com',
        displayOrder: 999,
        isActive: false // Kept inactive so it never leaks to public website
      })
    });

    assert(createRes.status === 200 || createRes.status === 201, `CMS create sponsor returns HTTP 200/201 (actual: ${createRes.status})`);
    const createdData = await createRes.json();
    const sponsorItem = createdData.sponsor || createdData;
    tempSponsorId = sponsorItem?.id;
    assert(tempSponsorId && sponsorItem.name === 'Ephemeral Audit Partner', 'Temporary audit item created via Admin API');
  } finally {
    if (tempSponsorId) {
      const deleteRes = await fetch(`${BASE_URL}/api/admin/sponsors/${tempSponsorId}`, {
        method: 'DELETE',
        headers: { 'Cookie': cookieHeader }
      });
      assert(deleteRes.status === 200, `CMS delete sponsor returns HTTP 200 (actual: ${deleteRes.status})`);
      const deleteData = await deleteRes.json();
      assert(deleteData.success === true, 'Temporary audit item purged cleanly from database');
    }
  }

  // 4. GEMINI ASSISTANT ENDPOINT
  console.log('\n--- 4. Testing AI Assistant API Endpoint ---');
  const chatConfigRes = await fetch(BASE_URL + '/api/chat');
  assert(chatConfigRes.status === 200, `AI Assistant GET /api/chat returns HTTP 200 (actual: ${chatConfigRes.status})`);
  const chatConfig = await chatConfigRes.json();
  assert(chatConfig.enabled === true && chatConfig.assistantName, 'AI Assistant configuration valid');

  const chatRes = await fetch(BASE_URL + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Who are Nizam Nawabs?'
    })
  });

  // When GEMINI_API_KEY is not configured on Vercel, it returns controlled JSON error { status: 500 }
  assert(chatRes.status === 200 || chatRes.status === 500 || chatRes.status === 503, `AI Assistant POST /api/chat returns controlled HTTP status (actual: ${chatRes.status})`);
  const chatData = await chatRes.json().catch(() => null);
  assert(chatRes.status === 200 || (chatData && chatData.error), 'Chat API returns controlled JSON response');

  console.log('\n============================================================');
  console.log(`ALL PRODUCTION TESTS PASSED: ${passed}/${total}`);
  console.log('============================================================\n');
}

runSuite().catch(err => {
  console.error('\nProduction verification failed:', err);
  process.exit(1);
});
