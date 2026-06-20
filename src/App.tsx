import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import Walls from '@/pages/Walls';
import WallDetail from '@/pages/WallDetail';
import Repairs from '@/pages/Repairs';
import Inventory from '@/pages/Inventory';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <main className="min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/walls" element={<Walls />} />
              <Route path="/walls/:id" element={<WallDetail />} />
              <Route path="/repairs" element={<Repairs />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
