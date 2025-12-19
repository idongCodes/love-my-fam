'use client'

import { useState } from 'react'

export default function MyRoom() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-4xl mx-auto mt-8">
        
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-brand-sky mb-6">My Room</h1>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-4 px-6 font-bold text-sm transition-all ${
              activeTab === 'dashboard'
                ? 'border-b-4 border-brand-sky text-brand-sky'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('mirror')}
            className={`pb-4 px-6 font-bold text-sm transition-all ${
              activeTab === 'mirror'
                ? 'border-b-4 border-brand-pink text-brand-pink' // Pink for the "Mirror" vibe
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            My Mirror
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        
        {/* VIEW 1: DASHBOARD (Your original content) */}
        {activeTab === 'dashboard' && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in">
            <p className="text-5xl mb-4">🛏️</p>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Personal Space</h2>
            <p className="text-slate-500">
              Personal dashboard, settings, and your post history will live here.
            </p>
          </div>
        )}

        {/* VIEW 2: MY MIRROR (The new tab) */}
        {activeTab === 'mirror' && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in">
            <p className="text-5xl mb-4">🪞</p>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">My Mirror</h2>
            <p className="text-slate-500 mb-6">
              Reflect on your journey. Your profile details and personal stats will appear here.
            </p>
            <div className="inline-block bg-brand-pink/20 text-brand-pink px-4 py-2 rounded-full text-xs font-bold uppercase">
              Coming Soon
            </div>
          </div>
        )}

      </div>
    </main>
  )
}