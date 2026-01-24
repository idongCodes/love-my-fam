'use client'

import { useState, useEffect } from 'react'
import { getNotifications, markAsRead, markAllAsRead } from './actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    const result = await getNotifications()
    if (result.success) {
      setNotifications(result.notifications)
    }
    setLoading(false)
  }

  const handleNotificationClick = async (id: string, link: string) => {
    // Mark as read immediately
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    await markAsRead(id)
    router.push(link)
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    await markAllAsRead()
  }

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllRead}
            className="text-sm font-bold text-brand-sky hover:text-sky-600 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-4">🔕</div>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id, notification.link)}
              className={`
                p-4 rounded-xl cursor-pointer transition-all duration-200 border
                ${notification.isRead 
                  ? 'bg-slate-50 border-slate-100 hover:bg-slate-100' 
                  : 'bg-brand-sky/10 border-brand-sky/20 hover:bg-brand-sky/20'
                }
              `}
            >
              <div className="flex gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notification.isRead ? 'bg-transparent' : 'bg-brand-sky'}`} />
                <div>
                  <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    {new Date(notification.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
