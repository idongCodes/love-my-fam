'use client'

import { useState } from 'react'
import { deletePost, editPost } from '@/app/common-room/actions'

export default function PostCard({ post, currentUserId }: { post: any, currentUserId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)

  // 1. DEFINE WHO IS ADMIN (You!)
  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'
  const isAdmin = post.author.email === ADMIN_EMAIL

  const isAuthor = currentUserId === post.authorId
  
  const createdAt = new Date(post.createdAt).getTime()
  const timeDiff = Date.now() - createdAt
  const canEdit = isAuthor && !post.isEdited && timeDiff < 10 * 60 * 1000

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this?')) {
      await deletePost(post.id)
    }
  }

  async function handleSave() {
    const result = await editPost(post.id, editContent)
    if (result.success) {
      setIsEditing(false)
    } else {
      alert(result.message)
    }
  }

  const displayName = post.author.alias || post.author.firstName
  const firstLetter = displayName[0].toUpperCase()

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 transition-all hover:border-slate-200">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-slate-700 font-bold text-lg shadow-sm">
            {firstLetter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{displayName}</span>
              <span className="text-[10px] bg-brand-sky/10 text-brand-sky px-2 py-0.5 rounded-full font-bold uppercase border border-brand-sky/20">
                {post.author.position}
              </span>
            </div>

            {/* --- NEW ADMIN BADGE --- */}
            {isAdmin && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] bg-slate-800 text-brand-yellow px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-slate-600 flex items-center gap-1">
                  🛡️ Admin
                </span>
              </div>
            )}
            
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(post.createdAt).toLocaleDateString()}
              {post.isEdited && <span className="italic ml-2">(Edited)</span>}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        {isAuthor && (
          <div className="flex gap-2 text-xs font-bold">
            {canEdit && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-brand-sky hover:underline"
              >
                Edit
              </button>
            )}
            <button 
              onClick={handleDelete}
              className="text-red-300 hover:text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-sky outline-none text-slate-700"
            rows={3}
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button onClick={() => setIsEditing(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
            <button onClick={handleSave} className="text-xs bg-brand-sky text-white px-3 py-1 rounded-full hover:bg-sky-500">Save Update</button>
          </div>
        </div>
      ) : (
        <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
          {post.content}
        </p>
      )}
    </div>
  )
}