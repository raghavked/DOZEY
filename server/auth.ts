import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from './supabase';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  userId: string;
  userEmail: string;
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
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

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}
