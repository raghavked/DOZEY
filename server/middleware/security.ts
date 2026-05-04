import { Request, Response, NextFunction } from 'express';

export interface SecurityContext {
  userId: string;
  userRole: string;
  ipAddress: string;
  timestamp: Date;
  requestId: string;
}

export function extractSecurityContext(request: Request): SecurityContext {
  return {
    userId: (request.headers['x-user-id'] as string) || 'anonymous',
    userRole: (request.headers['x-user-role'] as string) || 'user',
    ipAddress:
      (request.headers['x-forwarded-for'] as string) ||
      request.socket?.remoteAddress ||
      'unknown',
    timestamp: new Date(),
    requestId: crypto.randomUUID(),
  };
}

export function securityMiddleware(
  request: Request,
  _res: Response,
  next: NextFunction
): void {
  const context = extractSecurityContext(request);
  // Attach security context to request for downstream use
  (request as any).securityContext = context;
  request.headers['x-security-context'] = JSON.stringify(context);
  next();
}

// In-memory rate limiting store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket?.remoteAddress ||
      'unknown';
    const now = Date.now();

    const entry = rateLimitMap.get(key);
    if (entry && now < entry.resetTime) {
      if (entry.count >= maxRequests) {
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
      }
      entry.count++;
    } else {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    }

    next();
  };
}
