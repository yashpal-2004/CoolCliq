import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Store, ShieldAlert, Users, LogOut,
  ArrowUpRight, ArrowDownRight, Activity, Zap,
  TrendingUp, BarChart3, PieChart as PieChartIcon,
  Calendar, Search, Bell, Menu, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 700 },
];

const venueData = [
  { name: 'BKC', value: 45 },
  { name: 'Colaba', value: 32 },
  { name: 'Andheri', value: 58 },
  { name: 'Bandra', value: 48 },
  { name: 'Powai', value: 25 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    activeUsers: 0,
    venuesCount: 0,
    pendingReports: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: usersCount },
        { count: venuesCount },
        { count: reportsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        activeUsers: usersCount || 0,
        venuesCount: venuesCount || 0,
        pendingReports: reportsCount || 0,
        loading: false
      });
    };
    fetchStats();

    // Subscribe to changes for real-time updates
    const channels = supabase.channel('dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'venues' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

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

  const handleExportCSV = () => {
    const metrics = [
      ['Platform Analytics Report', new Date().toLocaleString()],
      ['Metric', 'Current Value', 'Status'],
      ['Total Active Users', stats.activeUsers.toString(), 'Nominal'],
      ['Verified Venues', stats.venuesCount.toString(), 'Operational'],
      ['Pending Moderation Tasks', stats.pendingReports.toString(), stats.pendingReports > 0 ? 'Action Required' : 'Clean'],
      ['System Health', '99.9%', 'Stable'],
      ['Engagement Rate', '42%', 'High']
    ];

    const csvContent = metrics.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CoolCliq_Global_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Platform Intelligence exported');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 flex overflow-hidden">
      {/* Sidebar - Professional Desktop Navigation */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#00000005] h-screen p-8 flex flex-col justify-between sticky top-0 z-20">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center font-black text-white text-xs">C</div>
            <span className="font-display font-bold text-xl tracking-tight text-[#0a0a0a]">CoolCliq <span className="text-muted-foreground font-medium text-xs ml-1 uppercase tracking-widest">Admin</span></span>
          </div>

          <nav className="space-y-1.5">
            {[
              { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard', active: true },
              { label: 'Venues', icon: Store, path: '/admin/venues' },
              { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
              { label: 'User Registry', icon: Users, path: '/admin/users' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group ${item.active
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
        {/* Top Header Section */}
        <header className="sticky top-0 z-10 bg-[#fcfcfc]/80 backdrop-blur-xl border-b border-[#00000005] px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center font-black text-white text-[10px] shrink-0">C</div>
          </div>

          <div className="hidden lg:flex items-center bg-white border border-border rounded-xl px-4 py-2 w-full max-w-md shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="Search analytics, venues, users..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/60 font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl border border-border bg-white shadow-sm hover:bg-muted transition-colors relative group">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-[#0a0a0a]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold tracking-tight leading-none">Divyanshu Gupta</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-200 to-zinc-100 border border-border flex items-center justify-center font-bold shadow-sm text-sm">
                DG
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10 lg:space-y-12">
          {/* Welcome Section */}
          <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-[#0a0a0a]">Platform Intelligence</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Real-time operations summary for May 08, 2026
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-6 py-3 rounded-xl bg-white border border-border shadow-sm font-semibold text-sm hover:bg-muted transition-all flex items-center gap-2"
              >
                Export Data <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 rounded-xl bg-[#0a0a0a] text-white shadow-xl shadow-black/10 font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                Sync Data
              </button>
            </div>
          </section>

          {/* Core Metrics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Active Users', value: stats.loading ? '...' : stats.activeUsers.toLocaleString(), trend: '+14%', up: true, icon: Users },
              { label: 'Verified Venues', value: stats.loading ? '...' : stats.venuesCount.toLocaleString(), trend: '+12%', up: true, icon: Store },
              { label: 'Moderation Load', value: stats.loading ? '...' : stats.pendingReports.toLocaleString(), trend: 'Live', up: stats.pendingReports > 10 ? false : true, icon: ShieldAlert },
              { label: 'Peak Capacity', value: '88%', trend: '+8.2%', up: true, icon: Activity },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-[#00000005] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-muted group-hover:bg-[#0a0a0a] transition-colors duration-500">
                    <stat.icon className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-display font-bold tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Visual Data Layer */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Growth Matrix */}
            <div className="lg:col-span-2 bg-white border border-[#00000005] rounded-[2.5rem] p-8 lg:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    Growth Matrix <TrendingUp className="w-5 h-5 text-[#0a0a0a]" />
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">User Engagement Lifecycle</p>
                </div>
                <div className="flex bg-muted p-1 rounded-xl">
                  {['Day', 'Week', 'Month'].map(tab => (
                    <button key={tab} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'Week' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-[#0a0a0a]'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 600, fill: '#a1a1aa' }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 600, fill: '#a1a1aa' }}
                      dx={-15}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px 16px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0a0a0a"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Map */}
            <div className="bg-[#0a0a0a] text-white border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-black/20 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-white/10 transition-colors duration-700" />

              <div className="relative z-10 space-y-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    Venue Load <BarChart3 className="w-5 h-5" />
                  </h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Operational Density by Zone</p>
                </div>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={venueData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 700, fill: 'rgba(255,255,255,0.6)' }}
                        width={70}
                      />
                      <Tooltip cursor={{ fill: 'transparent' }} content={() => null} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                        {venueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ffffff' : 'rgba(255,255,255,0.2)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-display font-bold tracking-tighter italic">208.4k</p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Total Impressions</p>
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
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
                    <span className="font-display font-bold text-lg tracking-tight">CoolCliq</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {[
                    { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard', active: true },
                    { label: 'Venues', icon: Store, path: '/admin/venues' },
                    { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
                    { label: 'User Registry', icon: Users, path: '/admin/users' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${item.active
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
