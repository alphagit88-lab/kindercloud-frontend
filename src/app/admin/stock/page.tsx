'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Minus,
  Edit2,
  Trash2
} from 'lucide-react';
import { inventoryAPI, StockItem } from '@/lib/api/inventory';

export default function StockManagementPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 0
  });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      // Pass a timestamp to bypass browser cache (304 Not Modified)
      const data = await inventoryAPI.getStocks({ _t: Date.now() });
      setStocks(data);
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedStockId(null);
    setFormData({ itemName: '', quantity: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stock: StockItem) => {
    setIsEditMode(true);
    setSelectedStockId(stock.id);
    setFormData({ itemName: stock.itemName, quantity: stock.quantity });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (isEditMode && selectedStockId) {
        await inventoryAPI.updateStock(selectedStockId, formData);
        setSuccessMessage('Inventory Updated Successfully!');
      } else {
        await inventoryAPI.addStock(formData);
        setSuccessMessage('New Item Registered Successfully!');
      }
      setIsModalOpen(false);
      setFormData({ itemName: '', quantity: 0 });
      fetchStocks();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert(isEditMode ? 'Failed to update item' : 'Failed to add item');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item from inventory?')) return;
    try {
      await inventoryAPI.deleteStock(id);
      setStocks(stocks.filter(s => s.id !== id));
      setSuccessMessage('Item Removed Successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleUpdateQuantity = async (id: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    try {
      await inventoryAPI.updateStock(id, { quantity: newQty });
      setStocks(stocks.map(s => s.id === id ? { ...s, quantity: newQty } : s));
    } catch (error) {
      alert('Update failed');
    }
  };

  const filteredStocks = stocks.filter(s => 
    s.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-200">
                 <Package className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Stock Management</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Monitor and replenish essential school supplies and inventory.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search supplies..." 
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
              <span>Add Inventory</span>
           </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total SKU Items</p>
               <h3 className="text-3xl font-black text-slate-900">{stocks.length}</h3>
            </div>
            <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center">
               <Package className="w-6 h-6" />
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Low Stock Alerts</p>
               <h3 className="text-3xl font-black text-rose-500">{stocks.filter(s => s.quantity < 5).length}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
               <AlertCircle className="w-6 h-6" />
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recently Added</p>
               <h3 className="text-3xl font-black text-mint-500">{stocks.length > 0 ? '1 New' : '0'}</h3>
            </div>
            <div className="w-12 h-12 bg-mint-50 text-mint-500 rounded-2xl flex items-center justify-center">
               <TrendingUp className="w-6 h-6" />
            </div>
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

      {/* Stock List */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full">
            <thead>
               <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Item Name</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Current Quantity</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Control</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr>
                     <td colSpan={4} className="py-20 text-center">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning Shelves...</p>
                     </td>
                  </tr>
               ) : (
                  filteredStocks.length > 0 ? filteredStocks.map((s) => (
                     <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                                 {s.itemName.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-800">{s.itemName}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`text-xl font-black ${s.quantity < 5 ? 'text-rose-500' : 'text-slate-900'}`}>
                              {s.quantity}
                           </span>
                           <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">Units</span>
                        </td>
                        <td className="px-10 py-6">
                           {s.quantity < 5 ? (
                              <span className="px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100">
                                 Low Stock
                              </span>
                           ) : (
                              <span className="px-3 py-1 bg-mint-50 text-mint-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-mint-100">
                                 In Stock
                              </span>
                           )}
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => handleUpdateQuantity(s.id, s.quantity, -1)}
                                 className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center"
                               >
                                  <Minus className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleUpdateQuantity(s.id, s.quantity, 1)}
                                 className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-mint-50 hover:text-mint-500 transition-all flex items-center justify-center"
                               >
                                  <Plus className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleOpenEdit(s)}
                                 className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all flex items-center justify-center ml-4"
                               >
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleDelete(s.id)}
                                 className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic">
                           No inventory items found matching your search.
                        </td>
                     </tr>
                  )
               )}
            </tbody>
         </table>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">
                       {isEditMode ? 'Edit Item' : 'Add New Item'}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Inventory System</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 <form id="stock-form" onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Item Name</label>
                       <input 
                        required 
                        placeholder="e.g. Crayons, Notebooks, Water bottles"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 font-bold text-sm outline-none transition-all" 
                        value={formData.itemName}
                        onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Initial Quantity</label>
                       <input 
                        required type="number" min="0"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 font-bold text-sm outline-none transition-all" 
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                       />
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="stock-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    ) : (
                      <>
                        <span>{isEditMode ? 'Update Inventory' : 'Add to Inventory'}</span>
                        <Package className="w-6 h-6 text-sky-500" />
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
