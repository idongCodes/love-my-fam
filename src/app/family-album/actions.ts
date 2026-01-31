'use server'

import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

async function getCurrentUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('session_id')?.value
}

export async function getAlbumMedia(page: number = 1, limit: number = 50) {
  try {
    const skip = (page - 1) * limit
    
    const media = await prisma.albumMedia.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        uploader: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    // Map to match the frontend interface if needed, or update frontend to match this
    // For now returning raw prisma result which is close enough
    // Frontend expects: { id, type, src, thumbnail }
    
    const mappedMedia = media.map(item => ({
      id: item.id,
      type: item.type,
      src: item.url,
      thumbnail: item.thumbnailUrl || item.url,
      altText: item.altText,
      uploader: item.uploader
    }))

    return { success: true, data: mappedMedia }
  } catch (error) {
    console.error('Error fetching album media:', error)
    return { success: false, data: [] }
  }
}

export async function uploadAlbumMedia(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return { success: false, message: 'Unauthorized' }
  }

  const file = formData.get('file') as File
  const altText = formData.get('altText') as string
  const type = formData.get('type') as string // 'image' or 'video'

  if (!file) {
    return { success: false, message: 'No file provided' }
  }

  try {
    // 1. Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file, 'family-album')
    
    // 2. Save to DB
    await prisma.albumMedia.create({
      data: {
        url: uploadResult.url,
        thumbnailUrl: uploadResult.url, 
        type: type,
        altText: altText,
        uploaderId: userId
      }
    })

    revalidatePath('/family-album')
    return { success: true }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, message: 'Upload failed' }
  }
}
