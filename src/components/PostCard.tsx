'use client'

import { useState } from 'react'
import { deletePost, editPost } from '@/app/common-room/actions'

export default function PostCard({ post, currentUserId }: { post: any, currentUserId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)

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
          {/* Avatar */}
          <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-slate-700 font-bold text-lg shadow-sm shrink-0">
            {firstLetter}
          </div>
          
          {/* User Info Column */}
          <div className="flex flex-col">
            {/* 1. Name */}
            <span className="font-bold text-slate-800 leading-tight">
              {displayName}
            </span>

            {/* 2. Date & Time (UPDATED) */}
            <p className="text-xs text-slate-400 mb-1">
              {new Date(post.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
              {post.isEdited && <span className="italic ml-1">(Edited)</span>}
            </p>

            {/* 3. Roles Row (Position + Admin) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] bg-brand-sky/10 text-brand-sky px-2 py-0.5 rounded-full font-bold uppercase border border-brand-sky/20">
                {post.author.position}
              </span>

              {isAdmin && (
                <span className="text-[10px] bg-slate-800 text-brand-yellow px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-slate-600 flex items-center gap-1">
                  🛡️ Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS (Icons) */}
        {isAuthor && (
          <div className="flex gap-3 text-slate-400">
            {canEdit && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="hover:text-brand-sky transition-colors p-1 rounded-full hover:bg-slate-50"
                title="Edit Post"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
            )}
            
            <button 
              onClick={handleDelete}
              className="hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              title="Delete Post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
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
        <div>
          <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap mb-3">
            {post.content}
          </p>

          {/* IMAGE DISPLAY */}
          {post.imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-100">
              <img 
                src={post.imageUrl} 
                alt="Post attachment" 
                className="w-full max-h-96 object-cover bg-slate-50"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}