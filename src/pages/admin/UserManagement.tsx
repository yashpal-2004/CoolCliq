import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Store, ShieldAlert, Users, LogOut, 
  Search, Ban, CheckCircle, User, Phone, Calendar, 
  MessageSquare, AlertCircle, Bell, Menu, X, Filter,
  MoreVertical, Activity, ShieldX, UserCheck, ShieldAlert as ShieldAlertIcon,
  Download, Plus, Trash2
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  handle: string;
  phone: string;
  age: number;
  gender: string;
  joinedDate: string;
  status: 'active' | 'suspended' | 'banned';
  totalChats: number;
  reportsReceived: number;
  riskScore: number;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('joined_date', { ascending: false });
      if (data) {
        setUsers(data.map((u: any) => ({
          id: u.id,
          handle: u.handle,
          phone: u.phone || 'N/A',
          age: u.age || 0,
          gender: u.gender || 'N/A',
          joinedDate: new Date(u.joined_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          status: u.status,
          totalChats: u.total_chats || 0,
          reportsReceived: u.reports_received || 0,
          riskScore: u.risk_score || 0
        })));
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const updateStatus = async (id: string, status: 'active' | 'suspended' | 'banned') => {
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    if (!error) {
      setUsers(users.map(u => u.id === id ? { ...u, status } : u));
      toast.success(`User status updated to ${status}`);
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleSuspend = (id: string) => updateStatus(id, 'suspended');
  const handleBan = (id: string) => updateStatus(id, 'banned');
  const handleRestore = (id: string) => updateStatus(id, 'active');

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted permanently');
    } else {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Handle', 'Phone', 'Joined Date', 'Status'];
    const csvData = users.map(user => [
      user.handle,
      user.phone || 'N/A',
      user.joinedDate,
      user.status || 'Active'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CoolCliq_Users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics exported successfully');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#00000005] h-screen p-8 flex flex-col justify-between sticky top-0 z-20">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center font-black text-white text-xs">C</div>
            <span className="font-display font-bold text-xl tracking-tight text-[#0a0a0a]">CoolCliq <span className="text-muted-foreground font-medium text-xs ml-1 uppercase tracking-widest">Admin</span></span>
          </div>

          <nav className="space-y-1.5">
            {[
              { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
              { label: 'Venues', icon: Store, path: '/admin/venues' },
              { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
              { label: 'User Registry', icon: Users, path: '/admin/users', active: true },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group ${
                  item.active 
                  ? 'bg-[#0a0a0a] text-white shadow-xl shadow-black/10' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-[#0a0a0a]'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:text-[#0a0a0a] transition-colors'}`} />
                <span className="text-sm font-semibold tracking-tight">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold tracking-tight">Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#fcfcfc] relative overflow-y-auto h-screen pb-24 lg:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#fcfcfc]/80 backdrop-blur-xl border-b border-[#00000005] px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden shrink-0">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
               <Menu className="w-6 h-6" />
             </button>
             <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center font-black text-white text-[10px] shrink-0">C</div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0 ml-2 lg:ml-0">
            <div className="flex items-center bg-white border border-border rounded-xl px-4 lg:px-6 py-2.5 flex-1 lg:max-w-2xl min-w-0 shadow-sm focus-within:shadow-md transition-shadow">
              <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Filter Shadow Registry..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
              />
            </div>
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <button 
                onClick={handleExportCSV}
                title="Export CSV"
                className="w-11 h-11 lg:w-auto lg:px-6 lg:h-12 rounded-xl border border-border bg-white text-[#0a0a0a] font-bold text-sm shadow-sm hover:bg-muted transition-all flex items-center justify-center lg:gap-2"
              >
                <Download className="w-4 h-4" /> <span className="hidden lg:inline uppercase tracking-widest text-[10px]">Export CSV</span>
              </button>
              <button 
                title="Provision User"
                className="w-11 h-11 lg:w-auto lg:px-6 lg:h-12 rounded-xl bg-[#0a0a0a] text-white font-bold text-sm shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center lg:gap-2"
              >
                <Plus className="w-4 h-4" /> <span className="hidden lg:inline uppercase tracking-widest text-[10px]">Provision User</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10 lg:space-y-12">
          {/* Section Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight text-[#0a0a0a]">Shadow Registry</h1>
            <p className="text-muted-foreground font-medium flex items-start lg:items-center gap-2 text-sm lg:text-base leading-tight lg:leading-normal">
              <Users className="w-4 h-4 mt-1 lg:mt-0 shrink-0" /> <span>Managing identity lifecycle and behavioral profiles across the network</span>
            </p>
          </div>

          {/* User Registry List */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white border border-border/50 rounded-[2.5rem] p-8 lg:p-10 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-10 overflow-hidden relative"
                >
                  <div className="flex items-center gap-8">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-muted rounded-[2rem] flex items-center justify-center font-display font-bold text-3xl text-[#0a0a0a] shadow-inner italic">
                        {user.handle.substring(0, 1)}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm ${
                        user.status === 'active' ? 'bg-green-500' : user.status === 'suspended' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 lg:gap-4 min-w-0">
                        <h3 className="text-2xl lg:text-3xl font-display font-bold tracking-tight italic truncate max-w-[150px] lg:max-w-none">{user.handle}</h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${
                          user.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                          user.status === 'suspended' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <Phone className="w-3.5 h-3.5" /> {user.phone}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" /> Established {user.joinedDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 lg:py-0 border-y lg:border-y-0 lg:border-x border-border/50 lg:px-10">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Session Load</p>
                      <p className="text-xl font-display font-bold tracking-tight italic">{user.totalChats} <span className="text-[10px] not-italic text-muted-foreground">Chats</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Signal Flags</p>
                      <p className="text-xl font-display font-bold tracking-tight italic">{user.reportsReceived} <span className="text-[10px] not-italic text-muted-foreground">Reports</span></p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Risk Index</p>
                        <p className="text-[10px] font-bold">{user.riskScore}%</p>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            user.riskScore > 70 ? 'bg-red-500' : user.riskScore > 30 ? 'bg-amber-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${user.riskScore}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {user.status === 'active' ? (
                      <>
                        <button 
                          onClick={() => handleSuspend(user.id)}
                          className="px-6 h-14 bg-muted/50 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-amber-500 hover:text-white transition-all"
                        >
                          Restrict
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleRestore(user.id)}
                        className="px-10 h-14 bg-[#0a0a0a] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" /> Restore Access
                      </button>
                    )}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle logic or state can be added if needed, 
                          // but for now let's use a focus-based menu or simple state.
                          const menu = e.currentTarget.nextElementSibling;
                          if (menu) menu.classList.toggle('hidden');
                        }}
                        title="More Options"
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 bottom-full mb-2 hidden bg-white border border-border rounded-xl shadow-xl p-2 w-32 z-50 pointer-events-auto">
                         <button 
                          onClick={() => handleBan(user.id)}
                          className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                         >
                           <Ban className="w-3 h-3" /> Ban User
                         </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-8 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto no-scrollbar"
            >
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center font-black text-white text-[10px]">C</div>
                    <span className="font-display font-bold text-lg tracking-tight text-[#0a0a0a]">CoolCliq</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {[
                    { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
                    { label: 'Venues', icon: Store, path: '/admin/venues' },
                    { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
                    { label: 'User Registry', icon: Users, path: '/admin/users', active: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                        item.active 
                        ? 'bg-[#0a0a0a] text-white shadow-xl shadow-black/20' 
                        : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
