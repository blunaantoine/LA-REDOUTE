import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

// Create a fresh PrismaClient for this route to avoid cached client issues
const prisma = new PrismaClient()

// POST - Create a new contact message (public, no auth needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Les champs nom, email et message sont requis.' },
        { status: 400 }
      )
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        subject: subject ? String(subject).trim() : null,
        message: String(message).trim(),
      },
    })

    return NextResponse.json({ success: true, message: contactMessage }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact message:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message.' },
      { status: 500 }
    )
  }
}

// GET - List all contact messages (auth required)
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return unauthorizedResponse()
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const unreadCount = messages.filter((m) => !m.isRead).length

    return NextResponse.json({ messages, unreadCount })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages.' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a contact message (auth required)
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID du message requis.' },
        { status: 400 }
      )
    }

    await prisma.contactMessage.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du message.' },
      { status: 500 }
    )
  }
}
