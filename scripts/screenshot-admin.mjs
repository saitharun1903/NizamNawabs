import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });

// Authenticate via API
const loginRes = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@nizamnawabs.com', password: 'admin@nizam2025' }),
});

const cookieHeader = loginRes.headers.get('set-cookie');
const tokenMatch = cookieHeader ? cookieHeader.match(/nawabs_admin_session=([^;]+)/) : null;
const token = tokenMatch ? tokenMatch[1] : '';

if (token) {
  await page.setCookie({
    name: 'nawabs_admin_session',
    value: token,
    domain: 'localhost',
    path: '/',
  });
}

await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 600));

await page.screenshot({
  path: 'C:\\Users\\SaiTh\\.gemini\\antigravity\\brain\\717bfe38-2eb9-4d65-85b2-c4be7db8f13b\\.tempmediaStorage\\admin-mobile-dashboard.png',
  fullPage: false,
});

// Also open the mobile drawer in admin
const adminMenuBtn = await page.$('button[aria-label="Toggle Navigation Menu"]');
if (adminMenuBtn) {
  await adminMenuBtn.click();
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: 'C:\\Users\\SaiTh\\.gemini\\antigravity\\brain\\717bfe38-2eb9-4d65-85b2-c4be7db8f13b\\.tempmediaStorage\\admin-mobile-drawer.png',
    fullPage: false,
  });
}

await browser.close();
console.log('Admin mobile screenshots captured successfully');
