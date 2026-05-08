import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import VenueManagement from './pages/admin/VenueManagement';
import UserManagement from './pages/admin/UserManagement';
import ModerationQueue from './pages/admin/ModerationQueue';
import QRCodeGeneration from './pages/admin/QRCodeGeneration';
import Login from './pages/mobile/Login';
import ProfileSetup from './pages/mobile/ProfileSetup';
import MapDiscovery from './pages/mobile/MapDiscovery';
import VenueDetail from './pages/mobile/VenueDetail';
import Chat from './pages/mobile/Chat';
import QRScan from './pages/mobile/QRScan';
import Circles from './pages/mobile/Circles';
import Notifications from './pages/mobile/Notifications';
import Settings from './pages/mobile/Settings';
import Users from './pages/mobile/Users';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-center" expand={true} richColors />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Mobile App Flow */}
        <Route path="/mobile/login" element={<Login />} />
        <Route path="/mobile/profile-setup" element={<ProfileSetup />} />
        <Route path="/mobile/map" element={<MapDiscovery />} />
        <Route path="/mobile/venue/:id" element={<VenueDetail />} />
        <Route path="/mobile/chat/:id" element={<Chat />} />
        <Route path="/mobile/qr-scan" element={<QRScan />} />
        <Route path="/mobile/circles" element={<Circles />} />
        <Route path="/mobile/notifications" element={<Notifications />} />
        <Route path="/mobile/settings" element={<Settings />} />
        <Route path="/mobile/users" element={<Users />} />

        {/* Admin Flow */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/venues" element={<VenueManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/moderation" element={<ModerationQueue />} />
        <Route path="/admin/qr-generation" element={<QRCodeGeneration />} />
      </Routes>
    </Router>
  );
}

export default App;
