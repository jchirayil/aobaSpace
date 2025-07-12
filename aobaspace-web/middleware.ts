import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before a request is completed.
// It's used here to protect routes that require authentication.
// IMPORTANT: The current implementation is for demonstration only and is NOT secure.
export function middleware(request: NextRequest) {
  // In a real application, you would get a secure, httpOnly session cookie.
  // You would then verify this token (e.g., a JWT) against a secret or by calling an auth service.
  // The 'isLoggedIn' cookie is insecure because it can be easily manipulated by the client.
  const sessionToken = request.cookies.get('session-token')?.value;
  const isLoggedIn = !!sessionToken; // TODO: Replace with actual token validation logic

  // Since the matcher is configured to only run on protected routes,
  // we can directly check for the authentication status.
  if (!isLoggedIn) {
    // Redirect unauthenticated users to the home page or a login page
    // In a real app, you'd redirect to /login
    const url = request.nextUrl.clone();
    url.pathname = '/login'; // Redirect to a dedicated login page
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed if not protected or if the user is logged in
  return NextResponse.next();
}

// Define which paths the middleware should apply to
// This matcher is scoped to only the routes that require authentication.
// This avoids running the middleware on public pages (like the homepage,
// privacy policy, etc.) for better performance.
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/billing/:path*'],
};