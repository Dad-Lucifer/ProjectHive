import { Badge } from '../ui/Badge';
import type { ProjectStatus } from '../../types/project';

const statusConfig: Record<ProjectStatus, { label: string; variant: 'sky' | 'signal' | 'moss' | 'slate' }> = {
  OPEN: { label: 'Open', variant: 'sky' },
  IN_PROGRESS: { label: 'In Progress', variant: 'signal' },
  COMPLETED: { label: 'Completed', variant: 'moss' },
  CANCELLED: { label: 'Cancelled', variant: 'slate' },
  ARCHIVED: { label: 'Archived', variant: 'slate' },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
