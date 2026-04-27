'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import Image from 'next/image'
import { useNavigation, PageName } from '@/context/NavigationContext'

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
  const { currentPage, navigateTo } = useNavigation()

  const handleNavClick = (page: PageName) => {
    navigateTo(page)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
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
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
              className="hidden sm:inline-flex bg-[#00A651] hover:bg-[#008541] text-white"
              asChild
            >
              <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 size-4" />
                Nous Contacter
              </a>
            </Button>

            <button
              className="md:hidden p-2 text-gray-600 hover:text-[#00A651]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  currentPage === link.page
                    ? 'bg-[#00A651]/10 text-[#00A651]'
                    : 'text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 px-4">
              <Button className="w-full bg-[#00A651] hover:bg-[#008541] text-white" asChild>
                <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 size-4" />
                  Nous Contacter
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
