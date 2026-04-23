'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { 
  FileText, 
  CreditCard, 
  MessageSquare, 
  UserCircle, 
  LogOut, 
  Sparkles,
  ChevronRight,
  Heart,
  Baby
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { parentsAPI, Child } from "@/lib/api/parents";

export default function ParentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [children_list, setChildrenList] = useState<Child[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'parent' && user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchChildren();
      }
    }
  }, [user, loading, router]);

  const fetchChildren = async () => {
    try {
      const data = await parentsAPI.getChildren();
      setChildrenList(data);
    } catch (err) {
      console.error("Failed to fetch children", err);
    }
  };

  const navItems = [
    { name: 'Latest Activities', href: '/parent', icon: Sparkles },
    { name: 'Billing & Invoices', href: '/parent/billing', icon: CreditCard },
    { name: 'Messages', href: '/parent/messages', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#f0f9ff] dark:bg-neutral-950 transition-colors">
      <aside className="w-80 bg-white dark:bg-neutral-900 flex flex-col pt-8 pb-10 px-6 border-r border-sky-100 dark:border-neutral-800 relative z-20">
        <div className="flex items-center gap-3 mb-10 px-2 group">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:rotate-12 transition-transform">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-xl font-black text-sky-900 dark:text-white tracking-tighter">
            KinderCloud <span className="text-sky-400 font-bold text-xs uppercase tracking-widest block">Parent Portal</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="px-4 mb-4">
             <h2 className="text-[10px] font-black text-sky-300 uppercase tracking-[0.2em] mb-4">Menu</h2>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                  isActive 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 active:scale-95' 
                  : 'text-slate-500 hover:bg-sky-50 dark:hover:bg-neutral-800 hover:text-sky-800 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-sky-400 group-hover:text-sky-500'} transition-colors`} />
                  <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}

          <div className="pt-8 px-4 mb-4">
             <h2 className="text-[10px] font-black text-sky-300 uppercase tracking-[0.2em] mb-4">My Children</h2>
          </div>
          
          {children_list.map(child => (
             <Link 
                key={child.id}
                href={`/parent/child/${child.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    pathname?.includes(child.id) 
                    ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                    : 'text-slate-500 hover:bg-amber-50'
                }`}
             >
                <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-700">
                    <Baby className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">{child.firstName}'s Journey</span>
             </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-400 hover:bg-rose-50 dark:hover:bg-neutral-800 hover:text-rose-600 transition-all font-black text-xs uppercase tracking-widest group"
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
