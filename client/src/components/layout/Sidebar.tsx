import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Compass, FolderKanban, User,
  Bell, LogOut, ChevronLeft, ChevronRight, Inbox
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/explore', label: 'Explore Projects', icon: Compass },
  { path: '/my-projects', label: 'My Projects', icon: FolderKanban },
  { path: '/requests', label: 'Project Requests', icon: Inbox, ownerOnly: true },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { currentUser } = useAuthStore();
  const logout = useLogout();
  const { data: notificationsData } = useNotifications({ limit: 50 });

  const unreadCount = notificationsData?.items.filter((n) => !n.readAt).length ?? 0;
  const isOwner = currentUser?.unlockedCapabilities?.includes('PROJECT_OWNER');

  const visibleItems = navItems.filter((item) => !item.ownerOnly || isOwner);

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-ink flex flex-col z-40 transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center h-14 border-b border-white/10 flex-shrink-0', collapsed ? 'justify-center px-0' : 'px-6 gap-2')}>
        {!collapsed && (
          <span className="font-display text-lg text-paper font-semibold tracking-tight">ProjectHive</span>
        )}
        {collapsed && <span className="font-display text-lg text-signal font-bold">P</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const badge = item.path === '/notifications' ? unreadCount : 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded text-sm transition-colors group',
                isActive
                  ? 'bg-sky/20 text-sky'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <span className="relative flex-shrink-0">
                <Icon size={18} />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rust text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className={clsx('border-t border-white/10 py-3 flex-shrink-0', collapsed ? 'px-3' : 'px-4')}>
        {currentUser && (
          <div className={clsx('flex items-center gap-3 mb-2', collapsed && 'justify-center')}>
            <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-paper font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-white/40 truncate">Level {currentUser.level}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={logout}
          title="Log out"
          className={clsx(
            'flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors py-1 rounded w-full cursor-pointer',
            collapsed ? 'justify-center' : 'px-1'
          )}
        >
          <LogOut size={16} />
          {!collapsed && 'Log out'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 bg-ink border border-white/10 rounded-full w-6 h-6 flex items-center justify-center text-white/60 hover:text-white cursor-pointer z-50"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
