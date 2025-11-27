import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/image(.*)',
  '/api/prompt(.*)',
]);

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  
  // Handle Cloudflare Pages specific headers
  const response = NextResponse.next();
  
  // Add CORS headers for API routes if needed
  if (nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Apply Clerk authentication to protected routes
  if (isProtectedRoute(req)) {
    return clerkMiddleware()(req);
  }
  
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless found in search params
        '/(api|trpc)(.*)',
  ],
};
