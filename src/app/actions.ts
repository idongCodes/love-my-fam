'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// ... (keep your existing logout function) ...
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session_id')
  redirect('/')
}

// NEW: Handle General Feedback
export async function submitGeneralFeedback(content: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_id')?.value

  if (!userId) {
    return { error: 'unauthorized' }
  }

  // TODO: Save this to a database table (e.g., 'Feedback') later.
  console.log("Feedback received:", content, "From:", userId)

  return { success: true }
}