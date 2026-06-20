import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, LayoutGrid, ClipboardList, PaintBucket } from 'lucide-react';

const navItems = [
  { path: '/', label: '数据看板', icon: LayoutDashboard },
  { path: '/walls', label: '墙面档案', icon: LayoutGrid },
  { path: '/repairs', label: '修补历史', icon: ClipboardList },
  { path: '/inventory', label: '油漆库存', icon: PaintBucket },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-60 min-h-screen bg-gradient-to-b from-teal-700 to-teal-600 flex flex-col">
      <div className="p-6 border-b border-teal-500/30">
        <h1 className="font-serif text-2xl font-bold text-cream-50 tracking-wide">
          墙面管家
        </h1>
        <p className="text-teal-100/70 text-sm mt-1">全屋墙面状态追踪</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-cream-100 text-teal-700 shadow-md'
                  : 'text-cream-100/80 hover:bg-teal-500/40 hover:text-cream-50'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-teal-500/30">
        <div className="bg-teal-500/20 rounded-xl2 p-4 text-cream-100/80 text-xs leading-relaxed">
          <p className="font-medium text-cream-50 mb-1">温馨提示</p>
          <p>换季时节注意检查墙面状态，预防开裂和霉变。</p>
        </div>
      </div>
    </aside>
  );
}
