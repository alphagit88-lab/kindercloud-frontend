'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Search, 
  Send, 
  User as UserIcon, 
  ShieldCheck, 
  GraduationCap, 
  Users,
  Loader2,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { messagesAPI, Message, UserSummary } from '@/lib/api/messages';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

type Category = 'admin' | 'teacher';

export default function ParentMessagesPage() {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState<UserSummary[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<UserSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('teacher');
  const [recipients, setRecipients] = useState<UserSummary[]>([]);
  const [showRecipients, setShowRecipients] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedRecipient) {
      fetchConversation(selectedRecipient.id);
    }
  }, [selectedRecipient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messagesAPI.getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId: string) => {
    try {
      setLoadingMessages(true);
      const data = await messagesAPI.getConversation(userId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchRecipients = async (category: Category) => {
    try {
      setLoading(true);
      const data = await messagesAPI.getRecipients(category);
      setRecipients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRecipient) return;

    try {
      const msg = await messagesAPI.sendMessage(selectedRecipient.id, newMessage);
      setMessages([...messages, msg]);
      setNewMessage('');
      
      if (!conversations.find(c => c.id === selectedRecipient.id)) {
        setConversations([selectedRecipient, ...conversations]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectRecipientFromCategory = (user: UserSummary) => {
    setSelectedRecipient(user);
    setShowRecipients(false);
    if (!conversations.find(c => c.id === user.id)) {
        setConversations([user, ...conversations]);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col sm:flex-row bg-white dark:bg-neutral-900 rounded-[3rem] shadow-xl border border-sky-100 dark:border-neutral-800 overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-full sm:w-80 border-r border-sky-50 dark:border-neutral-800 flex flex-col ${selectedRecipient ? 'hidden sm:flex' : 'flex'}`}>
        <header className="p-8 border-b border-sky-50 dark:border-neutral-800">
          <h1 className="text-3xl font-black text-sky-600 mb-6 flex items-center gap-2 italic">
            <MessageCircle className="w-8 h-8" /> Messages
          </h1>
          
          <div className="flex gap-2 mb-6">
            {(['admin', 'teacher'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                    setActiveCategory(cat);
                    fetchRecipients(cat);
                    setShowRecipients(true);
                }}
                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat && showRecipients 
                  ? 'bg-sky-500 text-white shadow-md' 
                  : 'bg-sky-50 dark:bg-neutral-800 text-sky-400 hover:bg-sky-100'
                }`}
              >
                {cat}s
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300" />
            <input 
              placeholder="Search chat..."
              className="w-full pl-12 pr-4 py-4 bg-sky-50/50 dark:bg-neutral-800 rounded-2xl text-sm font-bold border-none focus:ring-4 focus:ring-sky-500/10 transition-all"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {showRecipients ? (
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center px-4 mb-4">
                <span className="text-[10px] font-black uppercase text-sky-300 tracking-[0.2em]">Contact {activeCategory}s</span>
                <button onClick={() => setShowRecipients(false)} className="text-[10px] font-black text-sky-500 underline uppercase tracking-widest">Cancel</button>
              </div>
              {recipients.map(recipient => (
                <button
                  key={recipient.id}
                  onClick={() => selectRecipientFromCategory(recipient)}
                  className="w-full flex items-center gap-4 p-4 rounded-[2rem] hover:bg-sky-50 dark:hover:bg-neutral-800 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-500 font-black shadow-inner">
                    {recipient.profilePicture ? <img src={recipient.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover" /> : <UserIcon className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-neutral-800 dark:text-neutral-200">{recipient.firstName} {recipient.lastName}</p>
                    <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-0.5">{recipient.role}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-2">
                <span className="px-4 text-[10px] font-black uppercase text-sky-300 tracking-[0.2em] block mb-4">Conversations</span>
                {conversations.length > 0 ? (
                    conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedRecipient(conv)}
                            className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all ${
                                selectedRecipient?.id === conv.id 
                                ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20 active:scale-95' 
                                : 'hover:bg-sky-50 dark:hover:bg-neutral-800'
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${selectedRecipient?.id === conv.id ? 'bg-white/20' : 'bg-sky-100 text-sky-500'}`}>
                                {conv.profilePicture ? <img src={conv.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover" /> : <UserIcon className="w-7 h-7" />}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <p className={`font-black text-sm truncate ${selectedRecipient?.id === conv.id ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                    {conv.firstName} {conv.lastName}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    {conv.role === 'admin' ? <ShieldCheck className={`w-3.5 h-3.5 ${selectedRecipient?.id === conv.id ? 'text-white/70' : 'text-sky-500'}`} /> : <GraduationCap className={`w-3.5 h-3.5 ${selectedRecipient?.id === conv.id ? 'text-white/70' : 'text-sky-500'}`} />}
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRecipient?.id === conv.id ? 'text-white/60' : 'text-sky-300'}`}>
                                        {conv.role}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-20 px-10">
                        <MessageCircle className="w-16 h-16 text-sky-100 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase text-sky-300 tracking-widest leading-loose">No active conversations.<br/>Select a category above to start.</p>
                    </div>
                )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className={`flex-1 flex flex-col bg-sky-50/20 dark:bg-neutral-950/20 ${!selectedRecipient ? 'hidden sm:flex items-center justify-center' : 'flex'}`}>
        {selectedRecipient ? (
          <>
            <header className="p-8 bg-white dark:bg-neutral-900 border-b border-sky-50 dark:border-neutral-800 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-6">
                <button onClick={() => setSelectedRecipient(null)} className="sm:hidden p-3 bg-sky-50 dark:bg-neutral-800 rounded-2xl">
                    <ChevronLeft className="w-6 h-6 text-sky-500" />
                </button>
                <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-500 font-black shadow-inner">
                    {selectedRecipient.profilePicture ? <img src={selectedRecipient.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover" /> : <UserIcon className="w-7 h-7" />}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-neutral-800 dark:text-white leading-none italic tracking-tight">
                        {selectedRecipient.firstName} {selectedRecipient.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{selectedRecipient.role}</span>
                    </div>
                </div>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {loadingMessages ? (
                <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 text-sky-500 animate-spin" /></div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                      <div className={`max-w-[70%] p-6 rounded-[2rem] font-bold shadow-sm ${
                        isMine 
                        ? 'bg-sky-500 text-white rounded-br-none' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <span className={`text-[10px] block mt-3 font-black uppercase tracking-widest ${isMine ? 'text-white/60' : 'text-sky-300'}`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-sky-200 opacity-20">
                    <Sparkles className="w-32 h-32 mb-6" />
                    <p className="font-black uppercase tracking-[0.5em] text-lg italic text-center">Your bridge to the classroom</p>
                </div>
              )}
            </div>

            <footer className="p-8 bg-white dark:bg-neutral-900 border-t border-sky-50 dark:border-neutral-800">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message for Teacher {selectedRecipient.firstName}..."
                  className="w-full pl-8 pr-20 py-6 bg-sky-50/50 dark:bg-neutral-800 rounded-[2rem] text-sm font-bold border-none focus:ring-8 focus:ring-sky-500/5 transition-all shadow-inner placeholder:text-sky-200"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-200 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-sky-500/30 hover:scale-105 active:scale-95"
                >
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="text-center p-20 animate-in fade-in duration-1000">
             <div className="w-40 h-40 bg-sky-50 dark:bg-neutral-800 rounded-[4rem] flex items-center justify-center mx-auto mb-10 text-sky-200 shadow-inner">
                <MessageCircle className="w-20 h-20" />
             </div>
             <h3 className="text-4xl font-black text-neutral-800 dark:text-white mb-4 italic tracking-tight">Parent-Teacher Connection</h3>
             <p className="text-sky-900/40 dark:text-neutral-500 font-bold uppercase text-[10px] tracking-[0.5em]">Direct access to the heart of your child's education</p>
          </div>
        )}
      </main>
    </div>
  );
}
