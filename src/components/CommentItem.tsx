'use client'

import { useState } from 'react'
import { addComment, toggleCommentLike, deleteComment, editComment } from '@/app/common-room/actions'
import LikeButton from './LikeButton'

export default function CommentItem({ 
  comment, 
  currentUserId, 
  postId 
}: { 
  comment: any, 
  currentUserId: string, 
  postId: string 
}) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const ADMIN_EMAIL = 'idongesit_essien@ymail.com'
  const isAdmin = comment.author?.email === ADMIN_EMAIL
  const isAuthor = currentUserId === comment.authorId
  
  const createdAt = new Date(comment.createdAt).getTime()
  const timeDiff = Date.now() - createdAt
  const canEdit = isAuthor && !comment.isEdited && timeDiff < 10 * 60 * 1000

  // ... (Handlers same as before)
  async function handleToggleLike() { await toggleCommentLike(comment.id) }
  async function handleDelete() { if (confirm('Delete this comment?')) await deleteComment(comment.id) }
  async function handleEditSave() { 
    const result = await editComment(comment.id, editContent)
    if (result.success) setIsEditing(false) 
    else alert(result.message) 
  }
  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return
    await addComment(postId, replyContent, comment.id)
    setIsReplying(false)
    setReplyContent('')
  }

  const displayName = comment.author?.alias || comment.author?.firstName || 'Family Member'
  const firstLetter = displayName[0]?.toUpperCase() || '?'

  return (
    <div className="flex gap-3 mt-4 w-full">
      <div className="w-8 h-8 bg-brand-sky/20 rounded-full flex items-center justify-center text-brand-sky font-bold text-xs shrink-0">
        {firstLetter}
      </div>

      <div className="flex-1">
        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 group relative">
          
          {/* HEADER */}
          <div className="flex justify-between items-baseline mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 text-sm">{displayName}</span>
              
              {/* --- NEW GREY ADMIN BADGE --- */}
              {isAdmin && (
                <span className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded border border-slate-500 font-bold uppercase tracking-wide flex items-center gap-0.5 shadow-sm">
                  Admin
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString(undefined, {
                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                }) : ''}
                {comment.isEdited && <span className="italic ml-1">(Edited)</span>}
              </span>
              {isAuthor && !isEditing && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   {canEdit && <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-brand-sky" title="Edit">...</button>}
                   <button onClick={handleDelete} className="text-slate-400 hover:text-red-500" title="Delete">...</button>
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-1">
              <input autoFocus type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full text-sm p-1 border-b border-brand-sky outline-none bg-transparent"/>
              <div className="flex gap-2 mt-2 justify-end text-[10px] font-bold">
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                <button onClick={handleEditSave} className="text-brand-sky hover:text-sky-600">Save</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 break-words whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-4 mt-1 ml-2 text-xs font-bold text-slate-400">
            <LikeButton initialLikes={comment.likes || []} currentUserId={currentUserId} onToggle={handleToggleLike} />
            <button onClick={() => setIsReplying(!isReplying)} className="hover:text-brand-sky transition-colors">Reply</button>
          </div>
        )}

        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2 animate-in slide-in-from-top-1">
            <input autoFocus type="text" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder={`Reply to ${displayName}...`} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-sky outline-none"/>
            <button type="submit" className="bg-brand-sky text-white px-3 py-1 rounded-lg text-xs font-bold">Send</button>
          </form>
        )}

        {comment.children && comment.children.length > 0 && (
          <div className="border-l-2 border-slate-100 pl-4 mt-2">
            {comment.children.map((child: any) => (
              <CommentItem key={child.id} comment={child} currentUserId={currentUserId} postId={postId} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}