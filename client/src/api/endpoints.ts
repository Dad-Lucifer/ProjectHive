export const EP = {
  // auth
  authRegister: '/auth/register',
  authLogin: '/auth/login',
  authMe: '/auth/me',

  // students
  student: (id: string) => `/students/${id}`,
  studentContributions: (id: string) => `/students/${id}/contributions`,
  studentProjects: (id: string) => `/students/${id}/projects`,
  studentRecommendations: (id: string) => `/students/${id}/recommendations`,
  studentXpHistory: (id: string) => `/students/${id}/xp-history`,
  studentMe: '/students/me',

  // skills & categories
  skills: '/skills',
  categories: '/categories',

  // projects
  projects: '/projects',
  project: (id: string) => `/projects/${id}`,
  projectMembers: (id: string) => `/projects/${id}/members`,
  projectRequests: (id: string) => `/projects/${id}/requests`,
  projectTasks: (id: string) => `/projects/${id}/tasks`,
  projectAnalytics: (id: string) => `/projects/${id}/analytics`,
  projectComplete: (id: string) => `/projects/${id}/complete`,
  projectJoinRequest: (id: string) => `/projects/${id}/join-request`,

  // join requests
  joinRequestsMy: '/join-requests/my',
  joinRequestAccept: (id: string) => `/join-requests/${id}/accept`,
  joinRequestReject: (id: string) => `/join-requests/${id}/reject`,
  joinRequestWithdraw: (id: string) => `/join-requests/${id}/withdraw`,

  // tasks
  task: (id: string) => `/tasks/${id}`,
  taskSubmit: (id: string) => `/tasks/${id}/submit`,
  taskVerify: (id: string) => `/tasks/${id}/verify`,
  taskReject: (id: string) => `/tasks/${id}/reject`,

  // progression
  progressionMe: '/progression/me',

  // reviews
  projectReviews: (id: string) => `/projects/${id}/reviews`,
  review: (id: string) => `/reviews/${id}`,

  // notifications
  notifications: '/notifications',
  notificationRead: (id: string) => `/notifications/${id}/read`,
  notificationsReadAll: '/notifications/read-all',

  // analytics
  analyticsOverview: '/analytics/overview',
  analyticsByCategory: '/analytics/projects-by-category',
  analyticsPopularSkills: '/analytics/popular-skills',
  analyticsContributors: '/analytics/contributors',
  analyticsProjectParticipation: '/analytics/project-participation',
  analyticsXpTrends: '/analytics/xp-trends',

  // admin
  adminUsers: '/admin/users',
  adminUserSuspend: (id: string) => `/admin/users/${id}/suspend`,
  adminUserUnsuspend: (id: string) => `/admin/users/${id}/unsuspend`,
  adminProjects: '/admin/projects',
  adminAuditLogs: '/admin/audit-logs',
} as const;
