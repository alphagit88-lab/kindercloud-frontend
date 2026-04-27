'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Search, 
  Send, 
  User as UserIcon, 
  ShieldCheck, 
  Loader2,
  ChevronLeft,
  Sparkles,
  Heart
} from 'lucide-react';
import { messagesAPI, Message, UserSummary } from '@/lib/api/messages';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { format } from 'date-fns';

type Category = 'admin' | 'teacher';

export default function KidMessagesPage() {
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
        if (selectedRecipient?.id === msg.senderId) {
          setMessages(prev => [...prev, msg]);
        }
        
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
    <div className="h-[calc(100vh-140px)] flex flex-col sm:flex-row bg-white dark:bg-neutral-900 rounded-[3rem] shadow-2xl border-4 border-yellow-300 dark:border-neutral-800 overflow-hidden">
      {/* Sidebar - Conversation List */}
      <aside className={`w-full sm:w-80 border-r-4 border-yellow-100 dark:border-neutral-800 flex flex-col ${selectedRecipient ? 'hidden sm:flex' : 'flex'}`}>
        <header className="p-6 border-b-4 border-yellow-100 dark:border-neutral-800 bg-yellow-50/50">
          <h1 className="text-2xl font-black text-yellow-600 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" /> My Chats
          </h1>
          
          <div className="flex gap-2 mb-4">
            {(['teacher', 'admin'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                    setActiveCategory(cat);
                    fetchRecipients(cat);
                    setShowRecipients(true);
                }}
                className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat && showRecipients 
                  ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/30' 
                  : 'bg-white dark:bg-neutral-800 text-yellow-500 hover:bg-yellow-100 border-2 border-yellow-200'
                }`}
              >
                {cat === 'teacher' ? 'Teachers' : 'Office'}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
            <input 
              placeholder="Find my teacher..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-800 rounded-2xl text-sm font-bold border-2 border-yellow-100 focus:border-yellow-300 focus:ring-0 transition-all"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-yellow-50/20">
          {showRecipients ? (
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center px-2 mb-2">
                <span className="text-[10px] font-black uppercase text-yellow-600 tracking-wider">Tap to Chat!</span>
                <button onClick={() => setShowRecipients(false)} className="text-xs font-black text-rose-500 underline">Cancel</button>
              </div>
              {recipients.map(recipient => (
                <button
                  key={recipient.id}
                  onClick={() => selectRecipientFromCategory(recipient)}
                  className="w-full flex items-center gap-4 p-4 rounded-[2rem] bg-white dark:bg-neutral-800 hover:scale-[1.02] active:scale-95 transition-all shadow-sm border-2 border-transparent hover:border-yellow-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600 font-black">
                    {recipient.profilePicture ? <img src={recipient.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover" /> : <UserIcon className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-neutral-800 dark:text-neutral-200">{recipient.firstName}</p>
                    <p className="text-[10px] font-bold text-yellow-500 uppercase">{recipient.role}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-3">
                <span className="px-2 text-[10px] font-black uppercase text-yellow-600 tracking-widest block mb-1">My Friends & Teachers</span>
                {conversations.length > 0 ? (
                    conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedRecipient(conv)}
                            className={`w-full flex items-center gap-4 p-4 rounded-[2.5rem] transition-all ${
                                selectedRecipient?.id === conv.id 
                                ? 'bg-yellow-400 text-white shadow-xl shadow-yellow-400/20 scale-[1.05]' 
                                : 'bg-white dark:bg-neutral-800 hover:bg-yellow-50 dark:hover:bg-neutral-800/50 shadow-sm'
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black ${selectedRecipient?.id === conv.id ? 'bg-white/30' : 'bg-yellow-100 text-yellow-600'}`}>
                                {conv.profilePicture ? <img src={conv.profilePicture} alt="" className="w-full h-full rounded-[1.5rem] object-cover" /> : <UserIcon className="w-7 h-7" />}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <p className={`font-black text-base truncate ${selectedRecipient?.id === conv.id ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                    {conv.firstName}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRecipient?.id === conv.id ? 'text-white/80' : 'text-yellow-500'}`}>
                                        {conv.role === 'admin' ? 'The Office' : 'Teacher'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <Heart className="w-12 h-12 text-yellow-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-yellow-600">No messages yet!</p>
                        <p className="text-[10px] font-bold text-yellow-400 mt-1 uppercase">Say hi to your teacher!</p>
                    </div>
                )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-neutral-950 ${!selectedRecipient ? 'hidden sm:flex items-center justify-center' : 'flex'}`}>
        {selectedRecipient ? (
          <>
            <header className="p-6 bg-yellow-400 dark:bg-neutral-900 border-b-4 border-yellow-500 dark:border-neutral-800 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedRecipient(null)} className="sm:hidden p-3 bg-white/20 rounded-2xl">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-yellow-500 font-black shadow-inner">
                    {selectedRecipient.profilePicture ? <img src={selectedRecipient.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover" /> : <UserIcon className="w-8 h-8" />}
                </div>
                <div className="text-white">
                    <h2 className="text-2xl font-black leading-none drop-shadow-sm">
                        {selectedRecipient.firstName}
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Talking to Me!</span>
                </div>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
              {loadingMessages ? (
                <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 text-yellow-400 animate-spin" /></div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in zoom-in-75 duration-300`}>
                      <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold shadow-md relative ${
                        isMine 
                        ? 'bg-yellow-400 text-white rounded-br-none' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-none border-2 border-yellow-100'
                      }`}>
                        <p className="text-base leading-relaxed">{msg.content}</p>
                        <span className={`text-[10px] block mt-2 font-black ${isMine ? 'text-white/70' : 'text-yellow-400'}`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                        </span>
                        {isMine && <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-yellow-200">
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <MessageCircle className="w-12 h-12 text-yellow-300" />
                    </div>
                    <p className="font-black uppercase tracking-[0.2em] text-sm text-yellow-500">Say Hello!</p>
                </div>
              )}
            </div>

            <footer className="p-6 bg-yellow-50 dark:bg-neutral-900 border-t-4 border-yellow-100 dark:border-neutral-800">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a happy message..."
                  className="w-full pl-8 pr-20 py-6 bg-white dark:bg-neutral-800 rounded-[2.5rem] text-lg font-black border-4 border-yellow-200 focus:border-yellow-400 focus:ring-0 transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-100 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:rotate-12 active:scale-75"
                >
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="text-center p-20 animate-in fade-in zoom-in duration-700">
             <div className="w-40 h-40 bg-yellow-100 dark:bg-neutral-800 rounded-[4rem] flex items-center justify-center mx-auto mb-10 text-yellow-400 shadow-xl border-4 border-white">
                <Sparkles className="w-20 h-20" />
             </div>
             <h3 className="text-4xl font-black text-yellow-600 dark:text-white mb-4">Chat with Teachers!</h3>
             <p className="text-yellow-400 font-black uppercase text-sm tracking-[0.4em]">Let's have some fun learning!</p>
          </div>
        )}
      </main>
    </div>
  );
}
