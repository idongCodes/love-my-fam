'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

export default function ChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

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
          </div>
          
          {/* Sample Messages */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-sm font-bold text-white">
                M
              </div>
              <div className="flex-1">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <p className="text-sm text-slate-700">Hey everyone! How&apos;s everyone doing today?</p>
                  <p className="text-xs text-slate-400 mt-1">Mom • 2:30 PM</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-xs">
                <div className="bg-brand-sky p-3 rounded-2xl shadow-sm">
                  <p className="text-sm text-white">Doing great! Just finished work.</p>
                  <p className="text-xs text-brand-sky/80 mt-1">You • 2:32 PM</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-sky flex items-center justify-center text-sm font-bold text-white">
                Y
              </div>
            </div>
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky"
            />
            <button className="px-6 py-3 bg-brand-sky text-white rounded-full font-medium hover:bg-brand-pink transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
