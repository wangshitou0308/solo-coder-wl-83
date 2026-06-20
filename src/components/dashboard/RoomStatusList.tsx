import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { relativeDate } from '@/utils/dateUtils';
import { ChevronRight, Home, AlertTriangle } from 'lucide-react';

export default function RoomStatusList() {
  const { rooms, walls, repairs } = useStore();

  const roomStats = rooms.map((room) => {
    const roomWalls = walls.filter((w) => w.roomId === room.id);
    const roomRepairs = repairs.filter((r) =>
      roomWalls.some((w) => w.id === r.wallId)
    );
    const recurringIssues = roomRepairs.filter((r) => r.isRecurring).length;
    const lastRepair = roomRepairs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    const healthScore = Math.max(
      0,
      100 - roomRepairs.length * 8 - recurringIssues * 15
    );

    return {
      ...room,
      wallCount: roomWalls.length,
      repairCount: roomRepairs.length,
      recurringIssues,
      lastRepairDate: lastRepair?.date,
      healthScore,
    };
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-sage-500 bg-sage-100';
    if (score >= 60) return 'text-sand-500 bg-sand-100';
    return 'text-terracotta-600 bg-terracotta-100';
  };

  return (
    <div className="card p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title">各房间状态</h3>
        <Link
          to="/walls"
          className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium"
        >
          查看全部 <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-3">
        {roomStats.map((room, index) => (
          <Link
            key={room.id}
            to="/walls"
            className="flex items-center gap-4 p-4 rounded-xl2 bg-cream-50 hover:bg-cream-100/70 transition-all duration-200 group opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${250 + index * 50}ms` }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-100 to-cream-200 flex items-center justify-center">
              <Home size={20} className="text-teal-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-teal-700">{room.name}</h4>
                <span className="text-xs text-teal-400">{room.floor}</span>
                {room.recurringIssues > 0 && (
                  <span className="badge bg-terracotta-100 text-terracotta-600">
                    <AlertTriangle size={12} className="mr-1" />
                    {room.recurringIssues}处反复问题
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-teal-500">
                <span>{room.wallCount} 面墙</span>
                <span>累计修补 {room.repairCount} 次</span>
                {room.lastRepairDate && (
                  <span>最近修补 {relativeDate(room.lastRepairDate)}</span>
                )}
              </div>
            </div>

            <div
              className={`badge text-sm px-3 py-1.5 ${getHealthColor(room.healthScore)}`}
            >
              <span className="font-bold">{room.healthScore}</span>
              <span className="ml-0.5 opacity-70">分</span>
            </div>

            <ChevronRight
              size={18}
              className="text-teal-400 group-hover:text-teal-600 transition-colors"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
