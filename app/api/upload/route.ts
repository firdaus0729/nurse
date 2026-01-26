import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      console.error('Upload: No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Upload: Session found, processing file...')
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only images are allowed.` },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create upload directory if it doesn't exist
    // Use a more reliable path resolution
    const cwd = process.cwd()
    console.log('Current working directory:', cwd)
    
    // Build the upload directory path
    const publicDir = join(cwd, 'public')
    const uploadDir = join(publicDir, 'upload')
    
    console.log('Public directory:', publicDir)
    console.log('Upload directory:', uploadDir)
    
    try {
      // Ensure both public and upload directories exist
      if (!existsSync(publicDir)) {
        console.log('Creating public directory...')
        await mkdir(publicDir, { recursive: true })
      }
      if (!existsSync(uploadDir)) {
        console.log('Creating upload directory...')
        await mkdir(uploadDir, { recursive: true })
      }
      console.log('Upload directory verified:', uploadDir)
    } catch (mkdirError: any) {
      console.error('Error creating upload directory:', mkdirError)
      console.error('Attempted paths - Public:', publicDir, 'Upload:', uploadDir)
      return NextResponse.json(
        { error: `Failed to create upload directory: ${mkdirError.message}. Tried: ${uploadDir}` },
        { status: 500 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${timestamp}-${randomStr}.${extension}`
    const filepath = join(uploadDir, filename)

    // Write file
    try {
      await writeFile(filepath, buffer)
      console.log(`Upload: File written successfully to ${filepath}`)
    } catch (writeError: any) {
      console.error('Error writing file:', writeError)
      console.error('File path:', filepath)
      return NextResponse.json(
        { error: `Failed to write file: ${writeError.message}` },
        { status: 500 }
      )
    }

    // Return public URL (relative to public folder)
    const publicUrl = `/upload/${filename}`
    console.log(`Upload: Success! URL: ${publicUrl}`)

    return NextResponse.json({ url: publicUrl, filename })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: `Failed to upload file: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
