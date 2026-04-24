'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { 
  BookOpen, 
  CalendarHeart, 
  MessageCircle, 
  Home, 
  LogOut,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'teacher' && user.role !== 'admin') {
        const redirectMap: Record<string, string> = {
          admin: '/admin',
          parent: '/parent',
          kid: '/kid',
        };
        router.push(redirectMap[user.role] || '/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white animate-pulse shadow-xl shadow-rose-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Educator Workspace Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/teacher', icon: Home },
    { name: 'Diary Plans', href: '/teacher/diary', icon: CalendarHeart },
    { name: 'Lessons', href: '/teacher/lessons', icon: BookOpen },
    { name: 'Messages', href: '/teacher/messages', icon: MessageCircle },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-neutral-950 transition-colors">
      <aside className="w-72 bg-white dark:bg-neutral-900 flex flex-col pt-8 pb-10 px-6 border-r border-slate-100 dark:border-neutral-800 relative z-20">
        <div className="flex items-center gap-3 mb-10 px-2 group">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:rotate-12 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
            KinderCloud
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                  isActive 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 active:scale-95' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-500'} transition-colors`} />
                  <span className="font-black text-sm uppercase tracking-widest">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-slate-50 dark:bg-neutral-800/50 rounded-3xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl border border-slate-100 dark:border-neutral-700 flex items-center justify-center text-slate-400 font-black text-xs shadow-sm">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-800 dark:text-neutral-100 truncate leading-none mb-1">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Classroom Teacher</p>
            </div>
          </div>

          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:text-rose-600 transition-all font-black text-sm uppercase tracking-widest group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        {children}
      </main>
    </div>
  );
}

