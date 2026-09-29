export const ERROR_COPY: Record<string, string> = {
  AUTH_REQUIRED: 'Please log in to continue.',
  INVALID_CREDENTIALS: 'That email or password is incorrect.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  STUDENT_NOT_FOUND: "We couldn't find that student.",
  PROJECT_NOT_FOUND: 'This project no longer exists.',
  PROJECT_CREATION_LOCKED: 'You need to reach Level 5 to create a project.',
  NO_PROJECT_CREATION_CREDIT: "You don't have a project creation credit right now.",
  ACTIVE_PROJECT_LIMIT_REACHED: 'You can participate in a maximum of 3 active projects.',
  OWNER_CONTRIBUTION_REQUIRED: 'You must actively contribute to another project before creating a new one.',
  DUPLICATE_JOIN_REQUEST: 'You already have a pending request for this project.',
  ALREADY_PROJECT_MEMBER: "You're already a member of this project.",
  JOIN_REQUEST_NOT_PENDING: 'This request has already been handled.',
  NOT_PROJECT_OWNER: 'Only the project owner can do that.',
  PROJECT_NOT_ACCEPTING_MEMBERS: "This project isn't accepting new members right now.",
  TASK_NOT_ASSIGNED: "This task isn't assigned to you.",
  TASK_ALREADY_VERIFIED: 'This task has already been verified.',
  XP_ALREADY_GRANTED: 'XP for this action was already granted.',
  LEVEL_UNLOCK_ALREADY_GRANTED: 'This unlock has already been applied.',
  SELF_REVIEW_NOT_ALLOWED: "You can't review yourself.",
  REVIEW_NOT_ALLOWED: "You're not eligible to leave this review.",
  USER_SUSPENDED: 'This account has been suspended.',
};

export function getErrorMessage(code: string, fallback?: string): string {
  return ERROR_COPY[code] ?? fallback ?? 'An unexpected error occurred.';
}
