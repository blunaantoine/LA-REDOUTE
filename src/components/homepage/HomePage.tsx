'use client'

import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import ProductsSection from './ProductsSection'
import ValuesSection from './ValuesSection'
import CTASection from './CTASection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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

interface HomePageProps {
  content: Record<string, string>
  images: Record<string, string>
  products: Product[]
  onOpenAdmin: () => void
}

export default function HomePage({ content, images, products, onOpenAdmin }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header logoUrl={images['logo-main'] || '/logo-main.png'} />
      <main className="flex-1">
        <HeroSection
          content={content}
          logoAltUrl={images['logo-alt'] || '/logo-alt.png'}
        />
        <AboutSection
          content={content}
          logoAltUrl={images['logo-alt'] || '/logo-alt.png'}
        />
        <ProductsSection
          content={content}
          products={products}
        />
        <ValuesSection content={content} />
        <CTASection content={content} />
      </main>
      <Footer
        logoUrl={images['logo-main'] || '/logo-main.png'}
        onOpenAdmin={onOpenAdmin}
      />
    </div>
  )
}
