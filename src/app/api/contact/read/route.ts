import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

const prisma = new PrismaClient()

// PATCH - Mark a contact message as read (auth required)
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { id, isRead } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID du message requis.' },
        { status: 400 }
      )
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: isRead !== undefined ? isRead : true },
    })

    return NextResponse.json({ success: true, message: updated })
  } catch (error) {
    console.error('Error updating contact message:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du message.' },
      { status: 500 }
    )
  }
}
