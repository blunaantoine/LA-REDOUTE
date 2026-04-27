import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.heic': 'image/heic',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...pathSegments)

    // Security: ensure the path doesn't escape the uploads directory
    const resolvedPath = path.resolve(filePath)
    const uploadsDir = path.resolve(path.join(process.cwd(), 'public', 'uploads'))
    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    // Check if file exists
    try {
      const fileStat = await stat(resolvedPath)
      if (!fileStat.isFile()) {
        return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 })
      }
    } catch {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 })
    }

    const fileBuffer = await readFile(resolvedPath)
    const ext = path.extname(resolvedPath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la lecture du fichier' },
      { status: 500 }
    )
  }
}
