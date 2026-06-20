import { useState } from 'react';
import { useStore } from '@/store/useStore';
import WallCard from '@/components/walls/WallCard';
import WallForm from '@/components/walls/WallForm';
import WallDetailPage from '@/pages/WallDetail';
import { Plus, Home } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

export default function Walls() {
  const { rooms, walls } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/walls/') && location.pathname !== '/walls') {
    return (
      <Routes>
        <Route path=":id" element={<WallDetailPage />} />
      </Routes>
    );
  }

  const filteredWalls = activeRoom
    ? walls.filter((w) => w.roomId === activeRoom)
    : walls;

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-teal-700">墙面档案</h1>
          <p className="text-teal-500 mt-2">
            管理每一面墙的材质、涂料、施工信息
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          新增墙面
        </button>
      </div>

      <div className="flex gap-4 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <button
          onClick={() => setActiveRoom(null)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl2 font-medium transition-all ${
            activeRoom === null
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-teal-600 hover:bg-cream-100 border border-cream-200'
          }`}
        >
          <Home size={18} />
          全部房间
        </button>
        {rooms.map((room) => {
          const count = walls.filter((w) => w.roomId === room.id).length;
          return (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl2 font-medium transition-all ${
                activeRoom === room.id
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-teal-600 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {room.name}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeRoom === room.id ? 'bg-white/20' : 'bg-cream-100'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredWalls.length === 0 ? (
        <div className="card p-16 text-center opacity-0 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <Home size={28} className="text-teal-400" />
          </div>
          <p className="text-teal-500 mb-4">还没有墙面档案</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            录入第一面墙
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWalls.map((wall, i) => (
            <div
              key={wall.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${100 + i * 60}ms` }}
            >
              <WallCard wall={wall} />
            </div>
          ))}
        </div>
      )}

      {showForm && <WallForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
