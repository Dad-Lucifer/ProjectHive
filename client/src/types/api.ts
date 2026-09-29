export type ApiSuccess<T> = { success: true; data: T; message?: string };
export type ApiError = {
  success: false;
  error: { code: ErrorCode; message: string };
};

export type ErrorCode =
  | 'AUTH_REQUIRED'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'STUDENT_NOT_FOUND'
  | 'PROJECT_NOT_FOUND'
  | 'PROJECT_CREATION_LOCKED'
  | 'NO_PROJECT_CREATION_CREDIT'
  | 'ACTIVE_PROJECT_LIMIT_REACHED'
  | 'OWNER_CONTRIBUTION_REQUIRED'
  | 'DUPLICATE_JOIN_REQUEST'
  | 'ALREADY_PROJECT_MEMBER'
  | 'JOIN_REQUEST_NOT_PENDING'
  | 'NOT_PROJECT_OWNER'
  | 'PROJECT_NOT_ACCEPTING_MEMBERS'
  | 'TASK_NOT_ASSIGNED'
  | 'TASK_ALREADY_VERIFIED'
  | 'XP_ALREADY_GRANTED'
  | 'LEVEL_UNLOCK_ALREADY_GRANTED'
  | 'SELF_REVIEW_NOT_ALLOWED'
  | 'REVIEW_NOT_ALLOWED'
  | 'USER_SUSPENDED';

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiErrorPayload = { code: ErrorCode; message: string };
