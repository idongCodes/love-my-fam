import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge' 
import FamilyPositionIcon from '@/components/FamilyPositionIcon'
import DeleteUserButton from '@/components/DeleteUserButton'
import { deleteUser } from './actions'

const prisma = new PrismaClient()

async function getUsers(positionFilter?: string) {
  const whereClause = positionFilter ? { position: positionFilter } : {}
  
  return await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
    // ✅ Make sure to select 'status'
    select: { 
      id: true, 
      firstName: true, 
      lastName: true, 
      alias: true, 
      position: true, 
      profileImage: true, 
      email: true,
      status: true 
    }
  })
}

export default async function FamilyDirectory({ searchParams }: { searchParams: { position?: string } }) {
  const positionFilter = searchParams.position
  const users = await getUsers(positionFilter)
  const cookieStore = await cookies()
  const currentUserEmail = 'idongesit_essien@ymail.com' // Admin check
  
  // Find current user's session to determine if they are admin (optional logic)
  const sessionId = cookieStore.get('session_id')?.value
  const currentUser = users.find(u => u.id === sessionId)
  const isAdmin = currentUser?.email === currentUserEmail

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-6xl mx-auto mt-8">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-sky">
              Family Directory
              {positionFilter && (
                <span className="text-lg font-normal text-slate-500 ml-2">
                  - {positionFilter}
                </span>
              )}
            </h1>
            <p className="text-slate-500">
              {positionFilter 
                ? `Showing ${users.length} family member${users.length !== 1 ? 's' : ''} with position "${positionFilter}"`
                : 'Meet the fam.'
              }
            </p>
            {positionFilter && (
              <Link 
                href="/family" 
                className="inline-flex items-center gap-1 text-sm text-brand-pink hover:text-brand-sky transition-colors mt-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filter
              </Link>
            )}
          </div>
          <Link href="/common-room" className="text-sm font-bold text-slate-400 hover:text-brand-pink transition-colors">
            &larr; Back to Common Room
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className={`bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4 hover:shadow-md transition-shadow relative group ${isAdmin && user.email === currentUserEmail ? 'border-brand-sky/30 bg-brand-sky/5' : 'border-slate-100'}`}>
              
              {/* ADMIN ACTION */}
              {isAdmin && user.email !== currentUserEmail && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteUserButton 
                    userId={user.id} 
                    userName={user.firstName} 
                    onDelete={deleteUser} 
                  />
                </div>
              )}

              {/* AVATAR + STATUS */}
              <div className="relative">
                <Link href={`/${user.firstName.toLowerCase()}s-room`} className="block">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden hover:opacity-80 transition-opacity ${!user.profileImage ? 'bg-brand-sky/20 text-brand-sky' : ''}`}>
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      (user.alias || user.firstName)[0].toUpperCase()
                    )}
                  </div>
                </Link>
                
                {/* STATUS BADGE - Top Left-Right */}
                <div className="absolute top-0 left-3">
                  <StatusBadge status={user.status} size="normal" />
                </div>
              </div>

              {/* INFO */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/${user.firstName.toLowerCase()}s-room`} className="font-bold text-slate-800 text-lg truncate hover:text-brand-pink transition-colors">
                    {user.firstName} {user.lastName}
                  </Link>
                  {user.id === sessionId && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">YOU</span>
                  )}
                </div>
                
                {user.alias && (
                  <Link href={`/${user.firstName.toLowerCase()}s-room`} className="text-sm text-slate-400 font-medium truncate hover:text-brand-pink transition-colors">
                    @{user.alias}
                  </Link>
                )}
                
                <div className="mt-1">
                  <FamilyPositionIcon position={user.position} size="small" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  )
}