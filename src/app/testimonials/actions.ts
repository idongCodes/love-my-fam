'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

async function getCurrentUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('session_id')?.value
}

// 1. SUBMIT ACTION
export async function submitTestimonial(content: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: "Must be logged in" }
  
  if (!content.trim()) return { success: false, message: "Content empty" }

  await prisma.testimonial.create({
    data: {
      content,
      authorId: userId
    }
  })

  revalidatePath('/') 
  return { success: true }
}

// 2. SECURE FETCH ACTION
export async function getTestimonials() {
  const currentUserId = await getCurrentUserId()
  const isGuest = !currentUserId

  const testimonials = await prisma.testimonial.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        // ✅ ADDED: 'status' to selection
        select: { firstName: true, alias: true, email: true, profileImage: true, status: true } 
      }
    }
  })

  // HELPER: List of sensitive names to redact
  let sensitiveWords = new Set<string>()
  if (isGuest) {
    const allUsers = await prisma.user.findMany({
      select: { firstName: true, alias: true }
    })
    allUsers.forEach(u => {
      if (u.firstName) sensitiveWords.add(u.firstName.toLowerCase())
      if (u.alias) sensitiveWords.add(u.alias.toLowerCase())
    })
  }

  const redactText = (text: string) => {
    const words = text.split(' ')
    return words.map(word => {
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase()
      if (sensitiveWords.has(cleanWord)) {
        return "Family Member"
      }
      return word
    }).join(' ')
  }

  return testimonials.map(t => {
    // If Guest, we hide email AND profile image AND status
    if (isGuest) {
      return {
        id: t.id,
        content: t.content,
        createdAt: t.createdAt,
        authorEmail: null, 
        authorProfileImage: null, 
        authorStatus: null, // <--- Hide status
        displayAuthor: "Family Member",
        displayAvatar: null,
        redactedContent: redactText(t.content)
      }
    }

    // If Logged In, we show everything
    return {
      id: t.id,
      content: t.content,
      createdAt: t.createdAt,
      authorEmail: t.author.email,
      authorProfileImage: t.author.profileImage,
      authorStatus: t.author.status, // <--- Pass status
      displayAuthor: t.author.alias || t.author.firstName,
      displayAvatar: (t.author.alias || t.author.firstName)[0].toUpperCase(),
      redactedContent: t.content
    }
  })
}