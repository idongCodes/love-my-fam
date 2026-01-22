'use client'

import { useState, useEffect } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

export default function NotificationPrompt() {
  const { isSubscribed, subscribe, permission } = usePushNotifications()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show if:
    // 1. Not subscribed
    // 2. Permission is not denied (default or granted but unsubscribed)
    // 3. User hasn't dismissed it this session (optional, simpler to just show)
    // 4. We are mounted (client-side)
    if (!isSubscribed && permission !== 'denied') {
      const timer = setTimeout(() => setIsVisible(true), 3000) // Delay for better UX
      return () => clearTimeout(timer)
    }
  }, [isSubscribed, permission])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-sm animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-brand-sky/20 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h4 className="font-bold text-slate-800 text-sm">Enable Notifications?</h4>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        
        <p className="text-xs text-slate-600 leading-relaxed">
          Stay updated with new posts, chats, and family announcements instantly.
        </p>
        
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              subscribe()
              setIsVisible(false)
            }}
            className="flex-1 bg-brand-sky text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-sky-500 transition-colors"
          >
            Yes, Notify Me
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}
