'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getChatMessages() {
  try {
    const messages = await prisma.chatMessage.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            alias: true,
            profileImage: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    return { success: true, messages }
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return { success: false, message: 'Failed to fetch messages' }
  }
}

export async function sendChatMessage(content: string, authorId: string) {
  try {
    if (!content.trim()) {
      return { success: false, message: 'Message cannot be empty' }
    }

    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            alias: true,
            profileImage: true,
          }
        }
      }
    })

    revalidatePath('/chat')
    return { success: true, message }
  } catch (error) {
    console.error('Error sending chat message:', error)
    return { success: false, message: 'Failed to send message' }
  }
}
