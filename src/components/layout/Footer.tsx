'use client'

import { MessageCircle, Phone } from 'lucide-react'
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

  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
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
          <div className="space-y-4">
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
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Coordonnées Bancaires</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p className="font-medium text-gray-300">UTB</p>
              <p>Compte: 322114950004000</p>
              <p>Devise: XOF</p>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
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

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} LA REDOUTE SARL-U.{' '}
              <button
                onClick={onOpenAdmin}
                className="hover:text-gray-300 transition-colors cursor-default"
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="size-7 text-white" />
      </a>
    </footer>
  )
}
