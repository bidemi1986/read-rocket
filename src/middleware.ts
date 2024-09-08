import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Call the API endpoint to verify the session
  const verifySessionUrl = new URL('/api/verify-session', req.url);

  try {
    const res = await fetch(verifySessionUrl.toString(), {
      headers: { cookie: req.headers.get('cookie') || '' }, // Pass cookies to the API
    });

    // If the response is unauthorized (no valid session), redirect to login
    if (res.status === 401) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If the user is authenticated, allow them to proceed (no redirect loop)
    return NextResponse.next(); // Proceed to the requested page

  } catch (error) {
    console.error('Error in middleware session check:', error);
    // Redirect to login if there's an error (e.g., network issues)
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Define routes that require authentication
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/chat/:path*', 
    '/me/:path*',  // Protect all @me routes (rooms, profile, etc.)
    '/profile/:path*', // Protect /profile route
    '/settings/:path*', // Protect /settings route
    '/[userid]/room/:path*',  // Protect user-specific room routes
    '/[userid]/r/:path*',     // Protect alternate user-specific room routes
  ]
};
