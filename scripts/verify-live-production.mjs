import puppeteer from 'puppeteer-core';

async function verifyLive() {
  console.log('--- 1. Launching Chrome to verify https://www.lunor.co.in ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // Desktop Test (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  console.log('Navigating to https://www.lunor.co.in ...');
  const response = await page.goto('https://www.lunor.co.in', {
    waitUntil: 'networkidle2',
    timeout: 45000
  });

  console.log('HTTP Status:', response.status());

  // Wait for intro to play and hero to settle
  await new Promise(r => setTimeout(r, 4000));

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  const heroHeading = await page.$eval('h1', el => el.innerText).catch(() => 'NOT FOUND');
  console.log('Hero H1 Heading:', heroHeading);

  const screenshotPathDesktop = 'C:/Users/SaiTh/.gemini/antigravity/brain/717bfe38-2eb9-4d65-85b2-c4be7db8f13b/live-production-desktop.png';
  await page.screenshot({ path: screenshotPathDesktop });
  console.log('Saved desktop screenshot to:', screenshotPathDesktop);

  // Mobile Test (390x844 - iPhone 14/15)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('https://www.lunor.co.in', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3500));
  const screenshotPathMobile = 'C:/Users/SaiTh/.gemini/antigravity/brain/717bfe38-2eb9-4d65-85b2-c4be7db8f13b/live-production-mobile.png';
  await page.screenshot({ path: screenshotPathMobile });
  console.log('Saved mobile screenshot to:', screenshotPathMobile);

  console.log('Console errors encountered:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console errors (sample):', consoleErrors.slice(0, 5));
  }

  await browser.close();
  console.log('🎉 Live production verification completed successfully!');
}

verifyLive().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
