'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

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

  try {
    const blob = await put(imageFile.name, imageFile, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN,})

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: blob.url }
    })

    revalidatePath('/my-room')
    revalidatePath('/common-room')
    revalidatePath('/family')
    revalidatePath('/') 

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Upload failed:", error)
    return { success: false, message: "Failed to upload image" }
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