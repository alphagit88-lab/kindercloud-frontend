'use client';

import { useState, useEffect } from "react";
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
  Heart,
  CheckCircle2,
  AlertCircle,
  Coffee,
  XCircle,
  Loader2,
  LogOut,
  CalendarDays
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { teachersAPI } from "@/lib/api/teachers";
import { format } from "date-fns";

const QUICK_ACTIONS = [
  { title: 'Log Lesson', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-50', link: '/teacher/lessons' },
  { title: 'Daily Diary', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50', link: '/teacher/diary' },
  { title: 'Message', icon: MessageSquare, color: 'text-sky-500', bg: 'bg-sky-50', link: '/teacher/messages' },
  { title: 'Capture', icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-50', link: '/teacher/media' },
];

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'late' | 'leave' | 'half-day'>('late');
  const [note, setNote] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [workHours, setWorkHours] = useState('00:00:00');

  useEffect(() => {
    if (user?.id) {
      fetchAttendance();
    }
  }, [user]);

  useEffect(() => {
    let interval: any;
    if (attendance?.checkInTime && !attendance.checkOutTime) {
      interval = setInterval(() => {
        const checkIn = new Date(attendance.checkInTime).getTime();
        const now = new Date().getTime();
        const diff = now - checkIn;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setWorkHours(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    } else {
      setWorkHours('00:00:00');
    }
    return () => clearInterval(interval);
  }, [attendance]);

  const fetchAttendance = async () => {
    try {
      const data = await teachersAPI.getAttendanceHistory(user!.id);
      setHistory(data);
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = data.find((h: any) => h.date === today);
      setAttendance(todayRecord || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async (status: string, reason?: string) => {
    setSubmitLoading(true);
    try {
      await teachersAPI.markAttendance({ status, note: reason });
      await fetchAttendance();
      setIsModalOpen(false);
      setNote('');
    } catch (err) {
      alert("Failed to update attendance");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setSubmitLoading(true);
    try {
      await teachersAPI.checkOut();
      await fetchAttendance();
    } catch (err) {
      alert("Failed to check out");
    } finally {
      setSubmitLoading(false);
    }
  };

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
           {/* Attendance Card */}
           <section className="bg-white dark:bg-neutral-800 p-8 rounded-[3rem] border border-sky-100 dark:border-neutral-700 shadow-xl shadow-sky-500/5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                 <div>
                    <h2 className="text-2xl font-black text-neutral-800 dark:text-white flex items-center gap-3 mb-2">
                       <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                       Attendance & Check-in
                    </h2>
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-bold text-neutral-400">
                        {attendance 
                            ? `Status: ${attendance.status.toUpperCase()} ${attendance.checkInTime ? `at ${format(new Date(attendance.checkInTime), 'hh:mm a')}` : ''}`
                            : 'You haven\'t checked in yet for today.'}
                        </p>
                        {attendance?.checkInTime && !attendance.checkOutTime && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">{workHours}</span>
                            </div>
                        )}
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {!attendance || (attendance.status !== 'present' && attendance.status !== 'late') ? (
                       <>
                          <button 
                            onClick={() => handleMark('present')}
                            disabled={submitLoading}
                            className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                          >
                             {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                             Check In
                          </button>
                          <button 
                            onClick={() => { setModalType('late'); setIsModalOpen(true); }}
                            className="flex-1 sm:flex-none px-6 py-3 bg-amber-100 text-amber-700 font-black rounded-2xl hover:bg-amber-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                             <Clock className="w-5 h-5" />
                             I'm Late
                          </button>
                       </>
                    ) : (
                       <button 
                        onClick={handleCheckOut}
                        disabled={!!attendance.checkOutTime || submitLoading}
                        className={`flex-1 sm:flex-none px-6 py-3 font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${
                            attendance.checkOutTime 
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200 active:scale-95'
                        }`}
                       >
                          <LogOut className="w-5 h-5" />
                          {attendance.checkOutTime ? `Checked Out at ${format(new Date(attendance.checkOutTime), 'hh:mm a')}` : 'Check Out'}
                       </button>
                    )}
                    
                    <button 
                        onClick={() => { setModalType('leave'); setIsModalOpen(true); }}
                        className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Coffee className="w-5 h-5" />
                        Request Leave
                    </button>
                 </div>
              </div>
           </section>
            <section className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-[3rem] p-10 border border-neutral-100 dark:border-neutral-700 shadow-sm relative overflow-hidden">
               <h2 className="text-3xl font-black mb-8 text-neutral-800 dark:text-white flex items-center gap-3">
                  <CalendarDays className="w-8 h-8 text-sky-500" />
                  Monthly Attendance History
               </h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {history.length > 0 ? history.slice(0, 10).map((record, idx) => (
                    <div key={idx} className="p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-transparent hover:border-sky-100 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${
                             record.status === 'present' ? 'bg-emerald-100 text-emerald-600' : 
                             record.status === 'late' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                             {record.status === 'present' ? 'P' : record.status === 'late' ? 'L' : 'A'}
                          </div>
                          <div>
                             <p className="font-black text-neutral-800 dark:text-neutral-100">{format(new Date(record.date), 'EEE, MMM dd')}</p>
                             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                {record.checkInTime ? format(new Date(record.checkInTime), 'hh:mm a') : 'No Check-in'} 
                                {record.checkOutTime ? ` - ${format(new Date(record.checkOutTime), 'hh:mm a')}` : ''}
                             </p>
                          </div>
                       </div>
                       {record.note && (
                          <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                             <AlertCircle className="w-4 h-4 text-amber-400" />
                          </div>
                       )}
                    </div>
                  )) : (
                    <div className="col-span-full py-10 text-center text-neutral-400 italic font-bold">No history available.</div>
                  )}
               </div>

               <button className="mt-8 w-full py-4 bg-sky-50 hover:bg-sky-100 text-sky-600 font-black rounded-2xl transition-all flex items-center justify-center gap-2 border border-sky-200/50 uppercase tracking-widest text-sm">
                  View Full History <ArrowRight className="w-4 h-4" />
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

      {/* Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white dark:bg-neutral-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-neutral-800 dark:text-white italic">
                            {modalType === 'late' ? 'Running Late?' : modalType === 'half-day' ? 'Half Day Request' : 'Leave Request'}
                        </h2>
                        <p className="text-neutral-400 font-bold mt-1">Please provide a reason or note below.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors">
                        <XCircle className="w-6 h-6 text-neutral-300" />
                    </button>
                </div>

                <div className="space-y-6">
                    {modalType !== 'late' && (
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setModalType('leave')}
                                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
                                    modalType === 'leave' ? 'bg-sky-500 border-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-white text-slate-400 border-slate-100'
                                }`}
                            >
                                Full Day
                            </button>
                            <button 
                                onClick={() => setModalType('half-day')}
                                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
                                    modalType === 'half-day' ? 'bg-sky-500 border-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-white text-slate-400 border-slate-100'
                                }`}
                            >
                                Half Day
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Reason / Message</label>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={modalType === 'late' ? "Traffic, personal emergency..." : "Family event, medical appointment..."}
                            className="w-full bg-slate-50 dark:bg-neutral-900 border-2 border-slate-100 dark:border-neutral-700 rounded-3xl p-6 font-bold text-slate-700 dark:text-white h-40 focus:border-sky-500 focus:outline-none transition-all resize-none"
                        />
                    </div>

                    <button 
                        onClick={() => handleMark(modalType, note)}
                        disabled={submitLoading || (modalType === 'late' && !note)}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
                    >
                        {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
