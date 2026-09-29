import type { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../ui/EmptyState';
import { clsx } from 'clsx';

const columnLabels: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

const columnColors: Record<TaskStatus, string> = {
  TODO: 'border-t-slate',
  IN_PROGRESS: 'border-t-signal',
  SUBMITTED: 'border-t-sky',
  VERIFIED: 'border-t-moss',
  REJECTED: 'border-t-rust',
};

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  projectId: string;
  isOwner: boolean;
  currentUserId: string;
}

export function TaskColumn({ status, tasks, projectId, isOwner, currentUserId }: TaskColumnProps) {
  return (
    <div className={clsx('flex flex-col gap-3 min-w-[240px] flex-1 bg-[#f5f3ef] rounded border-t-2 p-3', columnColors[status])}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-slate uppercase tracking-wide">{columnLabels[status]}</h3>
        <span className="text-xs text-slate bg-line rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks"
          description=""
          className="py-4 px-0"
        />
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            projectId={projectId}
            isOwner={isOwner}
            currentUserId={currentUserId}
          />
        ))
      )}
    </div>
  );
}
