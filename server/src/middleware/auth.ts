import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_REQUIRED', message: 'Authentication token is missing' },
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'projecthive_secret_key_2026_super_secure';
    const decoded = jwt.verify(token, secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'User not found' },
      });
    }

    if (user.suspended) {
      return res.status(403).json({
        success: false,
        error: { code: 'USER_SUSPENDED', message: 'Your account has been suspended' },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_REQUIRED', message: 'Invalid or expired token' },
    });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: { code: 'AUTH_REQUIRED', message: 'Admin access required' },
    });
  }
  next();
}
