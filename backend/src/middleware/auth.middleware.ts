import { Request, Response, NextFunction } from 'express';

// Extend Express Session type to include our custom properties
declare module 'express-session' {
  interface SessionData {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
    user?: any;
  }
}

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated. Please log in first.' });
  }

  // Check if token is expired
  const now = Date.now();
  if (req.session.tokenExpiry && req.session.tokenExpiry < now) {
    return res.status(401).json({ error: 'Token expired. Please log in again.' });
  }

  next();
};

/**
 * Middleware to attach user session data to request
 */
export const attachUserSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.accessToken) {
    req.session.touch(); // Refresh session
  }
  next();
};
