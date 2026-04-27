import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const category = searchParams.get('category')

    if (key) {
      const content = await db.siteContent.findUnique({ where: { key } })
      if (!content) {
        return NextResponse.json(
          { error: 'Contenu non trouvé' },
          { status: 404 }
        )
      }
      return NextResponse.json(content)
    }

    if (category) {
      const contents = await db.siteContent.findMany({
        where: { category },
        orderBy: { createdAt: 'asc' },
      })
      return NextResponse.json(contents)
    }

    const contents = await db.siteContent.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(contents)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contenu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, category, title, content } = body

    if (!key || !category || !content) {
      return NextResponse.json(
        { error: 'Les champs key, category et content sont requis' },
        { status: 400 }
      )
    }

    const siteContent = await db.siteContent.create({
      data: { key, category, title, content },
    })

    return NextResponse.json(siteContent, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création du contenu' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, key, ...data } = body

    if (!id && !key) {
      return NextResponse.json(
        { error: 'ID ou key requis pour la mise à jour' },
        { status: 400 }
      )
    }

    const whereClause = id ? { id } : { key }

    const updated = await db.siteContent.update({
      where: whereClause,
      data,
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contenu' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const key = searchParams.get('key')

    if (!id && !key) {
      return NextResponse.json(
        { error: 'ID ou key requis pour la suppression' },
        { status: 400 }
      )
    }

    const whereClause = id ? { id } : { key }

    await db.siteContent.delete({ where: whereClause })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contenu' },
      { status: 500 }
    )
  }
}
