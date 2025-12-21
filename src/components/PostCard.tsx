'use client'

import { useState } from 'react'
import { deletePost, editPost, toggleLike, addComment } from '@/app/common-room/actions'
import CommentItem from './CommentItem'

export default function PostCard({ 
  post, 
  currentUserId, 
  initialLikeCount = 0, 
  initialIsLiked = false 
}: any) {
  // --- EXISTING STATES ---
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  
  // --- LIKE STATES ---
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)

  // --- COMMENT STATES ---
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'
  const isAdmin = post.author.email === ADMIN_EMAIL
  const isAuthor = currentUserId === post.authorId
  
  const createdAt = new Date(post.createdAt).getTime()
  const timeDiff = Date.now() - createdAt
  const canEdit = isAuthor && !post.isEdited && timeDiff < 10 * 60 * 1000

  // --- ACTIONS ---
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

  async function handleToggleLike() {
    // Optimistic Update
    const previousLiked = isLiked
    const previousCount = likeCount
    
    setIsLiked(!isLiked)
    setLikeCount((prev: number) => isLiked ? prev - 1 : prev + 1)

    const result = await toggleLike(post.id)

    if (!result?.success) {
      // Revert if failed
      setIsLiked(previousLiked)
      setLikeCount(previousCount)
    }
  }

  async function handleMainCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if(!commentText.trim()) return

    await addComment(post.id, commentText)
    setCommentText('')
  }

  const displayName = post.author.alias || post.author.firstName
  const firstLetter = displayName[0].toUpperCase()

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 transition-all hover:border-slate-200">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-slate-700 font-bold text-lg shadow-sm shrink-0">
            {firstLetter}
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 leading-tight">
              {displayName}
            </span>

            <p className="text-xs text-slate-400 mb-1">
              {new Date(post.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
              {post.isEdited && <span className="italic ml-1">(Edited)</span>}
            </p>

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

        {/* POST ACTIONS (Edit/Delete) */}
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

      {/* POST CONTENT */}
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

      {/* FOOTER: LIKE & REPLY */}
      <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
        
        {/* Left: Like Button */}
        <button 
          onClick={handleToggleLike}
          className="group flex items-center gap-1.5 text-slate-400 hover:text-brand-sky transition-colors"
        >
          {isLiked ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-brand-sky animate-in zoom-in duration-200">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}

          <span className={`text-sm font-bold ${isLiked ? 'text-brand-sky' : 'text-slate-400'}`}>
            {likeCount}
          </span>
        </button>

        {/* Right: Reply Toggle Button */}
        <button 
          onClick={() => setShowComments(!showComments)} 
          className="flex items-center gap-2 text-slate-400 hover:text-brand-sky transition-colors font-medium text-sm group"
        >
          <span>{post.topLevelComments?.length || 0} Replies</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        </button>

      </div>

      {/* --- COMMENTS SECTION --- */}
      {showComments && (
        <div className="mt-6 animate-in slide-in-from-top-2 border-t border-slate-50 pt-4">
          
          {/* Main Input */}
          <form onSubmit={handleMainCommentSubmit} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-sky outline-none transition-all"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="bg-brand-sky text-white font-bold px-4 py-2 rounded-lg hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Post
            </button>
          </form>

          {/* List of Comments */}
          <div className="space-y-4">
            {post.topLevelComments?.map((comment: any) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                currentUserId={currentUserId}
                postId={post.id}
              />
            ))}
            
            {(!post.topLevelComments || post.topLevelComments.length === 0) && (
              <p className="text-center text-slate-400 text-xs italic">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}

    </div>
  )
}