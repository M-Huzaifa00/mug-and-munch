import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useReducedMotion } from './useReducedMotion'

/** PageTransition listens for this and plays the wipe before navigating. */
export const TRANSITION_EVENT = 'mm:transition-navigate'

export interface TransitionNavigateDetail {
  to: string
  replace?: boolean
  /** Set by PageTransition when it handled the navigation. */
  handled?: boolean
}

/**
 * Programmatic navigation WITH the chili/cheese page wipe (links get it automatically).
 * Reduced motion, or no PageTransition mounted → plain navigate.
 */
export function useTransitionNavigate() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  return useCallback(
    (to: string, opts: { replace?: boolean; instant?: boolean } = {}) => {
      if (!reduced && !opts.instant) {
        const detail: TransitionNavigateDetail = { to, replace: opts.replace }
        window.dispatchEvent(new CustomEvent<TransitionNavigateDetail>(TRANSITION_EVENT, { detail }))
        if (detail.handled) return
      }
      void navigate(to, { replace: opts.replace })
    },
    [navigate, reduced],
  )
}
