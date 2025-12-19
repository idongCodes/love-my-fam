import Link from 'next/link'
import { cookies } from 'next/headers'
import { logout } from '@/app/actions' // <--- IMPORT THE ACTION

export default async function Navbar() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has('session_id')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-sky/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-all">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight hover:text-brand-cream transition-colors drop-shadow-sm">
          LoveMyFam
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-white">
          <Link href="/" className="hover:text-brand-yellow transition-colors">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/common-room" className="hover:text-brand-yellow transition-colors">
                Common Room
              </Link>
              <Link href="/my-room" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all border border-white/20">
                My Room
              </Link>
              
              {/* LOGOUT BUTTON (Wrapped in a form) */}
              <form action={logout}>
                <button 
                  type="submit" 
                  className="text-white/80 hover:text-white hover:underline transition-all ml-2"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="hover:text-brand-pink transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}