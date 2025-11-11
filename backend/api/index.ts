/**
 * Vercel Serverless Function Handler
 *
 * This file serves as the entry point for Vercel serverless deployment.
 * It imports and exports the Express app for serverless execution.
 *
 * NOTE: For production, ensure Vercel KV is configured for session persistence.
 * Without KV, sessions will not persist across serverless invocations.
 * See: VERCEL_KV_SETUP.md
 */

import app from '../src/app';

// Export the Express app for Vercel serverless
export default app;
