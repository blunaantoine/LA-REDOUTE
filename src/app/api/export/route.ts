import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type || !['products', 'content', 'messages'].includes(type)) {
      return NextResponse.json(
        { error: 'Type invalide. Utilisez: products, content, messages' },
        { status: 400 }
      )
    }

    let csv = ''
    let filename = ''

    if (type === 'products') {
      const products = await db.product.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      })

      const headers = ['Titre', 'Catégorie', 'Sous-catégorie', 'Variants', 'Actif', 'Description']
      csv = headers.join(',') + '\n'

      products.forEach((p) => {
        const row = [
          `"${(p.title || '').replace(/"/g, '""')}"`,
          `"${(p.category || '').replace(/"/g, '""')}"`,
          `"${(p.subcategory || '').replace(/"/g, '""')}"`,
          `"${(p.variants || '').replace(/"/g, '""')}"`,
          p.isActive ? 'Oui' : 'Non',
          `"${(p.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        ]
        csv += row.join(',') + '\n'
      })

      filename = 'produits-laredoute.csv'
    } else if (type === 'content') {
      const contents = await db.siteContent.findMany({
        orderBy: { createdAt: 'asc' },
      })

      const headers = ['Clé', 'Catégorie', 'Titre', 'Contenu']
      csv = headers.join(',') + '\n'

      contents.forEach((c) => {
        const row = [
          `"${(c.key || '').replace(/"/g, '""')}"`,
          `"${(c.category || '').replace(/"/g, '""')}"`,
          `"${(c.title || '').replace(/"/g, '""')}"`,
          `"${(c.content || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        ]
        csv += row.join(',') + '\n'
      })

      filename = 'contenu-laredoute.csv'
    } else if (type === 'messages') {
      const messages = await db.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      })

      const headers = ['Nom', 'Email', 'Sujet', 'Message', 'Lu', 'Date']
      csv = headers.join(',') + '\n'

      messages.forEach((m) => {
        const row = [
          `"${(m.name || '').replace(/"/g, '""')}"`,
          `"${(m.email || '').replace(/"/g, '""')}"`,
          `"${(m.subject || '').replace(/"/g, '""')}"`,
          `"${(m.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          m.isRead ? 'Oui' : 'Non',
          `"${new Date(m.createdAt).toLocaleDateString('fr-FR')}"`,
        ]
        csv += row.join(',') + '\n'
      })

      filename = 'messages-laredoute.csv'
    }

    // Add BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF'
    const csvWithBom = bom + csv

    return new Response(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    )
  }
}
