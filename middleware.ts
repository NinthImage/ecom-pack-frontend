import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless found in search params
    '/(api|trpc)(.*)',
  ],
};
