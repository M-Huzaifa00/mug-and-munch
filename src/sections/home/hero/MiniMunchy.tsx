/**
 * Mini Munchy (head only), same kawaii DNA as the big mascot: curls framing the face, cap with a side brim,
 * bangs, sparkly eyes (or blissful "^ ^"), rosy cheeks. `mouth`: little "o" (sipping) or a smile that can open.
 */
export function MiniMunchy({ x, y, eyes, mouth }: { x: number; y: number; eyes: 'open' | 'bliss'; mouth: 'sip' | 'chomp' }) {
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth="2.6">
      <g fill="currentColor" stroke="none">
        <circle cx="-14" cy="-3" r="6" />
        <circle cx="14" cy="-3" r="6" />
        <circle cx="-12" cy="8" r="5" />
        <circle cx="12" cy="8" r="5" />
      </g>
      <circle r="15" className="fill-oat" />
      <path d="M-15 -3c0-12 8-18 15-18s15 6 15 18c-8-4-22-4-30 0z" className="fill-oat" />
      <path d="M8 -8c6-3 12-2 15 2-5 2-10 2-14 1z" className="fill-oat" strokeWidth="2.2" />
      <path d="M-13 -4l26 0 0 1q-3 4-6.5 0q-3 4-6.5 0q-3 4-6.5 0q-3 4-6.5 0z" fill="currentColor" strokeWidth="1.5" />
      {eyes === 'bliss' ? (
        <path d="M-8 4q2.5-3.5 5 0M3 4q2.5-3.5 5 0" strokeWidth="2.2" />
      ) : (
        <g stroke="none">
          <ellipse cx="-5" cy="3" rx="2.4" ry="3" fill="currentColor" />
          <ellipse cx="5" cy="3" rx="2.4" ry="3" fill="currentColor" />
          <circle cx="-4.2" cy="1.8" r="0.9" className="fill-oat" />
          <circle cx="5.8" cy="1.8" r="0.9" className="fill-oat" />
        </g>
      )}
      <g data-cheeks className="fill-bubblegum" stroke="none" opacity="0.85">
        <ellipse cx="-9.5" cy="8" rx="3" ry="1.8" />
        <ellipse cx="9.5" cy="8" rx="3" ry="1.8" />
      </g>
      {mouth === 'sip' ? (
        <circle cx="-1" cy="9" r="1.8" fill="currentColor" stroke="none" />
      ) : (
        <>
          <path d="M-3 9q3 3 6 0" strokeWidth="2" />
          <ellipse data-mouth-open cx="0" cy="9.5" rx="3.6" ry="3.4" fill="currentColor" stroke="none" opacity="0" />
        </>
      )}
    </g>
  )
}

