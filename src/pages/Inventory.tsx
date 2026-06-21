import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import PaintForm from '@/components/inventory/PaintForm';
import { daysSince } from '@/utils/dateUtils';
import type { PaintInventory } from '@/types';
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  Edit2,
  PaintBucket,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function Inventory() {
  const { inventory, walls } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editPaint, setEditPaint] = useState<PaintInventory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return inventory;
    const q = searchQuery.toLowerCase();
    return inventory.filter(
      (p) =>
        p.brand.toLowerCase().includes(q) ||
        p.colorCode.toLowerCase().includes(q) ||
        p.colorName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }, [inventory, searchQuery]);

  const getOpenStatus = (paint: PaintInventory) => {
    const days = daysSince(paint.openDate);
    if (paint.remainingAmount <= 0) return { label: '已用完', color: 'text-teal-400 bg-cream-100', icon: AlertCircle };
    if (days < 0) {
      const daysLater = Math.abs(days);
      return { label: `计划${daysLater}天后开封`, color: 'text-sand-500 bg-sand-100', icon: Calendar };
    }
    if (days > 365) return { label: `开封${Math.floor(days / 30)}个月`, color: 'text-terracotta-600 bg-terracotta-100', icon: AlertCircle };
    if (days > 180) return { label: `开封${Math.floor(days / 30)}个月`, color: 'text-sand-500 bg-sand-100', icon: AlertCircle };
    return { label: `开封${days}天`, color: 'text-sage-500 bg-sage-100', icon: CheckCircle };
  };

  const getAmountStatus = (paint: PaintInventory) => {
    if (paint.remainingAmount <= 0) return 0;
    if (paint.unit === 'L' && paint.remainingAmount < 0.5) return 30;
    if (paint.unit === 'ml' && paint.remainingAmount < 200) return 30;
    if (paint.unit === 'kg' && paint.remainingAmount < 0.3) return 30;
    if (paint.unit === 'L' && paint.remainingAmount < 1) return 60;
    if (paint.unit === 'ml' && paint.remainingAmount < 500) return 60;
    if (paint.unit === 'kg' && paint.remainingAmount < 0.5) return 60;
    return 100;
  };

  const getMatchedWalls = (paint: PaintInventory) => {
    return walls.filter(
      (w) =>
        w.topcoatBrand.includes(paint.brand) ||
        w.topcoatColor.includes(paint.colorCode) ||
        w.topcoatColor.includes(paint.colorName)
    );
  };

  const openEdit = (paint: PaintInventory) => {
    setEditPaint(paint);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditPaint(null);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-teal-700">油漆库存</h1>
          <p className="text-teal-500 mt-2">
            管理剩余涂料，补漆时快速定位对应色号，避免色差
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          新增库存
        </button>
      </div>

      <div className="card p-4 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
          <input
            type="text"
            className="input-field pl-12"
            placeholder="搜索品牌、色号、颜色名称、存放位置..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredInventory.length === 0 ? (
        <div className="card p-16 text-center opacity-0 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <PaintBucket size={28} className="text-teal-400" />
          </div>
          <p className="text-teal-500 mb-4">
            {searchQuery ? '没有找到匹配的库存' : '暂无油漆库存记录'}
          </p>
          {!searchQuery && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              添加第一桶油漆
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInventory.map((paint, i) => {
            const status = getOpenStatus(paint);
            const StatusIcon = status.icon;
            const amountPercent = getAmountStatus(paint);
            const matchedWalls = getMatchedWalls(paint);
            return (
              <div
                key={paint.id}
                className="card p-5 card-hover opacity-0 animate-fade-in-up group"
                style={{ animationDelay: `${100 + i * 60}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex-shrink-0"
                    style={{ backgroundColor: paint.hexColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h4 className="font-serif font-semibold text-teal-700 text-lg truncate">
                          {paint.colorName}
                        </h4>
                        <p className="text-sm text-teal-500 font-mono">
                          {paint.colorCode}
                        </p>
                      </div>
                      <button
                        onClick={() => openEdit(paint)}
                        className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 size={16} className="text-teal-500" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-teal-600 mt-1">
                      {paint.brand}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-teal-500">剩余量</span>
                      <span className="font-bold text-teal-700">
                        {paint.remainingAmount} {paint.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          amountPercent <= 30
                            ? 'bg-terracotta-500'
                            : amountPercent <= 60
                            ? 'bg-sand-500'
                            : 'bg-sage-500'
                        }`}
                        style={{ width: `${amountPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-teal-500">
                      <Calendar size={14} />
                      <span className={`badge ${status.color}`}>
                        <StatusIcon size={11} className="mr-1" />
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-teal-500 truncate">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="truncate" title={paint.location}>
                        {paint.location}
                      </span>
                    </div>
                  </div>

                  {matchedWalls.length > 0 && (
                    <div className="pt-3 border-t border-cream-200/60">
                      <p className="text-xs text-teal-400 mb-2">
                        匹配墙面（{matchedWalls.length}）
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedWalls.slice(0, 3).map((w) => (
                          <span
                            key={w.id}
                            className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-lg"
                          >
                            {w.name}
                          </span>
                        ))}
                        {matchedWalls.length > 3 && (
                          <span className="text-xs text-teal-400 px-2 py-1">
                            +{matchedWalls.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <PaintForm editPaint={editPaint || undefined} onClose={handleClose} />}
    </div>
  );
}
