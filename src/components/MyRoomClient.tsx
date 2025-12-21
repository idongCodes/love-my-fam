'use client'

import { useState, useRef } from 'react'
import { updateProfilePhoto } from '@/app/my-room/actions'
import { useRouter } from 'next/navigation'

export default function MyRoomClient({ user }: { user: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Initialize with the database image if it exists
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null)
  const [isSaving, setIsSaving] = useState(false)
  
  const selfieInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSavePhoto = async () => {
    if (!profileImage) return

    setIsSaving(true)
    const formData = new FormData()
    formData.append('file', profileImage)

    const result = await updateProfilePhoto(formData)
    setIsSaving(false)

    if (result.success) {
      alert("Looking sharp! Profile photo updated.")
      setProfileImage(null) // Reset file input
      router.refresh()
    } else {
      alert(result.message || "Something went wrong.")
    }
  }

  const handleCancelPhoto = () => {
    setProfileImage(null)
    setPreviewUrl(user?.profileImage || null) // Revert to saved photo
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-brand-sky mb-8 text-center md:text-left">
        My Room
      </h1>

      {/* --- PROFILE PHOTO SECTION --- */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row items-center gap-8 animate-in slide-in-from-top-4">
        
        {/* 1. Avatar / Preview Area */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-sky/20 shadow-md bg-slate-50 flex items-center justify-center">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile Preview" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-4xl text-brand-sky font-bold">
                {(user?.alias || user?.firstName)?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {/* BUTTONS OVERLAY */}
          <div className="absolute -bottom-2 -right-4 flex gap-2">
            {/* Gallery Button */}
            <button 
              onClick={() => galleryInputRef.current?.click()}
              className="bg-white text-slate-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform border border-slate-200"
              title="Upload from Gallery"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </button>
            {/* Selfie Button */}
            <button 
              onClick={() => selfieInputRef.current?.click()}
              className="bg-brand-pink text-slate-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white"
              title="Take a Selfie"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
            </button>
          </div>
        </div>

        {/* 2. Actions / Instructions */}
        <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Update Profile Photo</h2>
          <p className="text-slate-500 text-sm mb-4 max-w-sm mx-auto md:mx-0">
             Snap a fresh selfie or pick a favorite memory from your gallery.
          </p>

          {profileImage && (
            <div className="flex gap-3 justify-center md:justify-start animate-in fade-in zoom-in-95">
              <button 
                onClick={handleSavePhoto}
                disabled={isSaving}
                className="bg-brand-sky text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-sky-500 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Photo'}
              </button>
              <button 
                onClick={handleCancelPhoto}
                disabled={isSaving}
                className="text-slate-400 hover:text-red-500 text-sm font-medium px-4 py-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Inputs */}
        <input type="file" ref={selfieInputRef} accept="image/*" capture="user" className="hidden" onChange={handleImageChange} />
        <input type="file" ref={galleryInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
      </section>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex border-b border-slate-200 mb-8">
        <button onClick={() => setActiveTab('dashboard')} className={`pb-4 px-6 font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'border-b-4 border-brand-sky text-brand-sky' : 'text-slate-400 hover:text-slate-600'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('mirror')} className={`pb-4 px-6 font-bold text-sm transition-all ${activeTab === 'mirror' ? 'border-b-4 border-brand-pink text-brand-pink' : 'text-slate-400 hover:text-slate-600'}`}>My Mirror</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in">
          <p className="text-5xl mb-4">🛏️</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Personal Space</h2>
          <p className="text-slate-500">Personal dashboard, settings, and your post history will live here.</p>
        </div>
      )}

      {activeTab === 'mirror' && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in">
          <p className="text-5xl mb-4">🪞</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">My Mirror</h2>
          <p className="text-slate-500 mb-6">Reflect on your journey. Your profile details and personal stats will appear here.</p>
          <div className="inline-block bg-brand-pink/20 text-brand-pink px-4 py-2 rounded-full text-xs font-bold uppercase">Coming Soon</div>
        </div>
      )}
    </div>
  )
}