import { Router } from 'express';
import { Project } from '../models/Project';
import { Membership } from '../models/Membership';
import { Task } from '../models/Task';
import { JoinRequest } from '../models/JoinRequest';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { search, category, difficulty, status, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { techStack: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.categoryId = category;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const total = await Project.countDocuments(query);
    const items = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.json({
      success: true,
      data: {
        items,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// POST /api/projects
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;

    if (user.level < 5) {
      return res.status(403).json({
        success: false,
        error: { code: 'PROJECT_CREATION_LOCKED', message: 'You must reach Level 5 to create a project.' },
      });
    }

    if (user.projectCreationCredits <= 0) {
      return res.status(403).json({
        success: false,
        error: { code: 'NO_PROJECT_CREATION_CREDIT', message: "You don't have a project creation credit." },
      });
    }

    const { title, description, categoryId, difficulty, techStack, requirements, roles, estimatedDurationWeeks, tags } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    const project = await Project.create({
      title,
      slug,
      description,
      categoryId: categoryId || 'general',
      difficulty: difficulty || 'BEGINNER',
      techStack: techStack || [],
      requirements: requirements || [],
      roles: roles || [],
      ownerId: user._id,
      ownerName: user.name,
      ownerAvatarUrl: user.avatarUrl,
      status: 'OPEN',
      estimatedDurationWeeks: estimatedDurationWeeks || 4,
      tags: tags || [],
      memberCount: 1,
    });

    // Create owner membership
    await Membership.create({
      projectId: project._id,
      userId: user._id,
      role: 'OWNER',
      status: 'ACTIVE',
    });

    // Deduct credit
    user.projectCreationCredits -= 1;
    user.ownedProjectCount += 1;
    user.activeProjectCount += 1;
    await user.save();

    return res.status(201).json({ success: true, data: project });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found.' },
      });
    }
    return res.json({ success: true, data: project });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// PUT /api/projects/:id
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found.' } });
    }
    if (project.ownerId.toString() !== req.user!._id.toString() && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { code: 'NOT_PROJECT_OWNER', message: 'Only owner can edit.' } });
    }

    Object.assign(project, req.body);
    await project.save();

    return res.json({ success: true, data: project });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found.' } });
    }
    if (project.ownerId.toString() !== req.user!._id.toString() && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { code: 'NOT_PROJECT_OWNER', message: 'Only owner can delete.' } });
    }

    const memberships = await Membership.find({ projectId: project._id, status: 'ACTIVE' });
    const memberUserIds = memberships.map((m) => m.userId);
    await Membership.deleteMany({ projectId: project._id });
    await User.updateMany(
      { _id: { $in: memberUserIds } },
      { $inc: { activeProjectCount: -1 } }
    );
    await Project.deleteOne({ _id: req.params.id });
    return res.json({ success: true, message: 'Project deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/projects/:id/members
router.get('/:id/members', async (req, res) => {
  try {
    const memberships = await Membership.find({ projectId: req.params.id }).populate('userId', 'name avatarUrl level xp');
    // Transform: Mongoose replaces userId with the populated user doc.
    // The client expects userId as a plain string ID and the user data under a `user` key.
    const data = memberships.map((m) => {
      const obj = m.toObject() as any;
      const populatedUser = obj.userId;
      obj.userId = populatedUser?._id?.toString() ?? obj.userId?.toString();
      obj.user = populatedUser
        ? { _id: populatedUser._id, name: populatedUser.name, avatarUrl: populatedUser.avatarUrl, level: populatedUser.level, xp: populatedUser.xp }
        : undefined;
      return obj;
    });
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/projects/:id/requests
router.get('/:id/requests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const requests = await JoinRequest.find({ projectId: req.params.id }).populate('applicantId', 'name avatarUrl level xp skills completedProjectCount activeProjectCount reputation');
    // Transform: Mongoose replaces applicantId with the populated user doc.
    // The client expects applicantId as a plain string and the user data under `applicant`.
    const data = requests.map((r) => {
      const obj = r.toObject() as any;
      const populatedApplicant = obj.applicantId;
      obj.applicantId = populatedApplicant?._id?.toString() ?? obj.applicantId?.toString();
      obj.applicant = populatedApplicant ?? undefined;
      return obj;
    });
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/projects/:id/tasks
router.get('/:id/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.id });
    return res.json({ success: true, data: tasks });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// GET /api/projects/:id/analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const projectId = req.params.id;

    const tasks = await Task.find({ projectId });
    const memberships = await Membership.find({ projectId, status: 'ACTIVE' });

    const totalTasks = tasks.length;
    const verifiedTasks = tasks.filter((t) => t.status === 'VERIFIED').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const submittedTasks = tasks.filter((t) => t.status === 'SUBMITTED').length;
    const todoTasks = tasks.filter((t) => t.status === 'TODO').length;

    const completionRate = totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0;

    const totalXpAwarded = tasks
      .filter((t) => t.status === 'VERIFIED')
      .reduce((sum, t) => sum + (t.xpReward || 0), 0);

    // On-time completions: verified tasks completed before dueDate
    const tasksWithDue = tasks.filter((t) => t.status === 'VERIFIED' && t.dueDate && t.verifiedAt);
    const onTime = tasksWithDue.filter((t) => new Date(t.verifiedAt!) <= new Date(t.dueDate!)).length;
    const onTimeRate = tasksWithDue.length > 0 ? Math.round((onTime / tasksWithDue.length) * 100) : 0;

    return res.json({
      success: true,
      data: {
        totalTasks,
        verifiedTasks,
        inProgressTasks,
        submittedTasks,
        todoTasks,
        completionRate,
        totalXpAwarded,
        onTimeRate,
        memberCount: memberships.length,
        taskStatusBreakdown: [
          { status: 'To Do', count: todoTasks },
          { status: 'In Progress', count: inProgressTasks },
          { status: 'Submitted', count: submittedTasks },
          { status: 'Verified', count: verifiedTasks },
        ],
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// POST /api/projects/:id/join-request
router.post('/:id/join-request', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found.' } });
    }

    if (project.status !== 'OPEN') {
      return res.status(400).json({ success: false, error: { code: 'PROJECT_NOT_ACCEPTING_MEMBERS', message: 'Not open.' } });
    }

    const existingMember = await Membership.findOne({ projectId, userId, status: 'ACTIVE' });
    if (existingMember) {
      return res.status(400).json({ success: false, error: { code: 'ALREADY_PROJECT_MEMBER', message: "You're already a member." } });
    }

    const existingRequest = await JoinRequest.findOne({ projectId, applicantId: userId, status: 'PENDING' });
    if (existingRequest) {
      return res.status(400).json({ success: false, error: { code: 'DUPLICATE_JOIN_REQUEST', message: 'Request pending.' } });
    }

    const matchSnapshot = {
      overallScore: 0.85,
      skillScore: 0.80,
      interestScore: 0,
      experienceScore: 0,
      availabilityScore: 0,
      collaborationScore: 0,
      reputationScore: 0,
      workloadScore: 0,
      reasons: ['Skills align well with role requirements'],
      gaps: [],
    };

    const joinRequest = await JoinRequest.create({
      projectId: req.params.id as string,
      applicantId: userId,
      requestedRole: req.body.requestedRole || '',
      message: req.body.message || '',
      matchSnapshot,
      status: 'PENDING',
    });

    return res.status(201).json({ success: true, data: joinRequest });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// POST /api/projects/:id/complete
router.post('/:id/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id as string);
    if (!project) return res.status(404).json({ success: false, error: { code: 'PROJECT_NOT_FOUND', message: 'Not found.' } });
    if (project.ownerId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ success: false, error: { code: 'NOT_PROJECT_OWNER', message: 'Not owner.' } });
    }

    project.status = 'COMPLETED';
    project.completedAt = new Date();
    await project.save();

    const memberships = await Membership.find({ projectId: project._id, status: 'ACTIVE' });
    const memberUserIds = memberships.map((m) => m.userId);
    await Membership.updateMany({ projectId: project._id, status: 'ACTIVE' }, { status: 'COMPLETED' });
    await User.updateMany(
      { _id: { $in: memberUserIds } },
      { $inc: { activeProjectCount: -1, completedProjectCount: 1 } }
    );

    return res.json({ success: true, data: project });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

// POST /api/projects/:id/tasks
router.post('/:id/tasks', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, difficulty, xpReward, assignedTo, priority, dueDate } = req.body;
    const task = await Task.create({
      projectId: req.params.id as string,
      title,
      description,
      difficulty: difficulty || 'BASIC',
      xpReward: xpReward || 50,
      assignedTo: assignedTo || null,
      createdBy: req.user!._id,
      priority: priority || 'MEDIUM',
      status: 'TODO',
      dueDate,
    });
    return res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
