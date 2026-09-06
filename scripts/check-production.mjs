const routes = [
  '/',
  '/team',
  '/roster',
  '/matches',
  '/journey',
  '/gallery',
  '/news',
  '/contact',
  '/admin',
  '/api/auth/me'
];

async function run() {
  for (const r of routes) {
    try {
      const res = await fetch('https://www.lunor.co.in' + r);
      const text = await res.text();
      const digests = (text.match(/"digest":"([^"]+)"/g) || []).map(d => d.replace(/"digest":"|"/g, ''));
      const hasError = text.includes('__next_error__') || text.includes('Application error');
      console.log(r.padEnd(16), 'Status:', res.status, 'HasError:', hasError, 'Digests:', digests);
    } catch (err) {
      console.error(r, 'Fetch error:', err.message);
    }
  }
}

run();
