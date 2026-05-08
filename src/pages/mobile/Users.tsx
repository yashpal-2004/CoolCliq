import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck, Zap, Star, Menu, X, QrCode, Bell, User, Settings, MapPin, Users, Search, MessageCircle
} from 'lucide-react';
import { supabase } from '../../services/supabase';

interface UserProfile {
  id: string;
  handle: string;
  online: boolean;
  avatar: string;
  status: string;
  distance: string;
  trustScore: number;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Live Now');

  // Lock scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active')
        .order('joined_date', { ascending: false })
        .limit(20);
      
      if (data) {
        setUsers(data.map((u: any) => ({
          id: u.id,
          handle: u.handle,
          online: true,
          avatar: u.handle.substring(0, 2).toUpperCase(),
          status: 'Active Shadow',
          distance: `${(Math.random() * 2).toFixed(1)} km`,
          trustScore: u.risk_score ? 100 - u.risk_score : 95
        })));
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.handle.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'Live Now') return matchesSearch && u.online;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Precision Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-white/80 backdrop-blur-xl border-b border-[#00000005] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-[#0a0a0a]">Circles</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 px-6 pb-24 max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Section Heading */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">Social <br className="hidden md:block" />Registry</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              {users.filter(u => u.online).length} Active Shadows Nearby
            </p>
          </div>

          {/* Search & Filter */}
          <div className="space-y-6 max-w-2xl mx-auto md:mx-0">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Find a handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 bg-white border border-border rounded-2xl pl-16 pr-6 font-bold tracking-tight shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {['Live Now', 'All Shadows', 'Verified', 'Nearby'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === filter
                      ? 'bg-[#0a0a0a] text-white shadow-lg'
                      : 'bg-white border border-border text-muted-foreground hover:border-primary/50'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* User List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative p-5 bg-white border border-border rounded-[2rem] hover:shadow-2xl transition-all duration-500 cursor-pointer flex items-center justify-between"
                  onClick={() => navigate(`/mobile/chat/${user.id}`)}
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center font-black text-primary text-xl shadow-inner">
                        {user.avatar}
                      </div>
                      {user.online && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black tracking-tight uppercase italic">{user.handle}</h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        {user.status} • {user.distance}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-[#0a0a0a] group-hover:bg-primary group-hover:text-white transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">{user.trustScore}% TRUST</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredUsers.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No shadows found in this sector</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[70] p-8 flex flex-col justify-between shadow-2xl overflow-y-auto no-scrollbar"
            >
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-primary/20">C</div>
                    <span className="font-black text-xl tracking-tighter uppercase italic text-[#0a0a0a]">CoolCliq</span>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { label: 'Discovery', icon: MapPin, path: '/mobile/map' },
                    { label: 'Check-In', icon: QrCode, path: '/mobile/qr-scan' },
                    { label: 'Circles', icon: Users, path: '/mobile/users', active: true },
                    { label: 'Notifications', icon: Bell, path: '/mobile/notifications' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 px-5 h-16 rounded-[1.5rem] transition-all group ${item.active
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                          : 'text-muted-foreground hover:bg-muted hover:text-[#0a0a0a]'
                        }`}
                    >
                      <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                      <span className="font-black uppercase tracking-[0.15em] text-[11px] leading-none">{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="pt-8 border-t border-border/50 space-y-1">
                  <p className="px-5 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Personal</p>
                  {[
                    { label: 'Profile', icon: User },
                    { label: 'Preferences', icon: Settings }
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-4 px-5 h-16 rounded-[1.5rem] text-muted-foreground hover:bg-muted hover:text-[#0a0a0a] transition-all group"
                    >
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-black uppercase tracking-[0.15em] text-[11px] leading-none">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-[#f9f9f9] border border-border/50 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary shadow-inner">DG</div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black uppercase tracking-tight italic">Divyanshu Gupta</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="w-full h-14 bg-[#0a0a0a] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
                >
                  End Session
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
