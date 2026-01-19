'use client'

import { useState, useRef, useEffect } from 'react'
import { updateProfilePhoto, updateProfileDetails, updateFamilySecret } from '@/app/my-room/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // <--- 1. Import Link
import EmojiButton from './EmojiButton'
import StatusBadge from './StatusBadge'
import FamilyPositionIcon from './FamilyPositionIcon'

export default function MyRoomClient({ user, familySecret }: { user: any, familySecret: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // --- PHOTO STATE ---
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null)
  const [isSavingPhoto, setIsSavingPhoto] = useState(false)
  const selfieInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // --- PROFILE DETAILS STATE ---
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isSavingDetails, setIsSavingDetails] = useState(false)
  
  // Form Fields
  const [firstName, setFirstName] = useState<string>(user.firstName || '')
  const [lastName, setLastName] = useState<string>(user.lastName || '')
  const [position, setPosition] = useState<string>(user.position || '')
  const [bio, setBio] = useState<string>(user.bio || '')
  const [location, setLocation] = useState<string>(user.location || '')
  const [alias, setAlias] = useState<string>(user.alias || '')
  const [status, setStatus] = useState<string>(user.status || '') 

  // --- SECRET EDIT STATE ---
  const [isEditingSecret, setIsEditingSecret] = useState(false)
  const [secretInput, setSecretInput] = useState(familySecret)
  const [isSavingSecret, setIsSavingSecret] = useState(false)

  // Sync state if user prop updates
  useEffect(() => {
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    setPosition(user.position || '')
    setBio(user.bio || '')
    setLocation(user.location || '')
    setAlias(user.alias || '')
    setStatus(user.status || '')
    setSecretInput(familySecret)
  }, [user, familySecret])

  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSavePhoto = async () => {
    if (!profileImage) return
    setIsSavingPhoto(true)
    const formData = new FormData()
    formData.append('file', profileImage)
    const result = await updateProfilePhoto(formData)
    setIsSavingPhoto(false)
    if (result.success) {
      alert("Profile photo updated.")
      setProfileImage(null)
      router.refresh()
    } else {
      alert(result.message)
    }
  }

  const handleCancelPhoto = () => {
    setProfileImage(null)
    setPreviewUrl(user?.profileImage || null)
  }

  const handleSaveDetails = async () => {
    setIsSavingDetails(true)
    const formData = new FormData()
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('position', position)
    formData.append('bio', bio)
    formData.append('location', location)
    formData.append('alias', alias)
    formData.append('status', status) 

    const result = await updateProfileDetails(formData)
    setIsSavingDetails(false)

    if (result.success) {
      setIsEditingDetails(false)
      router.refresh()
    } else {
      alert(result.message)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setStatus((prev: string) => prev + emoji)
  }

  const handleSaveSecret = async () => {
    if (!secretInput.trim()) return
    setIsSavingSecret(true)
    const result = await updateFamilySecret(secretInput)
    setIsSavingSecret(false)

    if (result.success) {
      setIsEditingSecret(false)
      alert("Family Secret Updated! Everyone must use this new code to login.")
      router.refresh()
    } else {
      alert(result.message)
    }
  }

  // Calculate the profile slug based on SAVED user data (to ensure link works)
  const profileSlug = (user.alias || user.firstName).trim()

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-brand-sky mb-8 text-center md:text-left">
        My Room
      </h1>

      {/* 1. PROFILE PHOTO CARD */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center gap-10 animate-in slide-in-from-top-4 relative">
        
        {/* --- NEW: PUBLIC PROFILE LINK (Top Right) --- */}
        <div className="absolute top-6 right-6 z-10">
          <Link 
            href={`/${profileSlug}s-room`} 
            className="text-xs font-bold text-brand-sky hover:text-sky-600 flex items-center gap-1 transition-colors"
          >
            Public Profile 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* AVATAR + BUTTONS */}
        <div className="relative group shrink-0">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-brand-sky/20 shadow-md bg-slate-50 flex items-center justify-center relative">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl text-brand-sky font-bold">
                {(alias || firstName)?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          
          <StatusBadge status={status} size="large" />

          <div className="absolute -bottom-2 -right-2 flex gap-2 z-20">
            <button onClick={() => galleryInputRef.current?.click()} className="bg-white text-slate-600 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border border-slate-200" title="Upload from Gallery">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            </button>
            <button onClick={() => selfieInputRef.current?.click()} className="bg-brand-pink text-slate-900 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white" title="Take a Selfie">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
            </button>
          </div>
        </div>

        {/* DETAILS DISPLAY */}
        <div className="flex-1 text-center md:text-left flex flex-col gap-1">
          {isAdmin && (
            <div className="mb-2">
              <span className="bg-slate-800 text-brand-yellow text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-slate-600 shadow-sm inline-flex items-center gap-1">
                Admin / Developer
              </span>
            </div>
          )}
          
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            {firstName} {lastName}
          </h2>
          
          {alias && <p className="text-brand-sky font-medium">@{alias}</p>}
          <div className="mt-2 flex items-center gap-2">
            <FamilyPositionIcon position={position} size="medium" />
          </div>

          {location && (
            <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5 text-slate-500 text-sm font-medium animate-in fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-pink shrink-0">
                <path fillRule="evenodd" d="M9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
              </svg>
              {location}
            </div>
          )}

          {status && (
            <div className="mt-2 flex items-center justify-center md:justify-start gap-1.5 text-slate-600 text-sm animate-in fade-in bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-flex w-fit mx-auto md:mx-0">
               <span className="text-base">💭</span>
               <span className="font-medium">{status}</span>
            </div>
          )}

          {profileImage && (
            <div className="mt-6 flex gap-3 justify-center md:justify-start animate-in fade-in slide-in-from-top-2">
              <button onClick={handleSavePhoto} disabled={isSavingPhoto} className="bg-brand-sky text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-sky-500 transition-colors shadow-sm disabled:opacity-50">
                {isSavingPhoto ? 'Saving...' : 'Save New Photo'}
              </button>
              <button onClick={handleCancelPhoto} disabled={isSavingPhoto} className="text-slate-400 hover:text-red-500 text-sm font-medium px-4 py-2">Cancel</button>
            </div>
          )}
        </div>
        
        <input type="file" ref={selfieInputRef} accept="image/*" capture="user" className="hidden" onChange={handleImageChange} />
        <input type="file" ref={galleryInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
      </section>

      {/* --- 2. ABOUT ME / EDIT DETAILS --- */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-10 animate-in slide-in-from-top-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👋</span> About Me
          </h2>
          {!isEditingDetails && (
            <button 
              onClick={() => setIsEditingDetails(true)}
              className="text-brand-sky text-sm font-bold hover:underline"
            >
              Edit Details
            </button>
          )}
        </div>

        {isEditingDetails ? (
          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-500 mb-1">FIRST NAME</label>
                 <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none bg-slate-50"/>
               </div>
               <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-500 mb-1">LAST NAME</label>
                 <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none bg-slate-50"/>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">FAMILY POSITION</label>
                <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Aunt, Cousin" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none bg-slate-50"/>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">ALIAS (NICKNAME)</label>
                <input value={alias} onChange={(e) => setAlias(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none bg-slate-50"/>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">CURRENT CITY</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none bg-slate-50"/>
               </div>
               <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">CURRENT STATUS</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2 z-10">
                      <EmojiButton onEmojiSelect={handleEmojiSelect} />
                    </div>
                    <input 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      placeholder="Feeling happy..."
                      className="w-full p-3 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none bg-slate-50"
                    />
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">BIO</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none bg-slate-50 resize-none"/>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => {
                  setIsEditingDetails(false)
                  setFirstName(user.firstName || '')
                  setLastName(user.lastName || '')
                  setPosition(user.position || '')
                  setBio(user.bio || '')
                  setLocation(user.location || '')
                  setAlias(user.alias || '')
                  setStatus(user.status || '')
                }}
                className="px-4 py-2 text-slate-400 font-bold text-sm hover:text-slate-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveDetails}
                disabled={isSavingDetails}
                className="bg-brand-sky text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-sky-500 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSavingDetails ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-slate-600">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-lg leading-relaxed text-slate-700">
              {bio ? bio : <span className="italic text-slate-400">Tell the family a bit about yourself...</span>}
            </div>
          </div>
        )}
      </section>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex border-b border-slate-200 mb-8">
        <button onClick={() => setActiveTab('dashboard')} className={`pb-4 px-6 font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'border-b-4 border-brand-sky text-brand-sky' : 'text-slate-400 hover:text-slate-600'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('mirror')} className={`pb-4 px-6 font-bold text-sm transition-all ${activeTab === 'mirror' ? 'border-b-4 border-brand-pink text-brand-pink' : 'text-slate-400 hover:text-slate-600'}`}>My Mirror</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* PRIVATE DETAILS CARD */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🔐</span> Private Details
            </h3>
            
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Email</label>
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-sky"><path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" /><path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" /></svg>
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Phone</label>
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-sky"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" /></svg>
                  <span className="font-medium">{user.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAMILY SECRET CARD */}
          <div className="bg-brand-sky/10 p-8 rounded-2xl shadow-sm border border-brand-sky/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-brand-sky flex items-center gap-2"><span>🤫</span> Family Secret</h3>
              {isAdmin && !isEditingSecret && (
                <button onClick={() => setIsEditingSecret(true)} className="text-xs bg-white/50 hover:bg-white text-brand-sky font-bold px-3 py-1 rounded-full transition-colors border border-brand-sky/20">
                  Edit
                </button>
              )}
            </div>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              This is the password used to register new family members.
            </p>
            
            {isEditingSecret ? (
              <div className="flex flex-col gap-3">
                <input 
                  value={secretInput} 
                  onChange={(e) => setSecretInput(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-brand-sky/30 focus:ring-2 focus:ring-brand-sky outline-none font-mono text-center font-bold text-xl"
                />
                <div className="flex gap-2 justify-center">
                  <button onClick={() => { setIsEditingSecret(false); setSecretInput(familySecret); }} className="px-4 py-2 text-slate-500 font-bold text-xs hover:text-slate-700">Cancel</button>
                  <button onClick={handleSaveSecret} disabled={isSavingSecret} className="bg-brand-sky text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-sky-500 disabled:opacity-50">
                    {isSavingSecret ? 'Updating...' : 'Update Secret'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-brand-sky/20 text-center">
                <span className="font-mono text-2xl font-bold text-slate-800 tracking-wider">
                  {familySecret}
                </span>
              </div>
            )}
            
            {!isEditingSecret && (
              <p className="text-center text-xs text-brand-sky/60 mt-3 font-medium uppercase tracking-wide">
                Shared with {isAdmin ? 'all users' : 'family'}
              </p>
            )}
          </div>

        </div>
      )}

      {activeTab === 'mirror' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          {/* Mirror Frame Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-pink/20 to-brand-sky/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🪞</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">My Mirror</h2>
            </div>
            <p className="text-slate-500 text-sm">How others see you in the family</p>
          </div>

          {/* Mirror Content - Visitor's Perspective */}
          <div className="max-w-2xl mx-auto">
            {/* Profile Card as seen by others */}
            <div className="bg-gradient-to-br from-brand-sky/5 to-brand-pink/5 p-8 rounded-2xl border border-brand-sky/10 mb-6">
              <div className="flex items-center gap-6 mb-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-brand-sky font-bold">
                        {(alias || firstName)?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={status} size="normal" />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {firstName} {lastName}
                  </h3>
                  {alias && (
                    <p className="text-brand-sky font-medium">@{alias}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <FamilyPositionIcon position={position} size="medium" />
                  </div>
                </div>
              </div>

              {/* Location */}
              {location && (
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-pink">
                    <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{location}</span>
                </div>
              )}

              {/* Status */}
              {status && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-lg">💭</span>
                    <span className="font-medium italic">"{status}"</span>
                  </div>
                </div>
              )}

              {/* Bio */}
              {bio && (
                <div className="bg-white p-6 rounded-xl border border-slate-100 mb-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Me</h4>
                  <p className="text-slate-700 leading-relaxed">{bio}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white p-6 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h4>
                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-sky/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-sky">
                        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Email</div>
                      <div className="text-slate-700 font-medium">{user.email}</div>
                    </div>
                  </div>

                  {/* Phone */}
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-pink/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-pink">
                          <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Phone</div>
                        <div className="text-slate-700 font-medium">{user.phone}</div>
                      </div>
                    </div>
                  )}

                  {!user.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                          <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Phone</div>
                        <div className="text-slate-400 italic">Not provided</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Family Connection Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-brand-sky/10 p-4 rounded-xl text-center border border-brand-sky/20">
                <div className="text-2xl font-bold text-brand-sky">👨‍👩‍👧‍👦</div>
                <div className="text-xs text-slate-600 mt-1">Family Member</div>
              </div>
              <div className="bg-brand-pink/10 p-4 rounded-xl text-center border border-brand-pink/20">
                <div className="text-2xl font-bold text-brand-pink">📅</div>
                <div className="text-xs text-slate-600 mt-1">
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="bg-brand-yellow/20 p-4 rounded-xl text-center border border-brand-yellow/30">
                <div className="text-2xl font-bold text-brand-yellow/80">✨</div>
                <div className="text-xs text-slate-600 mt-1">Active</div>
              </div>
              <div className="bg-brand-cream/30 p-4 rounded-xl text-center border border-brand-cream/50">
                <div className="text-2xl font-bold text-brand-cream/70">🏠</div>
                <div className="text-xs text-slate-600 mt-1">Common Room</div>
              </div>
            </div>

            {/* Visitor's Perspective Message */}
            <div className="bg-gradient-to-r from-brand-sky/10 to-brand-pink/10 p-6 rounded-2xl border border-brand-sky/20 text-center">
              <div className="text-3xl mb-3">👁️</div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Through Family Eyes</h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
                This is how your family sees you when they visit your profile. Your presence, your story, your connection to the family - all reflected back through the mirror of our shared space.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link 
                  href={`/${profileSlug}s-room`}
                  className="bg-brand-sky text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-sky-500 transition-colors shadow-sm"
                >
                  View Public Profile
                </Link>
                <Link 
                  href="/family"
                  className="bg-white text-brand-sky px-4 py-2 rounded-full text-sm font-bold hover:bg-brand-sky/10 transition-colors border border-brand-sky/20"
                >
                  Meet Family
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}