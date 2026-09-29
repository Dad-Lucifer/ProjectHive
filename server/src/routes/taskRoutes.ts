import { Router } from 'express';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { XpEvent } from '../models/XpEvent';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: { code: 'TASK_NOT_ASSIGNED', message: 'Task not found.' } });

    Object.assign(task, req.body);
    await task.save();

    return res.json({ success: true, data: task });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: { code: 'TASK_NOT_ASSIGNED', message: 'Task not found.' } });

    task.status = 'SUBMITTED';
    task.submittedAt = new Date();
    await task.save();

    return res.json({ success: true, data: task });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/:id/verify', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: { code: 'TASK_NOT_ASSIGNED', message: 'Task not found.' } });
    if (task.status === 'VERIFIED') {
      return res.status(400).json({ success: false, error: { code: 'TASK_ALREADY_VERIFIED', message: 'Task already verified.' } });
    }

    task.status = 'VERIFIED';
    task.verifiedAt = new Date();
    task.verifiedBy = req.user!._id;
    task.verificationComment = req.body.comment || '';
    await task.save();

    if (task.assignedTo) {
      const assignee = await User.findById(task.assignedTo);
      if (assignee) {
        assignee.xp += task.xpReward;
        const newLevel = Math.floor(assignee.xp / 500) + 1;
        if (newLevel > assignee.level) {
          assignee.level = newLevel;
          if (newLevel === 5 || (newLevel > 5 && (newLevel - 5) % 10 === 0)) {
            assignee.projectCreationCredits += 1;
            if (!assignee.unlockedCapabilities.includes('PROJECT_OWNER')) {
              assignee.unlockedCapabilities.push('PROJECT_OWNER');
            }
          }
        }
        await assignee.save();

        await XpEvent.create({
          userId: assignee._id,
          amount: task.xpReward,
          reason: `Task completed: ${task.title}`,
          taskId: task._id,
          projectId: task.projectId,
        });
      }
    }

    return res.json({ success: true, data: task });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/:id/reject', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: { code: 'TASK_NOT_ASSIGNED', message: 'Task not found.' } });

    task.status = 'REJECTED';
    task.verificationComment = req.body.comment || '';
    await task.save();

    return res.json({ success: true, data: task });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
