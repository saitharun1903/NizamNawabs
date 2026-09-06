import sharp from 'sharp';
import path from 'path';

const journeyImg = path.resolve('public/brand/post-journey-players.png');
const outputDir = path.resolve('public/brand');

async function cropPlayers() {
  const meta = await sharp(journeyImg).metadata();
  const W = meta.width;
  const H = meta.height;

  // Crop individual players
  // Left player:
  await sharp(journeyImg)
    .extract({
      left: 0,
      top: Math.round(H * 0.45),
      width: Math.round(W * 0.38),
      height: Math.round(H * 0.55),
    })
    .toFile(path.join(outputDir, 'player-1.png'));

  // Center player:
  await sharp(journeyImg)
    .extract({
      left: Math.round(W * 0.28),
      top: Math.round(H * 0.36),
      width: Math.round(W * 0.44),
      height: Math.round(H * 0.64),
    })
    .toFile(path.join(outputDir, 'player-2.png'));

  // Right player:
  await sharp(journeyImg)
    .extract({
      left: Math.round(W * 0.62),
      top: Math.round(H * 0.42),
      width: Math.round(W * 0.38),
      height: Math.round(H * 0.58),
    })
    .toFile(path.join(outputDir, 'player-3.png'));

  console.log('Player crops saved!');
}

cropPlayers().catch(console.error);
