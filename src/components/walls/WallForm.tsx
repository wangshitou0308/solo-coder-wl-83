import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { Wall, WallMaterial } from '@/types';
import { MATERIAL_LIST } from '@/types';
import { X } from 'lucide-react';

interface WallFormProps {
  onClose: () => void;
  editWall?: Wall;
}

export default function WallForm({ onClose, editWall }: WallFormProps) {
  const { rooms, addWall, updateWall } = useStore();
  const [form, setForm] = useState({
    roomId: editWall?.roomId || rooms[0]?.id || '',
    name: editWall?.name || '',
    material: (editWall?.material || '水泥砂浆') as WallMaterial,
    primerBrand: editWall?.primerBrand || '',
    primerColor: editWall?.primerColor || '',
    topcoatBrand: editWall?.topcoatBrand || '',
    topcoatColor: editWall?.topcoatColor || '',
    topcoatHex: editWall?.topcoatHex || '#F5F1E8',
    constructionDate: editWall?.constructionDate || new Date().toISOString().split('T')[0],
    contractor: editWall?.contractor || '',
    notes: editWall?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editWall) {
      updateWall(editWall.id, form);
    } else {
      addWall(form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-teal-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-cardHover max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200/60">
          <h3 className="font-serif text-xl font-semibold text-teal-700">
            {editWall ? '编辑墙面档案' : '新增墙面档案'}
          </h3>
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
              <label className="label">所属房间</label>
              <select
                className="input-field"
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}（{r.floor}）
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">墙面名称</label>
              <input
                type="text"
                className="input-field"
                placeholder="如：电视背景墙"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">墙面材质</label>
            <div className="grid grid-cols-5 gap-2">
              {MATERIAL_LIST.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm({ ...form, material: m })}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    form.material === m
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'bg-cream-50 text-teal-600 hover:bg-cream-100 border border-cream-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-cream-200/60 pt-5">
            <p className="font-medium text-teal-700 mb-4">底漆信息</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">底漆品牌</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="如：立邦"
                  value={form.primerBrand}
                  onChange={(e) => setForm({ ...form, primerBrand: e.target.value })}
                />
              </div>
              <div>
                <label className="label">底漆色号/名称</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="如：通用抗碱底漆"
                  value={form.primerColor}
                  onChange={(e) => setForm({ ...form, primerColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-cream-200/60 pt-5">
            <p className="font-medium text-teal-700 mb-4">面漆信息</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">面漆品牌</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="如：立邦"
                  value={form.topcoatBrand}
                  onChange={(e) => setForm({ ...form, topcoatBrand: e.target.value })}
                />
              </div>
              <div>
                <label className="label">面漆色号/名称</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="如：NN7830-4 奶咖色"
                  value={form.topcoatColor}
                  onChange={(e) => setForm({ ...form, topcoatColor: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label className="label mb-0">色卡预览</label>
              <input
                type="color"
                className="w-12 h-10 rounded-lg border border-cream-200 cursor-pointer"
                value={form.topcoatHex}
                onChange={(e) => setForm({ ...form, topcoatHex: e.target.value })}
              />
              <span className="text-sm text-teal-500 font-mono">{form.topcoatHex}</span>
            </div>
          </div>

          <div className="border-t border-cream-200/60 pt-5 grid grid-cols-2 gap-4">
            <div>
              <label className="label">施工日期</label>
              <input
                type="date"
                className="input-field"
                value={form.constructionDate}
                onChange={(e) => setForm({ ...form, constructionDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">施工方</label>
              <input
                type="text"
                className="input-field"
                placeholder="如：家和装饰"
                value={form.contractor}
                onChange={(e) => setForm({ ...form, contractor: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">备注</label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              placeholder="特殊说明、注意事项等"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200/60">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editWall ? '保存修改' : '创建档案'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
