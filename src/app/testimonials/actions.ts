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

  revalidatePath('/') // Refresh the home page to show new testimonial
  return { success: true }
}

// 2. SECURE FETCH ACTION
export async function getTestimonials() {
  const currentUserId = await getCurrentUserId()
  const isGuest = !currentUserId

  // Fetch testimonials (limit to recent 6 for design)
  const testimonials = await prisma.testimonial.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { firstName: true, alias: true }
      }
    }
  })

  // IF LOGGED IN: Return data as is
  if (!isGuest) {
    return testimonials.map(t => ({
      ...t,
      displayAuthor: t.author.alias || t.author.firstName,
      displayAvatar: (t.author.alias || t.author.firstName)[0].toUpperCase(),
      redactedContent: t.content
    }))
  }

  // IF GUEST: Redact names and hide author info
  
  // A. Get list of sensitive names (All first names & aliases in DB)
  const allUsers = await prisma.user.findMany({
    select: { firstName: true, alias: true }
  })
  
  const sensitiveWords = new Set<string>()
  allUsers.forEach(u => {
    if (u.firstName) sensitiveWords.add(u.firstName.toLowerCase())
    if (u.alias) sensitiveWords.add(u.alias.toLowerCase())
  })

  // B. Redact Function
  const redactText = (text: string) => {
    const words = text.split(' ')
    return words.map(word => {
      // Strip punctuation for checking (e.g., "John," -> "john")
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase()
      if (sensitiveWords.has(cleanWord)) {
        return "Family Member" // The replacement text
      }
      return word
    }).join(' ')
  }

  return testimonials.map(t => ({
    id: t.id,
    content: t.content,
    createdAt: t.createdAt,
    // HIDE AUTHOR IDENTITY
    displayAuthor: "Family Member",
    displayAvatar: null, 
    // REDACT CONTENT
    redactedContent: redactText(t.content)
  }))
}