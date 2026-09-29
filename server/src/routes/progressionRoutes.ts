import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Membership } from '../models/Membership';
import { Project } from '../models/Project';
import { User } from '../models/User';

const router = Router();

router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const nextLevelXp = user.level * 500;

    // Dynamically calculate actual project counts from memberships & projects
    const activeMemberships = await Membership.find({ userId: user._id, status: 'ACTIVE' });
    const activeProjectIds = activeMemberships.map((m) => m.projectId);
    const activeProjectCount = await Project.countDocuments({
      _id: { $in: activeProjectIds },
      status: { $ne: 'COMPLETED' },
    });

    const ownedProjectCount = await Project.countDocuments({ ownerId: user._id });

    const userMemberships = await Membership.find({ userId: user._id });
    const userProjectIds = userMemberships.map((m) => m.projectId);
    const completedProjectCount = await Project.countDocuments({
      _id: { $in: userProjectIds },
      status: 'COMPLETED',
    });

    // Update user document if desynchronized
    if (
      user.activeProjectCount !== activeProjectCount ||
      user.ownedProjectCount !== ownedProjectCount ||
      user.completedProjectCount !== completedProjectCount
    ) {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            activeProjectCount,
            ownedProjectCount,
            completedProjectCount,
          },
        }
      );
    }

    return res.json({
      success: true,
      data: {
        level: user.level,
        xp: user.xp,
        nextLevelXp,
        unlockedCapabilities: user.unlockedCapabilities,
        projectCreationCredits: user.projectCreationCredits,
        activeProjectCount,
        ownedProjectCount,
        completedProjectCount,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
