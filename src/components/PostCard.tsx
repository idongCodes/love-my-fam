'use client'

import { useState } from 'react'
import { deletePost, editPost, toggleLike, addComment } from '@/app/common-room/actions'
import CommentItem from './CommentItem'
import LikeButton from './LikeButton'

export default function PostCard({ post, currentUserId }: { post: any, currentUserId: string }) {
  // ... (State logic same as before)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'
  const isAdmin = post.author.email === ADMIN_EMAIL
  const isAuthor = currentUserId === post.authorId
  
  const createdAt = new Date(post.createdAt).getTime()
  const timeDiff = Date.now() - createdAt
  const canEdit = isAuthor && !post.isEdited && timeDiff < 10 * 60 * 1000

  // ... (Handlers same as before)
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
    await toggleLike(post.id)
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
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] bg-brand-sky/10 text-brand-sky px-2 py-0.5 rounded-full font-bold uppercase border border-brand-sky/20">
                {post.author.position}
              </span>
            </div>

            {/* --- NEW GREY ADMIN BADGE --- */}
            {isAdmin && (
              <span className="bg-slate-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit flex items-center gap-1 mt-1 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                   <path fillRule="evenodd" d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0 0 18 14.25V6.443Zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 0 0 .388.657l6.862 3.786Z" clipRule="evenodd" />
                </svg>
                Admin
              </span>
            )}

            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(post.createdAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
              {post.isEdited && <span className="italic ml-1">(Edited)</span>}
            </p>
          </div>
        </div>

        {isAuthor && (
          <div className="flex gap-3 text-slate-400">
            {canEdit && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="hover:text-brand-sky transition-colors p-1 rounded-full hover:bg-slate-50" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
            )}
            <button onClick={handleDelete} className="hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        )}
      </div>

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
          <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap mb-3">{post.content}</p>
          {post.imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-100">
              <img src={post.imageUrl} alt="Post attachment" className="w-full max-h-96 object-cover bg-slate-50" loading="lazy"/>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
        <LikeButton initialLikes={post.likes} currentUserId={currentUserId} onToggle={handleToggleLike} />
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-slate-400 hover:text-brand-sky transition-colors font-medium text-sm group">
          <span>{post.topLevelComments?.length || 0} Replies</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        </button>
      </div>

      {showComments && (
        <div className="mt-6 animate-in slide-in-from-top-2 border-t border-slate-50 pt-4">
          <form onSubmit={handleMainCommentSubmit} className="flex gap-2 mb-6">
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-sky outline-none transition-all"/>
            <button type="submit" disabled={!commentText.trim()} className="bg-brand-sky text-white font-bold px-4 py-2 rounded-lg hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Post</button>
          </form>
          <div className="space-y-4">
            {post.topLevelComments?.map((comment: any) => (
              <CommentItem key={comment.id} comment={comment} currentUserId={currentUserId} postId={post.id}/>
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