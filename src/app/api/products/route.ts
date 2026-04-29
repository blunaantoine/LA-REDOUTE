import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const id = searchParams.get('id')
    const all = searchParams.get('all')

    if (id) {
      const product = await db.product.findUnique({ where: { id } })
      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }
      return NextResponse.json(product)
    }

    const activeFilter = all === 'true' ? {} : { isActive: true }

    if (category) {
      const products = await db.product.findMany({
        where: { category, ...activeFilter },
        orderBy: { order: 'asc' },
      })
      return NextResponse.json(products)
    }

    const products = await db.product.findMany({
      where: activeFilter,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const body = await request.json()
    const { category, subcategory, title, description, imageUrl, images, variants, order } = body

    if (!category || !title) {
      return NextResponse.json(
        { error: 'Les champs category et title sont requis' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: { category, subcategory, title, description, imageUrl, images, variants, order },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: 'create',
        resource: 'product',
        resourceId: product.id,
        details: `Produit créé: ${title}`,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
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

    const updated = await db.product.update({
      where: { id },
      data,
    })

    // Log activity
    const actionDesc = data.isActive !== undefined
      ? (data.isActive ? 'Produit activé' : 'Produit désactivé')
      : data.order !== undefined
        ? 'Ordre du produit modifié'
        : 'Produit mis à jour'
    await db.activityLog.create({
      data: {
        action: 'update',
        resource: 'product',
        resourceId: id,
        details: `${actionDesc}: ${updated.title}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Product PUT error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
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

    // Get product title before soft delete
    const product = await db.product.findUnique({ where: { id } })

    // Soft delete
    await db.product.update({
      where: { id },
      data: { isActive: false },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: 'delete',
        resource: 'product',
        resourceId: id,
        details: `Produit supprimé: ${product?.title || id}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}
