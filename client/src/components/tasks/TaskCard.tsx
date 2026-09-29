import { useState } from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, Clock, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Badge } from '../ui/Badge';
import { useSubmitTask, useVerifyTask, useRejectTask, useUpdateTask } from '../../hooks/useTasks';
import { formatDate } from '../../lib/formatters';
import { toast } from '../../hooks/useToast';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';
import type { Task } from '../../types/task';

const priorityVariant: Record<string, 'sky' | 'signal' | 'rust' | 'slate'> = {
  LOW: 'slate', MEDIUM: 'sky', HIGH: 'signal', CRITICAL: 'rust',
};

interface TaskCardProps {
  task: Task;
  projectId: string;
  isOwner: boolean;
  currentUserId: string;
}

export function TaskCard({ task, projectId, isOwner, currentUserId }: TaskCardProps) {
  const [showVerify, setShowVerify] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const submitMutation = useSubmitTask(projectId);
  const verifyMutation = useVerifyTask(projectId);
  const rejectMutation = useRejectTask(projectId);
  const updateMutation = useUpdateTask(projectId);

  const isUnassigned = !task.assignedTo;
  const isAssignedToMe = task.assignedTo === currentUserId;
  const isRejected = task.verificationComment && task.status === 'IN_PROGRESS';

  const handleClaim = async () => {
    try {
      await updateMutation.mutateAsync({
        id: task._id,
        data: { assignedTo: currentUserId, status: 'IN_PROGRESS' },
      });
      toast('success', 'Task claimed! It is now in progress.');
    } catch (err) {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    }
  };

  const handleStart = async () => {
    try {
      await updateMutation.mutateAsync({
        id: task._id,
        data: { status: 'IN_PROGRESS' },
      });
      toast('success', 'Task started!');
    } catch (err) {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    }
  };

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync(task._id);
      toast('success', 'Task submitted for review');
    } catch (err) {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    }
  };

  const handleVerify = async (comment?: string) => {
    try {
      await verifyMutation.mutateAsync({ id: task._id, comment });
      setShowVerify(false);
      toast('success', 'Task verified! XP awarded.');
    } catch (err) {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    }
  };

  const handleReject = async (comment?: string) => {
    try {
      await rejectMutation.mutateAsync({ id: task._id, comment: comment || 'Needs revision' });
      setShowReject(false);
      toast('info', 'Task sent back for revision');
    } catch (err) {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    }
  };

  return (
    <div className={clsx(
      'border border-line rounded p-3 bg-paper flex flex-col gap-2',
      isRejected && 'border-signal/30 bg-[#faf0e4]/30'
    )}>
      {/* Rejection feedback */}
      {isRejected && (
        <div className="flex items-center gap-1.5 text-xs text-signal">
          <AlertTriangle size={12} />
          <span>Feedback: {task.verificationComment}</span>
        </div>
      )}

      {/* Title & Priority */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink leading-snug">{task.title}</p>
        <Badge variant={priorityVariant[task.priority] || 'slate'} size="sm">{task.priority}</Badge>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 text-xs text-slate flex-wrap">
        <span className="text-signal font-medium">+{task.xpReward} XP</span>
        <span>{task.difficulty}</span>
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Clock size={10} /> {formatDate(task.dueDate)}
          </span>
        )}
        {isAssignedToMe && (
          <span className="flex items-center gap-1 text-sky font-medium">
            <User size={10} /> You
          </span>
        )}
        {task.assignedTo && !isAssignedToMe && (
          <span className="flex items-center gap-1 text-slate">
            <User size={10} /> Assigned
          </span>
        )}
      </div>

      {/* Expanded description */}
      {expanded && task.description && (
        <p className="text-xs text-slate">{task.description}</p>
      )}

      {/* Actions row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate hover:text-ink cursor-pointer flex items-center gap-0.5"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Less' : 'Details'}
        </button>

        <div className="flex gap-1">
          {/* TODO → IN_PROGRESS: Claim (unassigned) or Start (assigned to me) */}
          {task.status === 'TODO' && isUnassigned && (
            <Button size="sm" variant="secondary" onClick={handleClaim} loading={updateMutation.isPending}>
              Claim
            </Button>
          )}
          {task.status === 'TODO' && isAssignedToMe && (
            <Button size="sm" variant="secondary" onClick={handleStart} loading={updateMutation.isPending}>
              Start
            </Button>
          )}
          {/* IN_PROGRESS → SUBMITTED */}
          {task.status === 'IN_PROGRESS' && isAssignedToMe && (
            <Button size="sm" variant="secondary" onClick={handleSubmit} loading={submitMutation.isPending}>
              Submit
            </Button>
          )}
          {/* SUBMITTED → VERIFIED / REJECTED (owner only) */}
          {task.status === 'SUBMITTED' && isOwner && (
            <>
              <Button size="sm" variant="primary" onClick={() => setShowVerify(true)}>Verify</Button>
              <Button size="sm" variant="danger" onClick={() => setShowReject(true)}>Reject</Button>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showVerify}
        onClose={() => setShowVerify(false)}
        onConfirm={handleVerify}
        title="Verify Task"
        description="Mark this task as verified. XP will be awarded to the assignee."
        confirmLabel="Verify & Award XP"
        variant="primary"
        requireReason
        reasonLabel="Verification comment (optional)"
        loading={verifyMutation.isPending}
      />
      <ConfirmDialog
        open={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        title="Reject Task"
        description="Send this task back to the contributor with feedback."
        confirmLabel="Reject"
        variant="danger"
        requireReason
        reasonLabel="Feedback (required)"
        loading={rejectMutation.isPending}
      />
    </div>
  );
}
