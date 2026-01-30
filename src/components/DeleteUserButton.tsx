'use client'

import { useState } from 'react'
import { useConfirm } from '@/context/ConfirmContext'
import { useToast } from '@/context/ToastContext'

interface DeleteUserButtonProps {
  userId: string
  userName: string
  onDelete: (userId: string) => Promise<void>
}

export default function DeleteUserButton({ userId, userName, onDelete }: DeleteUserButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { confirm } = useConfirm()
  const toast = useToast()

  const handleClick = async () => {
    if (await confirm({ 
      title: 'Delete User', 
      message: `Are you sure you want to completely remove ${userName} and all their data? This cannot be undone.`,
      confirmText: 'Delete Forever',
      type: 'danger' 
    })) {
      setIsDeleting(true)
      try {
        await onDelete(userId)
        toast.success(`User ${userName} deleted`)
      } catch (error) {
        console.error("Failed to delete user", error)
        toast.error("Failed to delete user. Check console for details.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
      title="Delete User"
    >
      {isDeleting ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      )}
    </button>
  )
}
