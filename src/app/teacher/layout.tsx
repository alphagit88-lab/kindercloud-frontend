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
        router.push('/login');
      }
    }
  }, [user, loading, router]);

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

        <div className="mt-auto">
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

