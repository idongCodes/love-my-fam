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
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                alias: true,
              }
            }
          }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                firstName: true,
                alias: true
              }
            }
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

export async function sendChatMessage(content: string, authorId: string, replyToId?: string) {
  try {
    if (!content.trim()) {
      return { success: false, message: 'Message cannot be empty' }
    }

    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        authorId,
        replyToId: replyToId || null
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
        },
        reactions: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                firstName: true,
                alias: true
              }
            }
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

export async function toggleReaction(messageId: string, userId: string, emoji: string) {
  try {
    // Check if reaction exists
    const existingReaction = await prisma.messageReaction.findFirst({
      where: {
        messageId,
        userId,
        emoji
      }
    })

    if (existingReaction) {
      // Remove reaction
      await prisma.messageReaction.delete({
        where: {
          id: existingReaction.id
        }
      })
    } else {
      // Add reaction
      await prisma.messageReaction.create({
        data: {
          messageId,
          userId,
          emoji
        }
      })
    }

    revalidatePath('/chat')
    return { success: true }
  } catch (error) {
    console.error('Error toggling reaction:', error)
    return { success: false, message: 'Failed to toggle reaction' }
  }
}
