// Generates public/og-image.png (1200x630) for social-share link previews.
// Requires sharp: `npm install -D sharp && node scripts/generate-ogp-image.mjs && npm uninstall sharp`
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 1200
const HEIGHT = 630
const ICON_SIZE = 380
const ICON_X = 80
const ICON_Y = (HEIGHT - ICON_SIZE) / 2
const FONT = "'Hiragino Sans', 'Noto Sans JP', sans-serif"

const backgroundSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1c1f"/>
      <stop offset="55%" stop-color="#15151a"/>
      <stop offset="100%" stop-color="#0e0e0f"/>
    </linearGradient>
    <radialGradient id="glow" cx="25%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#2a3f63"/>
      <stop offset="55%" stop-color="#16233a"/>
      <stop offset="100%" stop-color="#0e0e0f" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="${ICON_X + ICON_SIZE / 2}" cy="${HEIGHT / 2}" r="380" fill="url(#glow)"/>
  <text x="540" y="290" font-family="${FONT}" font-size="76" font-weight="700" fill="#f5f5f6">テキトー占い</text>
  <text x="540" y="350" font-family="${FONT}" font-size="32" font-weight="400" fill="#c7c7cc">今日やってみる、小さな行動占い</text>
</svg>
`

const iconPath = path.join(ROOT, 'public/icons/icon-512.png')
const outPath = path.join(ROOT, 'public/og-image.png')

const roundedMask = Buffer.from(
  `<svg width="${ICON_SIZE}" height="${ICON_SIZE}"><rect width="${ICON_SIZE}" height="${ICON_SIZE}" rx="72" fill="#fff"/></svg>`,
)

const icon = await sharp(iconPath)
  .resize(ICON_SIZE, ICON_SIZE)
  .composite([{ input: roundedMask, blend: 'dest-in' }])
  .png()
  .toBuffer()

await sharp(Buffer.from(backgroundSvg))
  .composite([{ input: icon, left: ICON_X, top: Math.round(ICON_Y) }])
  .png()
  .toFile(outPath)

console.log('Generated public/og-image.png')
