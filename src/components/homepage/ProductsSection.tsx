'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Car, Wheat } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  category: string
  subcategory: string | null
  title: string
  description: string | null
  imageUrl: string | null
  variants: string | null
  order: number
  isActive: boolean
}

interface ProductsSectionProps {
  content: Record<string, string>
  products: Product[]
}

export default function ProductsSection({ content, products }: ProductsSectionProps) {
  const autoProducts = products.filter(p => p.subcategory === 'automobile' && p.isActive)
  const agroProducts = products.filter(p => p.subcategory === 'agroalimentaire' && p.isActive)

  const autoVariants = [...new Set(autoProducts.map(p => p.category).filter(Boolean))]
  const agroVariants = [...new Set(agroProducts.map(p => p.category).filter(Boolean))]

  const categoryLabels: Record<string, string> = {
    pneus: 'Pneus',
    huiles: 'Huiles Moteurs',
    accessoires: 'Accessoires Auto',
    alimentation: 'Produits Alimentaires',
    boissons: 'Boissons',
    cereales: 'Céréales & Grains',
  }

  return (
    <section id="produits" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
            Nos Produits
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
            {content['products-title'] || "Deux Domaines d'Expertise"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Automobile Card */}
          <Card className="overflow-hidden card-hover border-0 shadow-lg">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/products-tires.png"
                alt="Automobile"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-[#00A651] rounded-lg flex items-center justify-center">
                  <Car className="size-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Automobile</h3>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                {content['auto-description'] || "Large sélection de pneus, huiles moteurs et accessoires automobiles pour tous véhicules."}
              </p>
              <div className="flex flex-wrap gap-2">
                {autoVariants.map(v => (
                  <Badge key={v} variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">
                    {categoryLabels[v] || v}
                  </Badge>
                ))}
                {autoVariants.length === 0 && (
                  <>
                    <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Pneus</Badge>
                    <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Huiles Moteurs</Badge>
                    <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Accessoires</Badge>
                  </>
                )}
              </div>
              <Button className="w-full bg-[#00A651] hover:bg-[#008541] text-white" asChild>
                <a href="#automobile">
                  Voir les produits Automobile
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Agro-alimentaire Card */}
          <Card className="overflow-hidden card-hover border-0 shadow-lg">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/products-food.png"
                alt="Agro-alimentaire"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-[#00A651] rounded-lg flex items-center justify-center">
                  <Wheat className="size-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Agro-alimentaire</h3>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                {content['agro-description'] || 'Distribution de produits alimentaires de qualité, boissons et céréales.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {agroVariants.map(v => (
                  <Badge key={v} variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">
                    {categoryLabels[v] || v}
                  </Badge>
                ))}
                {agroVariants.length === 0 && (
                  <>
                    <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Alimentation</Badge>
                    <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Boissons</Badge>
                    <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Céréales</Badge>
                  </>
                )}
              </div>
              <Button className="w-full bg-[#00A651] hover:bg-[#008541] text-white" asChild>
                <a href="#agroalimentaire">
                  Voir les produits Agro-alimentaire
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
