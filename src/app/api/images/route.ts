import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const category = searchParams.get('category')

    if (key) {
      const image = await db.siteImage.findUnique({ where: { key } })
      if (!image) {
        return NextResponse.json(
          { error: 'Image non trouvée' },
          { status: 404 }
        )
      }
      return NextResponse.json(image)
    }

    if (category) {
      const images = await db.siteImage.findMany({
        where: { category },
        orderBy: { order: 'asc' },
      })
      return NextResponse.json(images)
    }

    const images = await db.siteImage.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return NextResponse.json(images)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const body = await request.json()
    const { key, category, title, description, imageUrl, altText, order } = body

    if (!key || !category || !title || !imageUrl) {
      return NextResponse.json(
        { error: 'Les champs key, category, title et imageUrl sont requis' },
        { status: 400 }
      )
    }

    const siteImage = await db.siteImage.create({
      data: { key, category, title, description, imageUrl, altText, order },
    })

    return NextResponse.json(siteImage, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'image" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis pour la mise à jour' },
        { status: 400 }
      )
    }

    const updated = await db.siteImage.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Image PUT error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'image" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis pour la suppression' },
        { status: 400 }
      )
    }

    await db.siteImage.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    )
  }
}
