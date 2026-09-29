import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { useCreateJoinRequest } from '../../hooks/useJoinRequests';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';
import { toast } from '../../hooks/useToast';
import type { Project } from '../../types/project';
import type { User } from '../../types/user';

interface JoinRequestModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  currentUser: User;
}

export function JoinRequestModal({ open, onClose, project, currentUser }: JoinRequestModalProps) {
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const mutation = useCreateJoinRequest(project._id);

  const isBlocked = currentUser.activeProjectCount >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!message.trim() || message.length < 20) {
      setError('Message must be at least 20 characters.');
      return;
    }
    if (message.length > 500) {
      setError('Message must be at most 500 characters.');
      return;
    }

    try {
      await mutation.mutateAsync({ requestedRole: role || undefined, message });
      toast('success', 'Join request sent');
      onClose();
      setMessage('');
      setRole('');
    } catch (err) {
      const { code, message: msg } = extractError(err);
      setError(getErrorMessage(code, msg));
    }
  };

  const pct = project.matchScore ? Math.round(project.matchScore.overallScore * 100) : null;

  return (
    <Modal open={open} onClose={onClose} title="Request to Join" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Context */}
        <div className="p-3 bg-[#f5f3ef] border border-line rounded text-sm text-slate space-y-1">
          <p>Your current active projects: <span className="font-medium text-ink">{currentUser.activeProjectCount} / 3</span></p>
          {pct !== null && <p>Your compatibility: <span className="font-medium text-sky">{pct}%</span></p>}
        </div>

        {isBlocked && (
          <p className="text-sm text-rust">You already participate in 3 active projects.</p>
        )}

        {/* Role */}
        {project.roles.length > 0 && (
          <Select
            id="join-role"
            label="Requested Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="No preference"
            options={project.roles.map((r) => ({ value: r.name, label: r.name }))}
          />
        )}

        {/* Message */}
        <Textarea
          id="join-message"
          label="Why do you want to join?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your motivation and relevant experience…"
          showCount
          maxLength={500}
          rows={4}
          error={error}
        />

        <Button
          type="submit"
          variant="primary"
          loading={mutation.isPending}
          disabled={isBlocked}
        >
          Send Request
        </Button>
      </form>
    </Modal>
  );
}
