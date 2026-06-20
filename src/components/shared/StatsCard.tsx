import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendColor?: string;
  subtitle?: string;
  delay?: number;
  extra?: ReactNode;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendColor = 'text-sage-500',
  subtitle,
  delay = 0,
  extra,
}: StatsCardProps) {
  return (
    <div
      className="card p-5 card-hover opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-teal-500 font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-teal-700">
              {value}
            </span>
            {trend && (
              <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-teal-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  );
}
