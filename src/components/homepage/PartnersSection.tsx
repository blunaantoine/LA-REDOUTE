'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Building2 } from 'lucide-react'

interface Partner {
  id: string
  name: string
  description: string | null
  logoUrl: string | null
  documentUrl: string | null
  order: number
  isActive: boolean
}

interface PartnersSectionProps {
  partners: Partner[]
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  // Only show active partners
  const activePartners = partners.filter(p => p.isActive)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
            Nos Partenaires
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
            Ils Nous Font Confiance
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Des partenariats solides avec des entreprises de renom pour vous garantir les meilleurs produits et services.
          </p>
        </div>

        {activePartners.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {activePartners.map((partner) => (
              <Card
                key={partner.id}
                className="card-hover border border-gray-100 shadow-md group"
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  {/* Logo or Placeholder */}
                  <div className="w-20 h-20 rounded-xl bg-[#00A651]/5 flex items-center justify-center overflow-hidden group-hover:bg-[#00A651]/10 transition-colors">
                    {partner.logoUrl ? (
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <Building2 className="size-8 text-[#00A651]/60 group-hover:text-[#00A651] transition-colors" />
                    )}
                  </div>
                  {/* Name */}
                  <h3 className="font-semibold text-[#1a1a1a] text-sm leading-tight">
                    {partner.name}
                  </h3>
                  {/* Description */}
                  {partner.description && (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {partner.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Placeholder when no partners */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-[#00A651]/5 rounded-full flex items-center justify-center mb-4">
              <Building2 className="size-8 text-[#00A651]/40" />
            </div>
            <p className="text-gray-400 text-sm">
              Nos partenaires seront bientôt affichés ici.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
