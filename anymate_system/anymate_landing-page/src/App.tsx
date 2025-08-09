import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import NodeLanding from './pages/NodeLanding';
import PATHsassin3D from './pages/PATHsassin3D';
import AgentInterface from './pages/AgentInterface';
import NotFound from './pages/NotFound';
import Waitlist from './components/Waitlist';
import ActivatePanel from './components/ActivatePanel';
import { AdminDashboard } from './components/AdminDashboard';
import Wordmark from './components/Wordmark';
import AssetStrip from './components/AssetStrip';

function HeaderBar(){
  const [open, setOpen] = useState(false);
  return (
    <header className="flex justify-between items-center px-4 py-3 sticky top-0 bg-black/60 backdrop-blur-md z-50 border-b border-white/10">
      <div><Wordmark /></div>
      <nav className="flex gap-4 items-center">
        <Link to="/waitlist" className="text-white hover:text-emerald-400 transition-colors">
          Get early access
        </Link>
        <button 
          onClick={() => setOpen(true)} 
          aria-expanded={open} 
          aria-controls="activate-panel" 
          className="px-4 py-2 border border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
        >
          ACTIVATE
        </button>
      </nav>
      <ActivatePanel open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

function AppLayout() {
  const loc = useLocation();
  const onHome = loc.pathname === '/';
  return (
    <>
      <HeaderBar />
      <main className="px-4 md:px-6">{/* page content */}
        <Outlet />
        {onHome ? <AssetStrip /> : null}
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<NodeLanding />} />
          <Route path="/pathsassin-3d" element={<PATHsassin3D />} />
          <Route path="/agent" element={<AgentInterface />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
