'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Plus, 
  Loader2,
  X,
  CheckCircle2,
  Calendar,
  Trash2,
  Home,
  MapPin
} from 'lucide-react';
import { timetableAPI, TimeTableEntry } from '@/lib/api/timetable';
import { classroomsAPI, ClassRoom } from '@/lib/api/classrooms';

export default function TimetableManagementPage() {
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [schedule, setSchedule] = useState<TimeTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    activity: '',
    location: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchSchedule();
    }
  }, [selectedClassId]);

  const fetchClassrooms = async () => {
    try {
      const data = await classroomsAPI.getAll();
      setClassrooms(data);
      if (data.length > 0) setSelectedClassId(data[0].id);
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await timetableAPI.getByClass(selectedClassId);
      setSchedule(data);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await timetableAPI.addEntry({
        ...formData,
        classRoomId: selectedClassId
      });
      setSuccessMessage('Timetable Entry Added!');
      setIsModalOpen(false);
      setFormData({ dayOfWeek: 'Monday', startTime: '', endTime: '', activity: '', location: '' });
      fetchSchedule();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Failed to add entry');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this entry?')) return;
    try {
      await timetableAPI.deleteEntry(id);
      setSchedule(schedule.filter(s => s.id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-200">
                 <Clock className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Class Timetable</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Design and manage weekly learning schedules for each classroom.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <select 
                className="pl-6 pr-12 py-4 bg-white border border-slate-100 rounded-[2rem] w-64 lg:w-80 font-black text-[11px] uppercase tracking-widest shadow-sm focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all cursor-pointer appearance-none"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                 <Home className="w-4 h-4" />
              </div>
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
              <Plus className="w-5 h-5" />
              <span>Add Entry</span>
           </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-6 bg-mint-50 border-2 border-mint-200 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
           <CheckCircle2 className="w-8 h-8 text-mint-500 shadow-sm" />
           <div>
              <p className="text-sm font-black text-mint-900 uppercase tracking-widest leading-none mb-1">Success!</p>
              <p className="text-xs font-bold text-mint-700">{successMessage}</p>
           </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {days.map(day => (
          <div key={day} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
             <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest text-center">{day}</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center h-full opacity-20">
                     <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  </div>
                ) : (
                  schedule.filter(s => s.dayOfWeek === day).length > 0 ? (
                    schedule.filter(s => s.dayOfWeek === day).map(entry => (
                      <div key={entry.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group relative">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-tight">
                               {entry.startTime} - {entry.endTime}
                            </span>
                            <button 
                              onClick={() => handleDelete(entry.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                               <Trash2 className="w-3 h-3" />
                            </button>
                         </div>
                         <h4 className="text-xs font-black text-slate-800 leading-tight mb-2">{entry.activity}</h4>
                         {entry.location && (
                           <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                              <MapPin className="w-3 h-3 text-sky-400" />
                              <span>{entry.location}</span>
                           </div>
                         )}
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-10 flex-col gap-2">
                       <Calendar className="w-8 h-8" />
                       <p className="text-[10px] font-black uppercase">No Activity</p>
                    </div>
                  )
                )}
             </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">New Timetable Entry</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Scheduling System</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 <form id="timetable-form" onSubmit={handleCreate} className="space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Day</label>
                       <select 
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-black text-[11px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                       >
                          {days.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Time</label>
                          <input 
                            required type="time"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                            value={formData.startTime}
                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">End Time</label>
                          <input 
                            required type="time"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                            value={formData.endTime}
                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Activity Name</label>
                       <input 
                        required 
                        placeholder="e.g. Morning Circle, Creative Arts, Nap Time"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                        value={formData.activity}
                        onChange={(e) => setFormData({...formData, activity: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location (Optional)</label>
                       <input 
                        placeholder="e.g. Activity Room, Playground, Hall"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                       />
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="timetable-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    ) : (
                      <>
                        <span>Save to Timetable</span>
                        <CheckCircle2 className="w-6 h-6 text-mint-500" />
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
}
