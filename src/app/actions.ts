'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

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

  try {
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { error: 'user_not_found' }
    }

    const { sendEmail } = await import('@/lib/email')
    
    await sendEmail({
      to: "idongesit_essien@ymail.com",
      subject: `New Feedback from ${user.firstName} ${user.lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Feedback Received</h2>
          <p><strong>From:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <h3>Message:</h3>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${content}</p>
        </div>
      `
    })

    // TODO: Save this to a database table (e.g., 'Feedback') later.
    console.log("Feedback emailed from:", user.email)

    return { success: true }
  } catch (error) {
    console.error("Failed to send feedback email:", error)
    return { error: 'failed_to_send' }
  }
}