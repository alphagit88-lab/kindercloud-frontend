'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  LayoutDashboard, 
  Database, 
  Cloud, 
  Calendar, 
  Package, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  Home,
  Clock,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', color: 'sky' },
  { label: 'Student Management', icon: Users, path: '/admin/students', color: 'rose' },
  { label: 'Classroom Structure', icon: Home, path: '/admin/classrooms', color: 'sky' },
  { label: 'Teacher Operations', icon: GraduationCap, path: '/admin/teachers', color: 'amber' },
  { label: 'Finance & Fees', icon: DollarSign, path: '/admin/finance', color: 'mint' },
  { label: 'Supply Inventory', icon: Package, path: '/admin/stock', color: 'indigo' },
  { label: 'Asset Registry', icon: Database, path: '/admin/assets', color: 'sky' },
  { label: 'Attendance Logs', icon: Clock, path: '/admin/attendance', color: 'sky' },
  { label: 'Class Timetable', icon: Clock, path: '/admin/timetable', color: 'amber' },
  { label: 'School Events', icon: Calendar, path: '/admin/events', color: 'rose' },
  { label: 'Messages', icon: MessageCircle, path: '/admin/messages', color: 'sky' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        // Redirect to their respective dashboard if not an admin
        const redirectMap: Record<string, string> = {
          teacher: '/teacher',
          parent: '/parent',
          kid: '/kid',
        };
        router.push(redirectMap[user.role] || '/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center text-white animate-bounce shadow-xl shadow-sky-500/20">
            <Cloud className="w-8 h-8 fill-white" />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Entering Control Center...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-linear-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:rotate-12 transition-transform">
              <Cloud className="w-7 h-7 fill-white" />
            </div>
            <div>
               <h1 className="text-xl font-display font-black text-slate-800 tracking-tighter leading-none">
                 Kinder<span className="text-sky-500">Admin</span>
               </h1>
               <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Control Center</span>
                  <div className="w-1 h-1 bg-sky-500 rounded-full animate-pulse" />
               </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path}
                href={item.path} 
                className={`group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? `bg-slate-900 text-white shadow-xl shadow-slate-900/10` 
                    : `text-slate-500 hover:bg-slate-50 hover:text-slate-900`
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-white/10' : `bg-${item.color}-50 text-${item.color}-500`
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-sky-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-6 border-t border-slate-50">
           <div className="bg-slate-50 rounded-3xl p-4 flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs shadow-sm">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Master Admin</p>
             </div>
           </div>
           
           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
           >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content Space */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between z-20">
           <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</span>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                 <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                 <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Live Operations</span>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm" />
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-sky-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm">+</div>
              </div>
              <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                 <Settings className="w-5 h-5" />
              </button>
           </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 relative">
          {children}
        </section>
      </main>
    </div>
  );
}
