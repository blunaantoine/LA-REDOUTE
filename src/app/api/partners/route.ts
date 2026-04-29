import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

export async function GET() {
  try {
    const partners = await db.partner.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(partners)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des partenaires' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const body = await request.json()
    const { name, description, logoUrl, documentUrl, order } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Le champ name est requis' },
        { status: 400 }
      )
    }

    const partner = await db.partner.create({
      data: { name, description, logoUrl, documentUrl, order },
    })

    return NextResponse.json(partner, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création du partenaire' },
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

    const updated = await db.partner.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Partner PUT error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du partenaire' },
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

    await db.partner.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du partenaire' },
      { status: 500 }
    )
  }
}
