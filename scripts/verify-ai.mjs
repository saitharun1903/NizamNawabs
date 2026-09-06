import puppeteer from 'puppeteer-core';

async function runAIAssistantTests() {
  console.log('🤖 Starting Nizam Nawabs Gemini AI Assistant Verification...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ▪ ${message} ... ✅ PASS`);
      passed++;
    } else {
      console.error(`  ▪ ${message} ... ❌ FAIL`);
      failed++;
    }
  }

  // PART 1: Backend API Tests
  console.log('--- PART 1: Backend API & Gemini Grounding ---');
  try {
    // 1. GET /api/chat
    const getRes = await fetch('http://localhost:3000/api/chat');
    assert(getRes.status === 200, 'GET /api/chat returns status 200');
    const getConfig = await getRes.json();
    assert(getConfig.enabled === true, 'AI Assistant is enabled in CMS');
    assert(Boolean(getConfig.assistantName), `Assistant name configured: "${getConfig.assistantName}"`);
    assert(Array.isArray(getConfig.suggestedPrompts) && getConfig.suggestedPrompts.length > 0, `Suggested prompts configured: ${getConfig.suggestedPrompts?.length} chips`);

    // 2. POST /api/chat input validation
    const emptyRes = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '   ' }),
    });
    assert(emptyRes.status === 400, 'Rejects empty message with 400');

    const longRes = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'a'.repeat(501) }),
    });
    assert(longRes.status === 400, 'Rejects >500 char message with 400');

    // 3. Real Streaming Query to Gemini 3.6 Flash
    console.log('  Sending test prompt to Gemini 3.6 Flash via server route...');
    const streamRes = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Who are Nizam Nawabs and what did they achieve in Season 1?',
        pathname: '/',
      }),
    });

    assert(streamRes.status === 200, 'POST /api/chat returns 200 stream');

    const reader = streamRes.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }

    console.log(`    Response snippet: "${fullText.slice(0, 120)}..."`);
    assert(fullText.length > 20, 'Streamed real response from Gemini');
    const mentionsTeamOrSeason = fullText.toLowerCase().includes('nawabs') || fullText.toLowerCase().includes('basketball') || fullText.toLowerCase().includes('runners up');
    assert(mentionsTeamOrSeason, 'Response is factually grounded in database context');

  } catch (err) {
    console.error('API test failed:', err);
    failed++;
  }

  // PART 2: UI & Browser Interaction Tests
  console.log('\n--- PART 2: Puppeteer UI & Interaction ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

    // Wait for any initial intro or render
    await new Promise((r) => setTimeout(r, 2200));

    // 1. Verify floating button is present and visible
    const button = await page.$('button[aria-label="Open Nizam Nawabs AI Assistant"]');
    assert(button !== null, 'Floating Assistant Button mounted in DOM');

    // 2. Normal cursor verification
    const bodyCursor = await page.evaluate(() => window.getComputedStyle(document.body).cursor);
    assert(bodyCursor === 'auto' || bodyCursor === 'default', 'Normal browser cursor preserved on body');

    // 3. Click button to open panel
    await button.click();
    await new Promise((r) => setTimeout(r, 400));

    const dialog = await page.$('div[role="dialog"]');
    assert(dialog !== null, 'Assistant Chat Panel opens on button click');

    // 4. Verify Welcome Message & Suggested Chips
    const chipsCount = await page.$$eval('div[role="dialog"] button', (btns) => btns.length);
    assert(chipsCount >= 2, `Interactive buttons/chips rendered in chat panel (found ${chipsCount})`);

    // 5. Test Escape key to close
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    const dialogAfterEsc = await page.$('div[role="dialog"]');
    assert(dialogAfterEsc === null, 'Escape key smoothly closes assistant panel');

    // 6. Test Mobile Viewport (iPhone 390x844)
    await page.setViewport({ width: 390, height: 844 });
    const mobileBtn = await page.$('button[aria-label="Open Nizam Nawabs AI Assistant"]');
    await mobileBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    const mobileDialog = await page.$('div[role="dialog"]');
    assert(mobileDialog !== null, 'Mobile Bottom Sheet opens smoothly on mobile viewport');

    // Verify close button works on mobile
    const closeBtn = await page.$('button[aria-label="Close assistant"]');
    assert(closeBtn !== null, 'Mobile close button present');
    await closeBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    const mobileDialogAfterClose = await page.$('div[role="dialog"]');
    assert(mobileDialogAfterClose === null, 'Close button dismisses mobile bottom sheet');

  } catch (err) {
    console.error('UI test error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} AI ASSISTANT TESTS PASSED SUCCESSFULLY!`);
  } else {
    console.log(`❌ FAILED ${failed} TESTS (${passed} passed)`);
  }
  console.log('========================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runAIAssistantTests();
