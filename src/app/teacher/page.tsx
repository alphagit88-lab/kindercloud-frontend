'use client';

import { 
  Smile, 
  Calendar, 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Clock, 
  ArrowRight,
  ClipboardList,
  Camera,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const QUICK_ACTIONS = [
  { title: 'Log Lesson', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-50', link: '/teacher/lessons' },
  { title: 'Daily Diary', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50', link: '/teacher/diary' },
  { title: 'Message', icon: MessageSquare, color: 'text-sky-500', bg: 'bg-sky-50', link: '/teacher/messages' },
  { title: 'Capture', icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-50', link: '/teacher/media' },
];

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <header className="relative overflow-hidden bg-white dark:bg-neutral-800 p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-rose-200/20 border border-rose-100 dark:border-neutral-700 group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
           <Sparkles className="w-64 h-64 text-rose-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
               <Smile className="w-7 h-7" />
             </div>
             <span className="bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
               Active Session
             </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-800 dark:text-white mb-4 tracking-tight">
            Magical Day, <span className="text-rose-500">Teacher {user?.firstName || 'Sarah'}!</span>
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-bold max-w-2xl leading-relaxed">
            Your preschoolers are ready for some magic. You have <span className="text-rose-600 underline decoration-rose-200 underline-offset-4 font-black">2 classrooms</span> assigned today.
          </p>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Kids Present', value: '14', icon: Users, color: 'text-sky-500', bg: 'bg-sky-50' },
           { label: 'Meals Served', value: '12', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
           { label: 'Lessons Logged', value: '3', icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Messages', value: '2', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
         ].map((stat, idx) => (
           <div key={idx} className={`${stat.bg} p-6 rounded-[2.5rem] border border-white dark:border-neutral-700 shadow-sm flex flex-col items-center justify-center text-center group hover:scale-[1.03] transition-all`}>
              <stat.icon className={`w-8 h-8 ${stat.color} mb-3 group-hover:rotate-12 transition-transform`} />
              <div className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mb-1">{stat.value}</div>
              <div className="text-xs font-black uppercase tracking-widest text-neutral-400">{stat.label}</div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-[3rem] p-10 border border-neutral-100 dark:border-neutral-700 shadow-sm relative overflow-hidden">
              <h2 className="text-3xl font-black mb-8 text-neutral-800 dark:text-white flex items-center gap-3">
                 <Clock className="w-8 h-8 text-amber-500" />
                 Upcoming Schedule
              </h2>
              
              <div className="space-y-6">
                 {[
                   { time: '09:00 AM', event: 'Morning Meet & Greet', room: 'Little Owls (A)', desc: 'Circle time and daily greeting songs.' },
                   { time: '10:30 AM', event: 'Creative Colors Workshop', room: 'Busy Bees (B)', desc: 'Exploring primary colors with finger paints.' }
                 ].map((item, idx) => (
                   <div key={idx} className="flex gap-6 p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 shadow-inner group hover:bg-white dark:hover:hover:bg-neutral-800 transition-all border border-transparent hover:border-amber-100">
                      <div className="shrink-0 flex flex-col items-center">
                         <div className="text-sm font-black text-amber-600 mb-1">{item.time}</div>
                         <div className="w-1 h-full bg-amber-100 dark:bg-neutral-700 rounded-full" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-black text-neutral-800 dark:text-neutral-100">{item.event}</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-full text-neutral-500">{item.room}</span>
                         </div>
                         <p className="text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
              
              <button className="mt-8 w-full py-4 bg-amber-50 hover:bg-amber-100 text-amber-600 font-black rounded-2xl transition-all flex items-center justify-center gap-2 border border-amber-200/50 uppercase tracking-widest text-sm">
                 Full Calendar <ArrowRight className="w-4 h-4" />
              </button>
           </section>
        </div>

        {/* Quick Access Sidebar */}
        <div className="space-y-8">
           <div className="bg-rose-500 rounded-[3rem] p-10 shadow-xl shadow-rose-500/30 text-white relative overflow-hidden group">
              <Sparkles className="absolute -top-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-45 transition-transform duration-1000" />
              <h2 className="text-2xl font-black mb-6">Quick Links</h2>
              <div className="grid grid-cols-2 gap-4">
                 {QUICK_ACTIONS.map((action, idx) => (
                   <Link 
                    key={idx} 
                    href={action.link}
                    className="flex flex-col items-center justify-center p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-[2rem] transition-all group/item"
                    >
                      <action.icon className="w-8 h-8 mb-2 group-hover/item:scale-110 transition-transform" />
                      <span className="font-black text-[10px] uppercase tracking-widest">{action.title}</span>
                   </Link>
                 ))}
              </div>
           </div>

           <div className="bg-white dark:bg-neutral-800 p-8 rounded-[3rem] border border-sky-100 dark:border-neutral-700 shadow-lg shadow-sky-500/5">
              <h2 className="text-2xl font-black mb-6 text-sky-900 dark:text-sky-400 flex items-center gap-3">
                 <MessageSquare className="w-7 h-7" />
                 New Messages
              </h2>
              <div className="space-y-4">
                 <div className="p-4 bg-sky-50 dark:bg-neutral-900 rounded-2xl border border-sky-100 dark:border-neutral-700">
                    <div className="flex justify-between items-start mb-1">
                       <span className="font-black text-sky-900 dark:text-neutral-200">Leo's Mom</span>
                       <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">3m ago</span>
                    </div>
                    <p className="text-sm font-bold text-sky-700/70 dark:text-neutral-400">Leo might be 10 mins late today due to traffic...</p>
                 </div>
              </div>
              <Link href="/teacher/messages" className="block mt-6 text-center text-sm font-black text-sky-600 hover:underline uppercase tracking-widest italic">
                 View All Portal Activity
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
