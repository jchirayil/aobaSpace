// This file centralizes configuration constants for the AobaSpace web frontend.
// Environment variables prefixed with NEXT_PUBLIC_ are automatically exposed
// to the browser by Next.js.

/**
 * The base URL for the AobaSpace API backend.
 * This should be configured in a .env file (e.g., .env.local) as NEXT_PUBLIC_API_URL.
 * During local development, it typically points to http://localhost:3000/api.
 * In production, it would be your deployed API endpoint.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * The port on which the AobaSpace web frontend runs during local development.
 * This is primarily for logging and informational purposes within the frontend code,
 * as Next.js's dev server handles the actual port binding.
 */
export const FRONTEND_PORT = process.env.PORT || 3001; // Default to 3001 for frontend