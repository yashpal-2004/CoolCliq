import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Trash2, LogOut, ChevronRight, UserX, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed');
    } else {
      toast.success('Signed out successfully');
      navigate('/mobile/login');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure? This will permanently delete your profile, messages, and presence history. This action cannot be undone.'
    );

    if (confirmed) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No active session');

        // 1. Delete profile from Supabase (triggers cascade or manual cleanup)
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (profileError) throw profileError;

        // 2. Sign out
        await supabase.auth.signOut();
        
        toast.success('Account deleted successfully');
        navigate('/');
      } catch (err: any) {
        toast.error(`Delete failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20">
      {/* Header */}
      <nav className="px-6 py-8 bg-white/80 backdrop-blur-xl border-b border-[#00000005] flex items-center gap-6 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Account Settings</h1>
      </nav>

      <div className="p-6 max-w-2xl mx-auto space-y-12">
        {/* Security Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Privacy & Security</h2>
          </div>
          
          <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
            <button className="w-full px-8 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors border-b border-border/50 group">
              <span className="font-bold tracking-tight">Visibility Controls</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full px-8 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors group">
              <span className="font-bold tracking-tight">Blocked Identity Registry</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Account Actions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Session Management</h2>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full h-20 bg-white border border-border rounded-[2rem] flex items-center justify-between px-8 hover:bg-muted/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="font-bold tracking-tight">Sign Out</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={handleDeleteAccount}
              className="w-full h-20 bg-red-50 text-red-600 border border-red-100 rounded-[2rem] flex items-center justify-between px-8 hover:bg-red-600 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 group-hover:bg-red-500 rounded-xl flex items-center justify-center transition-colors">
                  <UserX className="w-5 h-5 text-red-600 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold tracking-tight leading-none">Delete Account</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Permanent Removal</p>
                </div>
              </div>
              <Trash2 className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </section>

        {/* Footer Info */}
        <div className="pt-12 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">CoolCliq v1.0.4-Alpha</p>
          <div className="flex justify-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            <button className="hover:text-primary">Terms</button>
            <span>•</span>
            <button className="hover:text-primary">Privacy</button>
            <span>•</span>
            <button className="hover:text-primary">Safety</button>
          </div>
        </div>
      </div>
    </div>
  );
}
