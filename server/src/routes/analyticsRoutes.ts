import { Router } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

const router = Router();

router.get('/overview', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'OPEN' });
    const completedTasks = await Task.countDocuments({ status: 'VERIFIED' });

    return res.json({
      success: true,
      data: {
        totalStudents,
        totalProjects,
        activeProjects,
        completedTasks,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.get('/projects-by-category', async (req, res) => {
  try {
    const data = [
      { category: 'Web Development', count: 12 },
      { category: 'Mobile Apps', count: 8 },
      { category: 'Artificial Intelligence', count: 15 },
      { category: 'Data Science', count: 6 },
    ];
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.get('/popular-skills', async (req, res) => {
  try {
    const data = [
      { name: 'React', count: 24 },
      { name: 'TypeScript', count: 20 },
      { name: 'Python', count: 18 },
      { name: 'Node.js', count: 15 },
    ];
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.get('/contributors', async (req, res) => {
  try {
    const topUsers = await User.find({ role: 'STUDENT' }).sort({ xp: -1 }).limit(5).select('name avatarUrl level xp');
    return res.json({ success: true, data: topUsers });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.get('/project-participation', async (req, res) => {
  try {
    return res.json({ success: true, data: [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.get('/xp-trends', async (req, res) => {
  try {
    const trends = [
      { date: 'Mon', xp: 120 },
      { date: 'Tue', xp: 250 },
      { date: 'Wed', xp: 180 },
      { date: 'Thu', xp: 340 },
      { date: 'Fri', xp: 420 },
    ];
    return res.json({ success: true, data: trends });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
