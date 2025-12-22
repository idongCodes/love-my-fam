import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function ProfileRoom({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Await params (Required in Next.js 15+)
  const { slug } = await params

  // 2. Validate URL Format: Must end with "s-room"
  // Example: "/Idongs-room" -> slug: "Idongs-room"
  if (!slug.endsWith('s-room')) {
    notFound() // Returns 404 if it doesn't match the pattern
  }

  // 3. Extract the Name
  // Remove the last 6 characters ("s-room")
  // "Idongs-room" -> "Idong"
  const nameQuery = slug.slice(0, -6)

  // 4. Find the User (Case Insensitive)
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { firstName: { equals: nameQuery, mode: 'insensitive' } },
        { alias: { equals: nameQuery, mode: 'insensitive' } }
      ]
    }
  })

  // 5. Handle "User Not Found"
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center font-sans bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl mb-2">🚪</h1>
          <h2 className="text-xl font-bold text-slate-400">Room not found.</h2>
          <p className="text-slate-400 text-sm">Maybe they moved out?</p>
        </div>
      </main>
    )
  }

  // 6. Determine Display Name
  const displayName = user.alias || user.firstName

  // 7. Render Empty Page with H1
  return (
    <main className="min-h-screen p-8 bg-slate-50 font-sans flex flex-col items-center pt-32">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-sky">
        {displayName}'s Room
      </h1>
    </main>
  )
}