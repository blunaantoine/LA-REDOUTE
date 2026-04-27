'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface HeroSectionProps {
  content: Record<string, string>
  logoAltUrl: string
}

export default function HeroSection({ content, logoAltUrl }: HeroSectionProps) {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="pattern-bg w-full h-full" />
      </div>

      {/* Decorative geometric shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 border border-white/10 rounded-full" />
      <div className="absolute bottom-20 left-10 w-48 h-48 border border-white/10 rounded-full" />
      <div className="absolute top-40 left-1/4 w-24 h-24 border border-white/5 rotate-45" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in-up">
            <Badge className="bg-white/15 text-white border-white/25 hover:bg-white/20 backdrop-blur-sm px-4 py-2 text-sm">
              {content['hero-badge'] || 'Votre partenaire de confiance depuis des années'}
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight">
                {content['hero-title'] || 'LA REDOUTE'}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-white/90">
                {content['hero-subtitle'] || 'SARL-U'}
              </p>
            </div>

            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              {content['hero-description'] || "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-[#00A651] hover:bg-white/90 font-semibold btn-primary-hover"
                asChild
              >
                <a href="#produits">
                  Nos Produits
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <a href="#contact">
                  Nous Contacter
                </a>
              </Button>
            </div>
          </div>

          {/* Right - Logo */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative animate-float">
              <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <Image
                  src={logoAltUrl || '/logo-alt.png'}
                  alt="LA REDOUTE SARL-U Logo"
                  width={400}
                  height={400}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about" className="text-white/60 hover:text-white transition-colors">
          <ArrowDown className="size-8" />
        </a>
      </div>
    </section>
  )
}
