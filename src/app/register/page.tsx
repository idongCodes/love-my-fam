'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from './actions'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState('') // Track what they type
  const router = useRouter()

  // Check if they got it right (Case insensitive)
  const isSecurityCorrect = answer.trim().toLowerCase() === 'mercy'

  async function handleSubmit(formData: FormData) {
    const result = await registerUser(formData)
    
    if (result.success) {
      router.push('/common-room')
    } else {
      setError(result.message || "Something went wrong")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream/30 px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full border border-slate-100">
        
        <h1 className="text-3xl font-bold text-center text-brand-sky mb-2">Join the Family</h1>
        <p className="text-center text-slate-400 mb-8">Create your profile to enter the Common Room.</p>

        <form action={handleSubmit} className="space-y-4">
          
          {/* PERSONAL DETAILS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">FIRST NAME</label>
              <input name="firstName" required className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">LAST NAME</label>
              <input name="lastName" required className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">PREFERRED ALIAS (Optional)</label>
            <input name="alias" placeholder="What should we call you?" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">PHONE</label>
              <input name="phone" type="tel" required className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL</label>
              <input name="email" type="email" required className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none" />
            </div>
          </div>

          {/* SECURITY QUESTION */}
          <div className={`p-4 rounded-xl border transition-colors duration-500 ${isSecurityCorrect ? 'bg-green-50 border-green-200' : 'bg-brand-yellow/20 border-brand-yellow'}`}>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              🔒 Security Question
            </label>
            <p className="text-sm text-slate-600 mb-3 italic">
              "What is Charlie's Grandma's name on her Father's side?"
            </p>
            <input 
              name="securityAnswer" 
              required 
              placeholder="Answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-pink outline-none" 
            />
          </div>

          {/* HIDDEN "POSITION" FIELD - APPEARS ON SUCCESS */}
          {isSecurityCorrect && (
            <div className="animate-fade-in-down">
              <div className="bg-brand-sky/10 p-4 rounded-xl border border-brand-sky mt-4">
                <label className="block text-sm font-bold text-brand-sky mb-2">
                  ✅ Correct! One last thing...
                </label>
                <p className="text-xs text-slate-500 mb-2">How are you related to the family? (e.g. Cousin, Aunt, Friend)</p>
                <input 
                  name="position" 
                  required 
                  placeholder="I am a..."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-sky outline-none" 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-brand-sky text-white font-bold py-4 rounded-xl shadow-md hover:bg-sky-500 transition-all mt-4"
              >
                Complete Registration
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mt-2">{error}</p>
          )}

        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-brand-pink font-bold hover:underline">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </main>
  )
}
