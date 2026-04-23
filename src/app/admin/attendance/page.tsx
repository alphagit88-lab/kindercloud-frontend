'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowRight,
  ArrowLeft,
  Coffee,
  MoreVertical,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api/api';

interface AttendanceRecord {
  id: string;
  teacherId: string;
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: number;
  note?: string;
  teacher: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    }
  }
}

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/teachers/attendance/all');
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const name = `${record.teacher.user.firstName} ${record.teacher.user.lastName}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || record.teacher.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || record.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight italic">
            Global <span className="text-sky-500">Attendance</span> Logs
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">
            Monitoring real-time check-ins and teacher shift durations
          </p>
        </div>

        <div className="flex items-center gap-3">
            <button 
                onClick={fetchAttendance}
                className="px-6 py-3 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-all flex items-center gap-2 shadow-sm"
            >
                Refresh Data
            </button>
            <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
            </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Active Shifts', value: records.filter(r => r.status === 'present' && !r.checkOutTime).length, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
           { label: 'Late Arrivals', value: records.filter(r => r.status === 'late').length, icon: CalendarDays, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'On Leave Today', value: records.filter(r => r.status === 'leave').length, icon: Coffee, color: 'text-sky-500', bg: 'bg-sky-50' },
           { label: 'Avg Shift Time', value: '7.8h', icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50' },
         ].map((stat, idx) => (
           <div key={idx} className={`${stat.bg} p-8 rounded-[3rem] border border-white dark:border-neutral-700 shadow-sm flex flex-col items-center justify-center text-center group hover:scale-[1.03] transition-all`}>
              <stat.icon className={`w-8 h-8 ${stat.color} mb-4 group-hover:rotate-12 transition-transform`} />
              <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
           </div>
         ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {/* Table Filters */}
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text"
              placeholder="Search teacher by name or email..."
              className="w-full pl-16 pr-8 py-5 rounded-[2rem] border border-slate-100 bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white p-1.5 rounded-[1.8rem] border border-slate-100 shadow-sm">
               {['all', 'present', 'late', 'leave', 'half-day'].map((f) => (
                 <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-900'
                  }`}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Teacher</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Check In / Out</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Duration</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-sky-200" />
                    <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[10px]">Loading shift logs...</p>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 italic">
                          {record.teacher.user.firstName.charAt(0)}
                       </div>
                       <div>
                          <p className="font-display font-black text-slate-900 italic">{record.teacher.user.firstName} {record.teacher.user.lastName}</p>
                          <p className="text-[10px] font-bold text-slate-400">{record.teacher.user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest ${
                      record.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 
                      record.status === 'late' ? 'bg-amber-50 text-amber-600' :
                      record.status === 'leave' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-sm font-black text-slate-800">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {record.checkInTime ? format(new Date(record.checkInTime), 'hh:mm a') : '---'}
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <XCircle className="w-3.5 h-3.5 text-rose-300" />
                          {record.checkOutTime ? format(new Date(record.checkOutTime), 'hh:mm a') : (record.status === 'present' ? 'Ongoing...' : '---')}
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <Clock className={`w-4 h-4 ${record.checkOutTime ? 'text-slate-300' : 'text-emerald-400 animate-pulse'}`} />
                       <span className="font-display font-black text-lg text-slate-800 tracking-tighter italic">
                          {record.duration ? `${Math.floor(record.duration / 60)}h ${record.duration % 60}m` : (record.status === 'present' && !record.checkOutTime ? 'Live' : '---')}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100">
                      <MoreVertical className="w-5 h-5 text-slate-300" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-bold italic">No records found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-10 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Showing {filteredRecords.length} log entries
          </p>
          <div className="flex items-center gap-4">
             <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                <ArrowLeft className="w-5 h-5" />
             </button>
             <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
    )
  }
