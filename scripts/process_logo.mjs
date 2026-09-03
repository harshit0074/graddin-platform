import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');

const srcImg = 'C:/Users/harsh/.gemini/antigravity-ide/brain/3c0edc86-15da-433d-a94f-1704509e143b/.user_uploaded/media_1788479505094.jpg';

async function main() {
  const metadata = await sharp(srcImg).metadata();
  console.log('Original image dimensions:', metadata.width, metadata.height);

  const trimmed = await sharp(srcImg).trim({ threshold: 25 }).toBuffer({ resolveWithObject: true });
  console.log('Trimmed dimensions:', trimmed.info.width, trimmed.info.height);

  const maxDim = Math.max(trimmed.info.width, trimmed.info.height);
  const padding = Math.round(maxDim * 0.18);
  const squareSize = maxDim + padding * 2;

  // Rich dark warm background
  const squareBlackBuffer = await sharp(trimmed.data)
    .extend({
      top: Math.round((squareSize - trimmed.info.height) / 2),
      bottom: Math.round((squareSize - trimmed.info.height) / 2),
      left: Math.round((squareSize - trimmed.info.width) / 2),
      right: Math.round((squareSize - trimmed.info.width) / 2),
      background: { r: 15, g: 10, b: 7, alpha: 1 }
    })
    .toBuffer();

  // Save 512x512 icon.png for Next.js App Router
  const icon512 = await sharp(squareBlackBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(webRoot, 'src/app/icon.png'), icon512);
  fs.writeFileSync(path.join(webRoot, 'public/icon-512.png'), icon512);

  // Save 192x192 icon for PWA
  const icon192 = await sharp(squareBlackBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(webRoot, 'public/icon-192.png'), icon192);

  // Save 180x180 apple-icon.png
  const appleIcon = await sharp(squareBlackBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(webRoot, 'src/app/apple-icon.png'), appleIcon);
  fs.writeFileSync(path.join(webRoot, 'public/apple-touch-icon.png'), appleIcon);

  // Save 32x32 and 16x16
  const icon32 = await sharp(squareBlackBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(webRoot, 'public/favicon-32x32.png'), icon32);
  const icon16 = await sharp(squareBlackBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(webRoot, 'public/favicon-16x16.png'), icon16);

  // Save favicon.ico
  fs.writeFileSync(path.join(webRoot, 'src/app/favicon.ico'), icon32);
  fs.writeFileSync(path.join(webRoot, 'public/favicon.ico'), icon32);

  // Also save logo.png in public
  fs.writeFileSync(path.join(webRoot, 'public/logo.png'), icon512);
  fs.copyFileSync(srcImg, path.join(webRoot, 'public/logo-full.jpg'));

  console.log('✅ Generated all favicon and logo assets successfully!');
}

main().catch(console.error);
