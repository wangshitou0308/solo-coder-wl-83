import { useStore } from '@/store/useStore';
import { ISSUE_LIST, ISSUE_COLORS } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function IssueDistribution() {
  const { repairs } = useStore();

  const data = ISSUE_LIST.map((issue) => ({
    name: issue,
    value: repairs.filter((r) => r.issueType === issue).length,
    color: ISSUE_COLORS[issue],
  })).filter((d) => d.value > 0);

  return (
    <div className="card p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">问题类型分布</h3>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-teal-400 text-sm">
          暂无修补记录
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #EDE5D4',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(45, 74, 78, 0.08)',
                    fontSize: '13px',
                  }}
                  formatter={(value: number, name: string) => [`${value}次`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-sm text-teal-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {data.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-2 bg-cream-50 rounded-lg px-3 py-2"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                ></span>
                <span className="text-xs text-teal-600 font-medium">
                  {d.name}
                </span>
                <span className="ml-auto text-sm font-bold text-teal-700">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
