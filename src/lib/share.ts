import type { Action } from '../data/types'
import { generateShareImage } from './shareImage'
import { getDateKey } from './fortune'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function shareResult(action: Action, categoryLabel: string, dateLabel: string) {
  const text = `今日は"${categoryLabel}"の日\n${action.text}\n${action.reason}`

  let imageBlob: Blob | null = null
  try {
    imageBlob = await generateShareImage({ action, categoryLabel, dateLabel })
  } catch {
    imageBlob = null
  }

  if (imageBlob) {
    const filename = `tekito-uranai-${getDateKey(new Date())}.jpg`
    const file = new File([imageBlob], filename, { type: 'image/jpeg' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text })
      } catch {
        /* user cancelled share sheet */
      }
      return
    }
    downloadBlob(imageBlob, filename)
    return
  }

  if (navigator.share) {
    navigator.share({ text }).catch(() => {
      /* user cancelled share sheet */
    })
    return
  }
  navigator.clipboard?.writeText(text)
}
