import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowLeft, Users, ShieldCheck, Star, MapPin, Zap, Menu, X, QrCode, Bell, User, Settings } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface UserProfile {
  id: string;
  handle: string;
  online: boolean;
  avatar: string;
  status?: string;
}

export default function VenueDetail() {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const venueNames: Record<string, string> = {
    '1': 'DIGGIN CAFE',
    '2': 'BLUE TOKAI',
    '3': 'HKV SOCIAL',
    '4': 'FARZI CAFE'
  };

  const currentVenueName = venueNames[venueId || ''] || 'THE BLUE LOUNGE';

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
        .limit(10);
      
      if (data) {
        setUsers(data.map((u: any) => ({
          id: u.id,
          handle: u.handle,
          online: true,
          avatar: u.handle.substring(0, 2).toUpperCase(),
          status: u.status
        })));
      }
      setLoading(false);
    };
    fetchUsers();
  }, [venueId]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Precision Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Hero Header */}
      <header className="relative pt-24 pb-16 px-8 bg-[#0a0a0a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fcfcfc] to-transparent opacity-100" />

        <nav className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </nav>

        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">Active Venue</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              4.8
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl"
          >
            {currentVenueName.split(' ').map((word, i) => (
              <span key={i}>{word} <br /></span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-8"
          >
            <div className="flex items-center gap-2.5 text-white font-bold text-xs uppercase tracking-widest drop-shadow-md">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(107,91,149,0.4)]">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              0.2 KM AWAY
            </div>
            <div className="flex items-center gap-2.5 text-white font-black text-xs uppercase tracking-widest drop-shadow-md">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(107,91,149,0.4)]">
                <Users className="w-4 h-4 text-white" />
              </div>
              {loading ? '...' : users.length} LIVE NOW
            </div>
          </motion.div>
        </div>
      </header>

      {/* User Discovery Section */}
      <main className="px-6 pb-32">
        <div className="py-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter italic uppercase">Nearby Shadows</h2>
            <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              Encrypted Bridge Active
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {users.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="group relative p-5 bg-white border border-border rounded-[2rem] hover:shadow-2xl transition-all duration-500 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center font-black text-primary text-xl">
                      {user.avatar}
                    </div>
                    {user.online && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight uppercase italic">{user.handle}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {user.online ? 'Verified Presence' : 'Left Session'}
                    </span>
                  </div>
                </div>

                {user.online && (
                  <button
                    onClick={() => navigate(`/mobile/chat/${user.id}`)}
                    className="w-12 h-12 rounded-2xl bg-[#0a0a0a] text-white flex items-center justify-center hover:bg-primary transition-colors shadow-lg shadow-black/10 group-hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-20 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
            <span>SECURE.VENUE.042</span>
            <span>EST. 2026</span>
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
                    { label: 'Discovery', icon: MapPin, path: '/mobile/map', active: false },
                    { label: 'Check-In', icon: QrCode, path: '/mobile/qr-scan', active: false },
                    { label: 'Circles', icon: Users, path: '/mobile/users', active: false },
                    { label: 'Notifications', icon: Bell, path: '/mobile/notifications', active: false },
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
                    { label: 'Profile', icon: User, path: '/mobile/profile-setup' },
                    { label: 'Preferences', icon: Settings, path: '/mobile/settings' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
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
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary shadow-inner">JR</div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black uppercase tracking-tight italic">Divyanshu Gupta</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Premium Member</p>
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
