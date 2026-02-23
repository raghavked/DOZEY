import type { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from './supabase';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { auditLog } from './index';

export interface AuthRequest extends Request {
  userId: string;
  userEmail: string;
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    auditLog(req, "AUTH_FAILED_NO_TOKEN");
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      auditLog(req, "AUTH_FAILED_INVALID_TOKEN");
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    (req as AuthRequest).userId = user.id;
    (req as AuthRequest).userEmail = user.email || '';

    const [existingUser] = await db.select().from(users).where(eq(users.id, user.id));
    if (!existingUser) {
      await db.insert(users).values({
        id: user.id,
        email: user.email || '',
        emailVerified: !!user.email_confirmed_at,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    auditLog(req, "PHI_ACCESS");
    next();
  } catch (err) {
    console.error('Auth error:', err);
    auditLog(req, "AUTH_ERROR");
    return res.status(401).json({ message: 'Authentication failed' });
  }
}
