'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  // 1. Delete the session cookie
  const cookieStore = await cookies()
  cookieStore.delete('session_id')

  // 2. Redirect to the Home Page
  redirect('/')
}