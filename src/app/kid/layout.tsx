'use client';

import { ReactNode, useEffect } from "react";
import { LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function KidLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'kid' && user.role !== 'admin') {
        const redirectMap: Record<string, string> = {
          admin: '/admin',
          teacher: '/teacher',
          parent: '/parent',
        };
        router.push(redirectMap[user.role] || '/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FFFDF0]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-amber-400 rounded-full border-8 border-white flex items-center justify-center text-white animate-bounce shadow-2xl">
             <Sparkles className="w-12 h-12" />
          </div>
          <p className="text-2xl font-black text-amber-500 tracking-tighter uppercase italic animate-pulse">Entering Magic Sandbox...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'kid' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#FFFDF0] dark:bg-neutral-900 overflow-hidden font-sans select-none">
      {/* 
        Kid's Top Navigation Bar 
        Optimized for zero text reading where possible, big visual cues.
      */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-[2rem] shadow-xl border-4 border-amber-200 dark:border-neutral-700 pointer-events-auto flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-12 h-12 bg-amber-400 rounded-full border-4 border-white flex items-center justify-center text-white font-black text-xl shadow-inner">
               {user?.firstName?.[0] || 'L'}
            </div>
            <span className="text-2xl font-black text-amber-500 tracking-tighter uppercase italic">
                {user?.firstName || "Leo"}'s Magic Cloud
            </span>
          </div>
          
          <button 
            onClick={() => logout()}
            className="bg-rose-500 hover:bg-rose-600 border-4 border-rose-300 text-white p-5 rounded-[2rem] shadow-xl hover:scale-110 active:scale-95 transition-all pointer-events-auto group"
          >
             <LogOut className="w-10 h-10 group-hover:rotate-12 transition-transform" />
             <span className="sr-only">Exit</span>
          </button>
      </nav>

      {/* Main Sandbox Area */}
      <main className="flex-1 w-full h-full flex flex-col items-center justify-center p-8 pt-24 relative overflow-y-auto custom-scrollbar">
        {/* Playful Background Elements */}
        <div className="fixed top-20 left-20 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
        <div className="fixed bottom-20 right-20 w-80 h-80 bg-rose-400 rounded-full blur-[100px] opacity-20 animate-pulse delay-1000"></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-200 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center">
            {children}
        </div>
      </main>
    </div>
  );
}
