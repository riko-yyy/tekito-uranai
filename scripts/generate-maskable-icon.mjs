// One-off: builds the maskable variant of public/favicon.svg by shrinking the
// foreground toward center so it survives Android's adaptive-icon safe zone.
// Requires sharp: `npm install -D sharp && node scripts/generate-maskable-icon.mjs && npm uninstall sharp`
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const srcSvg = readFileSync(path.join(ROOT, 'public/favicon.svg'), 'utf-8')

const bgEnd = srcSvg.indexOf('<circle cx="512" cy="400" r="420"')
const bgCloseIdx = srcSvg.indexOf('/>', bgEnd) + 2
const head = srcSvg.slice(0, bgCloseIdx)
const foreground = srcSvg.slice(bgCloseIdx, srcSvg.lastIndexOf('</svg>'))

const maskableSvg = `${head}<g transform="translate(512 512) scale(0.62) translate(-512 -512)">${foreground}</g></svg>`

writeFileSync(path.join(ROOT, 'public/icons/icon-maskable-512.svg'), maskableSvg)

await sharp(Buffer.from(maskableSvg))
  .resize(512, 512)
  .png()
  .toFile(path.join(ROOT, 'public/icons/icon-maskable-512.png'))

console.log('Generated public/icons/icon-maskable-512.png')
