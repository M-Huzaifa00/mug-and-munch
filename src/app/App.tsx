import { MotionConfig } from 'motion/react'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { SmoothScroll } from './providers/SmoothScroll'
import { router } from './router'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          offset={88}
          mobileOffset={{ top: 84, left: 12, right: 12 }}
          toastOptions={{
            className: 'sticker !rounded-2xl !bg-oat !text-espresso !font-sans !font-semibold',
            actionButtonStyle: { fontWeight: 800 },
          }}
        />
      </SmoothScroll>
    </MotionConfig>
  )
}
