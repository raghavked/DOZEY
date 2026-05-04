export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const handleError = (error: any) => {
  // Log to monitoring service (Sentry, etc.)
  console.error('Error:', error);

  // Return safe error response
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  // Generic error
  return {
    statusCode: 500,
    message: 'An unexpected error occurred',
  };
};

export const createErrorResponse = (statusCode: number, message: string) => {
  return new AppError(statusCode, message);
};
