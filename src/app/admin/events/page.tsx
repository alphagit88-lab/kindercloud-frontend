'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  Trash2, 
  Loader2,
  X,
  CheckCircle2,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import { eventsAPI, SchoolEvent } from '@/lib/api/events';

export default function EventManagementPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    audience: 'all' as any
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await eventsAPI.create(formData);
      setSuccessMessage('Event Scheduled Successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', eventDate: '', audience: 'all' });
      fetchEvents();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Failed to schedule event');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel this event?')) return;
    try {
      await eventsAPI.delete(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-200">
                 <Calendar className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">School Calendar</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Plan, schedule, and announce school activities and holidays.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] w-64 lg:w-80 font-bold text-sm shadow-sm focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
              <Plus className="w-5 h-5" />
              <span>Schedule Event</span>
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Syncing Calendar...</p>
          </div>
        ) : (
          filteredEvents.length > 0 ? filteredEvents.map((e) => (
            <div key={e.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group p-8 relative overflow-hidden flex flex-col">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl text-rose-600 shadow-sm border border-rose-100">
                     <span className="text-[10px] font-black uppercase leading-none mb-1">
                        {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                     </span>
                     <span className="text-xl font-black leading-none">
                        {new Date(e.eventDate).getDate()}
                     </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(e.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                     <Trash2 className="w-5 h-5" />
                  </button>
               </div>

               <div className="mb-6 flex-1">
                  <h2 className="text-2xl font-black text-slate-800 leading-tight mb-3">{e.title}</h2>
                  <p className="text-sm font-bold text-slate-400 line-clamp-3">{e.description || 'No additional details provided for this event.'}</p>
               </div>

               <div className="space-y-3 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <Users className="w-4 h-4 text-sky-400" />
                     <span>Audience: <span className="text-slate-600">{e.audience}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <Clock className="w-4 h-4 text-amber-400" />
                     <span>Added: <span className="text-slate-600">{new Date(e.createdAt).toLocaleDateString()}</span></span>
                  </div>
               </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[3rem]">
               No events scheduled in the calendar.
            </div>
          )
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">Schedule New Event</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Calendar System</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 <form id="event-form" onSubmit={handleCreate} className="space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</label>
                       <input 
                        required 
                        placeholder="e.g. Annual Sports Day, Parent-Teacher Meeting"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-rose-500 font-bold text-sm outline-none transition-all" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date of Event</label>
                       <input 
                        required type="date"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-rose-500 font-bold text-sm outline-none transition-all" 
                        value={formData.eventDate}
                        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Audience</label>
                       <select 
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-rose-500 font-black text-[11px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                        value={formData.audience}
                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                       >
                          <option value="all">Everyone</option>
                          <option value="parent">Parents Only</option>
                          <option value="teacher">Teachers Only</option>
                          <option value="kid">Students Only</option>
                          <option value="admin">Admin Staff Only</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Description</label>
                       <textarea 
                        placeholder="Provide details about the event, location, etc."
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-rose-500 font-bold text-sm outline-none transition-all h-40 resize-none" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                       />
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="event-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
                    ) : (
                      <>
                        <span>Publish Event</span>
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
