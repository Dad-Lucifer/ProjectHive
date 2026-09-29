import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useCreateTask } from '../../hooks/useTasks';
import { toast } from '../../hooks/useToast';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';
import type { ProjectMembership } from '../../types/membership';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  members: ProjectMembership[];
}

export function TaskFormModal({ open, onClose, projectId, members }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [priority, setPriority] = useState('MEDIUM');
  const [xpReward, setXpReward] = useState('100');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const mutation = useCreateTask(projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required.'); return; }

    try {
      await mutation.mutateAsync({
        title, description, difficulty: difficulty as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED',
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        xpReward: Number(xpReward),
        assignedTo: assignedTo || undefined,
        dueDate: dueDate || undefined,
      });
      toast('success', 'Task created');
      onClose();
      setTitle(''); setDescription(''); setAssignedTo(''); setDueDate('');
    } catch (err) {
      const { code, message } = extractError(err);
      setError(getErrorMessage(code, message));
    }
  };

  const memberOptions = members.map((m) => ({
    value: m.userId,
    label: m.user?.name ?? m.userId,
  }));

  return (
    <Modal open={open} onClose={onClose} title="New Task" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input id="task-title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea id="task-desc" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <Select id="task-difficulty" label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            options={[{ value: 'BASIC', label: 'Basic' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' }]}
          />
          <Select id="task-priority" label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}
            options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' }]}
          />
          <Input id="task-xp" label="XP Reward" type="number" min={1} value={xpReward} onChange={(e) => setXpReward(e.target.value)} />
          <Select id="task-assignee" label="Assignee" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Unassigned"
            options={memberOptions}
          />
        </div>
        <Input id="task-due" label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        {error && <p className="text-xs text-rust">{error}</p>}
        <Button type="submit" loading={mutation.isPending}>Create Task</Button>
      </form>
    </Modal>
  );
}
