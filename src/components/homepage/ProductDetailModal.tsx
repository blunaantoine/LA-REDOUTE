'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { MessageCircle, Package, X, Share2, Check, ArrowRight, ZoomIn } from 'lucide-react'
import Image from 'next/image'
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

const categoryLabels: Record<string, string> = {
  pneus: 'Pneus',
  huiles: 'Huiles Moteurs',
  accessoires: 'Accessoires Auto',
  alimentation: 'Produits Alimentaires',
  boissons: 'Boissons',
  cereales: 'Céréales & Grains',
}

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
  relatedProducts?: Product[]
}

export default function ProductDetailModal({ product, open, onClose, relatedProducts = [] }: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!product) return null

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je souhaite obtenir un devis pour le produit : ${product.title}${product.variants ? ` (${product.variants})` : ''}`
  )
  const whatsappUrl = `https://wa.me/22892501944?text=${whatsappMessage}`

  const variantsList = product.variants
    ? product.variants.split(',').map(v => v.trim()).filter(Boolean)
    : []

  const handleShare = async () => {
    const url = `${window.location.origin}/produit/${product.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent
          className="sm:max-w-2xl lg:max-w-3xl p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl [&>button]:hidden max-h-[90vh]"
        >
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {product.description || `Détails du produit ${product.title}`}
          </DialogDescription>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
              >
                {/* Close & Share Buttons */}
                <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                    title="Partager le lien"
                  >
                    {copied ? <Check className="size-4 text-green-300" /> : <Share2 className="size-4" />}
                    <span className="sr-only">Partager</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                  >
                    <X className="size-4" />
                    <span className="sr-only">Fermer</span>
                  </button>
                </div>

                {/* Toast notification for share */}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-14 right-3 z-50 bg-white text-[#1a1a1a] text-sm px-4 py-2 rounded-lg shadow-lg border border-gray-100"
                    >
                      Lien copié !
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="relative w-full md:w-1/2 min-h-[260px] sm:min-h-[320px] md:min-h-[480px] bg-gray-100 flex-shrink-0 overflow-hidden group cursor-pointer"
                  onClick={() => product.imageUrl && setLightboxOpen(true)}
                >
                  {product.imageUrl ? (
                    <>
                      {/* Skeleton loader */}
                      {!imageLoaded && (
                        <div className="absolute inset-0 skeleton-pulse" />
                      )}
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onLoad={() => setImageLoaded(true)}
                      />
                      {/* Zoom indicator overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <ZoomIn className="size-5 text-[#1a1a1a]" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00A651]/10 to-[#00A651]/5">
                      <Package className="size-20 text-[#00A651]/30" />
                    </div>
                  )}

                  {/* Category badge on image */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#00A651] text-white text-sm px-3 py-1 font-medium shadow-lg">
                      {categoryLabels[product.category] || product.category}
                    </Badge>
                  </div>

                  {/* Sur devis badge */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-amber-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 font-semibold shadow-lg tracking-wide uppercase">
                      Sur devis
                    </Badge>
                  </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex-1 p-6 sm:p-8 flex flex-col"
                >
                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight mb-2">
                    {product.title}
                  </h2>

                  {/* Category pill */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-[#00A651]" />
                    <span className="text-sm font-medium text-[#00A651]">
                      {categoryLabels[product.category] || product.category}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-100 mb-5" />

                  {/* Description */}
                  {product.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Variants */}
                  {variantsList.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Variantes disponibles
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {variantsList.map((variant, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                          >
                            <button
                              onClick={() => setSelectedVariant(selectedVariant === variant ? null : variant)}
                              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 cursor-pointer ${
                                selectedVariant === variant
                                  ? 'bg-[#00A651] text-white border-[#00A651] shadow-md shadow-[#00A651]/20'
                                  : 'border-[#00A651]/30 text-[#00A651] bg-[#00A651]/5 hover:bg-[#00A651]/15 hover:border-[#00A651]/50 hover:shadow-sm'
                              }`}
                            >
                              {variant}
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Related Products */}
                  {relatedProducts.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Produits similaires
                      </h3>
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {relatedProducts.slice(0, 3).map((rp) => (
                          <div
                            key={rp.id}
                            className="flex items-center gap-3 flex-shrink-0 p-2 rounded-lg border border-gray-100 hover:border-[#00A651]/30 hover:bg-[#00A651]/5 transition-colors cursor-pointer min-w-[200px]"
                          >
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 relative">
                              {rp.imageUrl ? (
                                <Image src={rp.imageUrl} alt={rp.title} fill className="object-cover" unoptimized sizes="40px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="size-4 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-[#1a1a1a] truncate">{rp.title}</p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                <ArrowRight className="size-2.5" />
                                Voir le produit
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="pt-4 border-t border-gray-100"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-base h-12 shadow-lg shadow-[#25D366]/25 transition-all hover:shadow-xl hover:shadow-[#25D366]/30"
                      asChild
                    >
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 size-5" />
                        Demander un devis
                      </a>
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Via WhatsApp — réponse rapide garantie
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && product.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[90vh] w-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="90vw"
                className="object-contain"
                unoptimized
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="size-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
