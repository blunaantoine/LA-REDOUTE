'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Wheat, UtensilsCrossed, GlassWater, Sprout, Search, ArrowLeft, ChevronLeft, Star, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'
import ProductDetailModal from '@/components/homepage/ProductDetailModal'
import ScrollReveal from '@/components/ui/scroll-reveal'
import { motion, AnimatePresence } from 'framer-motion'

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
  { value: 'alimentation', label: 'Alimentation', icon: UtensilsCrossed },
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

  // Featured product: first active product with image
  const featuredProduct = agroProducts.find(p => p.imageUrl) || agroProducts[0] || null

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

      {/* Featured Product Highlight */}
      {featuredProduct && (
        <ScrollReveal>
          <section className="py-8 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00A651]/5 to-[#00C762]/5 border border-[#00A651]/10 cursor-pointer group"
                onClick={() => setSelectedProduct(featuredProduct)}
              >
                <div className="grid md:grid-cols-[1fr_2fr] gap-0">
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    {featuredProduct.imageUrl ? (
                      <Image
                        src={featuredProduct.imageUrl}
                        alt={featuredProduct.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#00A651]/10">
                        <Wheat className="size-12 text-[#00A651]" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#00A651] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      <Star className="size-3" />
                      Produit vedette
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="size-4 text-[#00A651]" />
                      <span className="text-xs font-medium text-[#00A651] uppercase tracking-wider">Mis en avant</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">{featuredProduct.title}</h3>
                    {featuredProduct.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{featuredProduct.description}</p>
                    )}
                    {featuredProduct.variants && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredProduct.variants.split(',').slice(0, 4).map((v, i) => (
                          <Badge key={i} className="bg-[#00A651]/10 text-[#00A651] text-xs">
                            {v.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="w-fit bg-[#00A651] hover:bg-[#008541] text-white"
                    >
                      Voir les détails
                      <ChevronLeft className="mr-1 size-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Filters and Search - Animated tab switching */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Subcategory Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeSubcategory === 'all' ? 'default' : 'outline'}
                size="sm"
                className={`relative overflow-hidden transition-all duration-300 ${
                  activeSubcategory === 'all'
                    ? 'bg-[#00A651] hover:bg-[#008541] text-white shadow-md shadow-[#00A651]/20'
                    : 'border-gray-200 hover:border-[#00A651] hover:text-[#00A651]'
                }`}
                onClick={() => setActiveSubcategory('all')}
              >
                Tous
              </Button>
              <AnimatePresence mode="wait">
                {subcategoryConfig.map(sub => (
                  <motion.div
                    key={sub.value}
                    initial={false}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={activeSubcategory === sub.value ? 'default' : 'outline'}
                      size="sm"
                      className={`relative overflow-hidden transition-all duration-300 ${
                        activeSubcategory === sub.value
                          ? 'bg-[#00A651] hover:bg-[#008541] text-white shadow-md shadow-[#00A651]/20'
                          : 'border-gray-200 hover:border-[#00A651] hover:text-[#00A651]'
                      }`}
                      onClick={() => setActiveSubcategory(sub.value)}
                    >
                      <sub.icon className="mr-1.5 size-3.5" />
                      {sub.label}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-9 transition-all duration-200 focus:ring-[#00A651]/20 focus:border-[#00A651]"
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
                        {subProducts.map((product, index) => (
                          <ScrollReveal key={product.id} delay={index * 0.05}>
                            <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                              <AgroProductCard product={product} categoryLabels={categoryLabels} />
                            </div>
                          </ScrollReveal>
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ScrollReveal key={product.id} delay={index * 0.05}>
                      <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                        <AgroProductCard product={product} categoryLabels={categoryLabels} />
                      </div>
                    </ScrollReveal>
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
        relatedProducts={selectedProduct
          ? agroProducts
              .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
              .slice(0, 4)
          : []
        }
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
              className="bg-[#00A651] hover:bg-[#008541] text-white btn-primary-hover"
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
    <Card className="overflow-hidden card-hover border border-gray-100 shadow-md group hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wheat className="size-12 text-gray-300" />
          </div>
        )}
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        {/* Category badge */}
        <Badge className="absolute top-3 left-3 bg-[#00A651] text-white text-xs">
          {categoryLabels[product.category] || product.category}
        </Badge>
        {/* Available indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-medium text-gray-600">Disponible</span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            Voir détails
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-[#1a1a1a] mb-1 line-clamp-1 group-hover:text-[#00A651] transition-colors">{product.title}</h3>
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
