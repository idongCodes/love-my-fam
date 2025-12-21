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

// =======================================================
// 1. POST ACTIONS
// =======================================================

export async function createPost(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: 'Unauthorized' }

  const content = formData.get('content') as string || ""
  const imageFile = formData.get('file') as File | null 

  const hasText = content.trim().length > 0
  const hasImage = imageFile && imageFile.size > 0

  if (!hasText && !hasImage) {
    return { success: false, message: "Post cannot be empty" }
  }

  let imageUrl = null

  if (hasImage) {
    const blob = await put(imageFile!.name, imageFile!, {
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

// --- UPDATED: EDIT POST (Supports Title/Urgency for Announcements) ---
export async function editPost(
  postId: string, 
  newContent: string, 
  newTitle?: string, 
  newIsUrgent?: boolean
) {
  const userId = await getCurrentUserId()
  const post = await prisma.post.findUnique({ where: { id: postId } })
  
  if (!post || post.authorId !== userId) return { success: false, message: 'Unauthorized' }
  
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  
  // Rule: Regular posts have a 10-minute edit limit. Announcements (Admin) do not.
  if (!post.isAnnouncement && post.createdAt < tenMinutesAgo) {
      return { success: false, message: 'Edit time limit expired.' }
  }

  // Prepare update data
  const data: any = { content: newContent, isEdited: true }
  
  // Only update title/urgent if provided (for announcements)
  if (newTitle !== undefined) data.title = newTitle
  if (newIsUrgent !== undefined) data.isUrgent = newIsUrgent

  await prisma.post.update({
    where: { id: postId },
    data
  })

  revalidatePath('/common-room')
  return { success: true }
}

export async function toggleLike(postId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: "Unauthorized" }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  })

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } })
  } else {
    await prisma.like.create({ data: { userId, postId } })
  }

  revalidatePath('/common-room')
  return { success: true }
}

// =======================================================
// 2. COMMENT ACTIONS
// =======================================================

export async function addComment(postId: string, content: string, parentId?: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: "Unauthorized" }

  if (!content || content.trim().length === 0) return { success: false }

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
      parentId: parentId || null
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}

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

// =======================================================
// 3. ANNOUNCEMENT ACTIONS
// =======================================================

export async function createAnnouncement(formData: FormData) {
  const userId = await getCurrentUserId()
  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.email !== ADMIN_EMAIL) {
    return { success: false, message: "Only Admin can post announcements." }
  }

  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const isUrgent = formData.get('isUrgent') === 'true'

  if (!message || !title) return { success: false, message: "Title and Message are required." }

  await prisma.post.create({
    data: {
      title,
      content: message,
      authorId: userId!,
      isAnnouncement: true,
      isUrgent: isUrgent
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}

export async function dismissAnnouncement(postId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false }

  await prisma.postDismissal.create({
    data: {
      userId,
      postId
    }
  })

  revalidatePath('/common-room')
  return { success: true }
}

export async function getAnnouncements() {
  return await prisma.post.findMany({
    where: { isAnnouncement: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

// =======================================================
// 4. FEED FETCHING (Split Urgent vs Regular)
// =======================================================

export async function getFeedData() {
  const userId = await getCurrentUserId()
  
  // 1. Get Urgent Announcements (Not dismissed by me)
  const urgentPosts = await prisma.post.findMany({
    where: {
      isAnnouncement: true,
      isUrgent: true,
      dismissals: {
        none: { userId: userId } 
      }
    },
    include: {
      author: true,
      likes: { include: { user: true } },
      comments: { include: { author: true, likes: true, children: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  // 2. Get Regular Posts (Not announcements)
  const regularPosts = await prisma.post.findMany({
    where: {
      isAnnouncement: false
    },
    include: {
      author: true,
      likes: { include: { user: true } },
      comments: { include: { author: true, likes: true, children: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Helper to map data structure for frontend
  const mapPost = (p: any) => ({
    ...p,
    likeCount: p.likes.length,
    isLikedByMe: userId ? p.likes.some((l: any) => l.userId === userId) : false,
    topLevelComments: p.comments.filter((c: any) => !c.parentId)
  })

  return {
    urgentPosts: urgentPosts.map(mapPost),
    regularPosts: regularPosts.map(mapPost),
    currentUserId: userId
  }
}