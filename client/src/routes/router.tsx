import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { AppShell } from '../components/layout/AppShell';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminShell } from '../components/layout/AdminShell';

import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ArchitectureGuidePage } from '../pages/public/ArchitectureGuidePage';
import { DashboardPage } from '../pages/DashboardPage';
import { DiscoverProjectsPage } from '../pages/DiscoverProjectsPage';
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage';
import { MyProjectsPage } from '../pages/MyProjectsPage';
import { ProjectWorkspacePage } from '../pages/ProjectWorkspacePage';
import { ProfilePage } from '../pages/ProfilePage';
import { PublicProfilePage } from '../pages/PublicProfilePage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { CreateProjectPage } from '../pages/CreateProjectPage';
import { OwnerRequestsPage } from '../pages/OwnerRequestsPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminProjectsPage } from '../pages/admin/AdminProjectsPage';

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/architecture', element: <ArchitectureGuidePage /> },
    ],
  },
  // Admin routes
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/projects', element: <AdminProjectsPage /> },
        ],
      },
    ],
  },
  // Protected student routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/explore', element: <DiscoverProjectsPage /> },
          { path: '/projects/new', element: <CreateProjectPage /> },
          { path: '/projects/:id', element: <ProjectDetailsPage /> },
          { path: '/projects/:id/workspace', element: <ProjectWorkspacePage /> },
          { path: '/my-projects', element: <MyProjectsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/students/:id', element: <PublicProfilePage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/requests', element: <OwnerRequestsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
