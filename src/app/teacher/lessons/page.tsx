'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  CheckCircle2, 
  Plus, 
  X, 
  Calendar, 
  MapPin, 
  Star, 
  Smile, 
  GraduationCap,
  ClipboardList,
  Home,
  AlertCircle,
  Loader2
} from "lucide-react";
import { lessonsAPI, Lesson, CreateLessonData } from '@/lib/api/lessons';
import { classroomsAPI, ClassRoom } from '@/lib/api/classrooms';
import { format } from 'date-fns';

export default function TeacherLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  
  const [formData, setFormData] = useState<CreateLessonData>({
    classRoomId: '',
    subject: '',
    lessonDate: new Date().toISOString().split('T')[0],
    plan: '',
    activity: '',
    progress: '',
    homework: '',
    assessment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const classRoomsData = await classroomsAPI.getAll();
      setClassrooms(classRoomsData);
      
      if (classRoomsData.length > 0) {
        setSelectedClassroom(classRoomsData[0].id);
        fetchLessons(classRoomsData[0].id);
        setFormData(prev => ({ ...prev, classRoomId: classRoomsData[0].id }));
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load classrooms');
      setLoading(false);
    }
  };

  const fetchLessons = async (classRoomId: string) => {
    try {
      setLoading(true);
      const data = await lessonsAPI.getClassRoomLessons(classRoomId);
      setLessons(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassroom(classId);
    setFormData(prev => ({ ...prev, classRoomId: classId }));
    fetchLessons(classId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await lessonsAPI.logLesson(formData);
      setShowModal(false);
      fetchLessons(selectedClassroom);
      setFormData({
        classRoomId: selectedClassroom,
        subject: '',
        lessonDate: new Date().toISOString().split('T')[0],
        plan: '',
        activity: '',
        progress: '',
        homework: '',
        assessment: ''
      });
    } catch (err) {
      console.error(err);
      setError('Submission failed. Check all required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && classrooms.length === 0) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-black text-rose-600 tracking-tight">Lesson Planner</h1>
          </div>
          <p className="text-rose-900/60 dark:text-neutral-400 font-bold ml-1">Log magical learning moments for your little stars.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
               <MapPin className="w-4 h-4 text-rose-500" />
             </div>
             <select 
              value={selectedClassroom}
              onChange={handleClassChange}
              className="pl-10 pr-8 py-3 bg-white dark:bg-neutral-800 border border-rose-100 dark:border-neutral-700 rounded-2xl font-bold text-rose-900 dark:text-neutral-200 focus:ring-2 focus:ring-rose-500 transition-all shadow-sm group-hover:scale-[1.02]"
             >
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
             </select>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 group"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" /> 
            <span>LOG NEW LESSON</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-[2rem] border border-rose-100 dark:border-neutral-700/50 p-8 shadow-sm">
            <h2 className="text-2xl font-black mb-8 text-neutral-800 dark:text-white flex items-center gap-3">
              <ClipboardList className="w-7 h-7 text-rose-500" />
              Lesson History
            </h2>
            
            {loading ? (
               <div className="flex justify-center p-10"><Loader2 className="animate-spin text-rose-500" /></div>
            ) : lessons.length > 0 ? (
              <div className="space-y-6">
                {lessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    className="p-6 border border-neutral-100 dark:border-neutral-700/50 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-rose-200 hover:bg-rose-50/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-neutral-800 dark:text-neutral-100">{lesson.subject}</h3>
                          <div className="flex items-center gap-2 text-sm font-bold text-neutral-500">
                             <Calendar className="w-3.5 h-3.5" />
                             {lesson.lessonDate ? format(new Date(lesson.lessonDate), 'PPPP') : 'No Date'}
                          </div>
                        </div>
                      </div>
                      <button className="text-rose-500 font-black text-sm hover:underline uppercase tracking-widest">Detail</button>
                    </div>
                    {lesson.activity && (
                      <p className="text-neutral-600 dark:text-neutral-400 font-medium mb-4 line-clamp-2">
                        {lesson.activity}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                       {lesson.homework && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-full uppercase tracking-tighter">Homework Assigned</span>}
                       {lesson.assessment && <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-black rounded-full uppercase tracking-tighter">Self-Assessment Ready</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-rose-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300">
                  <Star className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-300">No lessons logged yet!</h3>
                <p className="text-neutral-500 font-medium">Click "Log New Lesson" to get started.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-amber-100/50 dark:bg-amber-900/20 rounded-[2.5rem] p-8 border border-amber-200/50 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <Upload className="w-32 h-32 text-amber-900" />
              </div>
              <h2 className="text-2xl font-black mb-4 text-amber-900 dark:text-amber-500 relative z-10">Quick Upload</h2>
              <p className="text-amber-900/70 dark:text-neutral-400 mb-8 font-bold relative z-10 uppercase text-xs tracking-widest">Securely share PDF worksheets or video captures to Vercel Blob.</p>
              
              <div className="border-3 border-dashed border-amber-300 dark:border-neutral-600 rounded-[2rem] h-48 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 transition hover:bg-amber-50 dark:hover:bg-neutral-800 cursor-pointer shadow-inner group/drop relative z-10">
                <Upload className="w-12 h-12 text-amber-300 mb-3 group-hover/drop:scale-110 transition-transform" />
                <p className="font-black text-amber-700 dark:text-neutral-400 uppercase text-sm tracking-tight">Drop files here</p>
              </div>
           </div>

           <div className="bg-sky-100/50 dark:bg-sky-900/20 rounded-[2.5rem] p-8 border border-sky-200/50 shadow-sm">
              <h2 className="text-2xl font-black mb-4 text-sky-900 dark:text-sky-500">Teacher Tips</h2>
              <div className="space-y-4">
                 <div className="flex gap-3">
                   <div className="shrink-0 w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white"><Smile className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-sky-900/70 dark:text-neutral-400 leading-snug">Include photos of physical activities to engage parents.</p>
                 </div>
                 <div className="flex gap-3">
                   <div className="shrink-0 w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white"><Star className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-sky-900/70 dark:text-neutral-400 leading-snug">Use simple Assessment keywords like "Explorative" or "Mastered".</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 sm:p-10">
              <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                      <GraduationCap className="w-6 h-6" />
                   </div>
                   <h2 className="text-3xl font-black text-neutral-800 dark:text-white tracking-tight italic">Lesson Entry</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                  <X className="w-7 h-7" />
                </button>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Today's Subject</label>
                    <input 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="e.g. Creative Colors"
                      className="w-full px-5 py-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Learning Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.lessonDate}
                      onChange={(e) => setFormData({...formData, lessonDate: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2">
                    <ClipboardList className="w-3.5 h-3.5" />
                    The Plan
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.plan}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    placeholder="Objectives and flow..."
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2">
                    <Smile className="w-3.5 h-3.5" />
                    Classroom Activity
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    placeholder="What did the kids actually do?"
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2">
                      <Home className="w-3.5 h-3.5" />
                      Homework
                    </label>
                    <input 
                      value={formData.homework}
                      onChange={(e) => setFormData({...formData, homework: e.target.value})}
                      placeholder="Tasks for home..."
                      className="w-full px-5 py-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2">
                      <Star className="w-3.5 h-3.5" />
                      Assessment
                    </label>
                    <input 
                      value={formData.assessment}
                      onChange={(e) => setFormData({...formData, assessment: e.target.value})}
                      placeholder="Classroom outcome..."
                      className="w-full px-5 py-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-linear-to-r from-rose-500 to-amber-500 hover:scale-[1.01] active:scale-[0.99] text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-rose-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  {submitting ? 'LOGGING...' : 'SAVE LESSON LOG'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
