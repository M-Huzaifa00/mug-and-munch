import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Stack so only the top-most open dialog reacts to Tab / Esc. */
const stack: symbol[] = []

/**
 * Keeps keyboard focus inside `ref` while active, closes on Esc,
 * and returns focus to whatever was focused before opening.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const node = ref.current
    if (!active || !node) return
    const id = Symbol('trap')
    stack.push(id)
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0)

    const first = node.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0] ?? node
    first.focus({ preventScroll: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) {
        e.preventDefault()
        node.focus()
        return
      }
      const firstEl = list[0]
      const lastEl = list[list.length - 1]
      const current = document.activeElement
      if (e.shiftKey && (current === firstEl || !node.contains(current))) {
        e.preventDefault()
        lastEl?.focus()
      } else if (!e.shiftKey && (current === lastEl || !node.contains(current))) {
        e.preventDefault()
        firstEl?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      const index = stack.indexOf(id)
      if (index >= 0) stack.splice(index, 1)
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true })
    }
  }, [ref, active])
}
