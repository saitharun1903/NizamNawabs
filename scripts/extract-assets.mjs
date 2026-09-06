import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const screenshotPath = 'C:\\Users\\SaiTh\\OneDrive\\Pictures\\Screenshots\\Screenshot 2026-09-06 112505.png';
const outputDir = path.resolve('public/brand');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function extract() {
  const metadata = await sharp(screenshotPath).metadata();
  console.log('Screenshot dimensions:', metadata.width, 'x', metadata.height);
  const W = metadata.width;
  const H = metadata.height;

  await sharp(screenshotPath).toFile(path.join(outputDir, 'reference-full.png'));

  const crops = [
    {
      name: 'logo-crest.png',
      extract: {
        left: Math.round(W * 0.260),
        top: Math.round(H * 0.145),
        width: Math.round(W * 0.100),
        height: Math.round(H * 0.180),
      }
    },
    {
      name: 'highlight-season1.png',
      extract: {
        left: Math.round(W * 0.275),
        top: Math.round(H * 0.510),
        width: Math.round(W * 0.055),
        height: Math.round(H * 0.100),
      }
    },
    {
      name: 'highlight-auction.png',
      extract: {
        left: Math.round(W * 0.340),
        top: Math.round(H * 0.510),
        width: Math.round(W * 0.055),
        height: Math.round(H * 0.100),
      }
    },
    {
      name: 'post-journey-players.png',
      extract: {
        left: Math.round(W * 0.305),
        top: Math.round(H * 0.730),
        width: Math.round(W * 0.185),
        height: Math.round(H * 0.270),
      }
    },
    {
      name: 'post-retention-challenge.png',
      extract: {
        left: Math.round(W * 0.490),
        top: Math.round(H * 0.730),
        width: Math.round(W * 0.185),
        height: Math.round(H * 0.270),
      }
    },
    {
      name: 'post-mvp.png',
      extract: {
        left: Math.round(W * 0.675),
        top: Math.round(H * 0.730),
        width: Math.round(W * 0.185),
        height: Math.round(H * 0.270),
      }
    }
  ];

  for (const crop of crops) {
    try {
      await sharp(screenshotPath)
        .extract(crop.extract)
        .toFile(path.join(outputDir, crop.name));
      console.log('Saved:', crop.name);
    } catch (err) {
      console.error('Error cropping', crop.name, err.message);
    }
  }

  console.log('Finished asset extraction');
}

extract().catch(console.error);
