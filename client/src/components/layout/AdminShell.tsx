import { Outlet, Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutDashboard, Users, FolderKanban, LogOut } from 'lucide-react';
import { useLogout } from '../../hooks/useAuth';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
];

export function AdminShell() {
  const location = useLocation();
  const logout = useLogout();

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="w-56 bg-ink fixed left-0 top-0 h-screen flex flex-col z-40">
        <div className="px-6 h-14 flex items-center border-b border-white/10">
          <span className="font-display text-lg text-paper font-semibold">Admin Panel</span>
        </div>
        <nav className="flex-1 py-4">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded text-sm transition-colors',
                  isActive ? 'bg-sky/20 text-sky' : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors cursor-pointer"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
      <div className="ml-56 flex-1 flex flex-col">
        <header className="h-14 bg-paper border-b border-line flex items-center px-6">
          <h1 className="text-base font-display font-medium text-ink">ProjectHive — Admin</h1>
        </header>
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
