import { Modal } from './Modal';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  requireReason?: boolean;
  reasonLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  requireReason = false,
  reasonLabel = 'Reason (optional)',
  loading = false,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate">{description}</p>
        {requireReason && (
          <Textarea
            label={reasonLabel}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Add a note…"
          />
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button
            variant={variant}
            onClick={() => { onConfirm(reason || undefined); setReason(''); }}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
