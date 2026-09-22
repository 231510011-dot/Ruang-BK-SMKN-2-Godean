import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { User } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'bk_smkn2_godean_jwt_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.getUserById(payload.id);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Invalid or expired token
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' });
  }
  next();
}

export function requireGuruBK(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' });
  }
  if (req.user.role !== 'guru_bk') {
    return res.status(403).json({ error: 'Akses ditolak. Fitur ini hanya dapat diakses oleh Guru BK / Administrator.' });
  }
  next();
}
