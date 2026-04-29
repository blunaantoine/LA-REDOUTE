import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

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
    if (!checkAuth(request)) return unauthorizedResponse()

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

    // Log activity
    await db.activityLog.create({
      data: {
        action: 'create',
        resource: 'content',
        resourceId: siteContent.id,
        details: `Contenu créé: ${key}`,
      },
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
    if (!checkAuth(request)) return unauthorizedResponse()

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

    // Log activity
    await db.activityLog.create({
      data: {
        action: 'update',
        resource: 'content',
        resourceId: updated.id,
        details: `Contenu mis à jour: ${updated.key}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Content PUT error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contenu' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

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

    // Get content info before delete
    const content = await db.siteContent.findUnique({ where: whereClause })

    await db.siteContent.delete({ where: whereClause })

    // Log activity
    await db.activityLog.create({
      data: {
        action: 'delete',
        resource: 'content',
        resourceId: id || undefined,
        details: `Contenu supprimé: ${content?.key || key || id}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contenu' },
      { status: 500 }
    )
  }
}
