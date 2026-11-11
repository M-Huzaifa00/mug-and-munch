import { STROKE } from './shapes'

/** Spiral eye (dizzy). */
const spiral = (cx: number, cy: number) => `M${cx} ${cy}m-1 0a1 1 0 1 1 2 0a2.2 2.2 0 1 1 -4.4 0a3.4 3.4 0 1 1 6.8 0`

/**
 * The SAME kawaii face in every form (big sparkly eyes, open smile with a tiny tongue, rosy blush): what makes the
 * burger, wrap and coffee read as one character. It never morphs; it only slides (FACE_Y).
 */
export function MunchFace({ y = 0 }: { y?: number }) {
  return (
    <g data-part="face" transform={`translate(0 ${y})`}>
      <g data-part="blush" className="fill-bubblegum" opacity="0.8">
        <ellipse cx="39" cy="53" rx="6" ry="3.6" />
        <ellipse cx="81" cy="53" rx="6" ry="3.6" />
      </g>
      <g data-part="eyes">
        <g data-part="pupils">
          <g data-part="eye">
            <ellipse cx="48" cy="44" rx="5" ry="6.2" fill="currentColor" />
            <circle cx="49.8" cy="41.8" r="1.9" className="fill-oat" />
            <circle cx="46.4" cy="46.6" r="0.9" className="fill-oat" />
          </g>
          <g data-part="eye">
            <ellipse cx="72" cy="44" rx="5" ry="6.2" fill="currentColor" />
            <circle cx="73.8" cy="41.8" r="1.9" className="fill-oat" />
            <circle cx="70.4" cy="46.6" r="0.9" className="fill-oat" />
          </g>
        </g>
        <g data-part="spirals" opacity="0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d={spiral(48, 44)} />
          <path d={spiral(72, 44)} />
        </g>
      </g>
      <g data-part="grin">
        <path d="M54.5 51.5Q60 60 65.5 51.5Z" fill="currentColor" stroke="currentColor" strokeWidth={STROKE * 0.6} strokeLinejoin="round" />
        <path d="M57.6 55.4Q60 53.8 62.4 55.4Q60 57.2 57.6 55.4Z" className="fill-bubblegum" />
      </g>
    </g>
  )
}
