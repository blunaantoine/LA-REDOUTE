import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

const DEFAULT_CONTENTS = [
  // Homepage content
  { key: 'hero-title', category: 'homepage', content: 'LA REDOUTE' },
  { key: 'hero-subtitle', category: 'homepage', content: 'SARL-U' },
  { key: 'hero-description', category: 'homepage', content: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel." },
  { key: 'hero-badge', category: 'homepage', content: 'Votre partenaire de confiance depuis des années' },
  { key: 'about-title', category: 'homepage', content: "Une entreprise togolaise engagée pour l'excellence" },
  { key: 'about-description', category: 'homepage', content: "Fondée avec la vision de fournir des produits de qualité supérieure au marché togolais, LA REDOUTE SARL-U a grandi pour devenir un distributeur de confiance." },
  { key: 'about-mission', category: 'homepage', content: 'Fournir des produits de qualité à des prix compétitifs, tout en assurant un service client exceptionnel. Nous nous efforçons d\'être le pont entre les meilleurs fabricants mondiaux et le marché togolais.' },
  { key: 'about-vision', category: 'homepage', content: "Devenir le leader de la distribution en Afrique de l'Ouest, reconnu pour l'excellence de nos produits, la fiabilité de notre service et notre contribution au développement économique de la région." },
  { key: 'about-story', category: 'homepage', content: "Depuis sa création, LA REDOUTE SARL-U s'est imposée comme un acteur majeur de la distribution au Togo. Notre engagement envers la qualité et le service client a fait de nous le partenaire de confiance de centaines de professionnels et particuliers." },
  { key: 'about-story2', category: 'homepage', content: "Spécialisée dans la distribution de produits automobiles et agro-alimentaires, nous offrons une gamme complète de produits soigneusement sélectionnés pour répondre aux besoins les plus exigeants du marché togolais et de la sous-région ouest-africaine." },
  { key: 'cta-title', category: 'homepage', content: 'Prêt à Travailler Avec Nous ?' },
  { key: 'cta-description', category: 'homepage', content: "Nous sommes à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets." },
  { key: 'values-title', category: 'homepage', content: 'Ce Qui Nous Définit' },
  { key: 'products-title', category: 'homepage', content: "Deux Domaines d'Expertise" },
  { key: 'auto-description', category: 'homepage', content: "Large sélection de pneus, huiles moteurs et accessoires automobiles pour tous véhicules." },
  { key: 'agro-description', category: 'homepage', content: 'Distribution de produits alimentaires de qualité, boissons et céréales.' },
  // Automobile page content
  { key: 'auto-page-title', category: 'automobile', content: 'Nos Produits Automobile' },
  { key: 'auto-page-subtitle', category: 'automobile', content: 'Découvrez notre gamme complète de produits automobiles' },
  // Agro-alimentaire page content
  { key: 'agro-page-title', category: 'agroalimentaire', content: 'Nos Produits Agro-alimentaire' },
  { key: 'agro-page-subtitle', category: 'agroalimentaire', content: 'Des produits de qualité pour votre alimentation' },
]

const DEFAULT_PRODUCTS = [
  // Automobile - Pneus
  { category: 'pneus', subcategory: 'automobile', title: 'Michelin Energy Saver', description: 'Pneu tourisme été haute performance avec faible résistance au roulement', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.23 (2).jpeg', variants: '175/65R14, 185/65R15, 195/65R15, 205/55R16', order: 1 },
  { category: 'pneus', subcategory: 'automobile', title: 'BFGoodrich Advantage', description: 'Pneu tourisme polyvalent pour toutes les conditions', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.23.jpeg', variants: '185/65R15, 195/65R15, 205/55R16, 215/55R17', order: 2 },
  { category: 'pneus', subcategory: 'automobile', title: 'Michelin Agilis+', description: 'Pneu utilitaire léger robuste et durable', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.23 (1).jpeg', variants: '195/65R15C, 205/65R16C, 215/65R16C', order: 3 },
  // Automobile - Huiles
  { category: 'huiles', subcategory: 'automobile', title: 'Total Quartz 9000 5W-30', description: 'Huile moteur synthétique pour performances optimales', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.24 (1).jpeg', variants: '1L, 4L, 5L, 208L', order: 1 },
  { category: 'huiles', subcategory: 'automobile', title: 'Total Quartz 7000 10W-40', description: 'Huile moteur semi-synthétique pour usage quotidien', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.24.jpeg', variants: '1L, 4L, 5L', order: 2 },
  { category: 'huiles', subcategory: 'automobile', title: 'Total Rubia 15W-40', description: 'Huile moteur diesel pour véhicules utilitaires', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.23 (3).jpeg', variants: '5L, 20L, 208L', order: 3 },
  // Automobile - Accessoires
  { category: 'accessoires', subcategory: 'automobile', title: 'Filtre à air universel', description: 'Filtre haute qualité pour une admission d\'air optimale', variants: 'Universel, Sur mesure', order: 1 },
  { category: 'accessoires', subcategory: 'automobile', title: 'Liquide de frein DOT4', description: 'Liquide de frein haute performance', variants: '500ml, 1L', order: 2 },
  // Agro-alimentaire - Alimentation
  { category: 'alimentation', subcategory: 'agroalimentaire', title: 'Riz La Rizière Premium', description: 'Riz long grain de qualité supérieure', imageUrl: '/uploads/products/la-riziere.jpg', variants: '1kg, 5kg, 10kg, 25kg, 50kg', order: 1 },
  { category: 'alimentation', subcategory: 'agroalimentaire', title: 'Riz Malaika', description: 'Riz parfumé de haute qualité', imageUrl: '/uploads/products/malaika-rice-2.jpg', variants: '1kg, 5kg, 10kg, 25kg', order: 2 },
  { category: 'alimentation', subcategory: 'agroalimentaire', title: 'Aïcha Riz', description: 'Riz de qualité pour la cuisine quotidienne', imageUrl: '/uploads/products/aicha-riz.jpg', variants: '1kg, 5kg, 10kg', order: 3 },
  { category: 'alimentation', subcategory: 'agroalimentaire', title: 'Huile Aïcha', description: 'Huile végétale de qualité pour la cuisine', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.23 (4).jpeg', variants: '1L, 5L, 10L, 20L', order: 4 },
  // Agro-alimentaire - Boissons
  { category: 'boissons', subcategory: 'agroalimentaire', title: 'Jus de fruits Aïcha', description: 'Jus de fruits naturel aux saveurs variées', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.25.jpeg', variants: '33cl, 1L', order: 1 },
  // Agro-alimentaire - Céréales
  { category: 'cereales', subcategory: 'agroalimentaire', title: 'Farine de blé Aïcha', description: 'Farine de blé premium pour pâtisserie et cuisine', imageUrl: '/uploads/products/WhatsApp Image 2026-04-27 at 11.08.25 (3).jpeg', variants: '1kg, 5kg, 25kg, 50kg', order: 1 },
  { category: 'cereales', subcategory: 'agroalimentaire', title: 'Semoule de blé', description: 'Semoule fine pour couscous et pâtisseries', variants: '1kg, 5kg, 25kg', order: 2 },
]

const DEFAULT_IMAGES = [
  { key: 'logo-main', category: 'logo', title: 'Logo Principal', imageUrl: '/logo-main.png' },
  { key: 'logo-alt', category: 'logo', title: 'Logo Alternatif', imageUrl: '/logo-alt.png' },
  { key: 'hero-background', category: 'hero', title: 'Arrière-plan Hero', imageUrl: '/pattern.png' },
  { key: 'about-team', category: 'about', title: 'Photo Équipe', imageUrl: '/about-team.png' },
]

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const reset = searchParams.get('reset') === 'true'

    // If reset=true, delete all existing data first
    if (reset) {
      await db.contactMessage.deleteMany()
      await db.siteContent.deleteMany()
      await db.siteImage.deleteMany()
      await db.product.deleteMany()
      await db.partner.deleteMany()
    }

    let contentCreated = 0
    let imagesCreated = 0

    // Seed SiteContent entries
    for (const item of DEFAULT_CONTENTS) {
      const existing = await db.siteContent.findUnique({ where: { key: item.key } })
      if (!existing) {
        await db.siteContent.create({ data: item })
        contentCreated++
      }
    }

    // Seed SiteImage entries
    for (const item of DEFAULT_IMAGES) {
      const existing = await db.siteImage.findUnique({ where: { key: item.key } })
      if (!existing) {
        await db.siteImage.create({ data: item })
        imagesCreated++
      }
    }

    // Seed Products
    let productsCreated = 0
    for (const item of DEFAULT_PRODUCTS) {
      const existing = await db.product.findFirst({ where: { title: item.title } })
      if (!existing) {
        await db.product.create({ data: item })
        productsCreated++
      }
    }

    return NextResponse.json({
      success: true,
      contentCreated,
      imagesCreated,
      productsCreated,
      totalCreated: contentCreated + imagesCreated + productsCreated,
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du seed de la base de données' },
      { status: 500 }
    )
  }
}
