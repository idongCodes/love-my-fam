'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions'
import { useState } from 'react'
import ChatModal from './ChatModal'

export default function BottomNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    ...(isLoggedIn ? [
      {
        name: 'Common Room',
        href: '/common-room',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        name: 'Family',
        href: '/family',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        name: 'My Room',
        href: '/my-room',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
      {
        name: 'Chat',
        href: '/chat',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
        isButton: true,
        onClick: () => setIsChatOpen(true),
      },
    ] : []),
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Floating pill container */}
      <div className="relative bg-brand-sky/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/30">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/20 via-white/10 to-brand-cream/20 rounded-full animate-pulse" />
        
        {/* Navigation content */}
        <div className="relative flex items-center justify-center px-6 py-2 gap-2">
          {navItems.map((item) => {
            if (item.isButton) {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-300
                    ${isActive(item.href) 
                      ? 'text-slate-800 bg-brand-yellow/90 scale-110' 
                      : 'text-white/90 hover:text-white hover:bg-white/20 hover:scale-105'
                    }
                  `}
                >
                  <div className="relative">
                    {item.icon}
                    {/* Active indicator */}
                    {isActive(item.href) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-800 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden lg:block">
                    {item.name}
                  </span>
                </button>
              )
            } else {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-300
                    ${isActive(item.href) 
                      ? 'text-slate-800 bg-brand-yellow/90 scale-110' 
                      : 'text-white/90 hover:text-white hover:bg-white/20 hover:scale-105'
                    }
                  `}
                >
                  <div className="relative">
                    {item.icon}
                    {/* Active indicator */}
                    {isActive(item.href) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-800 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden lg:block">
                    {item.name}
                  </span>
                </Link>
              )
            }
          })}
          
          {/* Logout button (only when logged in) */}
          {isLoggedIn && (
            <form action={logout} className="flex flex-col items-center gap-1 px-4 py-2">
              <button
                type="submit"
                className="text-white/90 hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 rounded-full p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              <span className="text-xs font-medium text-white/90 hidden lg:block">
                Logout
              </span>
            </form>
          )}

          {/* Login button (only when logged out) */}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 text-white/90 hover:text-white hover:bg-white/20 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs font-medium hidden lg:block">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </nav>
  )
}
