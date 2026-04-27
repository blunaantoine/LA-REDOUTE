'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Eye, ArrowLeft, Users, MapPin, Clock, Shield, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'

interface AboutPageProps {
  content: Record<string, string>
  images: Record<string, string>
}

const stats = [
  { label: "Ans d'expérience", value: '10+', icon: Clock },
  { label: 'Clients satisfaits', value: '500+', icon: Users },
  { label: 'Produits disponibles', value: '200+', icon: Shield },
  { label: 'Partenaires', value: '50+', icon: TrendingUp },
]

export default function AboutPage({ content, images }: AboutPageProps) {
  const { navigateTo } = useNavigation()

  return (
    <div>
      {/* Page Header */}
      <section className="relative py-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="pattern-bg w-full h-full" />
        </div>
        <div className="absolute top-10 right-20 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute bottom-10 left-20 w-32 h-32 border border-white/10 rotate-45" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 mb-6"
            onClick={() => navigateTo('accueil')}
          >
            <ArrowLeft className="mr-2 size-4" />
            Retour à l&apos;accueil
          </Button>
          <Badge className="bg-white/15 text-white border-white/25 backdrop-blur-sm px-4 py-2 text-sm mb-4">
            À Propos
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            {content['about-title'] || "Une entreprise togolaise engagée pour l'excellence"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mt-4">
            {content['about-description'] || "Fondée avec la vision de fournir des produits de qualité supérieure au marché togolais, LA REDOUTE SARL-U a grandi pour devenir un distributeur de confiance."}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-[#00A651]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="size-6 text-[#00A651]" />
                </div>
                <div className="text-3xl font-bold text-[#1a1a1a]">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={images['about-team'] || images['logo-alt'] || '/logo-alt.png'}
                  alt="LA REDOUTE Équipe"
                  width={600}
                  height={500}
                  className="object-cover w-full h-[500px]"
                  unoptimized
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
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                  Notre Histoire
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {content['about-story'] || "Depuis sa création, LA REDOUTE SARL-U s'est imposée comme un acteur majeur de la distribution au Togo. Notre engagement envers la qualité et le service client a fait de nous le partenaire de confiance de centaines de professionnels et particuliers."}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {content['about-story2'] || "Spécialisée dans la distribution de produits automobiles et agro-alimentaires, nous offrons une gamme complète de produits soigneusement sélectionnés pour répondre aux besoins les plus exigeants du marché togolais et de la sous-région ouest-africaine."}
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#00A651]/5 rounded-xl border border-[#00A651]/10">
                <MapPin className="size-8 text-[#00A651] flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#1a1a1a]">Basé à Lomé, Togo</p>
                  <p className="text-sm text-gray-500">Au cœur de l&apos;Afrique de l&apos;Ouest pour un service optimal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
              Mission & Vision
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              Ce Qui Nous Guide
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-[#00A651]/20 hover:border-[#00A651]/40 transition-colors">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-[#00A651]/10 rounded-xl flex items-center justify-center">
                  <Target className="size-7 text-[#00A651]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a]">Notre Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content['about-mission'] || 'Fournir des produits de qualité à des prix compétitifs, tout en assurant un service client exceptionnel. Nous nous efforçons d\'être le pont entre les meilleurs fabricants mondiaux et le marché togolais.'}
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#00A651]/20 hover:border-[#00A651]/40 transition-colors">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-[#00A651]/10 rounded-xl flex items-center justify-center">
                  <Eye className="size-7 text-[#00A651]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a]">Notre Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  {content['about-vision'] || "Devenir le leader de la distribution en Afrique de l'Ouest, reconnu pour l'excellence de nos produits, la fiabilité de notre service et notre contribution au développement économique de la région."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
              Nos Valeurs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              Ce Qui Nous Définit
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Qualité',
                description: 'Nous sélectionnons rigoureusement chaque produit pour garantir la plus haute qualité à nos clients. Chaque article passe par un contrôle strict avant d\'arriver entre vos mains.',
              },
              {
                icon: Users,
                title: 'Service Client',
                description: 'Notre équipe dévouée est toujours à l\'écoute pour répondre à vos besoins et vous accompagner. Votre satisfaction est notre priorité absolue.',
              },
              {
                icon: Target,
                title: 'Engagement',
                description: 'Nous nous engageons envers nos partenaires et notre communauté pour un développement durable. La confiance se construit sur la constance.',
              },
            ].map((value) => (
              <Card key={value.title} className="text-center border-0 shadow-lg card-hover">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-[#00A651]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <value.icon className="size-8 text-[#00A651]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a]">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#00A651] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Devenez notre partenaire
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Rejoignez les centaines de professionnels qui nous font confiance pour leurs approvisionnements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#00A651] hover:bg-white/90 font-semibold"
              onClick={() => navigateTo('contact')}
            >
              Nous Contacter
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              onClick={() => navigateTo('automobile')}
            >
              Découvrir nos produits
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
