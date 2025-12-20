import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all users, sorted by who joined first
async function getFamilyMembers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' }
  });
  return users;
}

export default async function FamilyDirectory() {
  const users = await getFamilyMembers();

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-5xl mx-auto mt-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-brand-sky mb-2">The Family Directory</h1>
          <p className="text-slate-500">
            We have <span className="font-bold text-brand-pink">{users.length}</span> members joined so far.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              
              {/* Avatar Circle */}
              <div className="w-16 h-16 bg-brand-sky/20 text-brand-sky rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                {(user.alias || user.firstName)[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="overflow-hidden">
                <h3 className="font-bold text-slate-800 text-lg truncate">
                  {user.alias || user.firstName}
                </h3>
                <p className="text-xs text-brand-pink font-bold uppercase tracking-wider mb-1">
                  {user.position}
                </p>
                
                {/* Full Name & Contact */}
                <p className="text-xs text-slate-400 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate mt-1">
                  {user.email}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}