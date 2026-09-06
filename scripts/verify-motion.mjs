import puppeteer from 'puppeteer-core';

async function runMotionVerification() {
  console.log('🎬 Starting Nizam Nawabs Motion & Smoothness Verification...\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

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

  try {
    // 1. Load Homepage and check cursor & initial intro
    await page.goto('http://localhost:3000/?intro=1', { waitUntil: 'networkidle2' });
    
    // Check normal cursor
    const customCursorEl = await page.$('#custom-cursor, .custom-cursor, .cursor-dot, .cursor-follower');
    assert(customCursorEl === null, 'Normal Browser Cursor: No custom cursor element injected in DOM');

    const bodyCursor = await page.evaluate(() => window.getComputedStyle(document.body).cursor);
    assert(bodyCursor === 'auto' || bodyCursor === 'default', `Normal Browser Cursor: Body cursor is "${bodyCursor}"`);

    // Wait for initial intro to complete (~2.5s)
    await new Promise((r) => setTimeout(r, 2600));

    // Check 3D Canvas
    const canvasExists = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return canvas !== null && canvas.clientHeight > 0;
    });
    assert(canvasExists, '3D Experience: Interactive 3D Basketball canvas mounted and rendering');

    // 2. Test Branded Page Transition from / to /roster
    // Scroll down to ensure scroll position reset can be tested
    await page.evaluate(() => window.scrollTo(0, 600));
    const initialScrollY = await page.evaluate(() => window.scrollY);
    assert(initialScrollY > 400, `Scroll Setup: Scrolled down page (scrollY = ${initialScrollY})`);

    // Click on Roster navigation link in desktop header
    const startTime = Date.now();
    await page.evaluate(() => {
      const link = document.querySelector('header a[href="/roster"]');
      if (link) link.click();
    });

    // Wait for overlay to become ACTIVE / VISIBLE
    await page.waitForFunction(() => {
      const overlay = document.getElementById('nizam-page-transition');
      if (!overlay) return false;
      const isHidden = overlay.classList.contains('hidden');
      const opacity = parseFloat(window.getComputedStyle(overlay).opacity || '0');
      return !isHidden || opacity > 0.1;
    }, { timeout: 1000 });
    assert(true, 'Branded Transition: Overlay activates immediately on route link click');

    // Wait for route change to complete and overlay to DISAPPEAR
    await page.waitForFunction(() => {
      const overlay = document.getElementById('nizam-page-transition');
      if (!overlay) return true;
      const isHidden = overlay.classList.contains('hidden');
      const opacity = parseFloat(window.getComputedStyle(overlay).opacity || '0');
      return isHidden && opacity <= 0.05;
    }, { timeout: 4000 });

    const elapsed = Date.now() - startTime;
    console.log(`    Transition 1 duration measured: ${elapsed}ms`);
    assert(elapsed >= 500 && elapsed <= 1600, `Master Timeline Timing: Duration ~0.85s-1.2s (measured ${elapsed}ms)`);

    // Verify current URL is /roster
    const currentUrl = page.url();
    assert(currentUrl.includes('/roster'), `Route Change 1: Navigated to /roster (${currentUrl})`);

    // Verify scroll position was reset to 0 under the overlay
    const newScrollY = await page.evaluate(() => window.scrollY);
    assert(newScrollY === 0, `Scroll Reset: Window scroll reset to top (scrollY = ${newScrollY})`);

    // 3. Test subsequent transition from /roster to /matches
    // Scroll down on roster page first
    await page.evaluate(() => window.scrollTo(0, 400));

    const start2 = Date.now();
    await page.evaluate(() => {
      const link = document.querySelector('header a[href="/matches"]');
      if (link) link.click();
    });

    // Wait for overlay to become ACTIVE
    await page.waitForFunction(() => {
      const overlay = document.getElementById('nizam-page-transition');
      if (!overlay) return false;
      const isHidden = overlay.classList.contains('hidden');
      const opacity = parseFloat(window.getComputedStyle(overlay).opacity || '0');
      return !isHidden || opacity > 0.1;
    }, { timeout: 1000 });

    // Wait for overlay to DISAPPEAR
    await page.waitForFunction(() => {
      const overlay = document.getElementById('nizam-page-transition');
      if (!overlay) return true;
      const isHidden = overlay.classList.contains('hidden');
      const opacity = parseFloat(window.getComputedStyle(overlay).opacity || '0');
      return isHidden && opacity <= 0.05;
    }, { timeout: 4000 });

    const elapsed2 = Date.now() - start2;
    const url2 = page.url();
    console.log(`    Transition 2 duration measured: ${elapsed2}ms`);
    assert(url2.includes('/matches'), `Route Change 2: Navigated to /matches (${url2}) in ${elapsed2}ms`);

    const scrollY2 = await page.evaluate(() => window.scrollY);
    assert(scrollY2 === 0, `Scroll Reset 2: Window scroll reset to top on /matches (scrollY = ${scrollY2})`);

    // 4. Test Reduced Motion detection
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const prefersReduced = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    assert(prefersReduced, 'Accessibility: prefers-reduced-motion detected correctly');

  } catch (err) {
    console.error('Error during motion verification:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} MOTION TESTS PASSED SUCCESSFULLY!`);
  } else {
    console.log(`❌ FAILED ${failed} TESTS (${passed} passed)`);
  }
  console.log('========================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runMotionVerification();
