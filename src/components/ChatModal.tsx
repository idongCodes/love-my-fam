'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function ChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  
  if (!isOpen) return null

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}-${day}-${year}`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const now = new Date()
  const sampleDate1 = new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
  const sampleDate2 = new Date(now.getTime() - 1.5 * 60 * 60 * 1000) // 1.5 hours ago

  // Sample user data (in real app, this would come from user context/database)
  const users = {
    mom: {
      name: 'Sarah Johnson',
      firstName: 'Sarah',
      alias: 'SuperMom', // User's alias if they have one
      profileImage: null, // Would be actual image URL
      initial: 'S',
      color: 'bg-brand-pink'
    },
    dad: {
      name: 'Michael Johnson', 
      firstName: 'Michael',
      alias: 'DadJokes', // User's alias
      profileImage: null,
      initial: 'M',
      color: 'bg-brand-yellow'
    },
    you: {
      name: 'You',
      firstName: 'You',
      alias: null, // No alias for "You"
      profileImage: null,
      initial: 'Y',
      color: 'bg-brand-sky'
    }
  }

  const getDisplayName = (user: any) => {
    return user.alias || user.name
  }

  const handleUserClick = (user: any) => {
    // Close modal first
    onClose()
    // Navigate to user's profile (using firstName for the route)
    router.push(`/${user.firstName.toLowerCase()}s-room`)
  }

  const renderAvatar = (user: typeof users.mom, size: 'small' | 'medium' = 'small') => {
    const sizeClasses = size === 'small' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'
    
    if (user.profileImage) {
      return (
        <img 
          src={user.profileImage} 
          alt={user.name} 
          className={`${sizeClasses} rounded-full object-cover`}
        />
      )
    }
    
    return (
      <div className={`${sizeClasses} rounded-full ${user.color} flex items-center justify-center text-white font-bold shrink-0`}>
        {user.initial}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container - Anchored to bottom navigation */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[70vw] max-w-4xl h-[70vh] bg-white rounded-t-3xl shadow-2xl border border-slate-200 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-brand-sky to-brand-pink text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <h2 className="text-lg font-bold">Family Chat</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {/* Welcome Message */}
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to Family Chat</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Start conversations with your family members. This is a safe space for family discussions.
            </p>
            <p className="text-xs text-slate-400 mt-2">{formatDate(now)} • {formatTime(now)}</p>
          </div>
          
          {/* Date Separator */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-slate-300"></div>
            <span className="text-xs text-slate-500 font-medium">{formatDate(sampleDate1)}</span>
            <div className="flex-1 h-px bg-slate-300"></div>
          </div>
          
          {/* Sample Messages */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {renderAvatar(users.mom)}
              <div className="flex-1">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <p className="text-sm text-slate-700">Hey everyone! How&apos;s everyone doing today?</p>
                </div>
                <div className="flex items-center gap-2 mt-1 px-2">
                  <button 
                    onClick={() => handleUserClick(users.mom)}
                    className="text-xs text-slate-400 font-medium hover:text-brand-pink transition-colors cursor-pointer"
                  >
                    {getDisplayName(users.mom)}
                  </button>
                  <span className="text-xs text-slate-300">•</span>
                  <p className="text-xs text-slate-400">{formatTime(sampleDate1)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-xs">
                <div className="bg-brand-sky p-3 rounded-2xl shadow-sm">
                  <p className="text-sm text-white">Doing great! Just finished work.</p>
                </div>
                <div className="flex items-center gap-2 mt-1 px-2 justify-end">
                  <p className="text-xs text-brand-sky/80 font-medium">{getDisplayName(users.you)}</p>
                  <span className="text-xs text-brand-sky/60">•</span>
                  <p className="text-xs text-brand-sky/80">{formatTime(sampleDate2)}</p>
                </div>
              </div>
              {renderAvatar(users.you)}
            </div>

            <div className="flex gap-3">
              {renderAvatar(users.dad)}
              <div className="flex-1">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <p className="text-sm text-slate-700">Great to hear! Anyone up for dinner this weekend?</p>
                </div>
                <div className="flex items-center gap-2 mt-1 px-2">
                  <button 
                    onClick={() => handleUserClick(users.dad)}
                    className="text-xs text-slate-400 font-medium hover:text-brand-pink transition-colors cursor-pointer"
                  >
                    {getDisplayName(users.dad)}
                  </button>
                  <span className="text-xs text-slate-300">•</span>
                  <p className="text-xs text-slate-400">{formatTime(sampleDate2)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-xs">
                <div className="bg-brand-sky p-3 rounded-2xl shadow-sm">
                  <p className="text-sm text-white">I&apos;m in! What time works for everyone?</p>
                </div>
                <div className="flex items-center gap-2 mt-1 px-2 justify-end">
                  <p className="text-xs text-brand-sky/80 font-medium">{getDisplayName(users.you)}</p>
                  <span className="text-xs text-brand-sky/60">•</span>
                  <p className="text-xs text-brand-sky/80">{formatTime(sampleDate2)}</p>
                </div>
              </div>
              {renderAvatar(users.you)}
            </div>
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-2">
            {renderAvatar(users.you)}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky"
              />
              <p className="text-xs text-slate-400 mt-2 text-center">{formatDate(now)} • {formatTime(now)}</p>
            </div>
            <button className="px-6 py-3 bg-brand-sky text-white rounded-full font-medium hover:bg-brand-pink transition-colors self-end">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
