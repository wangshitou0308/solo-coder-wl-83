import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import WallForm from '@/components/walls/WallForm';
import RepairForm from '@/components/repairs/RepairForm';
import { formatDate, relativeDate, daysSince } from '@/utils/dateUtils';
import { ISSUE_COLORS } from '@/types';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Layers,
  PaintBucket,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  RefreshCcw,
  MapPin,
  Hammer,
  ListOrdered,
} from 'lucide-react';

export default function WallDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWallById, getRoomById, getRepairsByWall, deleteWall, searchInventory } = useStore();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRepairForm, setShowRepairForm] = useState(false);

  if (!id) return null;
  const wall = getWallById(id);
  if (!wall) {
    return (
      <div className="p-8 text-center">
        <p className="text-teal-500">墙面不存在</p>
        <button onClick={() => navigate('/walls')} className="btn-primary mt-4">
          返回墙面列表
        </button>
      </div>
    );
  }

  const room = getRoomById(wall.roomId);
  const repairs = getRepairsByWall(wall.id);
  const matchedPaints = searchInventory(wall.topcoatBrand);

  const handleDelete = () => {
    if (confirm('确定要删除这个墙面档案吗？相关修补记录也将被删除。')) {
      deleteWall(wall.id);
      navigate('/walls');
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in-up">
        <button
          onClick={() => navigate('/walls')}
          className="p-2 rounded-xl2 hover:bg-white border border-cream-200/60 transition-colors"
        >
          <ArrowLeft size={20} className="text-teal-600" />
        </button>
        <div>
          <p className="text-sm text-teal-500">{room?.name} · {room?.floor}</p>
          <h1 className="font-serif text-2xl font-bold text-teal-700">{wall.name}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowEditForm(true)} className="btn-secondary flex items-center gap-2">
            <Edit2 size={16} />
            编辑
          </button>
          <button onClick={handleDelete} className="btn-danger flex items-center gap-2">
            <Trash2 size={16} />
            删除
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-cream-200 shadow-inner"
                style={{ backgroundColor: wall.topcoatHex || '#F5F1E8' }}
              />
              <div>
                <h3 className="section-title mb-1">基本信息</h3>
                <p className="text-teal-500 text-sm">
                  {wall.material}材质墙面，施工于 {formatDate(wall.constructionDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-xl2">
                <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Layers size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-teal-500">墙面材质</p>
                  <p className="text-teal-700 font-medium mt-0.5">{wall.material}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-xl2">
                <div className="w-9 h-9 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-sage-500" />
                </div>
                <div>
                  <p className="text-xs text-teal-500">施工日期</p>
                  <p className="text-teal-700 font-medium mt-0.5">
                    {formatDate(wall.constructionDate)}
                    <span className="text-xs text-teal-400 ml-2">
                      已 {daysSince(wall.constructionDate)} 天
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-xl2">
                <div className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-sand-500" />
                </div>
                <div>
                  <p className="text-xs text-teal-500">施工方</p>
                  <p className="text-teal-700 font-medium mt-0.5">
                    {wall.contractor || '未记录'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-xl2">
                <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-teal-500">备注</p>
                  <p className="text-teal-700 font-medium mt-0.5">
                    {wall.notes || '无'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="section-title">涂料信息</h3>
              {matchedPaints.length > 0 && (
                <Link to="/inventory" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  查看库存匹配
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl2 border border-cream-200/60">
                <p className="text-xs text-teal-500 mb-2">底漆</p>
                <p className="text-teal-700 font-medium">{wall.primerBrand || '未记录'}</p>
                <p className="text-sm text-teal-500 mt-1">{wall.primerColor || '—'}</p>
              </div>
              <div className="p-5 rounded-xl2 border border-cream-200/60">
                <p className="text-xs text-teal-500 mb-2">面漆</p>
                <p className="text-teal-700 font-medium">{wall.topcoatBrand || '未记录'}</p>
                <p className="text-sm text-teal-500 mt-1">{wall.topcoatColor || '—'}</p>
                {wall.topcoatHex && (
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="w-5 h-5 rounded-md border border-cream-200"
                      style={{ backgroundColor: wall.topcoatHex }}
                    />
                    <span className="text-xs text-teal-400 font-mono">{wall.topcoatHex}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '220ms' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h3 className="section-title">修补历史</h3>
                {repairs.some((r) => r.isRecurring) && (
                  <span className="badge bg-terracotta-100 text-terracotta-600">
                    <RefreshCcw size={12} className="mr-1" />
                    存在反复问题
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowRepairForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                记录修补
              </button>
            </div>

            {repairs.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-3">
                  <Hammer size={24} className="text-teal-400" />
                </div>
                <p className="text-teal-500">暂无修补记录</p>
              </div>
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-cream-200" />
                <div className="space-y-5">
                  {repairs.map((repair, i) => (
                    <div key={repair.id} className="relative">
                      <div
                        className="absolute -left-[22px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: ISSUE_COLORS[repair.issueType] }}
                      />
                      <div
                        className={`p-4 rounded-xl2 border transition-all ${
                          repair.isRecurring
                            ? 'border-terracotta-500/30 bg-terracotta-100/30'
                            : 'border-cream-200/60 bg-cream-50/50 hover:bg-cream-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
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
                          </div>
                          <span className="text-xs text-teal-400">
                            {formatDate(repair.date)} ({relativeDate(repair.date)})
                          </span>
                        </div>
                        <div className="mt-3 flex items-start gap-2 text-sm">
                          <MapPin size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-700">{repair.location}</span>
                        </div>
                        <div className="mt-2 flex items-start gap-2 text-sm">
                          <PaintBucket size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-600">{repair.materials}</span>
                        </div>
                        <div className="mt-2 flex items-start gap-2 text-sm">
                          <ListOrdered size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-600 whitespace-pre-line">{repair.steps}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="section-title mb-4">墙面统计</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-teal-500 text-sm">累计修补</span>
                <span className="font-serif text-2xl font-bold text-teal-700">
                  {repairs.length}
                  <span className="text-sm font-normal text-teal-400 ml-1">次</span>
                </span>
              </div>
              <div className="h-px bg-cream-200/60" />
              <div className="flex items-center justify-between">
                <span className="text-teal-500 text-sm">反复问题</span>
                <span className="font-serif text-2xl font-bold text-terracotta-600">
                  {repairs.filter((r) => r.isRecurring).length}
                  <span className="text-sm font-normal text-teal-400 ml-1">处</span>
                </span>
              </div>
              <div className="h-px bg-cream-200/60" />
              <div className="flex items-center justify-between">
                <span className="text-teal-500 text-sm">使用年限</span>
                <span className="font-serif text-2xl font-bold text-teal-700">
                  {(daysSince(wall.constructionDate) / 365).toFixed(1)}
                  <span className="text-sm font-normal text-teal-400 ml-1">年</span>
                </span>
              </div>
            </div>
          </div>

          {matchedPaints.length > 0 && (
            <div className="card p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '180ms' }}>
              <h3 className="section-title mb-4">库存匹配</h3>
              <div className="space-y-3">
                {matchedPaints.slice(0, 3).map((paint) => (
                  <div key={paint.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl2">
                    <span
                      className="w-10 h-10 rounded-lg border border-cream-200 flex-shrink-0"
                      style={{ backgroundColor: paint.hexColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-teal-700 truncate">
                        {paint.colorName}
                      </p>
                      <p className="text-xs text-teal-500">{paint.colorCode}</p>
                    </div>
                    <span className="text-sm font-bold text-teal-700">
                      {paint.remainingAmount}{paint.unit}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/inventory"
                className="block text-center text-sm text-teal-600 hover:text-teal-700 font-medium mt-4 pt-4 border-t border-cream-200/60"
              >
                查看全部库存
              </Link>
            </div>
          )}
        </div>
      </div>

      {showEditForm && (
        <WallForm editWall={wall} onClose={() => setShowEditForm(false)} />
      )}
      {showRepairForm && (
        <RepairForm defaultWallId={wall.id} onClose={() => setShowRepairForm(false)} />
      )}
    </div>
  );
}
