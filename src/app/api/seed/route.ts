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

const DEFAULT_IMAGES = [
  { key: 'logo-main', category: 'logo', title: 'Logo Principal', imageUrl: '/logo-main.png' },
  { key: 'logo-alt', category: 'logo', title: 'Logo Alternatif', imageUrl: '/logo-alt.png' },
  { key: 'hero-background', category: 'hero', title: 'Arrière-plan Hero', imageUrl: '/pattern.png' },
  { key: 'about-team', category: 'about', title: 'Photo Équipe', imageUrl: '/about-team.png' },
]

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

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

    return NextResponse.json({
      success: true,
      contentCreated,
      imagesCreated,
      totalCreated: contentCreated + imagesCreated,
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du seed de la base de données' },
      { status: 500 }
    )
  }
}
