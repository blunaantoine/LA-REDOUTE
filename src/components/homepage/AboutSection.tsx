'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Eye, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface AboutSectionProps {
  content: Record<string, string>
  logoAltUrl: string
}

export default function AboutSection({ content, logoAltUrl }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image with experience badge */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={logoAltUrl || '/logo-alt.png'}
                alt="LA REDOUTE Équipe"
                width={600}
                height={500}
                style={{ width: 'auto', height: 'auto' }}
                className="object-cover w-full h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            {/* Experience badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#00A651] text-white rounded-2xl p-6 shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm opacity-90">Ans d&apos;expérience</div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
                À Propos
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                {content['about-title'] || "Une entreprise togolaise engagée pour l'excellence"}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {content['about-description'] || "Fondée avec la vision de fournir des produits de qualité supérieure au marché togolais, LA REDOUTE SARL-U a grandi pour devenir un distributeur de confiance."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-[#00A651]/20 hover:border-[#00A651]/40 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 bg-[#00A651]/10 rounded-lg flex items-center justify-center">
                    <Target className="size-6 text-[#00A651]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a]">Notre Mission</h3>
                  <p className="text-sm text-gray-600">
                    {content['about-mission'] || 'Fournir des produits de qualité à des prix compétitifs'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[#00A651]/20 hover:border-[#00A651]/40 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 bg-[#00A651]/10 rounded-lg flex items-center justify-center">
                    <Eye className="size-6 text-[#00A651]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a]">Notre Vision</h3>
                  <p className="text-sm text-gray-600">
                    {content['about-vision'] || "Devenir le leader de la distribution en Afrique de l'Ouest"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button className="bg-[#00A651] hover:bg-[#008541] text-white btn-primary-hover" size="lg" asChild>
              <a href="#contact">
                En savoir plus
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
