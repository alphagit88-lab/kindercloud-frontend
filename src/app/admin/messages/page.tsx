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
  UserCheck
} from 'lucide-react';
import { messagesAPI, Message, UserSummary } from '@/lib/api/messages';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { format } from 'date-fns';

type Category = 'admin' | 'teacher' | 'parent' | 'student';

export default function AdminMessagesPage() {
  const { user: currentUser } = useAuth();
  const { socket } = useSocket();
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

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg: Message) => {
        // If message is from the currently selected recipient, add it to the messages list
        if (selectedRecipient?.id === msg.senderId) {
          setMessages(prev => [...prev, msg]);
        }
        
        // Update conversations list to show the latest person at the top
        setConversations(prev => {
          const otherUser = msg.senderId === currentUser?.id ? msg.receiver : msg.sender;
          const filtered = prev.filter(c => c.id !== otherUser.id);
          return [otherUser, ...filtered];
        });
      };

      socket.on('new_message', handleNewMessage);
      return () => {
        socket.off('new_message', handleNewMessage);
      };
    }
  }, [socket, selectedRecipient?.id, currentUser?.id]);

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
      
      // Update conversations list if this is a new person
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
    <div className="h-[calc(100vh-140px)] flex flex-col sm:flex-row bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl border border-indigo-100 dark:border-neutral-800 overflow-hidden">
      {/* Sidebar - Conversation List */}
      <aside className={`w-full sm:w-80 border-r border-indigo-50 dark:border-neutral-800 flex flex-col ${selectedRecipient ? 'hidden sm:flex' : 'flex'}`}>
        <header className="p-6 border-b border-indigo-50 dark:border-neutral-800">
          <h1 className="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> Support Center
          </h1>
          
          <div className="flex gap-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {(['teacher', 'parent', 'student', 'admin'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                    setActiveCategory(cat);
                    fetchRecipients(cat);
                    setShowRecipients(true);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat && showRecipients 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-50 dark:bg-neutral-800 text-indigo-400 hover:bg-indigo-100'
                }`}
              >
                {cat}s
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
            <input 
              placeholder="Search chat..."
              className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 dark:bg-neutral-800 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {showRecipients ? (
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center px-2 mb-2">
                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-tighter">Available {activeCategory}s</span>
                <button onClick={() => setShowRecipients(false)} className="text-xs font-bold text-indigo-600 underline">Close</button>
              </div>
              {recipients.length > 0 ? recipients.map(recipient => (
                <button
                  key={recipient.id}
                  onClick={() => selectRecipientFromCategory(recipient)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                    {recipient.profilePicture ? <img src={recipient.profilePicture} alt="" className="w-full h-full rounded-xl object-cover" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-neutral-800 dark:text-neutral-200">{recipient.firstName} {recipient.lastName}</p>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase">{recipient.role}</p>
                  </div>
                </button>
              )) : (
                <div className="text-center py-4">
                  <p className="text-[10px] font-bold text-indigo-300">No {activeCategory}s found.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-1">
                <span className="px-2 text-[10px] font-black uppercase text-indigo-300 tracking-tighter block mb-2">Ongoing Support</span>
                {conversations.length > 0 ? (
                    conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedRecipient(conv)}
                            className={`w-full flex items-center gap-3 p-4 rounded-3xl transition-all ${
                                selectedRecipient?.id === conv.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                : 'hover:bg-indigo-50 dark:hover:bg-neutral-800'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${selectedRecipient?.id === conv.id ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>
                                {conv.profilePicture ? <img src={conv.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover" /> : <UserIcon className="w-6 h-6" />}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <p className={`font-black text-sm truncate ${selectedRecipient?.id === conv.id ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                    {conv.firstName} {conv.lastName}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {conv.role === 'admin' && <ShieldCheck className={`w-3 h-3 ${selectedRecipient?.id === conv.id ? 'text-white/70' : 'text-indigo-600'}`} />}
                                    {conv.role === 'teacher' && <UserCheck className={`w-3 h-3 ${selectedRecipient?.id === conv.id ? 'text-white/70' : 'text-indigo-600'}`} />}
                                    {conv.role === 'kid' && <GraduationCap className={`w-3 h-3 ${selectedRecipient?.id === conv.id ? 'text-white/70' : 'text-indigo-600'}`} />}
                                    {conv.role === 'parent' && <Users className={`w-3 h-3 ${selectedRecipient?.id === conv.id ? 'text-white/70' : 'text-indigo-600'}`} />}
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedRecipient?.id === conv.id ? 'text-white/60' : 'text-indigo-300'}`}>
                                        {conv.role === 'kid' ? 'Student' : conv.role}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-xs font-bold text-indigo-300">No active conversations.</p>
                        <p className="text-[10px] font-black uppercase text-indigo-400 mt-1">Start a chat with staff or parents.</p>
                    </div>
                )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className={`flex-1 flex flex-col bg-indigo-50/20 dark:bg-neutral-950/20 ${!selectedRecipient ? 'hidden sm:flex items-center justify-center' : 'flex'}`}>
        {selectedRecipient ? (
          <>
            <header className="p-6 bg-white dark:bg-neutral-900 border-b border-indigo-50 dark:border-neutral-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedRecipient(null)} className="sm:hidden p-2 bg-indigo-50 dark:bg-neutral-800 rounded-xl">
                    <ChevronLeft className="w-5 h-5 text-indigo-600" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                    {selectedRecipient.profilePicture ? <img src={selectedRecipient.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover" /> : <UserIcon className="w-6 h-6" />}
                </div>
                <div>
                    <h2 className="text-xl font-black text-neutral-800 dark:text-white leading-none">
                        {selectedRecipient.firstName} {selectedRecipient.lastName}
                    </h2>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Administrative Support</span>
                </div>
              </div>
              <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase text-emerald-500 tracking-tighter">Monitoring</span>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {loadingMessages ? (
                <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl font-medium shadow-sm ${
                        isMine 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <span className={`text-[10px] block mt-2 font-bold ${isMine ? 'text-white/60' : 'text-indigo-300'}`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-200">
                    <MessageCircle className="w-20 h-20 mb-4 opacity-10" />
                    <p className="font-black uppercase tracking-widest text-sm">Initiate secure communication</p>
                </div>
              )}
            </div>

            <footer className="p-6 bg-white dark:bg-neutral-900 border-t border-indigo-50 dark:border-neutral-800">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type an official response..."
                  className="w-full pl-6 pr-16 py-5 bg-indigo-50/50 dark:bg-neutral-800 rounded-3xl text-sm font-bold border-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="text-center p-20 animate-in fade-in duration-1000">
             <div className="w-32 h-32 bg-indigo-50 dark:bg-neutral-800 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-indigo-200 shadow-inner">
                <MessageCircle className="w-16 h-16" />
             </div>
             <h3 className="text-3xl font-black text-neutral-800 dark:text-white mb-2 italic">Admin Inbox</h3>
             <p className="text-indigo-900/40 dark:text-neutral-500 font-bold uppercase text-xs tracking-[0.3em]">Centralized Messaging System</p>
          </div>
        )}
      </main>
    </div>
  );
}
