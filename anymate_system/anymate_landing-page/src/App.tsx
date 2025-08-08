import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import NodeLanding from './pages/NodeLanding';
import PATHsassin3D from './pages/PATHsassin3D';
import AgentInterface from './pages/AgentInterface';
import NotFound from './pages/NotFound';
import Waitlist from './pages/Waitlist';

function AppLayout() {
  return <Outlet />;
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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
