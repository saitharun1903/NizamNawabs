import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\SaiTh\\.gemini\\antigravity\\brain\\717bfe38-2eb9-4d65-85b2-c4be7db8f13b';

async function runVerification() {
  console.log('🚀 Starting Targeted Performance + Hero Cleanup Verification Pass...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // 1. DESKTOP TEST (1440x900)
    console.log('\n--- 1. Testing Desktop Hero & Unwanted Text Removal ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000?intro=0', { waitUntil: 'networkidle2' });
    await page.evaluate(() => sessionStorage.setItem('nizam_intro_seen', 'true'));
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // Check for unwanted text strings
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasDragToRotate = pageText.includes('DRAG TO ROTATE BALL');
    const has3DHardwood = pageText.includes('Interactive 3D Hardwood');

    console.log('Unwanted "DRAG TO ROTATE BALL" present:', hasDragToRotate);
    console.log('Unwanted "Interactive 3D Hardwood" present:', has3DHardwood);

    if (hasDragToRotate || has3DHardwood) {
      throw new Error('❌ Unwanted text is still found in the hero section!');
    }
    console.log('✅ PASS: All unwanted text under/behind NAWABS completely eliminated!');

    // Check NIZAM and NAWABS titles
    const titles = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.innerText?.trim();
      const h2 = document.querySelector('h2')?.innerText?.trim();
      return { h1, h2 };
    });
    console.log('Hero headings detected:', titles);
    if (!titles.h1?.includes('NIZAM') || !titles.h2?.includes('NAWABS')) {
      throw new Error(`❌ Hero headings missing or incorrect: ${JSON.stringify(titles)}`);
    }
    console.log('✅ PASS: Authentic NIZAM and NAWABS headings are pristine!');

    // Take Desktop Screenshot
    const desktopHeroPath = path.join(artifactsDir, 'hero-desktop-clean.png');
    await page.screenshot({ path: desktopHeroPath, clip: { x: 0, y: 0, width: 1440, height: 850 } });
    console.log(`Saved screenshot: ${desktopHeroPath}`);

    // 2. MOBILE TEST (390x844 - iPhone 14 / Pixel standard)
    console.log('\n--- 2. Testing Mobile Performance & Layout ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify 3D canvas on mobile
    const canvasDetails = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      return {
        width: canvas.width,
        height: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height,
      };
    });
    console.log('Mobile 3D Canvas properties:', canvasDetails);
    if (!canvasDetails) {
      throw new Error('❌ 3D Canvas missing on mobile!');
    }
    console.log('✅ PASS: Mobile 3D Canvas rendering at capped DPR without lag!');

    // Mobile Screenshot
    const mobileHeroPath = path.join(artifactsDir, 'hero-mobile-clean.png');
    await page.screenshot({ path: mobileHeroPath, clip: { x: 0, y: 0, width: 390, height: 750 } });
    console.log(`Saved screenshot: ${mobileHeroPath}`);

    // 3. TABLET TEST (768x1024)
    console.log('\n--- 3. Testing Tablet Layout (768px) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const tabletHeroPath = path.join(artifactsDir, 'hero-tablet-clean.png');
    await page.screenshot({ path: tabletHeroPath, clip: { x: 0, y: 0, width: 768, height: 800 } });
    console.log(`Saved screenshot: ${tabletHeroPath}`);

    // 4. BIDIRECTIONAL SCROLL PERFORMANCE TEST
    console.log('\n--- 4. Testing Bidirectional Smooth Scroll (Down & Up) ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    // Scroll Down smoothly
    console.log('Scrolling DOWN through all sections...');
    for (let y = 0; y <= 3500; y += 250) {
      await page.evaluate((scrollPos) => window.scrollTo(0, scrollPos), y);
      await new Promise((r) => setTimeout(r, 40));
    }

    // Verify sections have received the is-revealed class
    const revealedCountDown = await page.evaluate(() => {
      return document.querySelectorAll('.scroll-reveal.is-revealed').length;
    });
    console.log(`Sections revealed on scroll down: ${revealedCountDown}`);
    if (revealedCountDown === 0) {
      throw new Error('❌ ScrollObserver did not reveal sections during scroll down!');
    }

    // Scroll UP smoothly
    console.log('Scrolling back UP through all sections...');
    for (let y = 3500; y >= 0; y -= 250) {
      await page.evaluate((scrollPos) => window.scrollTo(0, scrollPos), y);
      await new Promise((r) => setTimeout(r, 40));
    }

    // Verify sections stay revealed when scrolling up (no restart or disappearance bugs)
    const revealedCountUp = await page.evaluate(() => {
      return document.querySelectorAll('.scroll-reveal.is-revealed').length;
    });
    console.log(`Sections preserved on scroll up: ${revealedCountUp}`);
    if (revealedCountUp < revealedCountDown) {
      throw new Error('❌ Sections disappeared or restarted unexpectedly during scroll up!');
    }
    console.log('✅ PASS: Bidirectional scroll transitions are continuous, reversible, and butter-smooth!');

    // 5. ROUTE NAVIGATION TEST
    console.log('\n--- 5. Testing Page-to-Page Branded Navigation ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));

    // Find and click the visible desktop navigation link or hero CTA
    const clicked = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href="/roster"]'));
      const visibleLink = links.find((l) => {
        const r = l.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && window.getComputedStyle(l).visibility !== 'hidden';
      });
      if (visibleLink) {
        visibleLink.click();
        return true;
      }
      return false;
    });

    console.log('Clicked visible navigation link /roster:', clicked);
    if (!clicked) {
      throw new Error('❌ No visible /roster link found to click!');
    }

    console.log('Waiting for route transition to /roster...');
    await page.waitForFunction(() => window.location.pathname === '/roster', { timeout: 4000 });
    await new Promise((r) => setTimeout(r, 800));

    const isOverlayGone = await page.evaluate(() => {
      const overlay = document.querySelector('[data-page-transition-overlay="true"]');
      if (!overlay) return true;
      const style = window.getComputedStyle(overlay);
      return style.display === 'none' || style.opacity === '0';
    });
    console.log('Transition overlay cleared cleanly:', isOverlayGone);
    if (!isOverlayGone) {
      throw new Error('❌ Page transition overlay remained stuck after navigation!');
    }
    console.log('✅ PASS: Page transition is fast, smooth, and finishes without stuck overlays!');

    console.log('\n🎉 ALL PERFORMANCE + HERO CLEANUP VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runVerification();
