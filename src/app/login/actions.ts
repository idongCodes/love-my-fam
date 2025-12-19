'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Check the Shared Family Secret
  if (password !== 'familyfirst') {
    return { success: false, message: 'Wrong family secret!' }
  }

  // 2. Check if the user exists in our Database
  const user = await prisma.user.findUnique({
    where: { email: email }
  })

  if (!user) {
    return { success: false, message: 'Email not found. Please register first!' }
  }

  // 3. Set the Session Cookie
  const cookieStore = await cookies()
  cookieStore.set('session_id', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return { success: true }
}
