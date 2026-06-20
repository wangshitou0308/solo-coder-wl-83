import { Bell, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getCurrentSeason, getSeasonalTips } from '@/utils/dateUtils';
import { useState } from 'react';

export default function Header() {
  const { repairs } = useStore();
  const [showNotify, setShowNotify] = useState(false);
  const season = getCurrentSeason();
  const tips = getSeasonalTips(season);

  const recentRepairs = repairs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const notifications = [
    { type: 'season', title: `${season}季墙面检查提醒`, desc: tips[0] },
    ...recentRepairs.map((r) => ({
      type: 'repair' as const,
      title: `新修补记录：${r.issueType}`,
      desc: r.location,
    })),
  ];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-cream-200/60 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-lg font-semibold text-teal-700">
          全屋墙面管理中心
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotify(!showNotify)}
            className="relative p-2.5 rounded-xl2 hover:bg-cream-100 transition-colors"
          >
            <Bell size={20} className="text-teal-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta-500 rounded-full"></span>
          </button>

          {showNotify && (
            <div className="absolute right-0 top-12 w-80 card p-0 overflow-hidden z-50 animate-fade-in">
              <div className="px-5 py-3 bg-gradient-to-r from-teal-700 to-teal-600 text-cream-50">
                <p className="font-medium">通知提醒</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 border-b border-cream-200/60 last:border-0 hover:bg-cream-50 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium text-teal-700">{n.title}</p>
                    <p className="text-xs text-teal-500 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl2 hover:bg-cream-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-500 to-teal-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-teal-700">业主</span>
        </button>
      </div>
    </header>
  );
}
