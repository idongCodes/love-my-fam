'use client'

import { useRef, useState } from 'react'
import { createPost } from '@/app/common-room/actions'

export default function PostInput() {
  const formRef = useRef<HTMLFormElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  async function action(formData: FormData) {
    await createPost(formData)
    formRef.current?.reset()
    setFileName(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      // Safety Check: Warn if file is over 20MB
      if (file.size > 20 * 1024 * 1024) {
        alert("File is too large! Please choose a file under 20MB.")
        e.target.value = "" // Clear the input
        setFileName(null)
        return
      }
      setFileName(file.name)
    } else {
      setFileName(null)
    }
  }

  // Helper to trigger the hidden file input
  const triggerFileInput = () => {
    const fileInput = document.getElementById('media-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-slate-200">
      <p className="text-slate-400 text-sm mb-3 font-medium">Share an update with family...</p>
      
      <form ref={formRef} action={action} className="flex flex-col gap-3">
        
        <div className="flex gap-2 items-center">
          {/* CONTAINER FOR INPUT + ICON */}
          <div className="relative flex-1">
            
            <input 
              name="content"
              type="text" 
              placeholder="Write something..."
              required
              className="w-full h-12 bg-slate-50 rounded-lg border border-slate-100 pl-4 pr-12 text-slate-700 focus:ring-2 focus:ring-brand-sky outline-none transition-all"
            />

            {/* --- RIGHT ALIGNED CAMERA BUTTON --- */}
            <button 
              type="button"
              onClick={triggerFileInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-pink p-2 transition-colors rounded-full hover:bg-slate-50"
              title="Upload photo or video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </button>

            {/* HIDDEN FILE INPUT */}
            <input 
              id="media-upload"
              name="media"
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button 
            type="submit"
            className="bg-brand-sky text-white font-bold px-6 rounded-lg hover:bg-sky-500 transition-colors shadow-sm h-12"
          >
            Post
          </button>
        </div>

        {/* --- FILE PREVIEW BADGE --- */}
        {fileName && (
          <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-600 px-3 py-2 rounded-lg w-fit animate-fade-in">
            <span className="font-bold text-brand-pink">📎 Attached:</span>
            <span className="truncate max-w-[200px]">{fileName}</span>
            <button 
              type="button" 
              onClick={() => {
                setFileName(null)
                const fileInput = document.getElementById('media-upload') as HTMLInputElement
                if (fileInput) fileInput.value = ''
              }}
              className="ml-2 text-slate-400 hover:text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        )}

      </form>
    </div>
  )
}