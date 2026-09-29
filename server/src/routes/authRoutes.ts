import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Name, email, and password are required.' },
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_ALREADY_EXISTS', message: 'An account with this email already exists.' },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'STUDENT',
      level: 1,
      xp: 0,
      projectCreationCredits: 0,
      unlockedCapabilities: ['JOIN_PROJECT'],
    });

    const secret = process.env.JWT_SECRET || 'projecthive_secret_key_2026_super_secure';
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'UNKNOWN', message: err.message || 'Server error during registration.' },
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email and password are required.' },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'That email or password is incorrect.' },
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'That email or password is incorrect.' },
      });
    }

    if (user.suspended) {
      return res.status(403).json({
        success: false,
        error: { code: 'USER_SUSPENDED', message: 'This account has been suspended.' },
      });
    }

    const secret = process.env.JWT_SECRET || 'projecthive_secret_key_2026_super_secure';
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'UNKNOWN', message: err.message || 'Server error during login.' },
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  return res.json({
    success: true,
    data: req.user,
  });
});

export default router;
