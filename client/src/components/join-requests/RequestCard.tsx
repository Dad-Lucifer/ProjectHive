import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Clock } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MatchScoreBadge } from '../projects/MatchScoreBadge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useAcceptJoinRequest, useRejectJoinRequest } from '../../hooks/useJoinRequests';
import { formatRelative } from '../../lib/formatters';
import { toast } from '../../hooks/useToast';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';
import type { JoinRequest } from '../../types/joinRequest';

interface RequestCardProps {
  request: JoinRequest;
  projectId: string;
}

export function RequestCard({ request, projectId }: RequestCardProps) {
  const [showReject, setShowReject] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const acceptMutation = useAcceptJoinRequest(projectId);
  const rejectMutation = useRejectJoinRequest(projectId);

  const applicant = request.applicant;
  const pct = request.matchSnapshot ? Math.round(request.matchSnapshot.overallScore * 100) : null;

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(request._id);
      toast('success', 'Request accepted');
    } catch (err) {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    }
  };

  const handleReject = async (reason?: string) => {
    try {
      await rejectMutation.mutateAsync({ id: request._id, reason });
      setShowReject(false);
      toast('success', 'Request rejected');
    } catch (err) {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    }
  };

  return (
    <div className="border border-line rounded p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {applicant ? (
            <Avatar name={applicant.name} avatarUrl={applicant.avatarUrl} size="md" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-line" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/students/${request.applicantId}`}
                className="text-sm font-medium text-ink hover:text-sky transition-colors"
              >
                {applicant?.name ?? 'Applicant'}
              </Link>
              {applicant && (
                <Badge variant="signal" size="sm">Lvl {applicant.level}</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate mt-0.5">
              {applicant && (
                <>
                  <span className="flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {applicant.reputation.averageRating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={10} /> {applicant.completedProjectCount} projects
                  </span>
                </>
              )}
              <span className="flex items-center gap-1">
                <Clock size={10} /> {formatRelative(request.createdAt)}
              </span>
            </div>
          </div>
        </div>
        {pct !== null && request.matchSnapshot && (
          <MatchScoreBadge score={request.matchSnapshot} />
        )}
      </div>

      {request.requestedRole && (
        <p className="text-xs text-slate">Requested role: <span className="font-medium text-ink">{request.requestedRole}</span></p>
      )}

      {request.message && (
        <div>
          <button
            className="text-xs text-sky cursor-pointer hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide message' : 'Show message'}
          </button>
          {expanded && (
            <p className="text-sm text-slate mt-1 p-3 bg-[#f5f3ef] rounded border border-line">
              {request.message}
            </p>
          )}
        </div>
      )}

      {request.status === 'PENDING' && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAccept}
            loading={acceptMutation.isPending}
          >
            Accept
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowReject(true)}
          >
            Reject
          </Button>
          <Link to={`/students/${request.applicantId}`}>
            <Button variant="ghost" size="sm">View Profile</Button>
          </Link>
        </div>
      )}

      <ConfirmDialog
        open={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        title="Reject Request"
        description="Optionally provide a reason for rejection."
        confirmLabel="Reject"
        variant="danger"
        requireReason
        reasonLabel="Rejection reason (optional)"
        loading={rejectMutation.isPending}
      />
    </div>
  );
}
