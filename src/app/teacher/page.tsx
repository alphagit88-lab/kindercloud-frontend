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

      {/* Attendance Section - Modern Glassmorphism Redesign */}
      <section className="relative group">
          {/* Decorative Background Blur */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-[3.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-[3.5rem] border border-white/20 dark:border-neutral-700/50 shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
                {/* Left Side: Status & Timer */}
                <div className={`flex-1 p-10 flex flex-col justify-center transition-all duration-700 ${
                  attendance?.checkInTime && !attendance.checkOutTime 
                  ? 'bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-white' 
                  : 'bg-neutral-50/50 dark:bg-neutral-900/50'
                }`}>
                  <div className="flex items-center gap-4 mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
                        attendance?.checkInTime && !attendance.checkOutTime 
                        ? 'bg-white/20 backdrop-blur-md text-white rotate-6 scale-110' 
                        : 'bg-white dark:bg-neutral-800 text-sky-500 border border-neutral-100 dark:border-neutral-700'
                      }`}>
                        <Clock className={`w-7 h-7 ${attendance?.checkInTime && !attendance.checkOutTime ? 'animate-pulse' : ''}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                              attendance?.checkInTime && !attendance.checkOutTime ? 'text-white/70' : 'text-neutral-400'
                            }`}>
                              {attendance?.checkInTime && !attendance.checkOutTime ? 'System Active' : 'Attendance Status'}
                            </h3>
                            {attendance?.checkInTime && !attendance.checkOutTime && (
                              <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            )}
                        </div>
                        <p className={`text-2xl font-black tracking-tight ${
                            attendance?.checkInTime && !attendance.checkOutTime ? 'text-white' : 'text-neutral-800 dark:text-white'
                        }`}>
                            {attendance 
                              ? attendance.status.toUpperCase() 
                              : 'Not Checked In'}
                        </p>
                      </div>
                  </div>

                  {attendance?.checkInTime && !attendance.checkOutTime ? (
                      <div className="space-y-6">
                        <div className="relative">
                            <div className="text-8xl font-black tracking-tighter font-mono flex items-baseline gap-3 drop-shadow-2xl">
                              {workHours}
                            </div>
                            <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                              Live Session
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-80">
                              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> Shift Progress</span>
                              <span>Target Met</span>
                            </div>
                            <div className="h-4 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-1 backdrop-blur-sm border border-white/5">
                              <div 
                                  className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all duration-1000 ease-out" 
                                  style={{ width: `${Math.min((parseInt(workHours.split(':')[0]) / 8) * 100, 100)}%` }}
                              />
                            </div>
                        </div>
                      </div>
                  ) : (
                      <div className="py-6 pr-10">
                        <h4 className="text-2xl font-black text-neutral-800 dark:text-white mb-2 leading-tight">
                            Ready to start your <span className="text-sky-500">Magic Day?</span>
                        </h4>
                        <p className="text-neutral-500 font-medium text-sm">
                            Mark your attendance to activate your live shift tracker and daily lesson planner.
                        </p>
                      </div>
                  )}
                </div>

                {/* Right Side: Actions */}
                <div className="p-10 flex flex-col justify-center bg-white/50 dark:bg-neutral-800/50 border-l border-neutral-100 dark:border-neutral-700/50 min-w-[380px]">
                  <div className="grid grid-cols-1 gap-5">
                      {!attendance || (attendance.status !== 'present' && attendance.status !== 'late') ? (
                        <>
                            <button 
                              onClick={() => handleMark('present')}
                              disabled={submitLoading}
                              className="group relative overflow-hidden px-8 py-7 bg-sky-500 text-white font-black rounded-[2.5rem] hover:bg-sky-600 transition-all shadow-2xl shadow-sky-500/30 active:scale-[0.98] flex items-center justify-center gap-4"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                              {submitLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <CheckCircle2 className="w-8 h-8" />}
                              <span className="text-2xl uppercase tracking-[0.1em]">Check In</span>
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                  onClick={() => { setModalType('late'); setIsModalOpen(true); }}
                                  className="group px-6 py-6 bg-amber-50/50 dark:bg-amber-900/10 text-amber-600 font-black rounded-3xl hover:bg-amber-100 transition-all active:scale-95 flex flex-col items-center gap-2 border border-amber-100/50 dark:border-amber-900/20"
                              >
                                  <Clock className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                  <span className="text-[10px] uppercase tracking-[0.2em]">Running Late</span>
                              </button>
                              <button 
                                  onClick={() => { setModalType('leave'); setIsModalOpen(true); }}
                                  className="group px-6 py-6 bg-rose-50/50 dark:bg-rose-900/10 text-rose-600 font-black rounded-3xl hover:bg-rose-100 transition-all active:scale-95 flex flex-col items-center gap-2 border border-rose-100/50 dark:border-rose-900/20"
                              >
                                  <Coffee className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                                  <span className="text-[10px] uppercase tracking-[0.2em]">Take Leave</span>
                              </button>
                            </div>
                        </>
                      ) : (
                        <div className="space-y-5">
                            <div className="p-8 rounded-[2.5rem] bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 flex flex-col items-center text-center">
                              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mb-4">
                                  <Sparkles className="w-6 h-6 text-sky-500" />
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">Shift Start Time</div>
                              <div className="text-4xl font-black text-neutral-800 dark:text-white tracking-tighter">
                                  {attendance.checkInTime ? format(new Date(attendance.checkInTime), 'hh:mm a') : '--:--'}
                              </div>
                            </div>
                            
                            <button 
                              onClick={handleCheckOut}
                              disabled={!!attendance.checkOutTime || submitLoading}
                              className={`w-full py-7 font-black rounded-[2.5rem] transition-all flex items-center justify-center gap-4 text-xl shadow-2xl tracking-[0.2em] uppercase ${
                                  attendance.checkOutTime 
                                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none' 
                                  : 'bg-rose-500 text-white hover:bg-rose-600 active:scale-95 shadow-rose-500/30'
                              }`}
                            >
                              {submitLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <LogOut className="w-8 h-8" />}
                              {attendance.checkOutTime ? 'Shift Done' : 'Finish Day'}
                            </button>

                            {attendance.checkOutTime && (
                              <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/20">
                                      <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest mb-4">
                                        <CheckCircle2 className="w-5 h-5" /> Shift Completed
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total Duration</p>
                                              <p className="text-2xl font-black text-neutral-800 dark:text-white">
                                                  {(() => {
                                                      const mins = attendance.duration || 0;
                                                      const h = Math.floor(mins / 60);
                                                      const m = mins % 60;
                                                      return `${h}h ${m}m`;
                                                  })()}
                                              </p>
                                          </div>
                                          <div className="space-y-1 border-l pl-4">
                                              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Date</p>
                                              <p className="text-lg font-black text-neutral-800 dark:text-white">
                                                  {format(new Date(attendance.date), 'MMM dd, yyyy')}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                                  <p className="text-center text-[10px] font-bold text-neutral-400 italic">
                                      Shift records have been synchronized with the admin panel.
                                  </p>
                              </div>
                            )}
                        </div>
                      )}
                  </div>
                </div>
            </div>
          </div>
      </section>

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
                                {record.duration && ` • ${Math.floor(record.duration / 60)}h ${record.duration % 60}m`}
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
