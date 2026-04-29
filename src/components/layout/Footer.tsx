'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, ArrowUp, Facebook, Twitter, Instagram, Linkedin, Send, CheckCircle2 } from 'lucide-react'
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

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
]

export default function Footer({ logoUrl, onOpenAdmin }: FooterProps) {
  const { navigateTo } = useNavigation()
  const [bankInfoOpen, setBankInfoOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]')
    if (!existing.includes(email)) {
      existing.push(email)
      localStorage.setItem('newsletter-subscribers', JSON.stringify(existing))
    }
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Restez informé</h3>
              <p className="text-gray-400 text-sm">Recevez nos dernières offres et actualités directement dans votre boîte mail.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2 bg-[#00A651]/10 border border-[#00A651]/30 rounded-lg px-4 py-2.5 w-full">
                  <CheckCircle2 className="size-5 text-[#00A651] shrink-0" />
                  <span className="text-[#00A651] text-sm font-medium">Merci pour votre inscription !</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="flex-1 min-w-0 bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A651]/50 focus:border-[#00A651]/50 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="bg-[#00A651] hover:bg-[#008541] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-2 shrink-0"
                  >
                    <Send className="size-4" />
                    <span className="hidden sm:inline">S&apos;inscrire</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

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
            {/* Social Media Icons */}
            <div className="flex gap-2 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center hover:bg-[#00A651] transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="text-gray-400 hover:text-[#00A651] text-sm transition-colors link-underline"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bank Info - Improved */}
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
            <div className={`text-sm space-y-2 ${bankInfoOpen ? 'block' : 'hidden'} md:block`}>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#00A651]/20 rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#00A651]">UTB</span>
                  </div>
                  <p className="font-semibold text-white">Union Togolaise de Banque</p>
                </div>
                <p className="text-gray-400 font-mono text-xs">322114950004000</p>
                <p className="text-gray-500 text-xs mt-1">Devise: XOF (FCFA)</p>
              </div>
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
                <Mail className="inline size-3 mr-1" />
                <a href="mailto:contact@laredoutesarl.com" className="hover:text-[#00A651] transition-colors">
                  contact@laredoutesarl.com
                </a>
              </p>
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
            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-gray-400 hover:text-[#00A651] transition-colors group"
              aria-label="Retour en haut"
            >
              <span className="text-xs">Retour en haut</span>
              <div className="w-7 h-7 border border-white/15 rounded-full flex items-center justify-center group-hover:border-[#00A651]/50 group-hover:bg-[#00A651]/10 transition-all duration-200">
                <ArrowUp className="size-3.5" />
              </div>
            </button>
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
