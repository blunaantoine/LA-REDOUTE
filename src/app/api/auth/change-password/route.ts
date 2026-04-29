import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel et le nouveau mot de passe sont requis.' },
        { status: 400 }
      )
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'laredoute2024'

    if (currentPassword !== adminPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel est incorrect.' },
        { status: 401 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      )
    }

    // Since we can't persist env var changes in a serverless environment,
    // we update the in-memory value for the current session only.
    // Note: This change will be lost when the server restarts.
    process.env.ADMIN_PASSWORD = newPassword

    return NextResponse.json({
      success: true,
      message: 'Mot de passe changé avec succès. Note: le changement est valide pour la session en cours uniquement.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe.' },
      { status: 500 }
    )
  }
}
