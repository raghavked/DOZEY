import { Request, Response } from 'express';
import { auditLogger } from '../lib/audit-logger';
import InputValidator from '../lib/input-validator';
import { handleError } from '../lib/error-handler';

export async function secureOperationHandler(req: Request, res: Response) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = (req.headers['x-user-id'] as string) || 'anonymous';
  const ipAddress =
    (req.headers['x-forwarded-for'] as string) ||
    req.socket?.remoteAddress ||
    'unknown';

  try {
    // 1. Validate input
    const validation = InputValidator.validatePayload(req.body, {
      email: { type: 'string', required: true, maxLength: 255 },
      data: { type: 'string', required: false, maxLength: 10000 },
    });

    if (!validation.valid) {
      await auditLogger.logEvent({
        userId,
        action: 'invalid_request',
        resource: 'api',
        riskLevel: 'medium',
        details: { errors: validation.errors },
        ipAddress,
      });

      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    // 2. Sanitize input
    const sanitizedEmail = InputValidator.sanitizeInput(req.body.email);

    // 3. Check for SQL injection patterns
    if (req.body.data && InputValidator.containsSqlInjectionPatterns(req.body.data)) {
      await auditLogger.logEvent({
        userId,
        action: 'sql_injection_attempt',
        resource: 'api',
        riskLevel: 'critical',
        details: { payload: req.body },
        ipAddress,
      });

      return res.status(403).json({ error: 'Invalid request' });
    }

    // 4. Process request
    // ... your business logic here

    // 5. Log successful operation
    await auditLogger.logEvent({
      userId,
      action: 'operation_completed',
      resource: 'api',
      riskLevel: 'low',
      details: { sanitizedEmail },
      ipAddress,
    });

    res.status(200).json({ success: true, message: 'Operation completed' });
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
