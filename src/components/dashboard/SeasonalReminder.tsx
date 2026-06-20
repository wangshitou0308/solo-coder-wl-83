import { getCurrentSeason, getSeasonalTips } from '@/utils/dateUtils';
import { CloudSun, Sun, Cloud, Snowflake, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

const seasonIcons = {
  春: CloudSun,
  夏: Sun,
  秋: Cloud,
  冬: Snowflake,
};

const seasonColors = {
  春: 'from-sage-500 to-teal-500',
  夏: 'from-sand-500 to-terracotta-500',
  秋: 'from-terracotta-500 to-sand-500',
  冬: 'from-teal-400 to-teal-600',
};

export default function SeasonalReminder() {
  const season = getCurrentSeason();
  const tips = getSeasonalTips(season);
  const Icon = seasonIcons[season];
  const [checked, setChecked] = useState<number[]>([]);

  const toggleCheck = (i: number) => {
    setChecked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  return (
    <div className="card p-0 overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className={`bg-gradient-to-r ${seasonColors[season]} p-5 text-white`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Icon size={24} />
          </div>
          <div>
            <p className="text-white/80 text-sm">当前季节</p>
            <h3 className="font-serif text-2xl font-bold">{season}季墙面养护</h3>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-teal-500 mb-4">完成以下检查清单，预防墙面问题：</p>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors text-left group"
            >
              <div className="mt-0.5">
                {checked.includes(i) ? (
                  <CheckCircle2 size={20} className="text-sage-500" />
                ) : (
                  <Circle
                    size={20}
                    className="text-teal-300 group-hover:text-teal-500 transition-colors"
                  />
                )}
              </div>
              <span
                className={`text-sm ${
                  checked.includes(i)
                    ? 'text-teal-400 line-through'
                    : 'text-teal-700'
                }`}
              >
                {tip}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-cream-200/60">
          <div className="flex items-center justify-between text-sm">
            <span className="text-teal-500">完成进度</span>
            <span className="font-bold text-teal-700">
              {checked.length} / {tips.length}
            </span>
          </div>
          <div className="mt-2 h-2 bg-cream-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${seasonColors[season]} transition-all duration-500`}
              style={{ width: `${(checked.length / tips.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
