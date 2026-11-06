import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MUNCH_STOPS } from '@/data/munchRun'
import { MunchCharacter } from './MunchCharacter'

/** Reduced motion: no flight. The three forms sit as static stickers inside their stop anchors. */
export function MunchStatic() {
  const [anchors, setAnchors] = useState<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Anchors live in Home sections rendered before this lazy chunk; read them once after mount.
    const found = MUNCH_STOPS.map((s) => document.querySelector<HTMLElement>(`[data-munch-stop="${s.stop}"]`))
    const id = requestAnimationFrame(() => setAnchors(found))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      {MUNCH_STOPS.map((s, i) => {
        const el = anchors[i]
        return el ? createPortal(<MunchCharacter form={s.form} className="size-full" />, el, `munch-${s.stop}`) : null
      })}
    </>
  )
}
