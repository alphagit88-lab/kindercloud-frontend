'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Star, 
  Calendar, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Home,
  CheckCircle2
} from "lucide-react";
import { parentsAPI, Child } from '@/lib/api/parents';
import { Lesson } from '@/lib/api/lessons';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ParentDashboardPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [latestActivity, setLatestActivity] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const kids = await parentsAPI.getChildren();
      setChildren(kids);
      
      if (kids.length > 0) {
        const lessons = await parentsAPI.getChildLessons(kids[0].id);
        if (lessons.length > 0) {
          setLatestActivity(lessons[0]);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-10 h-10 text-sky-500 animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <header className="relative overflow-hidden bg-white dark:bg-neutral-800 p-10 sm:p-14 rounded-[3rem] shadow-xl shadow-sky-200/20 border border-sky-100 dark:border-neutral-700 group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
           <Sparkles className="w-64 h-64 text-sky-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
               <Home className="w-7 h-7" />
             </div>
             <span className="bg-sky-50 text-sky-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
               Parent Portal
             </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-800 dark:text-white mb-6 tracking-tight italic">
            Welcome Back, <span className="text-sky-500">{user?.firstName}!</span>
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-bold max-w-2xl leading-relaxed">
            Stay connected with your child's magical learning journey and classroom activities.
          </p>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-[3rem] p-10 border border-neutral-100 dark:border-neutral-700 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-neutral-800 dark:text-white flex items-center gap-3">
                    <Star className="w-8 h-8 text-amber-500" />
                    Latest from Classroom
                </h2>
                {children.length > 0 && (
                    <Link href={`/parent/child/${children[0].id}`} className="text-sky-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                        View History <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
              </div>
              
              {latestActivity ? (
                <div className="p-8 rounded-[2.5rem] bg-sky-50/50 dark:bg-neutral-900 shadow-inner border border-sky-100/50 group transition-all">
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-[2rem] shadow-sm flex flex-col items-center justify-center shrink-0 border border-sky-100">
                            <span className="text-2xl font-black text-sky-600">{format(new Date(latestActivity.lessonDate), 'dd')}</span>
                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{format(new Date(latestActivity.lessonDate), 'MMM')}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-black text-neutral-800 dark:text-neutral-100 italic">{latestActivity.subject}</h3>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">Logged</span>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed mb-6">
                                {latestActivity.activity || latestActivity.plan || 'No details recorded for this activity yet.'}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/50 dark:bg-neutral-800 rounded-2xl border border-sky-50">
                                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block mb-1">Homework</span>
                                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 truncate">{latestActivity.homework || 'None assigned'}</p>
                                </div>
                                <div className="p-4 bg-white/50 dark:bg-neutral-800 rounded-2xl border border-sky-50">
                                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block mb-1">Teacher</span>
                                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Teacher {latestActivity.teacher?.firstName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-neutral-100">
                    <BookOpen className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                    <p className="font-bold text-neutral-400">No classroom activity logged yet for this week.</p>
                </div>
              )}
           </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-neutral-800 p-10 rounded-[3rem] border border-sky-100 dark:border-neutral-700 shadow-sm">
              <h2 className="text-2xl font-black mb-8 text-neutral-800 dark:text-white italic">My Children</h2>
              <div className="space-y-4">
                 {children.map(child => (
                   <Link 
                    key={child.id}
                    href={`/parent/child/${child.id}`}
                    className="flex items-center gap-4 p-4 rounded-3xl bg-sky-50/50 hover:bg-sky-100/50 border border-sky-100/50 transition-all group"
                   >
                     <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm font-black group-hover:scale-110 transition-transform">
                        {child.profilePicture ? <img src={child.profilePicture} className="w-full h-full object-cover rounded-2xl" /> : child.firstName[0]}
                     </div>
                     <div>
                        <p className="font-black text-neutral-800 dark:text-neutral-200 text-sm">{child.firstName} {child.lastName}</p>
                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mt-0.5">View Journey</p>
                     </div>
                   </Link>
                 ))}
              </div>
           </div>

           <div className="bg-amber-500 rounded-[3rem] p-10 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-45 transition-transform duration-700">
                 <CheckCircle2 className="w-32 h-32" />
              </div>
              <h2 className="text-2xl font-black mb-4 relative z-10">Quick Actions</h2>
              <div className="space-y-3 relative z-10">
                 <Link href="/parent/billing" className="block w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-center font-black text-xs uppercase tracking-[0.2em] transition-all">
                    Make Payment
                 </Link>
                 <Link href="/parent/messages" className="block w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-center font-black text-xs uppercase tracking-[0.2em] transition-all">
                    Contact Teacher
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
