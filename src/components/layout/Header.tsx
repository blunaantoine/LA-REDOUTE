'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import Image from 'next/image'
import { useNavigation, PageName } from '@/context/NavigationContext'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  logoUrl: string
}

const navLinks: { label: string; page: PageName }[] = [
  { label: 'Accueil', page: 'accueil' },
  { label: 'Automobile', page: 'automobile' },
  { label: 'Agro-alimentaire', page: 'agroalimentaire' },
  { label: 'À Propos', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

export default function Header({ logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { currentPage, navigateTo } = useNavigation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const handleNavClick = (page: PageName) => {
    navigateTo(page)
    setMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-500 ease-out ${
      scrolled
        ? 'bg-white/98 shadow-lg border-gray-200/80'
        : 'bg-white/95 shadow-sm border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
        }`}>
          {/* Logo */}
          <button
            onClick={() => handleNavClick('accueil')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Image
              src={logoUrl}
              alt="LA REDOUTE SARL-U"
              width={160}
              height={48}
              style={{ width: 'auto', height: 'auto' }}
              className={`h-8 sm:h-10 w-auto object-contain transition-all duration-500 ${scrolled ? '' : 'sm:h-12'}`}
              priority
              loading="eager"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === link.page
                    ? 'bg-[#00A651]/10 text-[#00A651]'
                    : 'text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Button
              className="hidden sm:inline-flex bg-[#00A651] hover:bg-[#008541] text-white relative overflow-hidden"
              asChild
            >
              <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 size-4" />
                Nous Contacter
                {/* Pulse ring animation */}
                <span className="absolute inset-0 rounded-md animate-[ctaPulse_2s_ease-in-out_infinite] border-2 border-[#00C762]" />
              </a>
            </Button>

            <button
              className="md:hidden p-2 text-gray-600 hover:text-[#00A651] transition-colors relative z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Framer Motion Slide-in */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              {/* Menu header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="font-bold text-[#1a1a1a]">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05, duration: 0.2 }}
                    onClick={() => handleNavClick(link.page)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === link.page
                        ? 'bg-[#00A651]/10 text-[#00A651]'
                        : 'text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5'
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              {/* CTA Button */}
              <div className="px-4 pb-6">
                <Button className="w-full bg-[#00A651] hover:bg-[#008541] text-white relative overflow-hidden" asChild>
                  <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 size-4" />
                    Nous Contacter
                    <span className="absolute inset-0 rounded-md animate-[ctaPulse_2s_ease-in-out_infinite] border-2 border-[#00C762]" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
