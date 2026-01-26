'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from './actions'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    phone: '',
    email: '',
    securityAnswer: '',
    position: ''
  })

  // Validation State (null = untouched, true = valid, false = invalid)
  const [validation, setValidation] = useState<{ [key: string]: boolean | null }>({
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    securityAnswer: null,
    position: null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Reset validation state on change to remove immediate red error while typing
    if (validation[name] === false) {
      setValidation(prev => ({ ...prev, [name]: null }))
    }

    // Real-time security check (special case)
    if (name === 'securityAnswer') {
       if (value.trim().toLowerCase() === 'mercy') {
          setValidation(prev => ({ ...prev, securityAnswer: true }))
       } else {
          setValidation(prev => ({ ...prev, securityAnswer: null })) // Don't show error yet, just remove success
       }
    }
  }

  const validateField = (name: string, value: string) => {
    let isValid = true
    
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'position':
        isValid = value.trim().length > 0
        break
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        break
      case 'phone':
        isValid = /^\+?[\d\s-]{10,}$/.test(value) // At least 10 digits/chars
        break
      case 'securityAnswer':
        isValid = value.trim().toLowerCase() === 'mercy'
        break
      default:
        break
    }

    setValidation(prev => ({ ...prev, [name]: isValid }))
    return isValid
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'alias') return // Optional
    validateField(name, value)
  }

  const isSecurityCorrect = validation.securityAnswer === true

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Final Validation Check
    const fieldsToValidate = ['firstName', 'lastName', 'phone', 'email', 'securityAnswer']
    if (isSecurityCorrect) fieldsToValidate.push('position')

    let allValid = true
    fieldsToValidate.forEach(field => {
       const isValid = validateField(field, (formData as any)[field])
       if (!isValid) allValid = false
    })

    if (!allValid) {
      setError("Please fix the errors in the form.")
      return
    }

    setIsSubmitting(true)
    const submitData = new FormData()
    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value))

    const result = await registerUser(submitData)
    
    if (result.success) {
      router.push('/common-room')
    } else {
      setError(result.message || "Something went wrong")
      setIsSubmitting(false)
    }
  }

  // Helper to get input classes based on validation state
  const getInputClass = (fieldName: string) => {
    const base = "w-full p-3 rounded-lg border focus:ring-2 outline-none transition-all "
    if (validation[fieldName] === true) return base + "bg-green-50 border-green-400 text-green-800 focus:ring-green-200"
    if (validation[fieldName] === false) return base + "bg-red-50 border-red-400 text-red-800 focus:ring-red-200"
    return base + "bg-slate-50 border-slate-200 focus:ring-brand-sky"
  }

  const ValidationIcon = ({ fieldName }: { fieldName: string }) => {
    if (validation[fieldName] === true) return <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
    if (validation[fieldName] === false) return <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">!</span>
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream/30 px-4 py-10 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full border border-slate-100">
        
        <h1 className="text-3xl font-bold text-center text-brand-sky mb-2 tracking-tight">Join the Family</h1>
        <p className="text-center text-slate-400 mb-8">Create your profile to enter the Common Room.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* PERSONAL DETAILS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-1">FIRST NAME</label>
              <input 
                name="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('firstName')}
                placeholder="Jane"
              />
              <ValidationIcon fieldName="firstName" />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-1">LAST NAME</label>
              <input 
                name="lastName" 
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('lastName')}
                placeholder="Doe"
              />
              <ValidationIcon fieldName="lastName" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">PREFERRED ALIAS (Optional)</label>
            <input 
              name="alias" 
              value={formData.alias}
              onChange={handleChange}
              placeholder="What should we call you?" 
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-sky outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-1">PHONE</label>
              <input 
                name="phone" 
                type="tel" 
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('phone')}
                placeholder="555-0123"
              />
              <ValidationIcon fieldName="phone" />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL</label>
              <input 
                name="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('email')}
                placeholder="jane@example.com"
              />
              <ValidationIcon fieldName="email" />
            </div>
          </div>

          {/* SECURITY QUESTION */}
          <div className={`p-4 rounded-xl border transition-all duration-500 relative ${isSecurityCorrect ? 'bg-green-50 border-green-200' : 'bg-brand-yellow/20 border-brand-yellow'}`}>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
              <span>🔒 Security Question</span>
              {isSecurityCorrect && <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">Verified</span>}
            </label>
            <p className="text-sm text-slate-600 mb-3 italic">
              "What is Charlie's Grandma's name on her Father's side?"
            </p>
            <div className="relative">
              <input 
                name="securityAnswer" 
                value={formData.securityAnswer}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Type the answer..."
                className={`w-full p-3 rounded-lg border outline-none pr-10 ${
                   validation.securityAnswer === false 
                   ? 'border-red-400 bg-white focus:ring-2 focus:ring-red-200' 
                   : 'border-slate-300 focus:ring-2 focus:ring-brand-pink'
                }`}
              />
               {validation.securityAnswer === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">!</span>}
            </div>
            {validation.securityAnswer === false && (
              <p className="text-red-500 text-xs mt-2 font-medium">Incorrect answer. Please try again.</p>
            )}
          </div>

          {/* HIDDEN "POSITION" FIELD - APPEARS ON SUCCESS */}
          {isSecurityCorrect && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-500">
              <div className="bg-brand-sky/5 p-5 rounded-xl border border-brand-sky/30 mt-2">
                <label className="block text-sm font-bold text-brand-sky mb-2">
                  ✅ Correct! One last thing...
                </label>
                <div className="relative">
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase">How are you related to the family?</p>
                  <input 
                    name="position" 
                    value={formData.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Cousin, Aunt, Friend"
                    className={getInputClass('position')} 
                  />
                  <ValidationIcon fieldName="position" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-sky text-white font-bold py-4 rounded-xl shadow-md hover:bg-sky-500 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Profile...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4 animate-in shake">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <Link href="/login" className="text-sm text-brand-pink font-bold hover:text-pink-400 transition-colors">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </main>
  )
}
