// This file intelligently determines the correct API base URL to use,
// whether the code is running on the server (during SSR/RSC) or on the client.

// This is the URL used by the browser. It must be accessible from the user's machine.
const API_URL_CLIENT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// This is the URL used by the Next.js server. It must use the internal Docker network hostname.
const API_URL_SERVER = process.env.API_URL_SERVER || 'http://aobaspace-api:3000/api';

// Check if the code is running on the server or the client.
const isServer = typeof window === 'undefined';

// Export the appropriate URL.
export const API_BASE_URL = isServer ? API_URL_SERVER : API_URL_CLIENT;