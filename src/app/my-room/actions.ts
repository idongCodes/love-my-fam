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

  const imageFile = formData.get('file') as File

  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: "No image provided" }
  }

  try {
    console.log('Starting upload process...')
    console.log('Image file:', imageFile)
    console.log('Image file name:', imageFile?.name)
    console.log('Image file size:', imageFile?.size)
    console.log('Image file type:', imageFile?.type)
    
    // Create a new File object to ensure proper format
    const fileToUpload = new File([imageFile], imageFile.name, {
      type: imageFile.type || 'image/jpeg'
    })
    
    const blob = await put(fileToUpload.name, fileToUpload)
    console.log('Blob upload successful:', blob.url)

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: blob.url }
    })
    
    console.log('Database update successful')

    revalidatePath('/my-room')
    revalidatePath('/common-room')
    revalidatePath('/family')
    revalidatePath('/') 

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Upload failed:", error)
    console.error("Error type:", typeof error)
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error')
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        return { success: false, message: "File not found or path error" }
      }
      if (error.message.includes('EACCES')) {
        return { success: false, message: "Permission denied accessing file" }
      }
      if (error.message.includes('blob') || error.message.includes('upload')) {
        return { success: false, message: "Blob storage upload failed - check Vercel configuration" }
      }
      if (error.message.includes('prisma') || error.message.includes('database')) {
        return { success: false, message: "Database update failed" }
      }
    }
    
    return { success: false, message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` }
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