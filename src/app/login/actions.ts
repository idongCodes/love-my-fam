'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. FETCH SECRET FROM DB
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'global' }
  })
  
  // Fallback to 'familyfirst' if DB record is missing (safety net)
  const currentSecret = settings?.familySecret || 'familyfirst'

  // 2. CHECK PASSWORD
  if (password !== currentSecret) {
    return { success: false, message: 'Wrong family secret!' }
  }

  // 3. CHECK USER
  const user = await prisma.user.findUnique({
    where: { email: email }
  })

  if (!user) {
    return { success: false, message: 'Email not found. Please register first!' }
  }

  const cookieStore = await cookies()
  cookieStore.set('session_id', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return { success: true }
}