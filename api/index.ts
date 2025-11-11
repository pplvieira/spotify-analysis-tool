/**
 * Vercel Serverless Function Handler
 *
 * This file serves as the entry point for Vercel serverless deployment.
 * It imports and exports the Express app for serverless execution.
 */

import app from '../lib/app';

// Export the Express app for Vercel serverless
export default app;
