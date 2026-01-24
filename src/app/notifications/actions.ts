'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

async function getCurrentUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('session_id')?.value
}

export async function getNotifications() {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, message: 'Unauthorized', notifications: [] }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, notifications }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, message: 'Failed to fetch notifications', notifications: [] }
  }
}

export async function markAsRead(notificationId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false }

  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })
    revalidatePath('/notifications')
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false }
  }
}

export async function markAllAsRead() {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false }

  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })
    revalidatePath('/notifications')
    return { success: true }
  } catch (error) {
    console.error('Error marking all as read:', error)
    return { success: false }
  }
}

export async function getUnreadCount() {
  const userId = await getCurrentUserId()
  if (!userId) return 0

  try {
    return await prisma.notification.count({
      where: { userId, isRead: false }
    })
  } catch (error) {
    return 0
  }
}
