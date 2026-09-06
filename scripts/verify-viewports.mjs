import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\SaiTh\\.gemini\\antigravity\\brain\\717bfe38-2eb9-4d65-85b2-c4be7db8f13b\\.tempmediaStorage';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'iPhone-SE-320', width: 320, height: 568 },
  { name: 'Galaxy-S8-360', width: 360, height: 740 },
  { name: 'iPhone-Mini-375', width: 375, height: 667 },
  { name: 'iPhone-14-390', width: 390, height: 844 },
  { name: 'iPhone-Plus-414', width: 414, height: 896 },
  { name: 'iPhone-ProMax-430', width: 430, height: 932 },
  { name: 'Small-Tablet-600', width: 600, height: 960 },
  { name: 'iPad-Portrait-768', width: 768, height: 1024 },
  { name: 'iPad-Air-820', width: 820, height: 1180 },
  { name: 'iPad-Pro-1024', width: 1024, height: 1366 },
  { name: 'Small-Desktop-1280', width: 1280, height: 800 },
  { name: 'Standard-Desktop-1440', width: 1440, height: 900 },
  { name: 'Large-Desktop-1600', width: 1600, height: 1000 },
  { name: 'FullHD-Desktop-1920', width: 1920, height: 1080 },
];

const PAGES_TO_TEST = [
  { path: '/', name: 'home' },
  { path: '/team', name: 'team' },
  { path: '/roster', name: 'roster' },
  { path: '/matches', name: 'matches' },
  { path: '/journey', name: 'journey' },
  { path: '/gallery', name: 'gallery' },
  { path: '/news', name: 'news' },
  { path: '/contact', name: 'contact' },
];

async function runVerification() {
  console.log('🚀 Starting Multi-Viewport Responsive Verification...\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  try {
    const page = await browser.newPage();

    console.log('=== CHECK 1: ZERO HORIZONTAL OVERFLOW ON HOMEPAGE ===');
    for (const vp of VIEWPORTS) {
      totalTests++;
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 400));

      const overflowData = await page.evaluate(() => {
        const docEl = document.documentElement;
        const scrollW = docEl.scrollWidth;
        const clientW = docEl.clientWidth;
        const bodyScrollW = document.body.scrollWidth;
        return {
          scrollW,
          clientW,
          bodyScrollW,
          hasOverflow: scrollW > clientW || bodyScrollW > clientW,
        };
      });

      if (!overflowData.hasOverflow) {
        console.log(`  [PASS] ${vp.name.padEnd(22)} (${vp.width}x${vp.height}): 0 horizontal overflow (scrollWidth=${overflowData.scrollW}, clientWidth=${overflowData.clientW})`);
        passedTests++;
      } else {
        console.error(`  [FAIL] ${vp.name.padEnd(22)} (${vp.width}x${vp.height}): OVERFLOW DETECTED! scrollWidth=${overflowData.scrollW} > clientWidth=${overflowData.clientW}`);
        failedTests++;
      }
    }

    console.log('\n=== CHECK 2: ZERO HORIZONTAL OVERFLOW ACROSS ALL PUBLIC SUBPAGES (360px) ===');
    await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 1 });
    for (const p of PAGES_TO_TEST) {
      totalTests++;
      await page.goto(`http://localhost:3000${p.path}`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 300));

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (!overflow) {
        console.log(`  [PASS] Page ${p.name.padEnd(10)} (${p.path}): No horizontal overflow`);
        passedTests++;
      } else {
        console.error(`  [FAIL] Page ${p.name.padEnd(10)} (${p.path}): Overflow detected at 360px!`);
        failedTests++;
      }
    }

    console.log('\n=== CHECK 3: MOBILE NAVIGATION DRAWER & ACCESSIBILITY ===');
    totalTests++;
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('nizam_intro_seen', 'true');
    });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));

    const menuBtn = await page.$('button[aria-label="Open Navigation Menu"]');
    if (menuBtn) {
      console.log('  [PASS] Hamburger button rendered with aria-label="Open Navigation Menu"');
      passedTests++;
    } else {
      console.error('  [FAIL] Hamburger button not found!');
      failedTests++;
    }

    totalTests++;
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 400));

    const overlayState = await page.evaluate(() => {
      const overlay = document.querySelector('div[role="dialog"][aria-label="Site Navigation"]');
      const isLocked = document.body.style.overflow === 'hidden';
      const navLinks = overlay ? overlay.querySelectorAll('nav a').length : 0;
      return { hasOverlay: !!overlay, isLocked, navLinks };
    });

    if (overlayState.hasOverlay && overlayState.isLocked && overlayState.navLinks >= 8) {
      console.log(`  [PASS] Mobile overlay opened successfully: body overflow=hidden, ${overlayState.navLinks} indexed navigation links present`);
      passedTests++;
    } else {
      console.error('  [FAIL] Mobile overlay issue:', overlayState);
      failedTests++;
    }

    const navScreenshotPath = path.join(SCREENSHOT_DIR, 'mobile-nav-overlay.png');
    await page.screenshot({ path: navScreenshotPath });
    console.log(`  [INFO] Captured mobile navigation screenshot: ${navScreenshotPath}`);

    totalTests++;
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
    const isClosed = await page.evaluate(() => {
      const overlay = document.querySelector('div[role="dialog"][aria-label="Site Navigation"]');
      return !overlay && document.body.style.overflow === '';
    });

    if (isClosed) {
      console.log('  [PASS] Mobile overlay dismissed on Escape key, body scroll restored');
      passedTests++;
    } else {
      console.error('  [FAIL] Mobile overlay failed to close on Escape!');
      failedTests++;
    }

    console.log('\n=== CHECK 4: DESKTOP NAVIGATION & DESKTOP COMPOSITION (1440px) ===');
    totalTests++;
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));

    const desktopNavState = await page.evaluate(() => {
      const desktopNav = document.querySelector('nav.hidden.lg\\:flex');
      const mobileBtn = document.querySelector('button[aria-label="Open Navigation Menu"]');
      const mobileBtnVisible = mobileBtn && window.getComputedStyle(mobileBtn.parentElement).display !== 'none';
      return { hasDesktopNav: !!desktopNav, mobileBtnVisible };
    });

    if (desktopNavState.hasDesktopNav && !desktopNavState.mobileBtnVisible) {
      console.log('  [PASS] Desktop navigation links displayed; mobile menu button cleanly hidden on desktop (>= 1024px)');
      passedTests++;
    } else {
      console.error('  [FAIL] Desktop navigation visibility incorrect:', desktopNavState);
      failedTests++;
    }

    console.log('\n=== CHECK 5: NORMAL BROWSER CURSOR INTEGRITY ===');
    totalTests++;
    const cursorCheck = await page.evaluate(() => {
      const bodyCursor = window.getComputedStyle(document.body).cursor;
      const customCursorDiv = document.querySelector('.custom-cursor, [data-custom-cursor]');
      return { bodyCursor, hasCustomCursorDiv: !!customCursorDiv };
    });

    if (!cursorCheck.hasCustomCursorDiv && cursorCheck.bodyCursor === 'auto') {
      console.log(`  [PASS] Default browser cursor preserved: body cursor=${cursorCheck.bodyCursor}, 0 custom cursor overlays`);
      passedTests++;
    } else {
      console.error('  [FAIL] Custom cursor detected or abnormal cursor:', cursorCheck);
      failedTests++;
    }

    console.log('\n=== CHECK 6: VISUAL AUDIT SCREENSHOTS ===');
    const screenshotTargets = [
      { name: 'responsive-mobile-390-hero', width: 390, height: 844 },
      { name: 'responsive-tablet-768-hero', width: 768, height: 1024 },
      { name: 'responsive-desktop-1440-hero', width: 1440, height: 900 },
    ];

    for (const target of screenshotTargets) {
      await page.setViewport({ width: target.width, height: target.height, deviceScaleFactor: 1 });
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 600));
      const ssPath = path.join(SCREENSHOT_DIR, `${target.name}.png`);
      await page.screenshot({ path: ssPath, fullPage: false });
      console.log(`  [INFO] Saved screenshot: ${target.name}.png`);
    }

  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log(`TEST SUMMARY: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('========================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
