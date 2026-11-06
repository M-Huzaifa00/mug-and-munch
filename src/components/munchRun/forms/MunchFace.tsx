import { STROKE } from './shapes'

/** Spiral eye (dizzy). */
const spiral = (cx: number, cy: number) => `M${cx} ${cy}m-1 0a1 1 0 1 1 2 0a2.2 2.2 0 1 1 -4.4 0a3.4 3.4 0 1 1 6.8 0`

/**
 * The SAME face in every form (dot eyes with a highlight, small grin, bubblegum blush): what makes the
 * burger, wrap and coffee read as one character. It never morphs; it only slides (FACE_Y).
 */
export function MunchFace({ y = 0 }: { y?: number }) {
  return (
    <g data-part="face" transform={`translate(0 ${y})`}>
      <g data-part="blush" className="fill-bubblegum" opacity="0.75">
        <ellipse cx="40" cy="53" rx="5" ry="3" />
        <ellipse cx="80" cy="53" rx="5" ry="3" />
      </g>
      <g data-part="eyes">
        <g data-part="pupils">
          <g data-part="eye">
            <ellipse cx="48" cy="44" rx="4.2" ry="5" fill="currentColor" />
            <circle cx="49.6" cy="42.2" r="1.3" className="fill-oat" />
          </g>
          <g data-part="eye">
            <ellipse cx="72" cy="44" rx="4.2" ry="5" fill="currentColor" />
            <circle cx="73.6" cy="42.2" r="1.3" className="fill-oat" />
          </g>
        </g>
        <g data-part="spirals" opacity="0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d={spiral(48, 44)} />
          <path d={spiral(72, 44)} />
        </g>
      </g>
      <path data-part="grin" d="M53 52Q60 59 67 52" fill="none" stroke="currentColor" strokeWidth={STROKE * 0.85} strokeLinecap="round" />
    </g>
  )
}
