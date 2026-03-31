interface IconProps {
  size?: number
  className?: string
}

export function ImgToSheetIcon({ size = 40, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded rectangle background */}
      <rect width="40" height="40" rx="10" fill="#111111" />
      <rect x="20" y="0" width="20" height="40" rx="0" fill="#16A34A" />
      {/* Fix right corners */}
      <rect x="20" y="0" width="20" height="40" fill="#16A34A" />
      <rect x="30" y="0" width="10" height="10" fill="#16A34A" />
      <rect x="30" y="30" width="10" height="10" fill="#16A34A" />
      {/* Re-apply rounded corners as clip */}
      <clipPath id="rounded">
        <rect width="40" height="40" rx="10" />
      </clipPath>
      <g clipPath="url(#rounded)">
        {/* LEFT HALF — Image/photo metaphor */}
        <rect width="20" height="40" fill="#111111" />

        {/* Mountain/hill path */}
        <path
          d="M0 32 L6 24 L10 28 L16 20 L20 26 L20 40 L0 40Z"
          fill="#262626"
        />
        <path
          d="M0 34 L5 28 L8 31 L14 23 L20 30"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sun */}
        <circle cx="15" cy="12" r="3" fill="#262626" />
        <circle cx="15" cy="12" r="2.5" stroke="white" strokeOpacity="0.35" strokeWidth="0.5" fill="none" />

        {/* RIGHT HALF — Spreadsheet grid */}
        <rect x="20" y="0" width="20" height="40" fill="#16A34A" />

        {/* Grid lines */}
        <line x1="27" y1="8" x2="27" y2="32" stroke="white" strokeOpacity="0.3" strokeWidth="0.75" />
        <line x1="33" y1="8" x2="33" y2="32" stroke="white" strokeOpacity="0.3" strokeWidth="0.75" />
        <line x1="23" y1="16" x2="37" y2="16" stroke="white" strokeOpacity="0.3" strokeWidth="0.75" />
        <line x1="23" y1="24" x2="37" y2="24" stroke="white" strokeOpacity="0.3" strokeWidth="0.75" />

        {/* Data bars in cells */}
        {/* Row 1 */}
        <rect x="23.5" y="10" width="2.5" height="3" rx="0.5" fill="white" fillOpacity="0.65" />
        <rect x="28.5" y="10" width="3.5" height="3" rx="0.5" fill="white" fillOpacity="0.65" />
        <rect x="34" y="10" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.65" />

        {/* Row 2 */}
        <rect x="23.5" y="18.5" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.65" />
        <rect x="28.5" y="18.5" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.65" />
        <rect x="34" y="18.5" width="2.5" height="3" rx="0.5" fill="white" fillOpacity="0.65" />

        {/* Row 3 */}
        <rect x="23.5" y="27" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.65" />
        <rect x="28.5" y="27" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.65" />
        <rect x="34" y="27" width="2.5" height="3" rx="0.5" fill="white" fillOpacity="0.65" />

        {/* Center divider */}
        <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeOpacity="0.1" strokeWidth="0.75" />
      </g>
    </svg>
  )
}

interface WordmarkProps {
  size?: number
  className?: string
  white?: boolean
}

export function Wordmark({ size = 18, className, white }: WordmarkProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontWeight: 500,
        fontSize: `${size}px`,
        letterSpacing: '-0.3px',
        lineHeight: 1,
      }}
    >
      <span style={{ color: white ? '#fff' : '#111111' }}>img</span>
      <span style={{ color: white ? '#fff' : '#16A34A' }}>to</span>
      <span style={{ color: white ? '#fff' : '#111111' }}>sheet</span>
    </span>
  )
}

interface LogoLockupProps {
  iconSize?: number
  wordmarkSize?: number
  className?: string
}

export function LogoLockup({ iconSize = 28, wordmarkSize = 18, className }: LogoLockupProps) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <ImgToSheetIcon size={iconSize} />
      <Wordmark size={wordmarkSize} />
    </span>
  )
}
