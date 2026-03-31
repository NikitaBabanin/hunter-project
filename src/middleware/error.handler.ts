import type { Request, Response, NextFunction } from 'express';

/**
 * Global Error Middleware
 * Acts as the final safety net for the Express pipeline.
 */
export const globalErrorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} Error:`, err.message);

  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      type: err.name || "SystemError",
      status: statusCode
    }
  });
};