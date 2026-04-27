'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
  logoUrl: string
}

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Automobile', href: '#produits' },
  { label: 'Agro-alimentaire', href: '#produits' },
  { label: 'À Propos', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Header({ logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#accueil" className="flex items-center gap-3">
            <Image
              src={logoUrl}
              alt="LA REDOUTE SARL-U"
              width={160}
              height={48}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-[#00A651] font-medium transition-colors text-sm"
              >
                {link.label}
              </a>
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
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-gray-600 hover:text-[#00A651] hover:bg-[#00A651]/5 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
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
