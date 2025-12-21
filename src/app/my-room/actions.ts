'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateProfilePhoto(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_id')?.value

  if (!userId) {
    return { success: false, message: "Unauthorized" }
  }

  const imageFile = formData.get('file') as File | null

  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: "No image provided" }
  }

  try {
    // 1. Upload to Vercel Blob
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    })

    // 2. Save URL to Database
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: blob.url }
    })

    // 3. Refresh pages where the avatar appears
    revalidatePath('/my-room')
    revalidatePath('/common-room')
    revalidatePath('/family')
    revalidatePath('/') // Navbar might show avatar later

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Upload failed:", error)
    return { success: false, message: "Failed to upload image" }
  }
}