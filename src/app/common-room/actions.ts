'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob' // <--- NEW IMPORT

const prisma = new PrismaClient()

async function getCurrentUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('session_id')?.value
}

// --- 1. CREATE POST (Now with Image Support) ---
export async function createPost(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: 'Unauthorized' }

  const content = formData.get('content') as string
  const imageFile = formData.get('media') as File | null // <--- GRAB THE FILE

  if (!content || content.trim().length === 0) return { success: false }

  let imageUrl = null

  // If there is a file, upload it to Vercel Blob
  if (imageFile && imageFile.size > 0) {
    // 1. Upload the file
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    })
    // 2. Get the public URL
    imageUrl = blob.url
  }

  // 3. Save to Database
  await prisma.post.create({
    data: {
      content,
      imageUrl, // <--- SAVE THE URL
      authorId: userId
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}

// ... (Keep deletePost and editPost the same as before)
export async function deletePost(postId: string) {
  const userId = await getCurrentUserId()
  
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post || post.authorId !== userId) {
    return { success: false, message: 'Unauthorized' }
  }

  await prisma.post.delete({ where: { id: postId } })
  revalidatePath('/common-room')
  return { success: true }
}

export async function editPost(postId: string, newContent: string) {
  const userId = await getCurrentUserId()
  const post = await prisma.post.findUnique({ where: { id: postId } })
  
  if (!post || post.authorId !== userId) return { success: false, message: 'Unauthorized' }
  if (post.isEdited) return { success: false, message: 'Post can only be edited once.' }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  if (post.createdAt < tenMinutesAgo) return { success: false, message: 'Edit time limit expired.' }

  await prisma.post.update({
    where: { id: postId },
    data: { content: newContent, isEdited: true }
  })

  revalidatePath('/common-room')
  return { success: true }
}