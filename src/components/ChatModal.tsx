'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { getChatMessages, sendChatMessage } from '@/app/chat/actions'

export default function ChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [joinMessage, setJoinMessage] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{
    id: string
    content: string
    author: {
      id: string
      firstName: string
      lastName: string
      alias: string | null
      profileImage: string | null
    }
    createdAt: Date
  }>>([])
  const [inputMessage, setInputMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages from database
  const fetchMessages = async () => {
    const result = await getChatMessages()
    if (result.success && result.messages) {
      setMessages(result.messages)
    }
  }
  
  // Check for join message on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      const message = document.cookie
        .split('; ')
        .find(row => row.startsWith('new_user_join_message='))
        ?.split('=')[1]
      
      if (message) {
        setJoinMessage(decodeURIComponent(message))
        // Clear the cookie after reading it
        document.cookie = 'new_user_join_message=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
      
      // Hardcoded welcome message for Idong (since he joined before this feature)
      if (!message) {
        setJoinMessage("Idong has joined the app! 🎉")
      }

      // Fetch real chat messages
      fetchMessages()
      
      // Get current user ID from session - improved cookie reading
      const getSessionId = () => {
        const cookies = document.cookie.split('; ')
        console.log('All available cookies:', cookies)
        
        // Try different possible cookie names, prioritizing the new user_session
        const possibleNames = ['user_session', 'session_id', 'sessionId', 'session', 'auth_token']
        
        for (const name of possibleNames) {
          const cookie = cookies.find(row => row.startsWith(`${name}=`))
          if (cookie) {
            const value = cookie.split('=')[1]
            console.log(`Found session cookie: ${name} = ${value}`)
            return value
          }
        }
        
        console.log('No session cookie found')
        return null
      }
      
      const sessionId = getSessionId()
      console.log('Session ID found:', sessionId) // Debug log
      
      // Fallback: If no session, try to use a test user ID for debugging
      const userId = sessionId || 'test-user-id'
      setCurrentUserId(userId)
    }
  }, [isOpen])

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!isOpen) return
    
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [isOpen])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    console.log('Attempting to send message:', { inputMessage: inputMessage.trim(), currentUserId })
    
    if (inputMessage.trim() && currentUserId) {
      try {
        const result = await sendChatMessage(inputMessage.trim(), currentUserId)
        if (result.success) {
          setInputMessage('')
          // Refresh messages to include the new one
          fetchMessages()
        } else {
          console.error('Failed to send message:', result.message)
          alert(`Failed to send message: ${result.message}`)
        }
      } catch (error) {
        console.error('Error sending message:', error)
        alert('Error sending message. Please try again.')
      }
    } else {
      if (!currentUserId) {
        console.error('No current user ID found. Available cookies:', document.cookie)
        alert('Please log in to send messages. Session not found.')
      } else if (!inputMessage.trim()) {
        console.log('Empty message, not sending')
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
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
      alias: 'SuperMom', // User's alias
      profileImage: null,
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
    sister: {
      name: 'Emma Johnson', 
      firstName: 'Emma',
      alias: 'Emmy', // User's alias
      profileImage: null,
      initial: 'E',
      color: 'bg-purple-500'
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

  const getDisplayName = (author: any) => {
    return author.alias || `${author.firstName} ${author.lastName}`
  }

  const renderAvatar = (author: any, size: 'small' | 'medium' = 'small') => {
    const sizeClasses = size === 'small' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'
    
    if (author.profileImage) {
      return (
        <img 
          src={author.profileImage} 
          alt={author.firstName} 
          className={`${sizeClasses} rounded-full object-cover`}
        />
      )
    }
    
    const initial = (author.alias || author.firstName)[0].toUpperCase()
    return (
      <div className={`${sizeClasses} rounded-full bg-brand-sky text-white flex items-center justify-center font-bold`}>
        {initial}
      </div>
    )
  }

  const handleUserClick = (author: any) => {
    // Close modal first
    onClose()
    // Navigate to user's profile (using firstName for the route)
    router.push(`/${author.firstName.toLowerCase()}s-room`)
  }

  const renderSystemMessage = (message: string, time: Date) => {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-slate-100 px-3 py-1 rounded-full">
          <p className="text-xs text-slate-500 font-medium">{message}</p>
          <p className="text-[10px] text-slate-400 text-center mt-1">{formatTime(time)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex">
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
          
          {/* Messages */}
          <div className="space-y-3">
            {/* Join Message - Appears when new user registers */}
            {joinMessage && renderSystemMessage(joinMessage, new Date())}
            
            {/* Real Messages */}
            {messages.map((message) => {
              const isCurrentUser = message.author.id === currentUserId
              return (
                <div key={message.id} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
                  {!isCurrentUser && renderAvatar(message.author)}
                  <div className={`flex-1 ${isCurrentUser ? 'max-w-xs' : ''}`}>
                    <div className={`${isCurrentUser ? 'bg-brand-sky text-white' : 'bg-white text-slate-700'} p-3 rounded-2xl shadow-sm`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 px-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                      <button 
                        onClick={() => handleUserClick(message.author)}
                        className={`text-xs font-medium hover:text-brand-pink transition-colors cursor-pointer ${isCurrentUser ? 'text-brand-sky/80' : 'text-slate-400'}`}
                      >
                        {getDisplayName(message.author)}
                      </button>
                      <span className={`text-xs ${isCurrentUser ? 'text-brand-sky/60' : 'text-slate-300'}`}>•</span>
                      <p className={`text-xs ${isCurrentUser ? 'text-brand-sky/80' : 'text-slate-400'}`}>{formatTime(message.createdAt)}</p>
                    </div>
                  </div>
                  {isCurrentUser && renderAvatar(message.author)}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
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
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky"
              />
              <p className="text-xs text-slate-400 mt-2 text-center">{formatDate(now)} • {formatTime(now)}</p>
            </div>
            <button 
              onClick={handleSendMessage}
              className="px-6 py-3 bg-brand-sky text-white rounded-full font-medium hover:bg-brand-pink transition-colors self-end"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
