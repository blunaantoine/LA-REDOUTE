'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Award, HeadphonesIcon, Heart } from 'lucide-react'

interface ValuesSectionProps {
  content: Record<string, string>
}

const values = [
  {
    icon: Award,
    title: 'Qualité',
    description: 'Nous sélectionnons rigoureusement chaque produit pour garantir la plus haute qualité à nos clients.',
    color: '#00A651',
  },
  {
    icon: HeadphonesIcon,
    title: 'Service Client',
    description: 'Notre équipe dévouée est toujours à l\'écoute pour répondre à vos besoins et vous accompagner.',
    color: '#00A651',
  },
  {
    icon: Heart,
    title: 'Engagement',
    description: 'Nous nous engageons envers nos partenaires et notre communauté pour un développement durable.',
    color: '#00A651',
  },
]

export default function ValuesSection({ content }: ValuesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
            Nos Valeurs
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
            {content['values-title'] || 'Ce Qui Nous Définit'}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => (
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
  )
}
