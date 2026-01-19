'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function registerUser(formData: FormData) {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const alias = formData.get('alias') as string || firstName
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const securityAnswer = formData.get('securityAnswer') as string
  
  // 1. GRAB THE POSITION FROM THE FORM
  const position = formData.get('position') as string 

  // 2. THE SECURITY CHECK
  if (securityAnswer.trim().toLowerCase() !== 'mercy') {
    return { success: false, message: "Incorrect security answer." }
  }

  // 3. CHECK IF USER EXISTS
  const existingUser = await prisma.user.findUnique({
    where: { email: email }
  })

  if (existingUser) {
    return { success: false, message: "This email is already registered. Please Login." }
  }

  // 4. CREATE THE USER (INCLUDE POSITION!)
  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      alias,
      email,
      phone,
      position, // <--- THIS WAS MISSING
    }
  })

  // 5. SET SESSION COOKIE
  const cookieStore = await cookies()
  cookieStore.set('session_id', newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  // Also set a client-readable cookie for chat functionality
  cookieStore.set('user_session', newUser.id, {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  // 6. STORE JOIN MESSAGE IN COOKIE FOR CHAT MODAL
  const displayName = alias || firstName
  cookieStore.set('new_user_join_message', `${displayName} has joined the app! 🎉`, {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return { success: true }
}
