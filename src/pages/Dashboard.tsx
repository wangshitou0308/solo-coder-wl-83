import { useStore } from '@/store/useStore';
import StatsCard from '@/components/shared/StatsCard';
import IssueDistribution from '@/components/dashboard/IssueDistribution';
import RoomStatusList from '@/components/dashboard/RoomStatusList';
import SeasonalReminder from '@/components/dashboard/SeasonalReminder';
import { LayoutGrid, ClipboardList, PaintBucket, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { walls, repairs, inventory, getRecurringIssues } = useStore();

  const recurringCount = getRecurringIssues().length;
  const thisMonthRepairs = repairs.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8 opacity-0 animate-fade-in-up">
        <h1 className="font-serif text-3xl font-bold text-teal-700">墙面健康概览</h1>
        <p className="text-teal-500 mt-2">
          追踪每一面墙的状态，守护您的家居品质
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="墙面总数"
          value={walls.length}
          icon={LayoutGrid}
          iconBg="bg-teal-100"
          iconColor="text-teal-600"
          subtitle={`覆盖 ${useStore.getState().rooms.length} 个房间`}
          delay={100}
          extra={
            <Link
              to="/walls"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              管理墙面档案 →
            </Link>
          }
        />
        <StatsCard
          title="本月修补"
          value={thisMonthRepairs}
          icon={ClipboardList}
          iconBg="bg-sand-100"
          iconColor="text-sand-500"
          subtitle={`累计修补 ${repairs.length} 次`}
          delay={150}
          extra={
            <Link
              to="/repairs"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              查看历史记录 →
            </Link>
          }
        />
        <StatsCard
          title="反复问题"
          value={recurringCount}
          icon={RefreshCcw}
          iconBg="bg-terracotta-100"
          iconColor="text-terracotta-600"
          trend={recurringCount > 0 ? '需关注' : undefined}
          trendColor="text-terracotta-600"
          subtitle="同一位置多次出现"
          delay={200}
        />
        <StatsCard
          title="油漆库存"
          value={inventory.length}
          icon={PaintBucket}
          iconBg="bg-sage-100"
          iconColor="text-sage-500"
          subtitle="剩余涂料储备"
          delay={250}
          extra={
            <Link
              to="/inventory"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              管理库存 →
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RoomStatusList />
          <IssueDistribution />
        </div>
        <div>
          <SeasonalReminder />
        </div>
      </div>
    </div>
  );
}
