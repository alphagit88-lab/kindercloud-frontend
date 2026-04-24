'use client';

import { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Loader2,
  X,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Wrench,
  Trash2
} from 'lucide-react';
import { inventoryAPI, Asset } from '@/lib/api/inventory';

export default function AssetManagementPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    itemName: '',
    condition: 'good' as any
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const data = await inventoryAPI.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedAssetId(null);
    setFormData({ itemName: '', condition: 'good' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setIsEditMode(true);
    setSelectedAssetId(asset.id);
    setFormData({ itemName: asset.itemName, condition: asset.condition });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (isEditMode && selectedAssetId) {
        await inventoryAPI.updateAsset(selectedAssetId, formData);
        setSuccessMessage('Asset Updated Successfully!');
      } else {
        await inventoryAPI.addAsset(formData);
        setSuccessMessage('Asset Registered Successfully!');
      }
      setIsModalOpen(false);
      setFormData({ itemName: '', condition: 'good' });
      fetchAssets();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert(isEditMode ? 'Failed to update asset' : 'Failed to register asset');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this asset?')) return;
    try {
      await inventoryAPI.deleteAsset(id);
      setAssets(assets.filter(a => a.id !== id));
      setSuccessMessage('Asset Removed Successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleUpdateCondition = async (id: string, condition: string) => {
    try {
      await inventoryAPI.updateAsset(id, { condition: condition as any });
      setAssets(assets.map(a => a.id === id ? { ...a, condition: condition as any } : a));
    } catch (error) {
      alert('Update failed');
    }
  };

  const filteredAssets = assets.filter(a => 
    a.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'good': return <ShieldCheck className="w-5 h-5 text-mint-500" />;
      case 'fair': return <ShieldQuestion className="w-5 h-5 text-amber-500" />;
      case 'damaged': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'lost': return <X className="w-5 h-5 text-slate-400" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm border border-sky-200">
                 <Database className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Asset Registry</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Track and manage high-value school assets, furniture, and equipment.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search assets..." 
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
              <span>Register Asset</span>
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

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Inventorying Assets...</p>
          </div>
        ) : (
          filteredAssets.length > 0 ? filteredAssets.map((a) => (
            <div key={a.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group p-8 flex flex-col">
               <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${
                    a.condition === 'damaged' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                    a.condition === 'good' ? 'bg-mint-50 text-mint-500 border-mint-100' :
                    'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                     {getConditionIcon(a.condition)}
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                      onClick={() => handleOpenEdit(a)}
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-sky-500 transition-colors"
                     >
                        <Wrench className="w-4 h-4" />
                     </button>
                     <button 
                      onClick={() => handleDelete(a.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <div className="mb-6 flex-1">
                  <h2 className="text-lg font-black text-slate-800 leading-tight mb-1 truncate">{a.itemName}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Asset ID: {a.id.substring(0, 8)}</p>
               </div>

               <div className="pt-6 border-t border-slate-50">
                  <select 
                    className={`w-full px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer ${
                        a.condition === 'good' ? 'bg-mint-50 border-mint-100 text-mint-600' :
                        a.condition === 'fair' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        a.condition === 'damaged' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                    value={a.condition}
                    onChange={(e) => handleUpdateCondition(a.id, e.target.value)}
                  >
                     <option value="good">Status: Good</option>
                     <option value="fair">Status: Fair</option>
                     <option value="damaged">Status: Damaged</option>
                     <option value="lost">Status: Lost</option>
                  </select>
               </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[3rem]">
               No high-value assets registered in the registry.
            </div>
          )
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">
                        {isEditMode ? 'Edit Asset' : 'Register Asset'}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Asset Control</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 <form id="asset-form" onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Name</label>
                       <input 
                        required 
                        placeholder="e.g. Smart Board, Playground Slide, Printer"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                        value={formData.itemName}
                        onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Condition</label>
                       <select 
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-black text-[11px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                        value={formData.condition}
                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                       >
                          <option value="good">Good Condition</option>
                          <option value="fair">Fair (Normal Wear)</option>
                          <option value="damaged">Damaged (Needs Repair)</option>
                          <option value="lost">Lost / Missing</option>
                       </select>
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="asset-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                    ) : (
                      <>
                        <span>{isEditMode ? 'Update Asset' : 'Add to Registry'}</span>
                        <Database className="w-6 h-6 text-sky-500" />
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
