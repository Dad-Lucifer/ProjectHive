import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AdminRoute() {
  const { currentUser, token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-paper">
        <div className="w-8 h-8 border-2 border-sky border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  if (!currentUser || currentUser.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
