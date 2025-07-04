import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before a request is completed.
// It's used here to protect routes that require authentication.
export function middleware(request: NextRequest) {
  // Get the 'isLoggedIn' cookie. In a real app, this would be a secure session token or JWT.
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const pathname = request.nextUrl.pathname;

  // Define protected routes using a regex or an array of paths
  // Any path under '/dashboard' (due to the (auth) route group) will be protected
  const protectedPaths = ['/dashboard']; // Add more protected paths as needed

  // Check if the current path is protected and the user is NOT logged in
  if (protectedPaths.some(path => pathname.startsWith(path)) && !isLoggedIn) {
    // Redirect unauthenticated users to the home page or a login page
    // For now, redirect to home. In a real app, you'd redirect to /login
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Redirect to home
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed if not protected or if the user is logged in
  return NextResponse.next();
}

// Define which paths the middleware should apply to
// This matcher will apply the middleware to all routes within the (auth) group
// and any other specific paths you want to protect.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Apply to all paths except static assets and API routes
};