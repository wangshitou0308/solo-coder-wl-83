import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { IssueType } from '@/types';
import { ISSUE_LIST } from '@/types';
import { ISSUE_COLORS } from '@/types';
import { X } from 'lucide-react';

interface RepairFormProps {
  onClose: () => void;
  defaultWallId?: string;
}

export default function RepairForm({ onClose, defaultWallId }: RepairFormProps) {
  const { walls, addRepair } = useStore();
  const [form, setForm] = useState({
    wallId: defaultWallId || walls[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    issueType: '裂缝' as IssueType,
    materials: '',
    steps: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRepair(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-teal-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-cardHover max-w-xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200/60">
          <h3 className="font-serif text-xl font-semibold text-teal-700">记录修补</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-teal-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">墙面</label>
              <select
                className="input-field"
                value={form.wallId}
                onChange={(e) => setForm({ ...form, wallId: e.target.value })}
              >
                {walls.map((w) => {
                  const room = useStore.getState().getRoomById(w.roomId);
                  return (
                    <option key={w.id} value={w.id}>
                      {room?.name} - {w.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="label">修补日期</label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">问题位置描述</label>
            <input
              type="text"
              className="input-field"
              placeholder="如：窗框左下角、插座旁墙面"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">问题类型</label>
            <div className="grid grid-cols-6 gap-2">
              {ISSUE_LIST.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, issueType: type })}
                  className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-all ${
                    form.issueType === type
                      ? 'text-white shadow-md'
                      : 'bg-cream-50 text-teal-600 hover:bg-cream-100 border border-cream-200'
                  }`}
                  style={
                    form.issueType === type
                      ? { backgroundColor: ISSUE_COLORS[type] }
                      : undefined
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">使用材料</label>
            <textarea
              className="input-field min-h-[70px] resize-none"
              placeholder="如：立邦腻子粉、NN7830-4面漆、网格布"
              value={form.materials}
              onChange={(e) => setForm({ ...form, materials: e.target.value })}
            />
          </div>

          <div>
            <label className="label">操作步骤</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="1. 清理松动腻子&#10;2. 批刮腻子两遍&#10;3. 打磨刷漆"
              value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200/60">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" className="btn-primary">
              保存记录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
