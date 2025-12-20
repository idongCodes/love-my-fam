import Link from 'next/link'
import { cookies } from 'next/headers'
import NavMenu from './NavMenu'

export default async function Navbar() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has('session_id')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-sky/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-all">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight hover:text-brand-cream transition-colors drop-shadow-sm z-50">
          LoveMyFam
        </Link>

        {/* The Responsive Menu Component */}
        <NavMenu isLoggedIn={isLoggedIn} />
        
      </div>
    </nav>
  )
}