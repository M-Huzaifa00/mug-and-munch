import type { ReactNode } from 'react'
import type { MascotPose, MouthPose } from './mascotPoses'

const EYE_L = { x: 124, y: 158 }
const EYE_R = { x: 158, y: 154 }

/** Solid teardrop eye like the logo's open eye (ink filled, tiny highlight). */
const eye = (x: number, y: number, dx: number) => (
  <>
    <path d={`M${x + dx} ${y}c7 0 12 10 11 19-1 6-8 7-12 2-6-7-7-21 1-21z`} fill="currentColor" stroke="none" />
    <circle cx={x + dx + 2} cy={y + 17} r="1.8" className="fill-oat" stroke="none" />
  </>
)

const MOUTHS: Record<MouthPose, ReactNode> = {
  tongue: (
    <>
      <path d="M120 212c16 16 54 16 72-8" />
      <path d="M128 216c-2-11 10-14 14-4l6 12c-8 2-14 0-20-8z" fill="currentColor" strokeWidth="3" />
    </>
  ),
  open: (
    <>
      <path d="M124 206c10 22 56 22 66-6z" fill="currentColor" />
      <path d="M140 220c6-6 18-6 24 0-6 6-18 6-24 0z" className="fill-chili" stroke="none" />
    </>
  ),
  o: <ellipse cx="152" cy="212" rx="5" ry="6" fill="currentColor" />,
  frown: <path d="M130 220c10-12 34-14 48-4" />,
  wobbly: <path d="M130 214c5-5 10 5 15 0s10 5 15 0 10 5 15 0" />,
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
        {eyes === 'wink' && <path d="M154 160c4 6 12 8 18 6M156 168c4-2 10-2 14 2" />}
        {eyes === 'closed' && <path d="M118 170c4 5 12 5 16 0M152 166c4 5 12 5 16 0" />}
        {eyes === 'happy' && <path d="M118 172c3-8 13-8 16 0M152 168c3-8 13-8 16 0" />}
        {eyes === 'droopy' && <path d="M116 152l16 4M152 152l16-6" />}
        {eyes === 'side' && <path d="M118 156h16M152 152h16" />}
      </g>
      <path data-part="nose" d="M141 192c2-7 12-9 15-3 3 6-1 13-8 12" fill="none" />
      <g data-part="blush" stroke="none" className="fill-bubblegum" opacity={0.55}>
        <ellipse cx="116" cy="200" rx="8" ry="4.5" />
        <ellipse cx="188" cy="190" rx="8" ry="4.5" />
      </g>
      <g data-part="mouth" fill="none">
        {MOUTHS[pose.mouth]}
      </g>
      {pose.extra === 'tear' && <path data-part="tear" d="M170 176c3 6 6 10 3 13-3 2-7 0-6-4z" className="fill-oat" strokeWidth="2.5" />}
      {pose.extra === 'crumbs' && (
        <g data-part="crumbs" fill="currentColor" stroke="none">
          <circle cx="124" cy="226" r="2.2" />
          <circle cx="134" cy="232" r="1.6" />
          <circle cx="182" cy="214" r="2" />
        </g>
      )}
    </g>
  )
}
