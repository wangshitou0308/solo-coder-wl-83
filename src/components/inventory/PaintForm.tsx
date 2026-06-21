import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { PaintInventory } from '@/types';
import { X, Trash2, Info } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

interface PaintFormProps {
  onClose: () => void;
  editPaint?: PaintInventory;
}

export default function PaintForm({ onClose, editPaint }: PaintFormProps) {
  const { addPaint, updatePaint } = useStore();
  const [form, setForm] = useState({
    brand: editPaint?.brand || '',
    colorCode: editPaint?.colorCode || '',
    colorName: editPaint?.colorName || '',
    hexColor: editPaint?.hexColor || '#F5F1E8',
    openDate: editPaint?.openDate || new Date().toISOString().split('T')[0],
    location: editPaint?.location || '',
    remainingAmount: editPaint?.remainingAmount || 0,
    unit: (editPaint?.unit || 'L') as 'L' | 'ml' | 'kg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPaint) {
      updatePaint(editPaint.id, form);
    } else {
      addPaint(form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-teal-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-cardHover max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200/60">
          <h3 className="font-serif text-xl font-semibold text-teal-700">
            {editPaint ? '编辑油漆库存' : '新增油漆库存'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-teal-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">品牌</label>
              <input
                type="text"
                className="input-field"
                placeholder="如：立邦"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">色号</label>
              <input
                type="text"
                className="input-field"
                placeholder="如：NN7830-4"
                value={form.colorCode}
                onChange={(e) => setForm({ ...form, colorCode: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">颜色名称</label>
              <input
                type="text"
                className="input-field"
                placeholder="如：奶咖色"
                value={form.colorName}
                onChange={(e) => setForm({ ...form, colorName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">色卡 HEX 值</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-12 h-11 rounded-xl border border-cream-200 cursor-pointer"
                  value={form.hexColor}
                  onChange={(e) => setForm({ ...form, hexColor: e.target.value })}
                />
                <input
                  type="text"
                  className="input-field font-mono text-sm"
                  placeholder="#D4B896"
                  value={form.hexColor}
                  onChange={(e) => setForm({ ...form, hexColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label">开封日期</label>
              <div className="flex items-center gap-1 text-xs text-teal-400">
                <Info size={12} />
                <span>可选择未来日期（计划开封）</span>
              </div>
            </div>
            <input
              type="date"
              className="input-field"
              value={form.openDate}
              onChange={(e) => setForm({ ...form, openDate: e.target.value })}
            />
          </div>

          <div>
            <label className="label">存放位置</label>
            <input
              type="text"
              className="input-field"
              placeholder="如：储物间第二层货架"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="label">剩余数量</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="input-field"
                value={form.remainingAmount}
                onChange={(e) => setForm({ ...form, remainingAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="label">单位</label>
              <select
                className="input-field"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value as 'L' | 'ml' | 'kg' })}
              >
                <option value="L">升 (L)</option>
                <option value="ml">毫升 (ml)</option>
                <option value="kg">千克 (kg)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200/60">
            {editPaint && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('确定删除此库存记录？')) {
                    useStore.getState().deletePaint(editPaint.id);
                    onClose();
                  }
                }}
                className="btn-danger flex items-center gap-1"
              >
                <Trash2 size={16} />
                删除
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editPaint ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
