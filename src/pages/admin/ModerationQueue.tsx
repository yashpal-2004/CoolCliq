import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Store, ShieldAlert, Users, LogOut, 
  AlertTriangle, Ban, CheckCircle, Eye, Clock, User,
  Bell, Search, Menu, X, Filter, MoreVertical, MessageSquare,
  ShieldCheck, ShieldX, Flag, Zap, Globe
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

interface Report {
  id: string;
  reportedUser: string;
  reportedBy: string;
  reason: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  priority: 'high' | 'medium' | 'low';
}

export default function ModerationQueue() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase.from('reports').select('*');
      if (data) {
        setReports(data.map((r: any) => ({
          id: r.id,
          reportedUser: r.reported_user,
          reportedBy: r.reported_by,
          reason: r.reason,
          message: r.message || '',
          timestamp: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: r.status,
          priority: r.priority
        })));
      }
      setLoading(false);
    };
    fetchReports();

    // Live subscription
    const channel = supabase.channel('reports-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, fetchReports)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateReportStatus = async (id: string, status: 'resolved') => {
    const { error } = await supabase.from('reports').update({ status }).eq('id', id);
    if (!error) {
      setReports(reports.map(r => r.id === id ? { ...r, status } : r));
      toast.success('Report status updated');
    } else {
      toast.error('Failed to update report');
    }
  };

  const handleSuspend = async (id: string) => {
    // In a real app, this would also update the profile status.
    // For this assignment, we'll just resolve the report.
    await updateReportStatus(id, 'resolved');
  };

  const handleDismiss = async (id: string) => {
    await updateReportStatus(id, 'resolved');
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

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
              { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation', active: true },
              { label: 'User Registry', icon: Users, path: '/admin/users' },
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

          <div className="flex items-center gap-3 w-full lg:max-w-xl">
            <div className="flex items-center bg-white border border-border rounded-xl px-3 lg:px-4 py-2 flex-1 min-w-0 shadow-sm">
              <Search className="w-4 h-4 text-muted-foreground mr-2 lg:mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Audit logs..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium truncate"
              />
            </div>
            <button className="p-2.5 rounded-xl border border-border bg-white shadow-sm hover:bg-muted transition-colors shrink-0">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shield Active</span>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10 lg:space-y-12">
          {/* Section Heading */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-[#0a0a0a]">Security Intel</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {pendingReports.length} critical signals awaiting administrative resolution
              </p>
            </div>
            <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'active' ? 'bg-white shadow-sm text-[#0a0a0a]' : 'text-muted-foreground hover:text-[#0a0a0a]'
                }`}
              >
                Active Queue
              </button>
              <button 
                onClick={() => setActiveTab('resolved')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'resolved' ? 'bg-white shadow-sm text-[#0a0a0a]' : 'text-muted-foreground hover:text-[#0a0a0a]'
                }`}
              >
                Resolution History
              </button>
            </div>
          </div>

          {/* Signals Feed */}
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {(activeTab === 'active' ? pendingReports : resolvedReports).map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-border/50 rounded-[2.5rem] p-8 lg:p-12 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 overflow-hidden relative group"
                >
                  <div className={`absolute top-0 left-0 w-2 h-full ${
                    report.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />

                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-8">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center text-[#0a0a0a] shadow-inner">
                            <User className="w-7 h-7" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-2xl font-display font-bold tracking-tight italic">{report.reportedUser}</h3>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                report.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {report.reason}
                              </span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> {report.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><MoreVertical className="w-5 h-5" /></button>
                      </div>

                      <div className="bg-[#f9f9f9] border border-border rounded-2xl p-6 relative">
                        <MessageSquare className="absolute top-4 right-4 w-5 h-5 text-muted-foreground/20" />
                        <p className="text-sm lg:text-base font-medium text-[#0a0a0a] leading-relaxed italic">
                          "{report.message}"
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border/50 pt-6">
                        <div className="flex items-center gap-2"><Flag className="w-3.5 h-3.5" /> Flagged by {report.reportedBy}</div>
                        <div className="w-1 h-1 bg-border rounded-full" />
                        <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Region: APAC-South</div>
                      </div>
                    </div>

                    {report.status === 'pending' ? (
                      <div className="lg:w-72 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-border/50 pt-8 lg:pt-0 lg:pl-10">
                        <button className="w-full h-14 bg-[#fcfcfc] border border-border rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#0a0a0a] hover:text-white transition-all">
                          <Eye className="w-4 h-4" /> View Full Context
                        </button>
                        <button 
                          onClick={() => handleSuspend(report.id)}
                          className="w-full h-14 bg-red-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                        >
                          <ShieldX className="w-4 h-4" /> Suspend User
                        </button>
                        <button 
                          onClick={() => handleDismiss(report.id)}
                          className="w-full h-14 bg-green-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-xl shadow-green-500/20"
                        >
                          <ShieldCheck className="w-4 h-4" /> Dismiss Report
                        </button>
                      </div>
                    ) : (
                      <div className="lg:w-72 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-border/50 pt-8 lg:pt-0 lg:pl-10">
                         <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Resolved</p>
                         </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(activeTab === 'active' ? pendingReports : resolvedReports).length === 0 && (
              <div className="bg-white border border-dashed border-border rounded-[2.5rem] p-32 text-center space-y-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                   <ShieldCheck className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold tracking-tight italic">Queue Purified</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">System security status: Optimal</p>
                </div>
              </div>
            )}
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
                    { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation', active: true },
                    { label: 'User Registry', icon: Users, path: '/admin/users' },
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
