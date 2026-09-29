import { Router } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Membership } from '../models/Membership';
import { XpEvent } from '../models/XpEvent';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// PUT /api/students/me
router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, bio, college, department, academicYear, interests, skills, availability, avatarUrl } = req.body;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'Student not found.' },
      });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (college !== undefined) user.college = college;
    if (department !== undefined) user.department = department;
    if (academicYear !== undefined) user.academicYear = academicYear;
    if (interests !== undefined) user.interests = interests;
    if (skills !== undefined) user.skills = skills;
    if (availability !== undefined) user.availability = availability;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'UNKNOWN', message: err.message },
    });
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'Student not found.' },
      });
    }
    return res.json({ success: true, data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/students/:id/contributions
router.get('/:id/contributions', async (req, res) => {
  try {
    const memberships = await Membership.find({ userId: req.params.id }).populate('projectId');
    return res.json({ success: true, data: memberships });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/students/:id/projects
router.get('/:id/projects', async (req, res) => {
  try {
    const memberships = await Membership.find({ userId: req.params.id, status: 'ACTIVE' });
    const projectIds = memberships.map((m) => m.projectId);
    const projects = await Project.find({ _id: { $in: projectIds } });
    return res.json({ success: true, data: projects });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/students/:id/recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'OPEN' }).limit(10);
    return res.json({ success: true, data: projects });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/students/:id/xp-history
router.get('/:id/xp-history', async (req, res) => {
  try {
    const events = await XpEvent.find({ userId: req.params.id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: events });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
