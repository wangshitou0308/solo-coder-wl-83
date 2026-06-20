import { Link } from 'react-router-dom';
import type { Wall } from '@/types';
import { useStore } from '@/store/useStore';
import { relativeDate } from '@/utils/dateUtils';
import { ChevronRight, Layers, AlertTriangle } from 'lucide-react';

interface WallCardProps {
  wall: Wall;
}

export default function WallCard({ wall }: WallCardProps) {
  const { getRepairsByWall } = useStore();
  const repairs = getRepairsByWall(wall.id);
  const room = useStore.getState().getRoomById(wall.roomId);
  const hasRecurring = repairs.some((r) => r.isRecurring);

  const lastRepair = repairs[0];

  return (
    <Link
      to={`/walls/${wall.id}`}
      className="card p-5 card-hover group block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-cream-200"
            style={{ backgroundColor: wall.topcoatHex || '#F5F1E8' }}
          >
            <Layers size={20} className="text-teal-600" />
          </div>
          <div>
            <h4 className="font-serif font-semibold text-teal-700 text-lg">
              {wall.name}
            </h4>
            <p className="text-xs text-teal-500">{room?.name} · {wall.material}</p>
          </div>
        </div>
        {hasRecurring && (
          <span className="badge bg-terracotta-100 text-terracotta-600">
            <AlertTriangle size={12} className="mr-1" />
            反复问题
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-teal-500">面漆色号</span>
          <span className="text-teal-700 font-medium flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-md border border-cream-200"
              style={{ backgroundColor: wall.topcoatHex }}
            ></span>
            {wall.topcoatColor}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-teal-500">施工日期</span>
          <span className="text-teal-700">{wall.constructionDate}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-teal-500">修补次数</span>
          <span className="text-teal-700 font-medium">{repairs.length} 次</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-cream-200/60">
        {lastRepair ? (
          <span className="text-xs text-teal-500">
            最近修补：{relativeDate(lastRepair.date)} · {lastRepair.issueType}
          </span>
        ) : (
          <span className="text-xs text-teal-400">暂无修补记录</span>
        )}
        <ChevronRight
          size={18}
          className="text-teal-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </Link>
  );
}
