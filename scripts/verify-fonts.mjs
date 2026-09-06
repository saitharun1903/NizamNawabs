async function verifyFonts() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  const cssMatches = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map(m => m[1]);
  console.log('Found CSS files:', cssMatches.length);

  for (const href of cssMatches) {
    const cssRes = await fetch(`http://localhost:3000${href}`);
    const cssText = await cssRes.text();
    console.log(`CSS File: ${href}`);
    console.log('  - Barlow Condensed defined:', cssText.includes('Barlow Condensed'));
    console.log('  - Manrope defined:', cssText.includes('Manrope'));
    console.log('  - --font-barlow-condensed defined:', cssText.includes('--font-barlow-condensed'));
    console.log('  - --font-manrope defined:', cssText.includes('--font-manrope'));
  }
}

verifyFonts().catch(console.error);
