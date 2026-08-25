interface Props {
  filled: boolean
  size?: number
}

const STAR_POINTS = '12,2 14.47,8.60 21.51,8.91 15.99,13.30 17.88,20.09 12,16.20 6.12,20.09 8.01,13.30 2.49,8.91 9.53,8.60'

export function StarIcon({ filled, size = 20 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinejoin="round"
    >
      <polygon points={STAR_POINTS} />
    </svg>
  )
}
