// Regenerates the placeholder PWA icons. Requires sharp: `npm install -D sharp && node scripts/generate-icons.mjs && npm uninstall sharp`
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const OUT_DIR = fileURLToPath(new URL('../public/icons/', import.meta.url))
mkdirSync(OUT_DIR, { recursive: true })

const BG = '#141416'
const GOLD = '#e0b84a'

function starPoints(cx, cy, outerR, innerR) {
  const points = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (Math.PI / 5) * i - Math.PI / 2
    points.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`)
  }
  return points.join(' ')
}

function svg({ rounded, outerR }) {
  const bg = rounded
    ? `<rect width="512" height="512" rx="96" fill="${BG}"/>`
    : `<rect width="512" height="512" fill="${BG}"/>`
  const star = `<polygon points="${starPoints(256, 256, outerR, outerR * 0.42)}" fill="${GOLD}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${bg}${star}</svg>`
}

const anySvg = svg({ rounded: true, outerR: 150 })
const maskableSvg = svg({ rounded: false, outerR: 95 })

await sharp(Buffer.from(anySvg)).resize(192, 192).png().toFile(path.join(OUT_DIR, 'icon-192.png'))
await sharp(Buffer.from(anySvg)).resize(512, 512).png().toFile(path.join(OUT_DIR, 'icon-512.png'))
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(path.join(OUT_DIR, 'icon-maskable-512.png'))
await sharp(Buffer.from(anySvg)).resize(180, 180).png().toFile(path.join(OUT_DIR, 'apple-touch-icon.png'))

console.log('Generated placeholder icons in public/icons/')
