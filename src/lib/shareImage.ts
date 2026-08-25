import type { Action } from '../data/types'

const WIDTH = 1080
const HEIGHT = 1080
const FONT_FAMILY = '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif'

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const char of text) {
    const candidate = current + char
    if (current && ctx.measureText(candidate).width > maxWidth) {
      lines.push(current)
      current = char
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${src}`))
    img.src = src
  })
}

interface ShareImageParams {
  action: Action
  categoryLabel: string
  dateLabel: string
}

export async function generateShareImage({ action, categoryLabel, dateLabel }: ShareImageParams): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')

  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  bg.addColorStop(0, '#1c1c1f')
  bg.addColorStop(0.55, '#15151a')
  bg.addColorStop(1, '#0e0e0f')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.36, 0, WIDTH / 2, HEIGHT * 0.36, WIDTH * 0.65)
  glow.addColorStop(0, '#2a3f63')
  glow.addColorStop(0.55, '#16233a')
  glow.addColorStop(1, 'rgba(14,14,15,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  try {
    const logo = await loadImage('/icons/icon-512.png')
    const logoSize = 140
    ctx.drawImage(logo, (WIDTH - logoSize) / 2, 90, logoSize, logoSize)
  } catch {
    /* logo is a decorative nice-to-have; skip if it fails to load */
  }

  ctx.textAlign = 'center'

  ctx.fillStyle = '#85858c'
  ctx.font = `400 32px ${FONT_FAMILY}`
  ctx.fillText(`${dateLabel}の運勢`, WIDTH / 2, 320)

  ctx.fillStyle = '#f5f5f6'
  ctx.font = `700 64px ${FONT_FAMILY}`
  ctx.fillText(`今日は"${categoryLabel}"の日`, WIDTH / 2, 400)

  ctx.font = `400 38px ${FONT_FAMILY}`
  ctx.fillStyle = '#c7c7cc'
  const maxTextWidth = WIDTH - 200
  const lines = [...wrapText(ctx, action.text, maxTextWidth), ...wrapText(ctx, action.reason, maxTextWidth)]
  let y = 520
  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y)
    y += 56
  }

  y += 40
  ctx.font = `600 34px ${FONT_FAMILY}`
  ctx.fillStyle = '#e0b84a'
  const stars = '★'.repeat(action.actionRating) + '☆'.repeat(5 - action.actionRating)
  ctx.fillText(`行動運 ${stars}`, WIDTH / 2, y)

  y += 64
  ctx.fillStyle = '#c7c7cc'
  ctx.fillText(`ラッキーカラー ${action.luckyColor}`, WIDTH / 2, y)

  ctx.font = `500 36px ${FONT_FAMILY}`
  ctx.fillStyle = '#7ab8ec'
  ctx.fillText('テキトー占い', WIDTH / 2, HEIGHT - 100)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('canvas toBlob failed'))
      },
      'image/jpeg',
      0.9,
    )
  })
}
