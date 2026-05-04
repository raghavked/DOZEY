import DOMPurify from 'isomorphic-dompurify';

export class InputValidator {
  // Validate email
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 12) errors.push('Password must be at least 12 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character');

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Validate and sanitize user input
  static sanitizeInput(input: string): string {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  }

  // Validate SQL-like patterns (prevent SQL injection)
  static containsSqlInjectionPatterns(input: string): boolean {
    const sqlPatterns = [
      /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /(-{2}|\/\*|\*\/|;)/,
      /(\bOR\b.*=.*)/gi,
      /(\bAND\b.*=.*)/gi,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // Validate API request payload
  static validatePayload(
    payload: Record<string, any>,
    schema: Record<string, { type: string; required?: boolean; maxLength?: number }>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, rules] of Object.entries(schema)) {
      const value = payload[key];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${key} is required`);
      }

      if (value !== undefined && value !== null) {
        if (typeof value !== rules.type) {
          errors.push(`${key} must be of type ${rules.type}`);
        }

        if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
          errors.push(`${key} must be less than ${rules.maxLength} characters`);
        }

        if (this.containsSqlInjectionPatterns(String(value))) {
          errors.push(`${key} contains invalid patterns`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default InputValidator;
