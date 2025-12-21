'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'

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
  const imageFile = formData.get('media') as File | null

  if (!content || content.trim().length === 0) return { success: false }

  let imageUrl = null

  // If there is a file, upload it to Vercel Blob
  if (imageFile && imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    })
    imageUrl = blob.url
  }

  await prisma.post.create({
    data: {
      content,
      imageUrl,
      authorId: userId
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}

// --- 2. DELETE POST ---
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

// --- 3. EDIT POST ---
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

// --- 4. TOGGLE LIKE ---
export async function toggleLike(postId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: "Unauthorized" }

  // Check if like exists
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  })

  if (existingLike) {
    // UNLIKE
    await prisma.like.delete({
      where: { id: existingLike.id }
    })
  } else {
    // LIKE
    await prisma.like.create({
      data: {
        userId,
        postId
      }
    })
  }

  revalidatePath('/common-room')
  return { success: true }
}

// --- 5. ADD COMMENT ---
export async function addComment(postId: string, content: string, parentId?: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: "Unauthorized" }

  if (!content || content.trim().length === 0) return { success: false }

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
      parentId: parentId || null // If it's a reply, link to parent
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}

// --- 6. TOGGLE COMMENT LIKE ---
export async function toggleCommentLike(commentId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: "Unauthorized" }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId
      }
    }
  })

  if (existingLike) {
    await prisma.commentLike.delete({ where: { id: existingLike.id } })
  } else {
    await prisma.commentLike.create({ data: { userId, commentId } })
  }

  revalidatePath('/common-room')
  return { success: true }
}

// ... (Previous imports and functions)

// --- 7. DELETE COMMENT ---
export async function deleteComment(commentId: string) {
  const userId = await getCurrentUserId()
  
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment || comment.authorId !== userId) {
    return { success: false, message: 'Unauthorized' }
  }

  await prisma.comment.delete({ where: { id: commentId } })
  revalidatePath('/common-room')
  return { success: true }
}

// --- 8. EDIT COMMENT ---
export async function editComment(commentId: string, newContent: string) {
  const userId = await getCurrentUserId()
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  
  if (!comment || comment.authorId !== userId) return { success: false, message: 'Unauthorized' }
  if (comment.isEdited) return { success: false, message: 'Comment can only be edited once.' }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  if (comment.createdAt < tenMinutesAgo) return { success: false, message: 'Edit time limit expired.' }

  await prisma.comment.update({
    where: { id: commentId },
    data: { content: newContent, isEdited: true }
  })

  revalidatePath('/common-room')
  return { success: true }
}