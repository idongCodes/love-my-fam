'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/app/actions'

export default function NavMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when a link is clicked
  const close = () => setIsOpen(false)

  return (
    <>
      {/* --- DESKTOP VIEW (Hidden on Mobile) --- */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
        <Link href="/" className="hover:text-brand-yellow transition-colors">Home</Link>
        
        {isLoggedIn ? (
          <>
            <Link href="/common-room" className="hover:text-brand-yellow transition-colors">Common Room</Link>
            <Link href="/family" className="hover:text-brand-yellow transition-colors">Directory</Link>
            <Link href="/my-room" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all border border-white/20">
              My Room
            </Link>
            <form action={logout}>
              <button type="submit" className="text-white/80 hover:text-white hover:underline transition-all ml-2">
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="hover:text-brand-pink transition-colors">Login</Link>
        )}
      </div>

      {/* --- MOBILE HAMBURGER BUTTON (Visible on Mobile) --- */}
      <button 
        className="md:hidden text-white text-3xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-brand-sky/95 backdrop-blur-xl border-b border-white/20 shadow-xl md:hidden flex flex-col p-6 gap-6 text-center text-white text-lg font-bold z-50 animate-in slide-in-from-top-2">
          
          <Link href="/" onClick={close} className="hover:text-brand-yellow py-2 border-b border-white/10">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/common-room" onClick={close} className="hover:text-brand-yellow py-2 border-b border-white/10">
                Common Room
              </Link>
              <Link href="/family" onClick={close} className="hover:text-brand-yellow py-2 border-b border-white/10">
                Directory
              </Link>
              <Link href="/my-room" onClick={close} className="hover:text-brand-yellow py-2 border-b border-white/10">
                My Room
              </Link>
              <form action={logout} className="py-2">
                <button type="submit" className="text-white/80 hover:text-white">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" onClick={close} className="text-brand-pink py-2">
              Login
            </Link>
          )}
        </div>
      )}
    </>
  )
}