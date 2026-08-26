import type { Action } from '../data/types'

const WIDTH = 1080
const HEIGHT = 1080
const CENTER_X = WIDTH / 2
const FONT_FAMILY = '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif'

const LOGO_SIZE = 140
const MAX_TEXT_WIDTH = WIDTH - 220

// Baseline-to-baseline gaps. Kept as named constants and reused for both the
// height calculation and the actual draw pass, so they can't drift apart.
const GAP_LOGO_TO_BADGE = 46
const GAP_BADGE_TO_DATE = 46
const GAP_LOGO_TO_DATE = 56
const GAP_DATE_TO_HEADLINE = 74
const GAP_HEADLINE_TO_ACTION = 78
const ACTION_LINE_GAP = 58
const GAP_ACTION_TO_REASON = 46
const REASON_LINE_GAP = 44
const GAP_REASON_TO_PILLS = 64
const PILL_HEIGHT = 58
const GAP_PILLS_TO_FOOTER = 74
const BOTTOM_PAD = 26

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
  isCompleted: boolean
}

export async function generateShareImage({
  action,
  categoryLabel,
  dateLabel,
  isCompleted,
}: ShareImageParams): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')
  ctx.textAlign = 'center'

  // ---- background ----
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  bg.addColorStop(0, '#1c1c1f')
  bg.addColorStop(0.55, '#15151a')
  bg.addColorStop(1, '#0e0e0f')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.4, 0, WIDTH / 2, HEIGHT * 0.4, WIDTH * 0.65)
  if (isCompleted) {
    glow.addColorStop(0, '#3a3320')
    glow.addColorStop(0.55, '#231d10')
  } else {
    glow.addColorStop(0, '#2a3f63')
    glow.addColorStop(0.55, '#16233a')
  }
  glow.addColorStop(1, 'rgba(14,14,15,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // ---- measure text up front so the whole block can be vertically centered ----
  ctx.font = `500 42px ${FONT_FAMILY}`
  const actionLines = wrapText(ctx, action.text, MAX_TEXT_WIDTH)
  ctx.font = `400 30px ${FONT_FAMILY}`
  const reasonLines = wrapText(ctx, action.reason, MAX_TEXT_WIDTH)

  const stars = '★'.repeat(action.actionRating) + '☆'.repeat(5 - action.actionRating)
  const pill1Text = `行動運 ${stars}`
  const pill2Text = `ラッキーカラー ${action.luckyColor}`
  ctx.font = `600 30px ${FONT_FAMILY}`
  const pillPadX = 30
  const pillGap = 16
  const pill1Width = ctx.measureText(pill1Text).width + pillPadX * 2
  const pill2Width = ctx.measureText(pill2Text).width + pillPadX * 2
  const pillsTotalWidth = pill1Width + pillGap + pill2Width

  // ---- lay out baselines relative to 0, then shift the whole block to center it ----
  let y = LOGO_SIZE
  y += isCompleted ? GAP_LOGO_TO_BADGE : GAP_LOGO_TO_DATE
  const badgeY = y
  if (isCompleted) {
    y += GAP_BADGE_TO_DATE
  }
  const dateY = y
  y += GAP_DATE_TO_HEADLINE
  const headlineY = y
  y += GAP_HEADLINE_TO_ACTION
  const actionStartY = y
  y += (actionLines.length - 1) * ACTION_LINE_GAP
  y += GAP_ACTION_TO_REASON
  const reasonStartY = y
  y += (reasonLines.length - 1) * REASON_LINE_GAP
  y += GAP_REASON_TO_PILLS
  const pillsCenterY = y
  y += GAP_PILLS_TO_FOOTER
  const footerY = y

  const totalHeight = footerY + BOTTOM_PAD
  const startY = Math.max(24, (HEIGHT - totalHeight) / 2)
  const shift = (relY: number) => relY + startY

  // ---- logo + achievement badge ----
  const logoX = (WIDTH - LOGO_SIZE) / 2
  const logoY = startY
  try {
    const logo = await loadImage('/icons/icon-512.png')
    ctx.drawImage(logo, logoX, logoY, LOGO_SIZE, LOGO_SIZE)
  } catch {
    /* logo is a decorative nice-to-have; skip if it fails to load */
  }

  if (isCompleted) {
    const badgeR = 22
    const badgeCx = logoX + LOGO_SIZE - 6
    const badgeCy = logoY + LOGO_SIZE - 6
    ctx.beginPath()
    ctx.arc(badgeCx, badgeCy, badgeR, 0, Math.PI * 2)
    ctx.fillStyle = '#e0b84a'
    ctx.fill()
    ctx.strokeStyle = '#15151a'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(badgeCx - 10, badgeCy)
    ctx.lineTo(badgeCx - 3, badgeCy + 8)
    ctx.lineTo(badgeCx + 11, badgeCy - 10)
    ctx.strokeStyle = '#1a1608'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  // ---- achievement label / date ----
  if (isCompleted) {
    ctx.fillStyle = '#e0b84a'
    ctx.font = `700 30px ${FONT_FAMILY}`
    ctx.fillText('有言実行!', CENTER_X, shift(badgeY))
  }

  ctx.fillStyle = '#85858c'
  ctx.font = `400 30px ${FONT_FAMILY}`
  ctx.fillText(`${dateLabel}の運勢`, CENTER_X, shift(dateY))

  // ---- headline: the main hook, biggest and boldest element ----
  ctx.fillStyle = isCompleted ? '#e0b84a' : '#f5f5f6'
  ctx.font = `700 64px ${FONT_FAMILY}`
  ctx.fillText(`今日は"${categoryLabel}"の日`, CENTER_X, shift(headlineY))

  // ---- action text: the actual content, bright and medium-weight ----
  ctx.fillStyle = '#f5f5f6'
  ctx.font = `500 42px ${FONT_FAMILY}`
  actionLines.forEach((line, i) => {
    ctx.fillText(line, CENTER_X, shift(actionStartY + i * ACTION_LINE_GAP))
  })

  // ---- reason: supporting text, smaller and muted ----
  ctx.fillStyle = '#8b8b92'
  ctx.font = `400 30px ${FONT_FAMILY}`
  reasonLines.forEach((line, i) => {
    ctx.fillText(line, CENTER_X, shift(reasonStartY + i * REASON_LINE_GAP))
  })

  // ---- rating / lucky color as a compact pill pair, matching the in-app tag look ----
  const pillsLeft = CENTER_X - pillsTotalWidth / 2
  const pillTop = shift(pillsCenterY) - PILL_HEIGHT / 2
  const pillRadius = PILL_HEIGHT / 2

  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.beginPath()
  ctx.roundRect(pillsLeft, pillTop, pill1Width, PILL_HEIGHT, pillRadius)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(pillsLeft + pill1Width + pillGap, pillTop, pill2Width, PILL_HEIGHT, pillRadius)
  ctx.fill()

  ctx.font = `600 30px ${FONT_FAMILY}`
  ctx.fillStyle = '#e0b84a'
  ctx.fillText(pill1Text, pillsLeft + pill1Width / 2, shift(pillsCenterY) + 10)
  ctx.fillStyle = '#c7c7cc'
  ctx.fillText(pill2Text, pillsLeft + pill1Width + pillGap + pill2Width / 2, shift(pillsCenterY) + 10)

  // ---- footer wordmark: smallest, most muted element ----
  ctx.font = `500 32px ${FONT_FAMILY}`
  ctx.fillStyle = isCompleted ? '#e0b84a' : '#7ab8ec'
  ctx.fillText('テキトー占い', CENTER_X, shift(footerY))

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
