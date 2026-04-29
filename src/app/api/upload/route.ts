import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { checkAuth, unauthorizedResponse } from '@/lib/auth'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) return unauthorizedResponse()

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = formData.get('category') as string | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, GIF, WebP ou SVG.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux. Maximum 10MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const originalSize = buffer.length

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category || 'general')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const ext = path.extname(file.name) || '.png'
    const baseName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const uniqueName = `${baseName}${ext}`

    const isSvg = file.type === 'image/svg+xml'

    let finalBuffer: Buffer
    let finalExt: string
    let thumbBuffer: Buffer | null = null
    let thumbExt: string

    if (isSvg) {
      // Skip Sharp processing for SVG files
      finalBuffer = buffer
      finalExt = ext
      thumbBuffer = null
      thumbExt = ext
    } else {
      try {
        // Detect if PNG has transparency
        const isPngWithAlpha = file.type === 'image/png'
        let hasTransparency = false

        if (isPngWithAlpha) {
          const metadata = await sharp(buffer).metadata()
          hasTransparency = metadata.hasAlpha === true
        }

        // Determine output format
        // PNG with transparency stays PNG; everything else becomes WebP
        const shouldKeepPng = isPngWithAlpha && hasTransparency

        if (shouldKeepPng) {
          // Resize but keep PNG format for transparency
          finalBuffer = await sharp(buffer)
            .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
            .png({ quality: 80 })
            .toBuffer()

          finalExt = '.png'

          // Thumbnail in PNG as well
          thumbBuffer = await sharp(buffer)
            .resize(400, null, { withoutEnlargement: true, fit: 'inside' })
            .png({ quality: 70 })
            .toBuffer()

          thumbExt = '.png'
        } else {
          // Convert to WebP for better compression
          finalBuffer = await sharp(buffer)
            .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
            .webp({ quality: 80 })
            .toBuffer()

          finalExt = '.webp'

          // Thumbnail in WebP
          thumbBuffer = await sharp(buffer)
            .resize(400, null, { withoutEnlargement: true, fit: 'inside' })
            .webp({ quality: 70 })
            .toBuffer()

          thumbExt = '.webp'
        }
      } catch (sharpError) {
        // Fallback: if Sharp fails, write the original buffer
        console.error('Sharp processing failed, falling back to original buffer:', sharpError)
        finalBuffer = buffer
        finalExt = ext
        thumbBuffer = null
        thumbExt = ext
      }
    }

    // Update filename to use the correct extension
    const finalName = `${baseName}${finalExt}`
    const filePath = path.join(uploadDir, finalName)

    await writeFile(filePath, finalBuffer)

    const url = `/uploads/${category || 'general'}/${finalName}`
    let thumbUrl: string | null = null

    // Write thumbnail if generated
    if (thumbBuffer) {
      const thumbName = `${baseName}-thumb${thumbExt}`
      const thumbPath = path.join(uploadDir, thumbName)

      await writeFile(thumbPath, thumbBuffer)

      thumbUrl = `/uploads/${category || 'general'}/${thumbName}`
    }

    const optimizedSize = finalBuffer.length

    return NextResponse.json({
      success: true,
      url,
      thumbUrl,
      filename: finalName,
      originalSize,
      optimizedSize,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    )
  }
}
