import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

// Fetch posts directly from the database
async function getPosts() {
  const posts = await prisma.post.findMany({
    include: {
      author: true, 
    },
    orderBy: {
      createdAt: "desc", 
    },
  });
  return posts;
}

export default async function CommonRoom() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- FEED CONTAINER --- */}
      <div className="max-w-2xl mx-auto p-4 mt-8 pb-20">
        
        {/* --- PAGE TITLE --- */}
        <h1 className="text-3xl font-bold text-brand-sky mb-6 tracking-tight">
          The Common Room
        </h1>
        
        {/* Post Input Placeholder */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-slate-200">
          <p className="text-slate-400 text-sm mb-3 font-medium">Share an update with family...</p>
          <div className="h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center px-4 text-slate-300 cursor-not-allowed">
            Write something...
          </div>
        </div>

        {/* The Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => {
            const displayName = post.author.alias || post.author.firstName;
            const firstLetter = displayName[0].toUpperCase();

            return (
              <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                
                {/* User Header */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center text-slate-700 font-bold text-xl shadow-sm">
                    {firstLetter}
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 text-lg">
                        {displayName}
                      </p>
                      
                      {/* Family Position Badge */}
                      <span className="text-[10px] bg-brand-sky/10 text-brand-sky px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-brand-sky/20">
                        {post.author.position}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Post Content */}
                <p className="text-slate-700 leading-relaxed text-base">
                  {post.content}
                </p>

              </div>
            );
          })}

          {/* Empty State */}
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