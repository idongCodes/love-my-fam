import Link from 'next/link'
import BottomNav from './BottomNav'

export default function Navbar() {
  return (
    <>
      {/* Simple top logo */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-sky/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-center">
          <Link href="/" className="text-white font-bold text-lg tracking-tight hover:text-brand-cream transition-colors drop-shadow-sm">
            LoveMyFam
          </Link>
        </div>
      </nav>

      {/* Bottom navigation */}
      <BottomNav />
    </>
  )
}