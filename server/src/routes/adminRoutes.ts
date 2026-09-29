import { Router } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { AuditLog } from '../models/AuditLog';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query: any = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      data: { items: users, page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/users/:id/suspend', async (req: AuthRequest, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, { suspended: true });
    await AuditLog.create({ userId: req.user!._id, action: 'SUSPEND_USER', details: { targetUserId: req.params.id } });
    return res.json({ success: true, message: 'User suspended.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/users/:id/unsuspend', async (req: AuthRequest, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, { suspended: false });
    await AuditLog.create({ userId: req.user!._id, action: 'UNSUSPEND_USER', details: { targetUserId: req.params.id } });
    return res.json({ success: true, message: 'User unsuspended.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const total = await Project.countDocuments();
    const projects = await Project.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      data: { items: projects, page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
