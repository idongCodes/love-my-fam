import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import MyRoomClient from '@/components/MyRoomClient'

const prisma = new PrismaClient()

async function getUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_id')?.value
  if (!userId) return null

  return await prisma.user.findUnique({
    where: { id: userId }
  })
}

async function getSystemSettings() {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'global' }
  })
  return settings?.familySecret || 'familyfirst'
}

export default async function MyRoom() {
  const user = await getUser()
  const familySecret = await getSystemSettings() // <--- Fetch Secret

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center font-sans">
        <p>Please log in to view your room.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-8">
      {/* Pass secret to client */}
      <MyRoomClient user={user} familySecret={familySecret} />
    </main>
  )
}