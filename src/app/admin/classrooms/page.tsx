'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Loader2,
  X,
  CheckCircle2,
  Users,
  GraduationCap
} from 'lucide-react';
import { classroomsAPI, ClassRoom } from '@/lib/api/classrooms';
import { teachersAPI, Teacher } from '@/lib/api/teachers';

export default function ClassroomManagementPage() {
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClassRoom, setSelectedClassRoom] = useState<ClassRoom | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    teacherId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classroomsData, teachersData] = await Promise.all([
        classroomsAPI.getAll(),
        teachersAPI.getAll()
      ]);
      setClassrooms(classroomsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedClassRoom(null);
    setFormData({ name: '', teacherId: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (classroom: ClassRoom) => {
    setIsEditMode(true);
    setSelectedClassRoom(classroom);
    setFormData({ 
      name: classroom.name, 
      teacherId: (classroom as any).teacherId || (classroom as any).teacher?.id || '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (isEditMode && selectedClassRoom) {
        await classroomsAPI.update(selectedClassRoom.id, formData);
        setSuccessMessage('Classroom Updated Successfully!');
      } else {
        await classroomsAPI.create(formData);
        setSuccessMessage('Classroom Created Successfully!');
      }
      setIsModalOpen(false);
      setFormData({ name: '', teacherId: '' });
      fetchData();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert(`Failed to ${isEditMode ? 'update' : 'create'} classroom`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this classroom?')) return;
    try {
      await classroomsAPI.delete(id);
      setClassrooms(classrooms.filter(c => c.id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const filteredClassrooms = classrooms.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm border border-sky-200">
                 <Home className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Classroom Structure</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Organize student groups and assign academic supervisors.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search classes..." 
                className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] w-64 lg:w-80 font-bold text-sm shadow-sm focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
              <Plus className="w-5 h-5" />
              <span>Add Class</span>
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

      {/* Classroom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Syncing Class Data...</p>
          </div>
        ) : (
          filteredClassrooms.length > 0 ? filteredClassrooms.map((c) => (
            <div key={c.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group p-8 relative overflow-hidden">
               <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-start justify-between mb-8">
                     <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 font-black text-xl italic shadow-sm">
                        {c.name.charAt(0)}
                     </div>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenEdit(c)}
                          className="p-3 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"
                        >
                           <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>

                  <div className="mb-8">
                     <h2 className="text-2xl font-black text-slate-800 leading-none mb-2">{c.name}</h2>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Academic Division</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                       <GraduationCap className="w-5 h-5 text-amber-500" />
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Supervisor</p>
                          <p className="text-sm font-bold text-slate-700">{(c as any).teacher ? `${(c as any).teacher.firstName} ${(c as any).teacher.lastName}` : 'Unassigned'}</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[3rem]">
               No classrooms established yet.
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
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">{isEditMode ? 'Edit' : 'Add New'} Classroom</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Infrastructure</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 p-10">
                 <form id="classroom-form" onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classroom Name</label>
                       <input 
                        required 
                        placeholder="e.g. Bluebells, Sunflowers, Grade 1-A"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign Supervisor (Teacher)</label>
                       <select 
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-black text-[11px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                        value={formData.teacherId}
                        onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                       >
                          <option value="">No Teacher Assigned</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.user.id}>{t.user.firstName} {t.user.lastName}</option>
                          ))}
                       </select>
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="classroom-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                    ) : (
                      <>
                        <span>{isEditMode ? 'Update' : 'Establish'} Classroom</span>
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
