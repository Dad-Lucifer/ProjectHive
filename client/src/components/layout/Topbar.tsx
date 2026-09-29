import { useLocation } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

const pageLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/explore': 'Explore Projects',
  '/my-projects': 'My Projects',
  '/profile': 'Profile',
  '/notifications': 'Notifications',
  '/requests': 'Project Requests',
  '/projects/new': 'Create Project',
  '/admin': 'Admin Dashboard',
  '/admin/users': 'Manage Users',
  '/admin/projects': 'Manage Projects',
};

function getPageTitle(pathname: string): string {
  if (pageLabels[pathname]) return pageLabels[pathname];
  if (pathname.includes('/workspace')) return 'Project Workspace';
  if (pathname.match(/\/projects\/[^/]+$/)) return 'Project Details';
  if (pathname.match(/\/students\/[^/]+$/)) return 'Student Profile';
  return 'ProjectHive';
}

export function Topbar() {
  const location = useLocation();
  const { currentUser } = useAuthStore();
  const title = getPageTitle(location.pathname);

  return (
    <header className="h-14 bg-paper border-b border-line flex items-center px-6 gap-4">
      <h1 className="text-base font-display font-medium text-ink flex-1 truncate">{title}</h1>
      <div className="flex items-center gap-3">
        <NotificationBell />
        {currentUser && (
          <Link to="/profile" className="flex-shrink-0">
            <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="sm" />
          </Link>
        )}
      </div>
    </header>
  );
}
