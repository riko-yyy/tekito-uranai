// Regenerates all icon sizes from public/favicon.svg with the foreground artwork
// scaled up (the omikuji + sparkle only took up ~20% of the canvas width originally,
// which read as "too small" once launchers crop/mask the icon).
// Requires sharp: `npm install -D sharp && node scripts/generate-maskable-icon.mjs && npm uninstall sharp`
// Note: this overwrites public/favicon.svg with the scaled result, so re-running it
// against its own output will compound the scale — only run it once per intended change.
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

function scaledSvg(scale) {
  return `${head}<g transform="translate(512 512) scale(${scale}) translate(-512 -512)">${foreground}</g></svg>`
}

const ANY_SCALE = 1.8
const MASKABLE_SCALE = 1.3

const anySvg = scaledSvg(ANY_SCALE)
const maskableSvg = scaledSvg(MASKABLE_SCALE)

writeFileSync(path.join(ROOT, 'public/favicon.svg'), anySvg)

const iconsDir = path.join(ROOT, 'public/icons')
await sharp(Buffer.from(anySvg)).resize(1024, 1024).png().toFile(path.join(iconsDir, 'icon-1024.png'))
await sharp(Buffer.from(anySvg)).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'))
await sharp(Buffer.from(anySvg)).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'))
await sharp(Buffer.from(anySvg)).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'))
await sharp(Buffer.from(anySvg)).resize(152, 152).png().toFile(path.join(iconsDir, 'apple-touch-icon-152.png'))
await sharp(Buffer.from(anySvg)).resize(120, 120).png().toFile(path.join(iconsDir, 'apple-touch-icon-120.png'))
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-maskable-512.png'))

console.log('Regenerated favicon.svg and all icons in public/icons/')
