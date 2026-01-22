'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

// --- 1. UPDATE PROFILE PHOTO ---
export async function updateProfilePhoto(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_id')?.value

  if (!userId) return { success: false, message: "Unauthorized" }

  const imageFile = formData.get('file') as File | null

  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: "No image provided" }
  }

  // --- PRODUCTION VALIDATION ---
  const MAX_SIZE = 4.5 * 1024 * 1024 // 4.5MB (Vercel limit is 4.5MB for serverless bodies)
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (imageFile.size > MAX_SIZE) {
    return { success: false, message: "File is too large. Max 4.5MB." }
  }
  
  if (!ALLOWED_TYPES.includes(imageFile.type)) {
    return { success: false, message: "Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed." }
  }

  try {
    // ✅ FIX: Convert File to Buffer to avoid "stream is not a function" error
    const arrayBuffer = await imageFile.arrayBuffer()

    const blob = await put(imageFile.name, arrayBuffer, {
      access: 'public',
      contentType: imageFile.type // Explicitly set content type since Buffer doesn't have it
    })

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: blob.url }
    })

    revalidatePath('/my-room')
    revalidatePath('/common-room')
    revalidatePath('/family')
    revalidatePath('/') 

    return { success: true, url: blob.url }
  } catch (error: any) {
    console.log("Server Error Log:", error);
    // console.error("Upload failed:", error)
    return { success: false, message: `Server Error: ${error.message || JSON.stringify(error)}` }
  }
}

// --- 2. UPDATE PROFILE DETAILS (Updated with Status) ---
export async function updateProfileDetails(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_id')?.value

  if (!userId) return { success: false, message: "Unauthorized" }

  const bio = formData.get('bio') as string
  const location = formData.get('location') as string
  const alias = formData.get('alias') as string 
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const position = formData.get('position') as string
  const status = formData.get('status') as string // <--- NEW

  if (!firstName || !lastName || !position) {
    return { success: false, message: "Name and Position are required." }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        bio,
        location,
        alias,
        firstName,
        lastName,
        position,
        status // <--- Save Status
      }
    })

    revalidatePath('/my-room')
    revalidatePath('/family') 
    revalidatePath('/common-room')
    
    return { success: true }
  } catch (error) {
    console.error("Update failed:", error)
    return { success: false, message: "Failed to update profile" }
  }
}

// --- 3. UPDATE FAMILY SECRET (Admin Only) ---
export async function updateFamilySecret(newSecret: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_id')?.value
  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'

  if (!userId) return { success: false, message: "Unauthorized" }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: "Only Admin can change the family secret." }
  }

  if (!newSecret || newSecret.trim().length < 4) {
    return { success: false, message: "Secret must be at least 4 characters." }
  }

  // Update or Create the settings row
  await prisma.systemSettings.upsert({
    where: { id: 'global' },
    update: { familySecret: newSecret },
    create: { id: 'global', familySecret: newSecret }
  })

  revalidatePath('/my-room')
  return { success: true }
}