import { Router } from 'express';
import { Notification } from '../models/Notification';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const total = await Notification.countDocuments({ userId: req.user!._id });
    const notifications = await Notification.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      data: {
        items: notifications,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/:id/read', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await Notification.updateOne({ _id: req.params.id, userId: req.user!._id }, { readAt: new Date() });
    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/read-all', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await Notification.updateMany({ userId: req.user!._id, readAt: null }, { readAt: new Date() });
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
