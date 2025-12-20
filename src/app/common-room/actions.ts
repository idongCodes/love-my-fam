'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// --- HELPER: GET CURRENT USER ID ---
async function getCurrentUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('session_id')?.value
}

// --- 1. CREATE POST ---
export async function createPost(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: 'Unauthorized' }

  const content = formData.get('content') as string
  if (!content || content.trim().length === 0) return { success: false }

  await prisma.post.create({
    data: {
      content,
      authorId: userId
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}

// --- 2. DELETE POST ---
export async function deletePost(postId: string) {
  const userId = await getCurrentUserId()
  
  // Verify ownership before deleting
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post || post.authorId !== userId) {
    return { success: false, message: 'Unauthorized' }
  }

  await prisma.post.delete({ where: { id: postId } })
  revalidatePath('/common-room')
  return { success: true }
}

// --- 3. EDIT POST ---
export async function editPost(postId: string, newContent: string) {
  const userId = await getCurrentUserId()

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post || post.authorId !== userId) {
    return { success: false, message: 'Unauthorized' }
  }

  // CHECK 1: Has it been edited before?
  if (post.isEdited) {
    return { success: false, message: 'Post can only be edited once.' }
  }

  // CHECK 2: Is it older than 10 minutes?
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  if (post.createdAt < tenMinutesAgo) {
    return { success: false, message: 'Edit time limit (10 mins) expired.' }
  }

  await prisma.post.update({
    where: { id: postId },
    data: { 
      content: newContent,
      isEdited: true // Mark as edited
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}