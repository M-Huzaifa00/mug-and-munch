import type { ReactNode } from 'react'
import type { MascotPose, MouthPose } from './mascotPoses'

/** Eye centres (viewBox units). Big, low-set kawaii eyes. */
const EYE_L = { x: 100, y: 178 }
const EYE_R = { x: 148, y: 178 }

/** Big glossy eye: ink oval + two sparkle highlights (the cute part). */
const eye = (x: number, y: number, dx: number) => (
  <>
    <ellipse cx={x + dx} cy={y} rx="10" ry="13" fill="currentColor" stroke="none" />
    <circle cx={x + dx + 3.5} cy={y - 5} r="4" className="fill-oat" stroke="none" />
    <circle cx={x + dx - 3.5} cy={y + 5} r="1.8" className="fill-oat" stroke="none" />
  </>
)

/** Main mouth outline per pose: ONE path so GSAP MorphSVG can morph between moods. */
const MOUTH_D: Record<MouthPose, string> = {
  // happy "D" smile (filled) with a little tongue
  tongue: 'M110 204c4 14 24 14 28 0z',
  // big excited open smile
  open: 'M106 202c4 22 32 22 36 0z',
  o: 'M124 206c4 0 6 3 6 6s-2 6-6 6-6-3-6-6 2-6 6-6z',
  frown: 'M112 214c6-8 18-8 24 0',
  wobbly: 'M110 210c4-4 7 4 11 0s7 4 11 0 7 4 11 0',
}
const FILLED: Record<MouthPose, boolean> = { tongue: true, open: true, o: true, frown: false, wobbly: false }

/** Extra mouth details layered on the outline. */
const MOUTH_EXTRA: Partial<Record<MouthPose, ReactNode>> = {
  tongue: <path data-part="tongue" d="M118 212c3-4 9-4 12 0-3 3-9 3-12 0z" className="fill-bubblegum" stroke="none" />,
  open: <path data-part="tongue" d="M114 216c5-6 15-6 20 0-5 5-15 5-20 0z" className="fill-bubblegum" stroke="none" />,
}

/** Face features. Groups carry data-part for GSAP (blink, follow, mouth morph). */
export function MascotFace({ pose }: { pose: MascotPose }) {
  const { eyes } = pose
  const shift = eyes === 'side' ? -4 : 0
  const leftOpen = eyes === 'open' || eyes === 'side' || eyes === 'droopy' || eyes === 'wink'
  const rightOpen = leftOpen && eyes !== 'wink'

  return (
    <g data-part="face" strokeWidth="4.5">
      <g data-part="eyeL" style={{ opacity: leftOpen ? 1 : 0 }}>
        <g data-part="pupilL">{eye(EYE_L.x, EYE_L.y, shift)}</g>
      </g>
      <g data-part="eyeR" style={{ opacity: rightOpen ? 1 : 0 }}>
        <g data-part="pupilR">{eye(EYE_R.x, EYE_R.y, shift)}</g>
      </g>
      <g data-part="eyelids" fill="none">
        {/* signature wink: a happy "^" on the right */}
        {eyes === 'wink' && <path d="M138 182c4-9 16-9 20 0" />}
        {eyes === 'closed' && <path d="M90 180c4 5 16 5 20 0M138 180c4 5 16 5 20 0" />}
        {eyes === 'happy' && <path d="M90 184c4-10 16-10 20 0M138 184c4-10 16-10 20 0" />}
        {/* sad: soft worried brows (inner ends up), never angry */}
        {eyes === 'droopy' && <path d="M88 158c6-1 12-4 16-8M160 158c-6-1-12-4-16-8" strokeWidth="3.5" />}
        {/* guilty: sleepy half-lids, cheeky not mean */}
        {eyes === 'side' && <path d="M88 172h22M136 172h22" strokeWidth="4" />}
      </g>
      {/* tiny nose: the logo's little curl, kept small */}
      <path data-part="nose" d="M121 194c2-3 7-3 7 1" fill="none" strokeWidth="3.5" />
      <g data-part="blush" stroke="none" className="fill-bubblegum" opacity={0.75}>
        <ellipse cx="80" cy="198" rx="11" ry="6.5" />
        <ellipse cx="168" cy="198" rx="11" ry="6.5" />
      </g>
      <g data-part="mouth" strokeWidth="4">
        <path data-part="mouthShape" d={MOUTH_D[pose.mouth]} fill={FILLED[pose.mouth] ? 'currentColor' : 'none'} />
        {MOUTH_EXTRA[pose.mouth]}
      </g>
      {pose.extra === 'tear' && <path data-part="tear" d="M156 190c3 6 6 10 3 13-3 2-7 0-6-4z" className="fill-oat" strokeWidth="2.5" />}
      {pose.extra === 'crumbs' && (
        <g data-part="crumbs" fill="currentColor" stroke="none">
          <circle cx="104" cy="216" r="2.2" />
          <circle cx="112" cy="224" r="1.6" />
          <circle cx="146" cy="214" r="2" />
        </g>
      )}
    </g>
  )
}
