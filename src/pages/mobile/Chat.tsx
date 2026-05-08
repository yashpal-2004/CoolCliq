import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, AlertTriangle, Flag, Ban, Hash, ShieldCheck, MoreVertical, Table, CheckCircle, X, MapPin, Zap } from 'lucide-react';
import { useRef } from 'react';
import { supabase } from '../../services/supabase';

interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  timestamp: string;
}

interface DBChatMessage {
  id: string;
  message: string;
  senderId: string;
  createdAt: string;
  venueId?: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [tableRevealed, setTableRevealed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Live Chat Subscription
  useEffect(() => {
    const fetchMessages = async () => {
      const { data: dbMessages } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (dbMessages) {
        // Filter messages for this specific conversation in JS for maximum reliability in demo
        const filtered = dbMessages.filter((m: any) => 
          (m.sender_id === 'me' && m.receiver_id === userId) || 
          (m.sender_id === userId && m.receiver_id === 'me')
        );

        setMessages(filtered.map((m: any) => ({
          id: m.id,
          text: m.text,
          type: m.sender_id === 'me' ? 'sent' : 'received',
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }
    };

    fetchMessages();

    // Simplify channel to a global listener for demo reliability
    const channel = supabase
      .channel('global-chat-sync')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload: any) => {
        const newMessage = payload.new as any;
        // Only add if it belongs to this conversation
        if (
          (newMessage.sender_id === userId && newMessage.receiver_id === 'me') ||
          (newMessage.sender_id === 'me' && newMessage.receiver_id === userId)
        ) {
          // Check if message already exists (to avoid double adding on sender's side)
          setMessages(prev => {
            if (prev.some(msg => msg.id === newMessage.id)) return prev;
            return [...prev, {
              id: newMessage.id,
              text: newMessage.text,
              type: newMessage.sender_id === 'me' ? 'sent' : 'received',
              timestamp: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }];
          });
        }
      })
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        if (payload.payload.receiver_id === 'me' && payload.payload.sender_id === userId) {
          setOtherUserTyping(payload.payload.isTyping);
          if (payload.payload.isTyping) {
            setTimeout(() => setOtherUserTyping(false), 5000);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleTyping = () => {
    supabase.channel('global-chat-sync').send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: true, sender_id: 'me', receiver_id: userId },
    });
  };

  const handleSend = async () => {
    if (message.trim()) {
      const { data, error } = await supabase.from('messages').insert([
        {
          text: message,
          sender_id: 'me',
          receiver_id: userId || 'other',
        }
      ]).select();
      
      if (!error && data) {
        const m = data[0];
        setMessages(prev => [...prev, {
          id: m.id,
          text: m.text,
          type: 'sent',
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setMessage('');
        // Stop typing indicator
        supabase.channel(`chat-${userId}`).send({
          type: 'broadcast',
          event: 'typing',
          payload: { isTyping: false },
        });
      }
    }
  };

  const handlePanicExit = () => {
    navigate('/mobile/map');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 flex flex-col h-screen overflow-hidden items-center">
      {/* Persistent Handshake HUD - Slim Minimalist Banner */}
      <AnimatePresence>
        {tableRevealed && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-primary text-white py-3 px-6 shadow-xl flex items-center justify-center gap-6 border-b border-white/10"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-white" />
              <p className="text-sm font-black tracking-tight uppercase italic">Both at Table #12 • Verified</p>
            </div>
            <button 
              onClick={() => setTableRevealed(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl flex flex-col h-full bg-white relative lg:shadow-2xl lg:shadow-black/[0.02]">
        {/* Header - Minimalist */}
        <nav className="px-6 md:px-10 py-6 md:py-8 bg-white/80 backdrop-blur-xl border-b border-[#00000005] flex items-center justify-between z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0a0a0a] rounded-2xl flex items-center justify-center font-black text-white italic">BJ</div>
              <div className="space-y-0.5">
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">BlueJay42</h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Live Session</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowActions(!showActions)}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </nav>

        {/* Action Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-24 right-6 w-64 bg-[#0a0a0a] text-white rounded-[2rem] p-3 shadow-2xl z-50 border border-white/10"
            >
              <div className="space-y-1">
                {!tableRevealed && (
                  <button
                    onClick={() => { setTableRevealed(true); setShowActions(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-2xl transition-colors group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Reveal Table</span>
                    <Table className="w-4 h-4 text-primary" />
                  </button>
                )}
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-2xl transition-colors text-white/40">
                  <span className="text-[10px] font-black uppercase tracking-widest">Restrict Contact</span>
                  <Ban className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-2xl transition-colors text-red-500/80">
                  <span className="text-[10px] font-black uppercase tracking-widest">Flag Incident</span>
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Chat Area - Zero Clutter */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth no-scrollbar">
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] space-y-2`}>
                  <div className={`px-6 py-4 rounded-[2rem] text-sm md:text-base font-bold tracking-tight shadow-sm ${
                    msg.type === 'sent' 
                    ? 'bg-[#0a0a0a] text-white rounded-tr-none' 
                    : 'bg-[#f0f0f0] text-[#0a0a0a] rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 ${
                    msg.type === 'sent' ? 'text-right' : 'text-left'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
            {otherUserTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-[#f0f0f0] px-6 py-4 rounded-[2rem] rounded-tl-none flex gap-1.5 items-center">
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
 
        {/* Input Area - Minimalist Stationery */}
        <div className="p-6 md:p-10 bg-white border-t border-[#00000005]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Send anonymous message..."
                className="flex-1 h-16 bg-[#f9f9f9] rounded-2xl px-8 font-bold tracking-tight focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-16 h-16 bg-[#0a0a0a] text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-20 group"
              >
                <Send className="w-7 h-7" />
              </button>
            </div>
            
            <div className="flex gap-3">
               <button 
                 onClick={handlePanicExit}
                 className="flex-1 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
               >
                 <AlertTriangle className="w-4 h-4" />
                 End Session
               </button>
               <div className="px-6 flex items-center gap-2 bg-muted/20 rounded-xl">
                 <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">E2EE</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
