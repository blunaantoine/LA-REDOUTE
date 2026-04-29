'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingBar() {
  const pathname = usePathname()

  // Use pathname as key to trigger re-animation on route change
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
        style={{
          background: 'linear-gradient(90deg, #00A651 0%, #00C762 50%, #008541 100%)',
        }}
      />
    </AnimatePresence>
  )
}
