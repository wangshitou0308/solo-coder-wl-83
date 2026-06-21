import { useState } from 'react';
import { useStore } from '@/store/useStore';
import RepairForm from '@/components/repairs/RepairForm';
import { formatDate, relativeDate } from '@/utils/dateUtils';
import { ISSUE_COLORS, ISSUE_LIST } from '@/types';
import type { IssueType } from '@/types';
import {
  Plus,
  Filter,
  AlertTriangle,
  MapPin,
  PaintBucket,
  ListOrdered,
  LayoutGrid,
  Hammer,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Repairs() {
  const { repairs, walls, getWallById, getRoomById } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<IssueType | 'all' | 'recurring'>('all');
  const hasWalls = walls.length > 0;

  const filteredRepairs = repairs
    .filter((r) => {
      if (filter === 'all') return true;
      if (filter === 'recurring') return r.isRecurring;
      return r.issueType === filter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupedRepairs: Record<string, typeof repairs> = {};
  filteredRepairs.forEach((r) => {
    const month = r.date.substring(0, 7);
    if (!groupedRepairs[month]) groupedRepairs[month] = [];
    groupedRepairs[month].push(r);
  });

  const filters: Array<{ key: IssueType | 'all' | 'recurring'; label: string; color?: string }> = [
    { key: 'all', label: '全部' },
    { key: 'recurring', label: '反复问题' },
    ...ISSUE_LIST.map((i) => ({ key: i, label: i, color: ISSUE_COLORS[i] })),
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-teal-700">修补历史</h1>
          <p className="text-teal-500 mt-2">
            追踪每次修补的位置、材料和操作，识别反复问题区域
          </p>
        </div>
        {hasWalls ? (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            记录修补
          </button>
        ) : (
          <Link to="/walls" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            先创建墙面档案
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 mb-8 flex-wrap opacity-0 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <Filter size={18} className="text-teal-400" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl2 text-sm font-medium transition-all ${
              filter === f.key
                ? f.color
                  ? 'text-white shadow-md'
                  : 'bg-teal-700 text-white shadow-md'
                : 'bg-white text-teal-600 hover:bg-cream-100 border border-cream-200'
            }`}
            style={filter === f.key && f.color ? { backgroundColor: f.color } : undefined}
          >
            {f.label}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                filter === f.key ? 'bg-white/20' : 'bg-cream-100'
              }`}
            >
              {f.key === 'all'
                ? repairs.length
                : f.key === 'recurring'
                ? repairs.filter((r) => r.isRecurring).length
                : repairs.filter((r) => r.issueType === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {filteredRepairs.length === 0 ? (
        <div className="card p-16 text-center opacity-0 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <Hammer size={28} className="text-teal-400" />
          </div>
          <p className="text-teal-500 mb-4">暂无修补记录</p>
          {hasWalls ? (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              记录第一次修补
            </button>
          ) : (
            <div>
              <p className="text-sand-500 text-sm mb-4">
                请先在墙面档案中录入墙面信息后，再记录修补
              </p>
              <Link to="/walls" className="btn-primary">
                去创建墙面档案
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="relative pl-4">
          {Object.keys(groupedRepairs)
            .sort((a, b) => b.localeCompare(a))
            .map((month, monthIdx) => (
              <div key={month} className="mb-10">
                <div className="flex items-center gap-3 mb-5 opacity-0 animate-fade-in-up">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-teal-500" />
                    {monthIdx < Object.keys(groupedRepairs).length - 1 && (
                      <div className="absolute left-1.5 top-3 bottom-[-120px] w-px bg-cream-200" />
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-teal-700">
                    {month.replace('-', '年')}月
                  </h3>
                  <span className="text-sm text-teal-400">
                    {groupedRepairs[month].length} 次修补
                  </span>
                </div>

                <div className="ml-6 space-y-4">
                  {groupedRepairs[month].map((repair, i) => {
                    const wall = getWallById(repair.wallId);
                    const room = wall ? getRoomById(wall.roomId) : null;
                    return (
                      <div
                        key={repair.id}
                        className={`card p-5 opacity-0 animate-fade-in-up ${
                          repair.isRecurring ? 'border-terracotta-500/40' : ''
                        }`}
                        style={{ animationDelay: `${(monthIdx + 1) * 100 + i * 60}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: ISSUE_COLORS[repair.issueType] + '18',
                            }}
                          >
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: ISSUE_COLORS[repair.issueType] }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: ISSUE_COLORS[repair.issueType] + '20',
                                  color: ISSUE_COLORS[repair.issueType],
                                }}
                              >
                                {repair.issueType}
                              </span>
                              {repair.isRecurring && (
                                <span className="badge bg-terracotta-100 text-terracotta-600">
                                  <AlertTriangle size={11} className="mr-1" />
                                  反复出现
                                </span>
                              )}
                              {wall && (
                                <Link
                                  to={`/walls/${wall.id}`}
                                  className="badge bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors"
                                >
                                  <LayoutGrid size={11} className="mr-1" />
                                  {room?.name} · {wall.name}
                                </Link>
                              )}
                              <span className="text-sm text-teal-400 ml-auto">
                                {formatDate(repair.date)} · {relativeDate(repair.date)}
                              </span>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                                <span className="text-teal-700 font-medium">
                                  {repair.location}
                                </span>
                              </div>
                              {repair.materials && (
                                <div className="flex items-start gap-2">
                                  <PaintBucket
                                    size={14}
                                    className="text-teal-400 mt-0.5 flex-shrink-0"
                                  />
                                  <span className="text-teal-600">{repair.materials}</span>
                                </div>
                              )}
                              {repair.steps && (
                                <div className="flex items-start gap-2">
                                  <ListOrdered
                                    size={14}
                                    className="text-teal-400 mt-0.5 flex-shrink-0"
                                  />
                                  <span className="text-teal-600 whitespace-pre-line">
                                    {repair.steps}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}

      {showForm && <RepairForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
