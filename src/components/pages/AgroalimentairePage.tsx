'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Wheat, UtensilsCrossed, GlassWater, Sprout, Search, ArrowLeft, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'
import ProductDetailModal from '@/components/homepage/ProductDetailModal'

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

interface AgroalimentairePageProps {
  content: Record<string, string>
  products: Product[]
}

const subcategoryConfig = [
  { value: 'alimentation', label: 'Produits Alimentaires', icon: UtensilsCrossed },
  { value: 'boissons', label: 'Boissons', icon: GlassWater },
  { value: 'cereales', label: 'Céréales & Grains', icon: Sprout },
]

export default function AgroalimentairePage({ content, products }: AgroalimentairePageProps) {
  const { navigateTo } = useNavigation()
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const agroProducts = products.filter(p => p.subcategory === 'agroalimentaire' && p.isActive)

  const filteredProducts = agroProducts.filter(p => {
    const matchesSubcategory = activeSubcategory === 'all' || p.category === activeSubcategory
    const matchesSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (p.variants?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesSubcategory && matchesSearch
  })

  const categoryLabels: Record<string, string> = {
    alimentation: 'Produits Alimentaires',
    boissons: 'Boissons',
    cereales: 'Céréales & Grains',
  }

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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Wheat className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Agro-alimentaire</h1>
              <p className="text-white/70 mt-1">
                {agroProducts.length} produit{agroProducts.length !== 1 ? 's' : ''} disponible{agroProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            {content['agro-description'] || 'Distribution de produits alimentaires de qualité, boissons et céréales.'}
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Subcategory Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeSubcategory === 'all' ? 'default' : 'outline'}
                size="sm"
                className={activeSubcategory === 'all' ? 'bg-[#00A651] hover:bg-[#008541] text-white' : 'border-gray-200 hover:border-[#00A651] hover:text-[#00A651]'}
                onClick={() => setActiveSubcategory('all')}
              >
                Tous
              </Button>
              {subcategoryConfig.map(sub => (
                <Button
                  key={sub.value}
                  variant={activeSubcategory === sub.value ? 'default' : 'outline'}
                  size="sm"
                  className={activeSubcategory === sub.value ? 'bg-[#00A651] hover:bg-[#008541] text-white' : 'border-gray-200 hover:border-[#00A651] hover:text-[#00A651]'}
                  onClick={() => setActiveSubcategory(sub.value)}
                >
                  <sub.icon className="mr-1.5 size-3.5" />
                  {sub.label}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wheat className="size-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-400">Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            <>
              {activeSubcategory === 'all' ? (
                subcategoryConfig.map(sub => {
                  const subProducts = filteredProducts.filter(p => p.category === sub.value)
                  if (subProducts.length === 0) return null
                  return (
                    <div key={sub.value} className="mb-12 last:mb-0">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 bg-[#00A651]/10 rounded-lg flex items-center justify-center">
                          <sub.icon className="size-5 text-[#00A651]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a1a1a]">{sub.label}</h2>
                        <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">{subProducts.length}</Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {subProducts.map(product => (
                          <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                            <AgroProductCard product={product} categoryLabels={categoryLabels} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                      <AgroProductCard product={product} categoryLabels={categoryLabels} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">
            Besoin de produits alimentaires en gros ?
          </h2>
          <p className="text-gray-600 mb-8">
            Nous offrons des prix compétitifs pour les commandes en gros. Contactez-nous pour un devis personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#00A651] hover:bg-[#008541] text-white"
              asChild
            >
              <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                Demander un devis
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#00A651] text-[#00A651] hover:bg-[#00A651]/5"
              onClick={() => navigateTo('automobile')}
            >
              <ChevronLeft className="mr-2 size-4" />
              Voir nos produits Automobile
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function AgroProductCard({ product, categoryLabels }: { product: Product; categoryLabels: Record<string, string> }) {
  return (
    <Card className="overflow-hidden card-hover border-0 shadow-md group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wheat className="size-12 text-gray-300" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-[#00A651] text-white text-xs">
          {categoryLabels[product.category] || product.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-[#1a1a1a] mb-1 line-clamp-1">{product.title}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        )}
        {product.variants && (
          <div className="flex flex-wrap gap-1">
            {product.variants.split(',').slice(0, 3).map((v, i) => (
              <Badge key={i} variant="outline" className="text-xs text-gray-500">
                {v.trim()}
              </Badge>
            ))}
            {product.variants.split(',').length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-400">
                +{product.variants.split(',').length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
