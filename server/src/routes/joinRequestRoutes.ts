import { Router } from 'express';
import { JoinRequest } from '../models/JoinRequest';
import { Membership } from '../models/Membership';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/my', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const requests = await JoinRequest.find({ applicantId: req.user!._id }).populate('projectId');
    return res.json({ success: true, data: requests });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/:id/accept', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: { code: 'JOIN_REQUEST_NOT_PENDING', message: 'Request not found.' } });

    request.status = 'ACCEPTED';
    request.reviewedBy = req.user!._id;
    request.reviewedAt = new Date();
    await request.save();

    await Membership.create({
      projectId: request.projectId,
      userId: request.applicantId,
      role: 'CONTRIBUTOR',
      requestedRole: request.requestedRole,
      status: 'ACTIVE',
    });

    await Project.updateOne({ _id: request.projectId }, { $inc: { memberCount: 1 } });
    await User.updateOne({ _id: request.applicantId }, { $inc: { activeProjectCount: 1 } });

    return res.json({ success: true, data: request });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/:id/reject', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: { code: 'JOIN_REQUEST_NOT_PENDING', message: 'Request not found.' } });

    request.status = 'REJECTED';
    request.reviewedBy = req.user!._id;
    request.reviewedAt = new Date();
    request.rejectionReason = req.body.reason || '';
    await request.save();

    return res.json({ success: true, data: request });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/:id/withdraw', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: { code: 'JOIN_REQUEST_NOT_PENDING', message: 'Request not found.' } });

    request.status = 'WITHDRAWN';
    await request.save();

    return res.json({ success: true, data: request });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
