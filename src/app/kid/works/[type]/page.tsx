'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  PlayCircle, 
  ArrowLeft, 
  Loader2, 
  Download,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { kidsAPI, KinderWork } from '@/lib/api/kids';

export default function KidWorksGalleryPage() {
  const { type } = useParams();
  const router = useRouter();
  const [works, setWorks] = useState<KinderWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<KinderWork | null>(null);

  useEffect(() => {
    if (type) {
      fetchWorks();
    }
  }, [type]);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const data = await kidsAPI.getWorksByType(type as string);
      setWorks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = type === 'video';
  const bgColor = isVideo ? 'bg-blue-400' : 'bg-rose-400';
  const borderColor = isVideo ? 'border-blue-300' : 'border-rose-300';
  const icon = isVideo ? <PlayCircle className="w-12 h-12" /> : <FileText className="w-12 h-12" />;

  return (
    <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="flex items-center gap-6 mb-16">
        <button 
            onClick={() => router.push('/kid')}
            className="p-6 bg-white rounded-[2rem] border-4 border-amber-100 shadow-xl hover:scale-110 active:scale-95 transition-all text-amber-500"
        >
            <ArrowLeft className="w-10 h-10" />
        </button>
        <div className={`px-10 py-5 ${bgColor} ${borderColor} border-8 rounded-[2.5rem] text-white shadow-2xl flex items-center gap-6`}>
            {icon}
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                My {isVideo ? 'Videos' : 'Worksheets'}
            </h1>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-20 h-20 text-amber-400 animate-spin" />
            <p className="text-2xl font-black text-amber-500 uppercase tracking-widest italic animate-pulse">Finding Magic...</p>
        </div>
      ) : works.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {works.map((work) => (
                <div 
                    key={work.id}
                    onClick={() => setSelectedWork(work)}
                    className="group bg-white rounded-[3rem] p-8 shadow-xl border-4 border-amber-50 hover:border-amber-200 transition-all cursor-pointer hover:scale-[1.03] active:scale-95 flex flex-col items-center text-center gap-6"
                >
                    <div className={`w-full aspect-square rounded-[2rem] ${bgColor} flex items-center justify-center text-white/50 relative overflow-hidden`}>
                        <Sparkles className="absolute -top-4 -right-4 w-24 h-24 opacity-20 group-hover:rotate-45 transition-transform duration-700" />
                        {isVideo ? <PlayCircle className="w-24 h-24 text-white group-hover:scale-110 transition-transform" /> : <FileText className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-neutral-800 italic leading-tight mb-2 uppercase">{work.title}</h3>
                        <p className="text-amber-500 font-bold uppercase tracking-widest text-xs">Tap to Open</p>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white/50 rounded-[4rem] border-8 border-dashed border-amber-100 flex flex-col items-center gap-8">
            <div className="text-8xl">🌈</div>
            <p className="text-3xl font-black text-amber-500 uppercase tracking-tighter italic">Your magic cloud is empty for now!</p>
            <button 
                onClick={() => router.push('/kid')}
                className="bg-amber-400 text-white px-10 py-5 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-xl border-4 border-amber-200"
            >
                Back to Play
            </button>
        </div>
      )}

      {/* Basic Viewer Modal */}
      {selectedWork && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white rounded-[4rem] w-full max-w-5xl h-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
                <button 
                    onClick={() => setSelectedWork(null)}
                    className="absolute top-8 right-8 p-4 bg-rose-500 text-white rounded-full shadow-lg z-10 hover:scale-110 active:scale-90 transition-all"
                >
                    <ArrowLeft className="w-8 h-8 rotate-90" />
                </button>

                <div className="p-10 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="text-3xl font-black text-neutral-800 italic uppercase">{selectedWork.title}</h2>
                    <a 
                        href={selectedWork.fileUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-lg"
                    >
                        {isVideo ? 'Open Video' : 'Download PDF'} <Download className="w-5 h-5" />
                    </a>
                </div>

                <div className="flex-1 bg-neutral-900 flex items-center justify-center relative group">
                    {isVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white gap-6">
                            <PlayCircle className="w-32 h-32 opacity-50" />
                            <p className="text-2xl font-black uppercase tracking-widest italic">Video Player Ready</p>
                            <a href={selectedWork.fileUrl} target="_blank" className="bg-white/10 hover:bg-white/20 px-10 py-5 rounded-3xl font-black flex items-center gap-4 transition-all">
                                <ExternalLink className="w-6 h-6" /> START WATCHING
                            </a>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white gap-6">
                            <FileText className="w-32 h-32 opacity-50" />
                            <p className="text-2xl font-black uppercase tracking-widest italic">Worksheet Viewer</p>
                            <a href={selectedWork.fileUrl} target="_blank" className="bg-white/10 hover:bg-white/20 px-10 py-5 rounded-3xl font-black flex items-center gap-4 transition-all">
                                <ExternalLink className="w-6 h-6" /> OPEN WORKSHEET
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
