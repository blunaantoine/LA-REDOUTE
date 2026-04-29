import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    const adminPassword = process.env.ADMIN_PASSWORD || 'laredoute2024'

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      token: generateToken(password), // Bearer token for localStorage-based auth
    })

    // Set cookie for cookie-based auth (primary)
    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Requête invalide' },
      { status: 400 }
    )
  }
}
