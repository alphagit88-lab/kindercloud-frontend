'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Baby, 
  BookOpen, 
  ClipboardList, 
  Home, 
  Star, 
  Calendar,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { parentsAPI, Child } from '@/lib/api/parents';
import { Lesson } from '@/lib/api/lessons';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ChildJourneyPage() {
  const { kidId } = useParams();
  const [child, setChild] = useState<Child | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (kidId) {
      fetchData();
    }
  }, [kidId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const kids = await parentsAPI.getChildren();
      const currentChild = kids.find(k => k.id === kidId);
      setChild(currentChild || null);

      const lessonData = await parentsAPI.getChildLessons(kidId as string);
      setLessons(lessonData);
    } catch (err) {
      console.error(err);
      setError('Failed to load child data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-10 h-10 text-sky-500 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-6">
          <Link href="/parent" className="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-sky-100 hover:bg-sky-50 transition-colors shadow-sm">
             <ArrowLeft className="w-6 h-6 text-sky-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 text-white">
                    <Baby className="w-7 h-7" />
                </div>
                <h1 className="text-4xl font-black text-neutral-800 dark:text-white tracking-tight italic">{child?.firstName}'s Journey</h1>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 font-bold ml-1 uppercase text-[10px] tracking-widest">Tracking growth, magic, and learning moments.</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-[3rem] p-10 border border-neutral-100 dark:border-neutral-700 shadow-sm">
                <h2 className="text-2xl font-black mb-8 text-neutral-800 dark:text-white flex items-center gap-3 italic">
                    <ClipboardList className="w-7 h-7 text-sky-500" />
                    Learning History
                </h2>

                {lessons.length > 0 ? (
                    <div className="space-y-10">
                        {lessons.map((lesson, idx) => (
                            <div key={lesson.id} className="relative pl-12 group">
                                {/* Vertical Timeline Line */}
                                {idx !== lessons.length - 1 && (
                                    <div className="absolute left-[23px] top-12 bottom-[-40px] w-0.5 bg-sky-100 dark:bg-neutral-800 group-hover:bg-sky-200 transition-colors" />
                                )}
                                
                                <div className="absolute left-0 top-0 w-12 h-12 bg-white dark:bg-neutral-900 border-4 border-sky-50 dark:border-neutral-800 rounded-2xl flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-neutral-50/50 dark:bg-neutral-900/30 border border-transparent hover:border-sky-100 hover:bg-white dark:hover:bg-neutral-800 transition-all shadow-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                                                <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{format(new Date(lesson.lessonDate), 'PPPP')}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-neutral-800 dark:text-neutral-100 italic">{lesson.subject}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-neutral-400 uppercase block mb-1">Teacher</span>
                                            <p className="font-bold text-neutral-600 dark:text-neutral-300">Teacher {lesson.teacher?.firstName}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase text-sky-500 tracking-widest mb-2 flex items-center gap-2">
                                                    <Star className="w-3 h-3 fill-current" /> Activity
                                                </h4>
                                                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                                                    {lesson.activity || 'The children enjoyed a wonderful creative session today.'}
                                                </p>
                                            </div>
                                            {lesson.progress && (
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-2 flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3" /> Progress
                                                    </h4>
                                                    <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                                                        {lesson.progress}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                                                <h4 className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-2 flex items-center gap-2">
                                                    <Home className="w-3 h-3" /> Homework
                                                </h4>
                                                <p className="text-sm font-black text-amber-900 dark:text-amber-200">
                                                    {lesson.homework || 'No extra tasks tonight. Sleep well!'}
                                                </p>
                                            </div>
                                            {lesson.assessment && (
                                                <div className="p-6 bg-sky-50 dark:bg-sky-900/10 rounded-3xl border border-sky-100 dark:border-sky-900/30">
                                                    <h4 className="text-[10px] font-black uppercase text-sky-600 tracking-widest mb-2 flex items-center gap-2">
                                                        <BookOpen className="w-3 h-3" /> Assessment
                                                    </h4>
                                                    <p className="text-sm font-bold text-sky-900 dark:text-sky-200 italic">
                                                        {lesson.assessment}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                        <p className="font-bold text-neutral-400">No lessons logged for {child?.firstName} yet.</p>
                    </div>
                )}
            </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-neutral-800 p-10 rounded-[3rem] border border-sky-100 dark:border-neutral-700 shadow-sm">
                <div className="w-24 h-24 bg-sky-50 dark:bg-neutral-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-sky-500 shadow-inner">
                    <Baby className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-center text-neutral-800 dark:text-white mb-1 italic">{child?.firstName} {child?.lastName}</h3>
                <p className="text-center text-[10px] font-black text-sky-400 uppercase tracking-widest mb-8">Active Preschooler</p>
                
                <div className="space-y-4 pt-6 border-t border-neutral-50 dark:border-neutral-700">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Attendance</span>
                        <span className="text-xs font-black text-emerald-500 uppercase">98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Activities</span>
                        <span className="text-xs font-black text-amber-500 uppercase">{lessons.length} Logs</span>
                    </div>
                </div>
            </div>

            <div className="bg-linear-to-br from-sky-500 to-sky-600 rounded-[3rem] p-10 text-white shadow-xl shadow-sky-500/30">
                <h3 className="text-2xl font-black mb-4">Magic Milestones</h3>
                <p className="text-sky-100 font-bold text-sm leading-relaxed mb-8">
                    Your child is hitting new milestones every day. Check back often for personalized teacher observations!
                </p>
                <div className="w-full py-4 bg-white/20 rounded-2xl text-center font-black text-xs uppercase tracking-widest backdrop-blur-md">
                    Explore Progress Reports
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
