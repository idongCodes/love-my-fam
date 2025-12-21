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

export default async function MyRoom() {
  const user = await getUser()

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center font-sans">
        <p>Please log in to view your room.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-8">
      <MyRoomClient user={user} />
    </main>
  )
}