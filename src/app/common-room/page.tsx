import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import PostInput from "@/components/PostInput";
import PostCard from "@/components/PostCard";

const prisma = new PrismaClient();

async function getUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value
  if (!sessionId) return null

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, firstName: true, alias: true }
  })
  return user
}

async function getPosts() {
  return await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CommonRoom() {
  const [user, posts] = await Promise.all([getUser(), getPosts()]);
  const welcomeName = user?.alias || user?.firstName || "Family Member";

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-2xl mx-auto p-4 mt-8 pb-20">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-3xl font-bold text-brand-sky tracking-tight">The Common Room</h1>
          <h2 className="text-slate-500 font-medium text-lg pb-1">
            Welcome home, <span className="text-brand-pink font-bold">{welcomeName}</span>.
          </h2>
        </div>

        {/* INPUT FORM */}
        <PostInput />

        {/* POSTS FEED */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user?.id || ''} />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-4xl mb-4">🦗</p>
              <p className="text-slate-500 font-medium">It's quiet in here...</p>
              <p className="text-sm text-slate-400">Be the first to post!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}