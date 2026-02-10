import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, File, Image, Settings } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin', end: true },
    { icon: FileText, label: 'Posts', to: '/admin/posts' },
    { icon: File, label: 'Pages', to: '/admin/pages' },
    { icon: Image, label: 'Media', to: '/admin/media' },
    { icon: Settings, label: 'Settings', to: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg mr-3">W</div>
        <span className="font-bold text-lg tracking-tight">WPVite</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">WPVite v1.0.0</p>
      </div>
    </aside>
  );
}
