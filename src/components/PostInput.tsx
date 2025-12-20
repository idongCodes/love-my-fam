'use client'

import { useRef } from 'react'
import { createPost } from '@/app/common-room/actions'

export default function PostInput() {
  const formRef = useRef<HTMLFormElement>(null)

  async function action(formData: FormData) {
    await createPost(formData)
    formRef.current?.reset() // Clear the box after posting
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-slate-200">
      <p className="text-slate-400 text-sm mb-3 font-medium">Share an update with family...</p>
      
      <form ref={formRef} action={action} className="flex gap-2">
        <input 
          name="content"
          type="text" 
          placeholder="Write something..."
          required
          className="flex-1 h-12 bg-slate-50 rounded-lg border border-slate-100 px-4 text-slate-700 focus:ring-2 focus:ring-brand-sky outline-none transition-all"
        />
        <button 
          type="submit"
          className="bg-brand-sky text-white font-bold px-6 rounded-lg hover:bg-sky-500 transition-colors shadow-sm"
        >
          Post
        </button>
      </form>
    </div>
  )
}