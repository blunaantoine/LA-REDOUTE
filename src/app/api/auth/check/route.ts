import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // checkAuth now supports both cookie and Bearer token auth
    if (checkAuth(request)) {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false })
  } catch {
    return NextResponse.json(
      { authenticated: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
