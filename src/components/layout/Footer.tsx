'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import { useNavigation, PageName } from '@/context/NavigationContext'

interface FooterProps {
  logoUrl: string
  onOpenAdmin: () => void
}

const quickLinks: { label: string; page: PageName }[] = [
  { label: 'Accueil', page: 'accueil' },
  { label: 'Automobile', page: 'automobile' },
  { label: 'Agro-alimentaire', page: 'agroalimentaire' },
  { label: 'À Propos', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

export default function Footer({ logoUrl, onOpenAdmin }: FooterProps) {
  const { navigateTo } = useNavigation()
  const [bankInfoOpen, setBankInfoOpen] = useState(false)

  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <Image
              src={logoUrl}
              alt="LA REDOUTE SARL-U"
              width={160}
              height={48}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Distribution professionnelle de pneus, huiles moteurs et produits d&apos;alimentation générale au Togo.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="text-gray-400 hover:text-[#00A651] text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bank Info */}
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile: collapsible toggle */}
            <button
              onClick={() => setBankInfoOpen(!bankInfoOpen)}
              className="md:hidden w-full flex items-center justify-between font-semibold text-white"
              aria-expanded={bankInfoOpen}
            >
              <span>Coordonnées Bancaires</span>
              {bankInfoOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {/* Desktop: always visible heading */}
            <h3 className="hidden md:block font-semibold text-white">Coordonnées Bancaires</h3>
            <div className={`text-sm text-gray-400 space-y-2 ${bankInfoOpen ? 'block' : 'hidden'} md:block`}>
              <p className="font-medium text-gray-300">UTB</p>
              <p>Compte: 322114950004000</p>
              <p>Devise: XOF</p>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-white">Contact</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>Lomé, Togo</p>
              <p>
                <Phone className="inline size-3 mr-1" />
                <a href="tel:+22822251898" className="hover:text-[#00A651] transition-colors">
                  +228 22 25 18 98
                </a>
                <span className="text-gray-600 ml-1">(Fixe)</span>
              </p>
              <p>
                <MessageCircle className="inline size-3 mr-1" />
                <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer" className="hover:text-[#00A651] transition-colors">
                  +228 92 50 19 44
                </a>
                <span className="text-gray-600 ml-1">(WhatsApp)</span>
              </p>
              <p>
                <a href="mailto:contact@laredoutesarl.com" className="hover:text-[#00A651] transition-colors">
                  contact@laredoutesarl.com
                </a>
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href="https://wa.me/22892501944"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A651] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Contact Bar */}
      <div className="md:hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <a
              href="tel:+22822251898"
              className="flex items-center justify-center w-12 h-12 bg-[#00A651] rounded-full hover:bg-[#008541] transition-colors"
              aria-label="Appeler"
            >
              <Phone className="size-5 text-white" />
            </a>
            <a
              href="https://wa.me/22892501944"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-[#25D366] rounded-full hover:bg-[#1da851] transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-5 text-white" />
            </a>
            <a
              href="mailto:contact@laredoutesarl.com"
              className="flex items-center justify-center w-12 h-12 bg-[#00A651] rounded-full hover:bg-[#008541] transition-colors"
              aria-label="Email"
            >
              <Mail className="size-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} LA REDOUTE SARL-U.{' '}
              <button
                onClick={onOpenAdmin}
                className="hover:text-gray-200 transition-colors cursor-pointer underline decoration-white/20 underline-offset-2 hover:decoration-white/50"
                aria-label="Administration"
              >
                Tous droits réservés.
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/22892501944"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform whatsapp-pulse"
        aria-label="WhatsApp"
      >
        <MessageCircle className="size-7 text-white" />
      </a>
    </footer>
  )
}
