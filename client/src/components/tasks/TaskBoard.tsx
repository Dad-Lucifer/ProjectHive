import type { Task } from '../../types/task';
import { TaskColumn } from './TaskColumn';
import type { TaskStatus } from '../../types/task';

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'SUBMITTED', 'VERIFIED'];

interface TaskBoardProps {
  tasks: Task[];
  projectId: string;
  isOwner: boolean;
  currentUserId: string;
}

export function TaskBoard({ tasks, projectId, isOwner, currentUserId }: TaskBoardProps) {
  const grouped = COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, status) => {
    // Rejected tasks go back to IN_PROGRESS column for display
    acc[status] = tasks.filter((t) => {
      if (status === 'IN_PROGRESS') return t.status === 'IN_PROGRESS' || t.status === 'REJECTED';
      return t.status === status;
    });
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <TaskColumn
          key={col}
          status={col}
          tasks={grouped[col]}
          projectId={projectId}
          isOwner={isOwner}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
